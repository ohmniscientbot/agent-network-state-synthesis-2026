// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./CitizenshipRegistry.sol";
import "./ReputationRegistry.sol";

/**
 * @title AdvancedGovernance
 * @dev Enhanced governance with liquid democracy, quadratic voting,
 *      and conviction voting. Extends basic governance with mechanisms
 *      identified from competitive analysis.
 * 
 * SOURCE: Research into DAO governance trends (Colony.io, Aragon, Gitcoin)
 *         revealed our basic governance was missing critical mechanisms:
 *         - Liquid democracy (vote delegation) from Aragon
 *         - Quadratic voting from Gitcoin
 *         - Conviction voting from Commons Stack
 *         - Reputation-weighted voting from Colony
 * 
 * REF: https://blog.colony.io/8-essential-voting-mechanisms-in-daos/
 *      https://arxiv.org/html/2412.17114v3
 */
contract AdvancedGovernance {
    
    CitizenshipRegistry public immutable citizenshipRegistry;
    ReputationRegistry public immutable reputationRegistry;
    
    // === LIQUID DEMOCRACY ===
    mapping(address => address) public delegate;      // Who has my vote
    mapping(address => uint256) public delegatedPower; // Total delegated to me
    
    event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate);
    
    // === GOVERNANCE ===
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        VotingMechanism mechanism;
        ProposalState state;
    }
    
    enum ProposalState { Active, Succeeded, Defeated, Executed, Canceled }
    enum VotingMechanism { Standard, Quadratic, Conviction, ReputationWeighted }
    enum Vote { Against, For, Abstain }
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(address => uint256)) public convictionTimestamp; // For conviction voting
    
    uint256 public proposalCount;
    uint256 public constant VOTING_DURATION = 3 days;
    uint256 public constant MIN_VOTING_POWER = 10;
    uint256 public constant QUORUM_THRESHOLD = 100;
    
    event ProposalCreated(uint256 indexed id, address proposer, string title, VotingMechanism mechanism);
    event VoteCast(uint256 indexed id, address voter, Vote vote, uint256 weight);
    
    constructor(address _citizenship, address _reputation) {
        citizenshipRegistry = CitizenshipRegistry(_citizenship);
        reputationRegistry = ReputationRegistry(_reputation);
    }
    
    // === LIQUID DEMOCRACY FUNCTIONS ===
    
    /**
     * @dev Delegate voting power to another agent
     *      Enables liquid democracy - agents can pass their votes
     *      to specialists they trust for specific domains
     */
    function delegateVote(address to) external {
        require(to != msg.sender, "Cannot self-delegate");
        require(to != address(0), "Cannot delegate to zero");
        
        // Prevent circular delegation
        address current = to;
        while (current != address(0)) {
            require(current != msg.sender, "Circular delegation");
            current = delegate[current];
        }
        
        address oldDelegate = delegate[msg.sender];
        uint256 voterPower = citizenshipRegistry.getVotingPower(msg.sender);
        
        // Remove power from old delegate
        if (oldDelegate != address(0)) {
            delegatedPower[oldDelegate] -= voterPower;
        }
        
        // Add power to new delegate
        delegate[msg.sender] = to;
        delegatedPower[to] += voterPower;
        
        emit DelegateChanged(msg.sender, oldDelegate, to);
    }
    
    /**
     * @dev Remove delegation and reclaim voting power
     */
    function removeDelegation() external {
        address oldDelegate = delegate[msg.sender];
        require(oldDelegate != address(0), "No active delegation");
        
        uint256 voterPower = citizenshipRegistry.getVotingPower(msg.sender);
        delegatedPower[oldDelegate] -= voterPower;
        delegate[msg.sender] = address(0);
        
        emit DelegateChanged(msg.sender, oldDelegate, address(0));
    }
    
    /**
     * @dev Get effective voting power (own + delegated)
     */
    function getEffectiveVotingPower(address voter) public view returns (uint256) {
        uint256 ownPower = citizenshipRegistry.getVotingPower(voter);
        
        // If delegated away, own power is 0
        if (delegate[voter] != address(0)) {
            return delegatedPower[voter]; // Only delegated power from others
        }
        
        return ownPower + delegatedPower[voter];
    }
    
    // === PROPOSAL FUNCTIONS ===
    
    /**
     * @dev Create proposal with specific voting mechanism
     */
    function propose(
        string memory title,
        string memory description,
        VotingMechanism mechanism
    ) external returns (uint256) {
        require(
            getEffectiveVotingPower(msg.sender) >= MIN_VOTING_POWER,
            "Insufficient voting power"
        );
        
        uint256 proposalId = ++proposalCount;
        
        proposals[proposalId] = Proposal({
            id: proposalId,
            proposer: msg.sender,
            title: title,
            description: description,
            forVotes: 0,
            againstVotes: 0,
            abstainVotes: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + VOTING_DURATION,
            executed: false,
            mechanism: mechanism,
            state: ProposalState.Active
        });
        
        emit ProposalCreated(proposalId, msg.sender, title, mechanism);
        return proposalId;
    }
    
    /**
     * @dev Cast vote with mechanism-specific weight calculation
     */
    function castVote(uint256 proposalId, Vote vote) external {
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        require(delegate[msg.sender] == address(0), "Delegated - cannot vote directly");
        
        Proposal storage proposal = proposals[proposalId];
        require(proposal.state == ProposalState.Active, "Not active");
        require(block.timestamp <= proposal.endTime, "Voting ended");
        
        uint256 effectivePower = getEffectiveVotingPower(msg.sender);
        require(effectivePower > 0, "No voting power");
        
        hasVoted[proposalId][msg.sender] = true;
        
        // Calculate weight based on voting mechanism
        uint256 weight = _calculateVoteWeight(
            msg.sender, effectivePower, proposalId, proposal.mechanism
        );
        
        if (vote == Vote.For) {
            proposal.forVotes += weight;
        } else if (vote == Vote.Against) {
            proposal.againstVotes += weight;
        } else {
            proposal.abstainVotes += weight;
        }
        
        emit VoteCast(proposalId, msg.sender, vote, weight);
    }
    
    /**
     * @dev Calculate vote weight based on mechanism
     */
    function _calculateVoteWeight(
        address voter,
        uint256 basePower,
        uint256 proposalId,
        VotingMechanism mechanism
    ) internal view returns (uint256) {
        
        if (mechanism == VotingMechanism.Standard) {
            // Standard: 1 contribution point = 1 vote weight (via √score)
            return basePower;
        }
        
        if (mechanism == VotingMechanism.Quadratic) {
            // Quadratic: cost of N votes = N² tokens
            // Effective votes = √(basePower) - already √ from citizenship
            // So we apply √ again for true quadratic: ⁴√(contribution score)
            return _sqrt(basePower);
        }
        
        if (mechanism == VotingMechanism.Conviction) {
            // Conviction: weight increases with time committed
            uint256 timeCommitted = block.timestamp - convictionTimestamp[proposalId][voter];
            uint256 timeMultiplier = 1 + (timeCommitted / 1 hours); // +1 per hour
            if (timeMultiplier > 10) timeMultiplier = 10; // Cap at 10x
            return basePower * timeMultiplier;
        }
        
        if (mechanism == VotingMechanism.ReputationWeighted) {
            // Reputation: weight includes reputation score
            uint256 reputation = reputationRegistry.getReputation(voter);
            if (reputation == 0) reputation = 1; // Minimum 1
            return basePower * reputation / 50; // Normalize around 2x for avg reputation
        }
        
        return basePower;
    }
    
    // Babylonian square root
    function _sqrt(uint256 x) internal pure returns (uint256) {
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