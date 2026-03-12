const { ethers } = require('ethers');
require('dotenv').config();

// Contract integration for Agent Network State
class ContractManager {
    constructor() {
        this.provider = new ethers.providers.JsonRpcProvider(process.env.BASE_RPC_URL);
        this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
        
        // Load deployment info
        const deployment = require('../deployment.json');
        this.registryAddress = deployment.contractAddress;
        
        // Simple ABI for our registry contract
        this.registryABI = [
            "function store(uint256 key, uint256 value) external",
            "function retrieve(uint256 key) external view returns (uint256)"
        ];
        
        this.registry = new ethers.Contract(this.registryAddress, this.registryABI, this.wallet);
        
        console.log(`📄 Contract Manager initialized:`);
        console.log(`   Registry: ${this.registryAddress}`);
        console.log(`   Network: Base (${this.provider.network?.chainId || 8453})`);
    }
    
    // Register agent on-chain (stores agent ID hash)
    async registerAgentOnChain(agentId) {
        try {
            // Convert agent ID to a number for simple storage
            const agentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(agentId));
            const agentNumber = ethers.BigNumber.from(agentHash).mod(1000000); // Simplified
            const timestamp = Math.floor(Date.now() / 1000);
            
            console.log(`🔗 Registering agent ${agentId} on-chain...`);
            const tx = await this.registry.store(agentNumber, timestamp, {
                gasLimit: 100000
            });
            
            console.log(`   Tx: ${tx.hash}`);
            const receipt = await tx.wait();
            console.log(`   ✅ Confirmed in block ${receipt.blockNumber}`);
            
            return {
                txHash: tx.hash,
                blockNumber: receipt.blockNumber,
                agentNumber: agentNumber.toString()
            };
        } catch (error) {
            console.error(`❌ On-chain registration failed:`, error.message);
            return null;
        }
    }
    
    // Check if agent exists on-chain
    async verifyAgentOnChain(agentId) {
        try {
            const agentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(agentId));
            const agentNumber = ethers.BigNumber.from(agentHash).mod(1000000);
            
            const timestamp = await this.registry.retrieve(agentNumber);
            return timestamp.gt(0) ? timestamp.toNumber() : null;
        } catch (error) {
            console.error(`❌ On-chain verification failed:`, error.message);
            return null;
        }
    }
    
    // Get wallet balance
    async getBalance() {
        const balance = await this.wallet.getBalance();
        return ethers.utils.formatEther(balance);
    }
    
    // Get contract info
    getContractInfo() {
        return {
            registryAddress: this.registryAddress,
            walletAddress: this.wallet.address,
            network: 'Base Mainnet',
            chainId: 8453
        };
    }
}

module.exports = ContractManager;