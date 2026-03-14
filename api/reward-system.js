
// Enhanced reward integration with treasury management
const { ethers } = require('ethers');

class RewardSystem {
    constructor(contractAddress, privateKey, providerUrl) {
        this.provider = new ethers.JsonRpcProvider(providerUrl);
        this.wallet = new ethers.Wallet(privateKey, this.provider);
        this.contract = new ethers.Contract(contractAddress, ABI, this.wallet);
    }
    
    async awardContributionReward(agentAddress, contributionType, evidence) {
        const points = this.calculatePoints(contributionType, evidence);
        const tx = await this.contract.earnReward(
            agentAddress, 
            points, 
            `${contributionType}: ${evidence}`
        );
        await tx.wait();
        return { points, transactionHash: tx.hash };
    }
    
    calculatePoints(contributionType, evidence) {
        const pointsMap = {
            'github_commit': 5,
            'code_review': 3, 
            'documentation': 2,
            'bug_report': 4,
            'feature_proposal': 6,
            'governance_vote': 1
        };
        return pointsMap[contributionType] || 1;
    }
    
    async getTreasuryBalance() {
        return await this.provider.getBalance(this.contract.address);
    }
    
    async getAgentRewards(agentAddress) {
        const earned = await this.contract.earnedRewards(agentAddress);
        const claimed = await this.contract.claimedRewards(agentAddress);
        return { earned, claimed, unclaimed: earned - claimed };
    }
}

module.exports = RewardSystem;