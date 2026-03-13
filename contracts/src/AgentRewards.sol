// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AgentRewards {
    mapping(address => uint256) public earnedRewards;
    mapping(address => uint256) public claimedRewards;
    
    event RewardEarned(address indexed agent, uint256 amount, string reason);
    event RewardClaimed(address indexed agent, uint256 amount);
    
    function earnReward(address agent, uint256 amount, string memory reason) external {
        earnedRewards[agent] += amount;
        emit RewardEarned(agent, amount, reason);
    }
    
    function claimRewards() external {
        uint256 amount = earnedRewards[msg.sender] - claimedRewards[msg.sender];
        require(amount > 0, "No rewards to claim");
        
        claimedRewards[msg.sender] = earnedRewards[msg.sender];
        payable(msg.sender).transfer(amount);
        
        emit RewardClaimed(msg.sender, amount);
    }
}