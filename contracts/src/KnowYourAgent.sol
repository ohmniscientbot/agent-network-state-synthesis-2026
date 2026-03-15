// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title KnowYourAgent (KYA) Registry
 * @notice On-chain credential anchoring for AI agent identity verification
 * @dev Implements the Know Your Agent framework for the Agent Network State Protocol
 * 
 * Inspired by:
 * - KYC/AML frameworks adapted for AI agents (Skyfire KYA, AgentFacts.org)
 * - Coinbase Agentic Wallets & x402 protocol (Feb 2026)
 * - EU AI Act compliance requirements
 * - Decentralized Identifiers (DIDs) for agent identity
 *
 * Trust Score Dimensions:
 * - Identity (0-25): Cryptographic binding to human principal
 * - Behavior (0-25): Historical on-chain behavior patterns  
 * - Contribution (0-25): Verified contribution track record
 * - Compliance (0-25): Regulatory framework adherence
 */
contract KnowYourAgent {
    
    // ========== STRUCTS ==========
    
    struct KYACredential {
        bytes32 credentialHash;      // Hash of full off-chain credential
        address agentAddress;        // Agent's wallet address
        address principalAddress;    // Human/org principal responsible for agent
        string agentModel;           // e.g., "claude-sonnet-4-6"
        string agentHarness;         // e.g., "openclaw"
        AutonomyLevel maxAutonomy;   // Declared autonomy ceiling
        uint256 issuedAt;
        uint256 expiresAt;
        CredentialStatus status;
        VerificationLevel level;
        uint8 trustScore;            // 0-100 composite trust score
    }
    
    struct Verification {
        address verifier;            // Who performed the verification
        address agent;               // Agent being verified
        VerificationType vType;
        VerificationResult result;
        uint256 timestamp;
        bytes32 evidenceHash;        // Hash of off-chain evidence
    }
    
    // ========== ENUMS ==========
    
    enum AutonomyLevel { Supervised, SemiAutonomous, FullyAutonomous }
    enum CredentialStatus { Active, Suspended, Revoked, Expired }
    enum VerificationLevel { Basic, Enhanced, Full }
    enum VerificationType { Identity, Capability, Compliance, Behavioral }
    enum VerificationResult { Passed, Failed, Conditional }
    
    // ========== STATE ==========
    
    mapping(address => KYACredential) public credentials;
    mapping(address => Verification[]) public verifications;
    mapping(address => bool) public authorizedIssuers;
    
    address public governance;
    uint256 public totalCredentials;
    uint256 public totalVerifications;
    
    // Trust score thresholds
    uint8 public constant CERTIFIED_THRESHOLD = 80;
    uint8 public constant TRUSTED_THRESHOLD = 55;
    uint8 public constant BASIC_THRESHOLD = 30;
    
    // ========== EVENTS ==========
    
    event CredentialIssued(
        address indexed agent,
        address indexed principal,
        bytes32 credentialHash,
        AutonomyLevel maxAutonomy,
        uint256 expiresAt
    );
    
    event CredentialRevoked(
        address indexed agent,
        address indexed revokedBy,
        string reason
    );
    
    event VerificationCompleted(
        address indexed agent,
        address indexed verifier,
        VerificationType vType,
        VerificationResult result
    );
    
    event TrustScoreUpdated(
        address indexed agent,
        uint8 oldScore,
        uint8 newScore,
        VerificationLevel level
    );
    
    event AutonomyLevelChanged(
        address indexed agent,
        AutonomyLevel oldLevel,
        AutonomyLevel newLevel
    );
    
    // ========== MODIFIERS ==========
    
    modifier onlyGovernance() {
        require(msg.sender == governance, "KYA: Only governance");
        _;
    }
    
    modifier onlyAuthorizedIssuer() {
        require(authorizedIssuers[msg.sender] || msg.sender == governance, "KYA: Not authorized issuer");
        _;
    }
    
    modifier onlyActiveCredential(address agent) {
        require(credentials[agent].status == CredentialStatus.Active, "KYA: No active credential");
        require(block.timestamp < credentials[agent].expiresAt, "KYA: Credential expired");
        _;
    }
    
    // ========== CONSTRUCTOR ==========
    
    constructor(address _governance) {
        governance = _governance;
        authorizedIssuers[_governance] = true;
    }
    
    // ========== CREDENTIAL MANAGEMENT ==========
    
    /**
     * @notice Issue a KYA credential to an AI agent
     * @param agent Agent's wallet address
     * @param principal Human/org principal responsible for agent
     * @param agentModel AI model identifier
     * @param agentHarness Agent framework/harness
     * @param maxAutonomy Maximum declared autonomy level
     * @param validityDays Number of days the credential is valid
     * @param credentialHash Hash of the full off-chain credential document
     */
    function issueCredential(
        address agent,
        address principal,
        string calldata agentModel,
        string calldata agentHarness,
        AutonomyLevel maxAutonomy,
        uint256 validityDays,
        bytes32 credentialHash
    ) external onlyAuthorizedIssuer {
        require(agent != address(0), "KYA: Invalid agent address");
        require(principal != address(0), "KYA: Invalid principal address");
        require(credentials[agent].status != CredentialStatus.Active, "KYA: Already has active credential");
        
        credentials[agent] = KYACredential({
            credentialHash: credentialHash,
            agentAddress: agent,
            principalAddress: principal,
            agentModel: agentModel,
            agentHarness: agentHarness,
            maxAutonomy: maxAutonomy,
            issuedAt: block.timestamp,
            expiresAt: block.timestamp + (validityDays * 1 days),
            status: CredentialStatus.Active,
            level: VerificationLevel.Basic,
            trustScore: 25 // Starting trust score
        });
        
        totalCredentials++;
        
        emit CredentialIssued(agent, principal, credentialHash, maxAutonomy, credentials[agent].expiresAt);
    }
    
    /**
     * @notice Revoke an agent's KYA credential
     * @param agent Agent whose credential to revoke
     * @param reason Human-readable revocation reason
     */
    function revokeCredential(address agent, string calldata reason) external {
        KYACredential storage cred = credentials[agent];
        require(cred.status == CredentialStatus.Active, "KYA: No active credential");
        require(
            msg.sender == governance || 
            msg.sender == cred.principalAddress ||
            authorizedIssuers[msg.sender],
            "KYA: Not authorized to revoke"
        );
        
        cred.status = CredentialStatus.Revoked;
        
        emit CredentialRevoked(agent, msg.sender, reason);
    }
    
    // ========== VERIFICATION ==========
    
    /**
     * @notice Submit a verification for an agent
     * @param agent Agent being verified
     * @param vType Type of verification performed
     * @param result Verification outcome
     * @param evidenceHash Hash of off-chain evidence
     */
    function verify(
        address agent,
        VerificationType vType,
        VerificationResult result,
        bytes32 evidenceHash
    ) external onlyActiveCredential(agent) {
        require(msg.sender != agent, "KYA: Cannot self-verify");
        
        // Verifier should also have an active credential for peer verification
        require(
            credentials[msg.sender].status == CredentialStatus.Active || 
            authorizedIssuers[msg.sender],
            "KYA: Verifier needs active credential or issuer status"
        );
        
        verifications[agent].push(Verification({
            verifier: msg.sender,
            agent: agent,
            vType: vType,
            result: result,
            timestamp: block.timestamp,
            evidenceHash: evidenceHash
        }));
        
        totalVerifications++;
        
        // Auto-upgrade verification level based on passed verifications
        uint256 passedCount = _countPassedVerifications(agent);
        KYACredential storage cred = credentials[agent];
        VerificationLevel oldLevel = cred.level;
        
        if (passedCount >= 5) {
            cred.level = VerificationLevel.Full;
        } else if (passedCount >= 2) {
            cred.level = VerificationLevel.Enhanced;
        }
        
        // Update trust score
        uint8 oldScore = cred.trustScore;
        cred.trustScore = _calculateTrustScore(agent);
        
        emit VerificationCompleted(agent, msg.sender, vType, result);
        
        if (cred.trustScore != oldScore) {
            emit TrustScoreUpdated(agent, oldScore, cred.trustScore, cred.level);
        }
    }
    
    // ========== VIEW FUNCTIONS ==========
    
    function getCredential(address agent) external view returns (KYACredential memory) {
        return credentials[agent];
    }
    
    function getTrustScore(address agent) external view returns (uint8) {
        return credentials[agent].trustScore;
    }
    
    function getTrustLevel(address agent) external view returns (string memory) {
        uint8 score = credentials[agent].trustScore;
        if (score >= CERTIFIED_THRESHOLD) return "certified";
        if (score >= TRUSTED_THRESHOLD) return "trusted";
        if (score >= BASIC_THRESHOLD) return "basic";
        return "unverified";
    }
    
    function getVerificationCount(address agent) external view returns (uint256) {
        return verifications[agent].length;
    }
    
    function isCredentialActive(address agent) external view returns (bool) {
        return credentials[agent].status == CredentialStatus.Active && 
               block.timestamp < credentials[agent].expiresAt;
    }
    
    // ========== GOVERNANCE ==========
    
    function addAuthorizedIssuer(address issuer) external onlyGovernance {
        authorizedIssuers[issuer] = true;
    }
    
    function removeAuthorizedIssuer(address issuer) external onlyGovernance {
        authorizedIssuers[issuer] = false;
    }
    
    function updateGovernance(address newGovernance) external onlyGovernance {
        governance = newGovernance;
    }
    
    // ========== INTERNAL ==========
    
    function _countPassedVerifications(address agent) internal view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < verifications[agent].length; i++) {
            if (verifications[agent][i].result == VerificationResult.Passed) {
                count++;
            }
        }
        return count;
    }
    
    function _calculateTrustScore(address agent) internal view returns (uint8) {
        KYACredential storage cred = credentials[agent];
        uint256 score = 0;
        
        // Identity dimension (0-25)
        score += 10; // Has credential
        if (cred.principalAddress != address(0)) score += 5;
        if (cred.level == VerificationLevel.Enhanced) score += 5;
        if (cred.level == VerificationLevel.Full) score += 10;
        if (score > 25) score = 25;
        
        // Behavior dimension (0-25) - based on credential age
        uint256 ageDays = (block.timestamp - cred.issuedAt) / 1 days;
        uint256 behaviorScore = ageDays > 10 ? 10 : ageDays;
        behaviorScore += cred.status == CredentialStatus.Active ? 10 : 0;
        behaviorScore += 5; // No violations bonus (simplified)
        if (behaviorScore > 25) behaviorScore = 25;
        score += behaviorScore;
        
        // Contribution dimension (0-25) - based on verifications received
        uint256 passedCount = _countPassedVerifications(agent);
        uint256 contribScore = passedCount * 5;
        if (contribScore > 25) contribScore = 25;
        score += contribScore;
        
        // Compliance dimension (0-25)
        uint256 complianceScore = 10; // Base for having constraints
        if (cred.maxAutonomy == AutonomyLevel.Supervised) complianceScore += 10;
        else if (cred.maxAutonomy == AutonomyLevel.SemiAutonomous) complianceScore += 5;
        if (complianceScore > 25) complianceScore = 25;
        score += complianceScore;
        
        return score > 100 ? 100 : uint8(score);
    }
}
