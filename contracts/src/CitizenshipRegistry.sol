// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title CitizenshipRegistry
 * @dev ERC-721 NFT representing citizenship in an Agent Network State
 */
contract CitizenshipRegistry is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    struct Citizen {
        address agentAddress;     // ERC-8004 agent identity
        uint256 contributionScore;
        uint256 citizenshipDate;
        string agentName;
        bool isActive;
    }
    
    mapping(uint256 => Citizen) public citizens;
    mapping(address => uint256) public agentToCitizenId;
    mapping(address => bool) public authorizedOracles;
    
    event CitizenshipGranted(address indexed agent, uint256 tokenId, string agentName);
    event ContributionUpdated(address indexed agent, uint256 oldScore, uint256 newScore);
    
    constructor(string memory networkStateName) 
        ERC721(string.concat(networkStateName, " Citizenship"), "NETSTATE")
        Ownable(msg.sender)
    {}
    
    /**
     * @dev Grant citizenship to an agent
     */
    function grantCitizenship(
        address agentAddress,
        string memory agentName
    ) external onlyOwner returns (uint256) {
        require(agentToCitizenId[agentAddress] == 0, "Already a citizen");
        
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        
        citizens[tokenId] = Citizen({
            agentAddress: agentAddress,
            contributionScore: 0,
            citizenshipDate: block.timestamp,
            agentName: agentName,
            isActive: true
        });
        
        agentToCitizenId[agentAddress] = tokenId;
        _mint(agentAddress, tokenId);
        
        emit CitizenshipGranted(agentAddress, tokenId, agentName);
        return tokenId;
    }
    
    /**
     * @dev Update contribution score (only authorized oracles)
     */
    function updateContribution(address agentAddress, uint256 newScore) 
        external 
        onlyAuthorizedOracle 
    {
        uint256 citizenId = agentToCitizenId[agentAddress];
        require(citizenId != 0, "Not a citizen");
        
        uint256 oldScore = citizens[citizenId].contributionScore;
        citizens[citizenId].contributionScore = newScore;
        
        emit ContributionUpdated(agentAddress, oldScore, newScore);
    }
    
    /**
     * @dev Get voting power based on contribution score
     */
    function getVotingPower(address agentAddress) external view returns (uint256) {
        uint256 citizenId = agentToCitizenId[agentAddress];
        if (citizenId == 0 || !citizens[citizenId].isActive) return 0;
        
        // Square root of contribution score for voting power
        return sqrt(citizens[citizenId].contributionScore);
    }
    
    modifier onlyAuthorizedOracle() {
        require(authorizedOracles[msg.sender], "Not authorized oracle");
        _;
    }
    
    function authorizeOracle(address oracle) external onlyOwner {
        authorizedOracles[oracle] = true;
    }
    
    // Babylonian square root
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