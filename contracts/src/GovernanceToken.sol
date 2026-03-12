// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GovernanceToken
 * @dev ERC-20 governance token for Agent Network State participation
 * @notice Used for token-based quadratic voting in hybrid governance system
 */
contract GovernanceToken is ERC20, Ownable {
    
    mapping(address => bool) public authorizedMinters;
    uint256 public constant MAX_SUPPLY = 1_000_000_000e18; // 1 billion tokens
    
    event TokensEarned(address indexed agent, uint256 amount, string reason);
    event MinterAuthorized(address indexed minter, bool authorized);
    
    constructor(string memory name, string memory symbol) 
        ERC20(name, symbol) 
        Ownable(msg.sender)
    {
        // Initial supply to deployer for testing/distribution
        _mint(msg.sender, 100_000e18); // 100k initial tokens
    }
    
    /**
     * @dev Mint tokens to agents for contributions (authorized minters only)
     */
    function mintReward(
        address agent, 
        uint256 amount, 
        string memory reason
    ) external onlyAuthorizedMinter {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(agent, amount);
        emit TokensEarned(agent, amount, reason);
    }
    
    /**
     * @dev Batch mint rewards for multiple agents
     */
    function batchMintRewards(
        address[] calldata agents,
        uint256[] calldata amounts,
        string[] calldata reasons
    ) external onlyAuthorizedMinter {
        require(
            agents.length == amounts.length && amounts.length == reasons.length,
            "Array lengths mismatch"
        );
        
        for (uint256 i = 0; i < agents.length; i++) {
            require(totalSupply() + amounts[i] <= MAX_SUPPLY, "Exceeds max supply");
            _mint(agents[i], amounts[i]);
            emit TokensEarned(agents[i], amounts[i], reasons[i]);
        }
    }
    
    /**
     * @dev Authorize/unauthorize token minters
     */
    function setMinterAuthorization(address minter, bool authorized) external onlyOwner {
        authorizedMinters[minter] = authorized;
        emit MinterAuthorized(minter, authorized);
    }
    
    /**
     * @dev Check if address is authorized minter
     */
    function isMinter(address account) external view returns (bool) {
        return authorizedMinters[account];
    }
    
    modifier onlyAuthorizedMinter() {
        require(authorizedMinters[msg.sender], "Not authorized minter");
        _;
    }
    
    /**
     * @dev Override transfer to emit detailed events (optional)
     */
    function transfer(address to, uint256 amount) public override returns (bool) {
        // Could add governance-specific logic here if needed
        return super.transfer(to, amount);
    }
    
    /**
     * @dev Get voting power based on token balance (quadratic)
     */
    function getTokenVotingPower(address account) external view returns (uint256) {
        uint256 balance = balanceOf(account);
        return sqrt(balance / 1e18); // Quadratic voting power
    }
    
    /**
     * @dev Babylonian square root
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