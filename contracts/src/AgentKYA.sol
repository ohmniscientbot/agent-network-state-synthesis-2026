// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title AgentKYA (Know Your Agent) Identity System
 * @dev Implements verifiable AI agent credentials with human principal linkage
 * Based on 2026 KYA standards for agent trust and accountability
 */
contract AgentKYA is ERC721, Ownable {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    struct AgentCredential {
        address agentAddress;           // Agent's blockchain address
        address humanPrincipal;        // Responsible human entity
        string agentType;              // "trading", "governance", "analysis", etc.
        string harness;                // "openclaw", "langchain", etc.
        uint256 capabilityMask;        // Bitfield of allowed capabilities
        uint256 expiryTimestamp;       // Credential expiration
        bytes32 attestationHash;       // Hash of off-chain attestation
        bool isActive;                 // Credential status
        uint256 issuedAt;             // Timestamp of issuance
    }

    struct HumanPrincipal {
        address humanAddress;          // Human's verified address
        string name;                   // Human's verified name
        string email;                  // Contact information
        uint256 maxAgents;            // Max agents this human can certify
        uint256 currentAgents;        // Current agent count
        bool isVerified;              // KYC verification status
        bytes32 verificationHash;     // Off-chain verification proof
    }

    // Capability bitfield constants
    uint256 public constant CAP_TRADING = 1 << 0;          // Financial transactions
    uint256 public constant CAP_GOVERNANCE = 1 << 1;       // DAO voting/proposals
    uint256 public constant CAP_TREASURY = 1 << 2;         // Treasury management
    uint256 public constant CAP_CROSS_CHAIN = 1 << 3;      // Multi-chain operations
    uint256 public constant CAP_DELEGATION = 1 << 4;       // Vote delegation
    uint256 public constant CAP_PROPOSAL_CREATE = 1 << 5;  // Create proposals
    uint256 public constant CAP_EMERGENCY = 1 << 6;        // Emergency functions

    // Storage
    mapping(uint256 => AgentCredential) public agentCredentials;
    mapping(address => uint256) public agentToTokenId;
    mapping(address => HumanPrincipal) public humanPrincipals;
    mapping(address => bool) public verifiedIssuers; // Trusted KYA issuers
    
    uint256 private _nextTokenId = 1;
    
    // Events
    event AgentCredentialIssued(
        uint256 indexed tokenId,
        address indexed agentAddress,
        address indexed humanPrincipal,
        string agentType
    );
    
    event CredentialRevoked(uint256 indexed tokenId, string reason);
    event HumanPrincipalVerified(address indexed human, string name);
    event CapabilityUpdated(uint256 indexed tokenId, uint256 newCapabilities);
    event IssuerStatusChanged(address indexed issuer, bool isVerified);

    constructor() ERC721("Agent KYA Credentials", "AKYA") {}

    /**
     * @dev Register a human principal who can certify agents
     */
    function registerHumanPrincipal(
        string memory name,
        string memory email,
        uint256 maxAgents,
        bytes32 verificationHash,
        bytes memory signature
    ) external {
        require(bytes(name).length > 0, "Name required");
        require(maxAgents > 0 && maxAgents <= 100, "Invalid max agents");
        
        // Verify signature from trusted issuer
        bytes32 messageHash = keccak256(abi.encodePacked(
            msg.sender, name, email, maxAgents, verificationHash
        )).toEthSignedMessageHash();
        
        address signer = messageHash.recover(signature);
        require(verifiedIssuers[signer], "Invalid issuer signature");
        
        humanPrincipals[msg.sender] = HumanPrincipal({
            humanAddress: msg.sender,
            name: name,
            email: email,
            maxAgents: maxAgents,
            currentAgents: 0,
            isVerified: true,
            verificationHash: verificationHash
        });
        
        emit HumanPrincipalVerified(msg.sender, name);
    }

    /**
     * @dev Issue KYA credential for an AI agent
     */
    function issueAgentCredential(
        address agentAddress,
        string memory agentType,
        string memory harness,
        uint256 capabilityMask,
        uint256 expiryTimestamp,
        bytes32 attestationHash
    ) external returns (uint256) {
        HumanPrincipal storage human = humanPrincipals[msg.sender];
        require(human.isVerified, "Human not verified");
        require(human.currentAgents < human.maxAgents, "Max agents reached");
        require(agentAddress != address(0), "Invalid agent address");
        require(agentToTokenId[agentAddress] == 0, "Agent already credentialed");
        require(expiryTimestamp > block.timestamp, "Invalid expiry");
        
        uint256 tokenId = _nextTokenId++;
        
        agentCredentials[tokenId] = AgentCredential({
            agentAddress: agentAddress,
            humanPrincipal: msg.sender,
            agentType: agentType,
            harness: harness,
            capabilityMask: capabilityMask,
            expiryTimestamp: expiryTimestamp,
            attestationHash: attestationHash,
            isActive: true,
            issuedAt: block.timestamp
        });
        
        agentToTokenId[agentAddress] = tokenId;
        human.currentAgents++;
        
        _mint(msg.sender, tokenId); // Human owns the credential NFT
        
        emit AgentCredentialIssued(tokenId, agentAddress, msg.sender, agentType);
        return tokenId;
    }

    /**
     * @dev Verify an agent has specific capabilities
     */
    function verifyAgentCapability(address agentAddress, uint256 capability) 
        external view returns (bool) {
        uint256 tokenId = agentToTokenId[agentAddress];
        if (tokenId == 0) return false;
        
        AgentCredential storage cred = agentCredentials[tokenId];
        return cred.isActive && 
               cred.expiryTimestamp > block.timestamp &&
               (cred.capabilityMask & capability) != 0;
    }

    /**
     * @dev Get agent's human principal
     */
    function getAgentPrincipal(address agentAddress) 
        external view returns (address, string memory) {
        uint256 tokenId = agentToTokenId[agentAddress];
        require(tokenId != 0, "Agent not found");
        
        AgentCredential storage cred = agentCredentials[tokenId];
        HumanPrincipal storage human = humanPrincipals[cred.humanPrincipal];
        
        return (cred.humanPrincipal, human.name);
    }

    /**
     * @dev Revoke agent credential (emergency)
     */
    function revokeCredential(uint256 tokenId, string memory reason) external {
        AgentCredential storage cred = agentCredentials[tokenId];
        require(
            msg.sender == cred.humanPrincipal || owner() == msg.sender,
            "Not authorized"
        );
        require(cred.isActive, "Already revoked");
        
        cred.isActive = false;
        humanPrincipals[cred.humanPrincipal].currentAgents--;
        
        emit CredentialRevoked(tokenId, reason);
    }

    /**
     * @dev Update agent capabilities (only by human principal)
     */
    function updateCapabilities(uint256 tokenId, uint256 newCapabilities) external {
        AgentCredential storage cred = agentCredentials[tokenId];
        require(msg.sender == cred.humanPrincipal, "Not principal");
        require(cred.isActive, "Credential inactive");
        
        cred.capabilityMask = newCapabilities;
        emit CapabilityUpdated(tokenId, newCapabilities);
    }

    /**
     * @dev Add/remove verified KYA issuer
     */
    function setVerifiedIssuer(address issuer, bool isVerified) external onlyOwner {
        verifiedIssuers[issuer] = isVerified;
        emit IssuerStatusChanged(issuer, isVerified);
    }

    /**
     * @dev Get agent credential details
     */
    function getAgentCredential(address agentAddress) 
        external view returns (AgentCredential memory) {
        uint256 tokenId = agentToTokenId[agentAddress];
        require(tokenId != 0, "Agent not found");
        return agentCredentials[tokenId];
    }

    /**
     * @dev Check if agent is verified and active
     */
    function isAgentVerified(address agentAddress) external view returns (bool) {
        uint256 tokenId = agentToTokenId[agentAddress];
        if (tokenId == 0) return false;
        
        AgentCredential storage cred = agentCredentials[tokenId];
        return cred.isActive && cred.expiryTimestamp > block.timestamp;
    }

    /**
     * @dev Get human principal details
     */
    function getHumanPrincipal(address human) 
        external view returns (HumanPrincipal memory) {
        require(humanPrincipals[human].isVerified, "Human not verified");
        return humanPrincipals[human];
    }

    /**
     * @dev Override transfer to prevent NFT trading (soulbound)
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        // Only allow minting (from == address(0))
        require(from == address(0), "KYA credentials are soulbound");
    }
}