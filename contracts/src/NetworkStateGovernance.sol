// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./CitizenshipRegistry.sol";

/**
 * @title NetworkStateGovernance
 * @dev Governance system for Agent Network States with citizen voting
 */
contract NetworkStateGovernance is ReentrancyGuard {
    
    CitizenshipRegistry public immutable citizenshipRegistry;
    
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        bytes callData;
        address target;
        uint256 value;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        bool passed;
        ProposalState state;
    }
    
    enum ProposalState {
        Pending,
        Active,
        Succeeded,
        Defeated,
        Executed,
        Canceled
    }
    
    enum Vote {
        Against,
        For,
        Abstain
    }
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(address => Vote)) public votes;
    
    uint256 public proposalCount;
    uint256 public constant VOTING_DURATION = 3 days;
    uint256 public constant MIN_VOTING_POWER = 10; // Minimum voting power to propose
    uint256 public constant QUORUM_THRESHOLD = 100; // Minimum total votes needed
    
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        address target,
        uint256 value
    );
    
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        Vote vote,
        uint256 weight,
        string reason
    );
    
    event ProposalExecuted(uint256 indexed proposalId);
    
    constructor(address _citizenshipRegistry) {
        citizenshipRegistry = CitizenshipRegistry(_citizenshipRegistry);
    }
    
    /**
     * @dev Create a new proposal
     */
    function propose(
        address target,
        uint256 value,
        bytes memory callData,
        string memory title,
        string memory description
    ) external returns (uint256) {
        require(
            citizenshipRegistry.getVotingPower(msg.sender) >= MIN_VOTING_POWER,
            "Insufficient voting power to propose"
        );
        
        uint256 proposalId = ++proposalCount;
        
        proposals[proposalId] = Proposal({
            id: proposalId,
            proposer: msg.sender,
            title: title,
            description: description,
            callData: callData,
            target: target,
            value: value,
            forVotes: 0,
            againstVotes: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + VOTING_DURATION,
            executed: false,
            passed: false,
            state: ProposalState.Active
        });
        
        emit ProposalCreated(proposalId, msg.sender, title, target, value);
        return proposalId;
    }
    
    /**
     * @dev Cast a vote on a proposal
     */
    function castVote(
        uint256 proposalId,
        Vote vote,
        string memory reason
    ) external {
        return _castVote(proposalId, msg.sender, vote, reason);
    }
    
    /**
     * @dev Internal vote casting
     */
    function _castVote(
        uint256 proposalId,
        address voter,
        Vote vote,
        string memory reason
    ) internal {
        require(proposalId <= proposalCount, "Invalid proposal");
        require(!hasVoted[proposalId][voter], "Already voted");
        
        Proposal storage proposal = proposals[proposalId];
        require(proposal.state == ProposalState.Active, "Voting not active");
        require(block.timestamp <= proposal.endTime, "Voting period ended");
        
        uint256 weight = citizenshipRegistry.getVotingPower(voter);
        require(weight > 0, "No voting power");
        
        hasVoted[proposalId][voter] = true;
        votes[proposalId][voter] = vote;
        
        if (vote == Vote.For) {
            proposal.forVotes += weight;
        } else if (vote == Vote.Against) {
            proposal.againstVotes += weight;
        }
        // Abstain votes don't count towards for/against
        
        emit VoteCast(proposalId, voter, vote, weight, reason);
    }
    
    /**
     * @dev Execute a proposal after voting ends
     */
    function executeProposal(uint256 proposalId) external nonReentrant {
        require(proposalId <= proposalCount, "Invalid proposal");
        
        Proposal storage proposal = proposals[proposalId];
        require(proposal.state == ProposalState.Active, "Not active");
        require(block.timestamp > proposal.endTime, "Voting still active");
        require(!proposal.executed, "Already executed");
        
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes;
        require(totalVotes >= QUORUM_THRESHOLD, "Quorum not reached");
        
        if (proposal.forVotes > proposal.againstVotes) {
            proposal.passed = true;
            proposal.state = ProposalState.Succeeded;
            
            // Execute the proposal
            if (proposal.target != address(0)) {
                (bool success, ) = proposal.target.call{value: proposal.value}(
                    proposal.callData
                );
                require(success, "Proposal execution failed");
            }
            
            proposal.executed = true;
            proposal.state = ProposalState.Executed;
            
            emit ProposalExecuted(proposalId);
        } else {
            proposal.state = ProposalState.Defeated;
        }
    }
    
    /**
     * @dev Get proposal state
     */
    function getProposalState(uint256 proposalId) external view returns (ProposalState) {
        require(proposalId <= proposalCount, "Invalid proposal");
        
        Proposal storage proposal = proposals[proposalId];
        
        if (proposal.executed) {
            return ProposalState.Executed;
        } else if (block.timestamp <= proposal.endTime) {
            return ProposalState.Active;
        } else {
            uint256 totalVotes = proposal.forVotes + proposal.againstVotes;
            if (totalVotes < QUORUM_THRESHOLD) {
                return ProposalState.Defeated;
            } else if (proposal.forVotes > proposal.againstVotes) {
                return ProposalState.Succeeded;
            } else {
                return ProposalState.Defeated;
            }
        }
    }
    
    /**
     * @dev Get proposal details
     */
    function getProposal(uint256 proposalId) external view returns (
        address proposer,
        string memory title,
        string memory description,
        uint256 forVotes,
        uint256 againstVotes,
        uint256 startTime,
        uint256 endTime,
        bool executed,
        ProposalState state
    ) {
        require(proposalId <= proposalCount, "Invalid proposal");
        Proposal storage proposal = proposals[proposalId];
        
        return (
            proposal.proposer,
            proposal.title,
            proposal.description,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.startTime,
            proposal.endTime,
            proposal.executed,
            this.getProposalState(proposalId)
        );
    }
}