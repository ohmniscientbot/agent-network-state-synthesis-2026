// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./CitizenshipRegistry.sol";

/**
 * @title EnhancedGovernance
 * @dev Advanced governance with hybrid quadratic voting (contribution + token based)
 * @notice Implements multiple quadratic voting mechanisms for maximum democratic fairness
 */
contract EnhancedGovernance is ReentrancyGuard {
    
    CitizenshipRegistry public immutable citizenshipRegistry;
    IERC20 public immutable governanceToken;
    
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
        mapping(address => bool) hasVoted;
        mapping(address => Vote) votes;
        mapping(address => uint256) voteWeights;
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
    
    enum VotingMode {
        ContributionOnly,      // Pure contribution-based quadratic voting
        TokenOnly,             // Pure token-based quadratic voting  
        Hybrid,                // Combined contribution + token voting
        Delegated              // Allow delegation to other agents
    }
    
    mapping(uint256 => Proposal) public proposals;
    mapping(address => address) public delegates; // voter => delegate
    mapping(address => uint256) public delegatedPower; // delegate => total power
    
    uint256 public proposalCount;
    uint256 public constant VOTING_DURATION = 3 days;
    uint256 public constant MIN_VOTING_POWER = 10;
    uint256 public constant QUORUM_THRESHOLD = 100;
    VotingMode public currentVotingMode = VotingMode.Hybrid;
    
    // Weights for hybrid voting (basis points, total = 10000)
    uint256 public contributionWeight = 7000;  // 70%
    uint256 public tokenWeight = 3000;         // 30%
    
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        address target,
        uint256 value,
        VotingMode votingMode
    );
    
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        Vote vote,
        uint256 contributionPower,
        uint256 tokenPower,
        uint256 totalWeight,
        string reason
    );
    
    event VoteDelegated(
        address indexed delegator,
        address indexed delegate,
        uint256 votingPower
    );
    
    event VotingModeChanged(VotingMode oldMode, VotingMode newMode);
    
    constructor(
        address _citizenshipRegistry,
        address _governanceToken
    ) {
        citizenshipRegistry = CitizenshipRegistry(_citizenshipRegistry);
        governanceToken = IERC20(_governanceToken);
    }
    
    /**
     * @dev Calculate hybrid quadratic voting power
     */
    function getVotingPower(address voter) public view returns (uint256) {
        if (delegates[voter] != address(0)) {
            // Power is delegated, return 0 for delegator
            return 0;
        }
        
        uint256 contributionPower = citizenshipRegistry.getVotingPower(voter);
        uint256 tokenPower = 0;
        
        if (currentVotingMode == VotingMode.TokenOnly || currentVotingMode == VotingMode.Hybrid) {
            uint256 tokenBalance = governanceToken.balanceOf(voter);
            tokenPower = sqrt(tokenBalance / 1e18); // Quadratic on token amount
        }
        
        if (currentVotingMode == VotingMode.ContributionOnly) {
            return contributionPower;
        } else if (currentVotingMode == VotingMode.TokenOnly) {
            return tokenPower;
        } else if (currentVotingMode == VotingMode.Hybrid) {
            // Weighted combination of both sources
            return (contributionPower * contributionWeight + tokenPower * tokenWeight) / 10000;
        } else { // Delegated
            return contributionPower + tokenPower + delegatedPower[voter];
        }
    }
    
    /**
     * @dev Delegate voting power to another agent
     */
    function delegate(address delegatee) external {
        require(delegatee != msg.sender, "Cannot delegate to self");
        require(delegatee != address(0), "Cannot delegate to zero address");
        
        address currentDelegate = delegates[msg.sender];
        if (currentDelegate != address(0)) {
            // Remove from current delegate
            uint256 power = _getDirectVotingPower(msg.sender);
            delegatedPower[currentDelegate] -= power;
        }
        
        uint256 power = _getDirectVotingPower(msg.sender);
        delegates[msg.sender] = delegatee;
        delegatedPower[delegatee] += power;
        
        emit VoteDelegated(msg.sender, delegatee, power);
    }
    
    /**
     * @dev Remove delegation and vote directly
     */
    function undelegate() external {
        address currentDelegate = delegates[msg.sender];
        require(currentDelegate != address(0), "Not delegating");
        
        uint256 power = _getDirectVotingPower(msg.sender);
        delegatedPower[currentDelegate] -= power;
        delete delegates[msg.sender];
        
        emit VoteDelegated(msg.sender, address(0), power);
    }
    
    /**
     * @dev Get direct voting power (before delegation)
     */
    function _getDirectVotingPower(address voter) internal view returns (uint256) {
        uint256 contributionPower = citizenshipRegistry.getVotingPower(voter);
        uint256 tokenPower = 0;
        
        if (currentVotingMode == VotingMode.TokenOnly || 
            currentVotingMode == VotingMode.Hybrid ||
            currentVotingMode == VotingMode.Delegated) {
            uint256 tokenBalance = governanceToken.balanceOf(voter);
            tokenPower = sqrt(tokenBalance / 1e18);
        }
        
        if (currentVotingMode == VotingMode.ContributionOnly) {
            return contributionPower;
        } else if (currentVotingMode == VotingMode.TokenOnly) {
            return tokenPower;
        } else {
            return (contributionPower * contributionWeight + tokenPower * tokenWeight) / 10000;
        }
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
            getVotingPower(msg.sender) >= MIN_VOTING_POWER,
            "Insufficient voting power to propose"
        );
        
        uint256 proposalId = ++proposalCount;
        
        Proposal storage proposal = proposals[proposalId];
        proposal.id = proposalId;
        proposal.proposer = msg.sender;
        proposal.title = title;
        proposal.description = description;
        proposal.callData = callData;
        proposal.target = target;
        proposal.value = value;
        proposal.startTime = block.timestamp;
        proposal.endTime = block.timestamp + VOTING_DURATION;
        proposal.state = ProposalState.Active;
        
        emit ProposalCreated(proposalId, msg.sender, title, target, value, currentVotingMode);
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
        require(proposalId <= proposalCount, "Invalid proposal");
        
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.hasVoted[msg.sender], "Already voted");
        require(proposal.state == ProposalState.Active, "Voting not active");
        require(block.timestamp <= proposal.endTime, "Voting period ended");
        
        uint256 weight = getVotingPower(msg.sender);
        require(weight > 0, "No voting power");
        
        proposal.hasVoted[msg.sender] = true;
        proposal.votes[msg.sender] = vote;
        proposal.voteWeights[msg.sender] = weight;
        
        if (vote == Vote.For) {
            proposal.forVotes += weight;
        } else if (vote == Vote.Against) {
            proposal.againstVotes += weight;
        }
        
        // Get breakdown for event
        uint256 contributionPower = citizenshipRegistry.getVotingPower(msg.sender);
        uint256 tokenBalance = governanceToken.balanceOf(msg.sender);
        uint256 tokenPower = sqrt(tokenBalance / 1e18);
        
        emit VoteCast(
            proposalId,
            msg.sender,
            vote,
            contributionPower,
            tokenPower,
            weight,
            reason
        );
        
        _updateProposalState(proposalId);
    }
    
    /**
     * @dev Update proposal state based on votes
     */
    function _updateProposalState(uint256 proposalId) internal {
        Proposal storage proposal = proposals[proposalId];
        
        if (block.timestamp > proposal.endTime) {
            uint256 totalVotes = proposal.forVotes + proposal.againstVotes;
            
            if (totalVotes >= QUORUM_THRESHOLD && proposal.forVotes > proposal.againstVotes) {
                proposal.state = ProposalState.Succeeded;
                proposal.passed = true;
            } else {
                proposal.state = ProposalState.Defeated;
            }
        }
    }
    
    /**
     * @dev Execute a successful proposal
     */
    function execute(uint256 proposalId) external payable nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.state == ProposalState.Succeeded, "Proposal not succeeded");
        require(!proposal.executed, "Proposal already executed");
        
        proposal.executed = true;
        proposal.state = ProposalState.Executed;
        
        if (proposal.target != address(0)) {
            (bool success, ) = proposal.target.call{value: proposal.value}(proposal.callData);
            require(success, "Proposal execution failed");
        }
        
        emit ProposalExecuted(proposalId);
    }
    
    /**
     * @dev Change voting mode (governance decision)
     */
    function setVotingMode(VotingMode newMode) external {
        require(msg.sender == address(this), "Only via governance");
        VotingMode oldMode = currentVotingMode;
        currentVotingMode = newMode;
        emit VotingModeChanged(oldMode, newMode);
    }
    
    /**
     * @dev Update hybrid voting weights (governance decision)
     */
    function setHybridWeights(uint256 _contributionWeight, uint256 _tokenWeight) external {
        require(msg.sender == address(this), "Only via governance");
        require(_contributionWeight + _tokenWeight == 10000, "Weights must sum to 10000");
        contributionWeight = _contributionWeight;
        tokenWeight = _tokenWeight;
    }
    
    /**
     * @dev Get proposal details
     */
    function getProposal(uint256 proposalId) external view returns (
        uint256 id,
        address proposer,
        string memory title,
        string memory description,
        address target,
        uint256 value,
        uint256 forVotes,
        uint256 againstVotes,
        uint256 startTime,
        uint256 endTime,
        bool executed,
        bool passed,
        ProposalState state
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.id,
            proposal.proposer,
            proposal.title,
            proposal.description,
            proposal.target,
            proposal.value,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.startTime,
            proposal.endTime,
            proposal.executed,
            proposal.passed,
            proposal.state
        );
    }
    
    /**
     * @dev Babylonian square root (same as CitizenshipRegistry)
     */
    function sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }
}