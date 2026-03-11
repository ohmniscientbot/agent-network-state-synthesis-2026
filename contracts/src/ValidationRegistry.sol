// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ValidationRegistry
 * @dev ERC-8004 Validation Registry - On-chain verification of agent tasks
 *      with cryptographic and economic proofs of work completion.
 * 
 * SOURCE: ERC-8004 full spec requires Identity + Reputation + Validation.
 *         Our original implementation was missing this critical component.
 * 
 * REF: https://eips.ethereum.org/EIPS/eip-8004
 *      https://blog.quicknode.com/erc-8004-a-developers-guide-to-trustless-ai-agent-identity/
 */
contract ValidationRegistry is Ownable {
    
    struct Task {
        uint256 id;
        address requester;      // Who requested the task
        address assignee;       // Agent performing the task
        string description;
        string deliverable;     // IPFS hash of completed work
        uint256 reward;         // ETH reward for completion
        uint256 deadline;
        TaskStatus status;
        bytes32 validationHash; // Cryptographic proof of completion
    }
    
    enum TaskStatus { 
        Open,           // Task created, awaiting assignment
        Assigned,       // Agent accepted the task
        Submitted,      // Agent submitted deliverable
        Validated,      // Oracle verified completion
        Completed,      // Reward distributed
        Disputed,       // Under dispute resolution
        Expired         // Deadline passed
    }
    
    mapping(uint256 => Task) public tasks;
    mapping(address => uint256[]) public agentTasks;
    mapping(address => bool) public oracles;
    
    uint256 public taskCount;
    uint256 public totalTasksCompleted;
    uint256 public totalRewardsDistributed;
    
    event TaskCreated(uint256 indexed taskId, address indexed requester, uint256 reward);
    event TaskAssigned(uint256 indexed taskId, address indexed agent);
    event TaskSubmitted(uint256 indexed taskId, bytes32 validationHash);
    event TaskValidated(uint256 indexed taskId, bool success);
    event TaskCompleted(uint256 indexed taskId, address indexed agent, uint256 reward);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Create a new task with ETH reward
     */
    function createTask(
        string memory description,
        uint256 deadline
    ) external payable returns (uint256) {
        require(msg.value > 0, "Must include reward");
        require(deadline > block.timestamp, "Deadline must be future");
        
        uint256 taskId = ++taskCount;
        
        tasks[taskId] = Task({
            id: taskId,
            requester: msg.sender,
            assignee: address(0),
            description: description,
            deliverable: "",
            reward: msg.value,
            deadline: deadline,
            status: TaskStatus.Open,
            validationHash: bytes32(0)
        });
        
        emit TaskCreated(taskId, msg.sender, msg.value);
        return taskId;
    }
    
    /**
     * @dev Agent accepts and is assigned to a task
     */
    function acceptTask(uint256 taskId) external {
        Task storage task = tasks[taskId];
        require(task.status == TaskStatus.Open, "Task not open");
        require(block.timestamp < task.deadline, "Task expired");
        
        task.assignee = msg.sender;
        task.status = TaskStatus.Assigned;
        agentTasks[msg.sender].push(taskId);
        
        emit TaskAssigned(taskId, msg.sender);
    }
    
    /**
     * @dev Agent submits completed work with cryptographic proof
     */
    function submitWork(
        uint256 taskId,
        string memory deliverable,
        bytes32 validationHash
    ) external {
        Task storage task = tasks[taskId];
        require(task.assignee == msg.sender, "Not assigned agent");
        require(task.status == TaskStatus.Assigned, "Wrong task status");
        require(block.timestamp < task.deadline, "Deadline passed");
        
        task.deliverable = deliverable;
        task.validationHash = validationHash;
        task.status = TaskStatus.Submitted;
        
        emit TaskSubmitted(taskId, validationHash);
    }
    
    /**
     * @dev Oracle validates completed work and distributes reward
     */
    function validateTask(uint256 taskId, bool isValid) external onlyOracle {
        Task storage task = tasks[taskId];
        require(task.status == TaskStatus.Submitted, "Not submitted");
        
        task.status = TaskStatus.Validated;
        emit TaskValidated(taskId, isValid);
        
        if (isValid) {
            task.status = TaskStatus.Completed;
            totalTasksCompleted++;
            totalRewardsDistributed += task.reward;
            
            // Transfer reward to agent
            payable(task.assignee).transfer(task.reward);
            
            emit TaskCompleted(taskId, task.assignee, task.reward);
        } else {
            task.status = TaskStatus.Disputed;
            // Reward stays in contract for dispute resolution
        }
    }
    
    /**
     * @dev Get agent's completed task count
     */
    function getAgentTaskCount(address agent) external view returns (uint256) {
        return agentTasks[agent].length;
    }
    
    function addOracle(address oracle) external onlyOwner {
        oracles[oracle] = true;
    }
    
    modifier onlyOracle() {
        require(oracles[msg.sender] || msg.sender == owner(), "Not authorized oracle");
        _;
    }
}