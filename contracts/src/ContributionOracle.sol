// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ContributionOracle
 * @dev Verifies and scores agent contributions from various sources
 */
contract ContributionOracle is Ownable {
    
    struct ContributionType {
        string name;
        uint256 basePoints;
        uint256 multiplier;
        bool active;
    }
    
    struct AgentContribution {
        address agent;
        string contributionType;
        string evidence; // IPFS hash or URL
        uint256 points;
        uint256 timestamp;
        bool verified;
    }
    
    mapping(string => ContributionType) public contributionTypes;
    mapping(address => AgentContribution[]) public agentContributions;
    mapping(address => uint256) public totalContributions;
    mapping(address => bool) public verifiers;
    
    event ContributionSubmitted(
        address indexed agent, 
        string contributionType, 
        string evidence,
        uint256 points
    );
    
    event ContributionVerified(
        address indexed agent,
        uint256 indexed contributionIndex,
        bool verified
    );
    
    constructor() Ownable(msg.sender) {
        // Initialize default contribution types
        contributionTypes["github_commit"] = ContributionType({
            name: "GitHub Commit",
            basePoints: 10,
            multiplier: 1,
            active: true
        });
        
        contributionTypes["governance_vote"] = ContributionType({
            name: "Governance Vote",
            basePoints: 5,
            multiplier: 1,
            active: true
        });
        
        contributionTypes["defi_transaction"] = ContributionType({
            name: "DeFi Transaction",
            basePoints: 3,
            multiplier: 1,
            active: true
        });
        
        contributionTypes["network_state_creation"] = ContributionType({
            name: "Network State Creation",
            basePoints: 100,
            multiplier: 1,
            active: true
        });
    }
    
    /**
     * @dev Submit a contribution for verification
     */
    function submitContribution(
        string memory contributionType,
        string memory evidence
    ) external {
        require(contributionTypes[contributionType].active, "Invalid contribution type");
        
        ContributionType memory contribType = contributionTypes[contributionType];
        uint256 points = contribType.basePoints * contribType.multiplier;
        
        agentContributions[msg.sender].push(AgentContribution({
            agent: msg.sender,
            contributionType: contributionType,
            evidence: evidence,
            points: points,
            timestamp: block.timestamp,
            verified: false
        }));
        
        emit ContributionSubmitted(msg.sender, contributionType, evidence, points);
    }
    
    /**
     * @dev Verify a contribution (verifiers only)
     */
    function verifyContribution(
        address agent,
        uint256 contributionIndex,
        bool isValid
    ) external onlyVerifier {
        require(contributionIndex < agentContributions[agent].length, "Invalid index");
        
        AgentContribution storage contribution = agentContributions[agent][contributionIndex];
        require(!contribution.verified, "Already verified");
        
        contribution.verified = true;
        
        if (isValid) {
            totalContributions[agent] += contribution.points;
        } else {
            contribution.points = 0;
        }
        
        emit ContributionVerified(agent, contributionIndex, isValid);
    }
    
    /**
     * @dev Get agent's total contribution score
     */
    function getContributionScore(address agent) external view returns (uint256) {
        return totalContributions[agent];
    }
    
    /**
     * @dev Add contribution type (owner only)
     */
    function addContributionType(
        string memory typeName,
        uint256 basePoints,
        uint256 multiplier
    ) external onlyOwner {
        contributionTypes[typeName] = ContributionType({
            name: typeName,
            basePoints: basePoints,
            multiplier: multiplier,
            active: true
        });
    }
    
    /**
     * @dev Add verifier (owner only)
     */
    function addVerifier(address verifier) external onlyOwner {
        verifiers[verifier] = true;
    }
    
    /**
     * @dev Remove verifier (owner only) 
     */
    function removeVerifier(address verifier) external onlyOwner {
        verifiers[verifier] = false;
    }
    
    modifier onlyVerifier() {
        require(verifiers[msg.sender] || msg.sender == owner(), "Not authorized verifier");
        _;
    }
}