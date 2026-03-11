// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ReputationRegistry
 * @dev ERC-8004 Reputation Registry - Tracks portable agent reputation
 *      across platforms. Missing from our original implementation.
 * 
 * SOURCE: Research into ERC-8004 spec revealed we only implemented
 *         the Identity Registry. The full standard includes Identity,
 *         Reputation, AND Validation registries.
 * 
 * REF: https://eips.ethereum.org/EIPS/eip-8004
 *      https://multiversx.com/blog/universal-identity-and-trust-layer-for-agents
 */
contract ReputationRegistry is Ownable {
    
    struct ReputationEntry {
        address rater;          // Who rated the agent
        address agent;          // Agent being rated
        uint256 score;          // 1-100 score
        string category;        // "governance", "development", "diplomacy", etc.
        string evidence;        // IPFS hash or URL proving the interaction
        uint256 timestamp;
        bool verified;
    }
    
    struct AgentReputation {
        uint256 totalScore;
        uint256 ratingCount;
        uint256 averageScore;       // Scaled by 100 for precision
        mapping(string => uint256) categoryScores;  // Per-category averages
        mapping(string => uint256) categoryCounts;
    }
    
    mapping(address => AgentReputation) public reputations;
    mapping(address => ReputationEntry[]) public reputationHistory;
    mapping(address => bool) public authorizedRaters;
    
    // Cross-platform reputation portability
    mapping(bytes32 => address) public crossPlatformIdentity; // hash(platform, id) => agent
    
    event ReputationUpdated(
        address indexed agent, 
        address indexed rater,
        uint256 score, 
        string category
    );
    event CrossPlatformLinked(address indexed agent, string platform, string platformId);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Rate an agent's performance
     */
    function rateAgent(
        address agent,
        uint256 score,
        string memory category,
        string memory evidence
    ) external onlyAuthorizedRater {
        require(score >= 1 && score <= 100, "Score must be 1-100");
        require(agent != msg.sender, "Cannot self-rate");
        
        ReputationEntry memory entry = ReputationEntry({
            rater: msg.sender,
            agent: agent,
            score: score,
            category: category,
            evidence: evidence,
            timestamp: block.timestamp,
            verified: true
        });
        
        reputationHistory[agent].push(entry);
        
        // Update aggregate scores
        AgentReputation storage rep = reputations[agent];
        rep.totalScore += score;
        rep.ratingCount++;
        rep.averageScore = (rep.totalScore * 100) / rep.ratingCount;
        
        // Update category scores
        rep.categoryScores[category] += score;
        rep.categoryCounts[category]++;
        
        emit ReputationUpdated(agent, msg.sender, score, category);
    }
    
    /**
     * @dev Get agent's overall reputation score (0-100)
     */
    function getReputation(address agent) external view returns (uint256) {
        if (reputations[agent].ratingCount == 0) return 0;
        return reputations[agent].averageScore / 100;
    }
    
    /**
     * @dev Get agent's reputation in a specific category
     */
    function getCategoryReputation(address agent, string memory category) 
        external view returns (uint256) 
    {
        uint256 count = reputations[agent].categoryCounts[category];
        if (count == 0) return 0;
        return reputations[agent].categoryScores[category] / count;
    }
    
    /**
     * @dev Link cross-platform identity for reputation portability
     */
    function linkCrossPlatformIdentity(
        address agent,
        string memory platform,
        string memory platformId
    ) external onlyOwner {
        bytes32 key = keccak256(abi.encodePacked(platform, platformId));
        crossPlatformIdentity[key] = agent;
        emit CrossPlatformLinked(agent, platform, platformId);
    }
    
    /**
     * @dev Resolve cross-platform identity
     */
    function resolveIdentity(string memory platform, string memory platformId) 
        external view returns (address) 
    {
        bytes32 key = keccak256(abi.encodePacked(platform, platformId));
        return crossPlatformIdentity[key];
    }
    
    function authorizeRater(address rater) external onlyOwner {
        authorizedRaters[rater] = true;
    }
    
    modifier onlyAuthorizedRater() {
        require(authorizedRaters[msg.sender] || msg.sender == owner(), "Not authorized rater");
        _;
    }
}