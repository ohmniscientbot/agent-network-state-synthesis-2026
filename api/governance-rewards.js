// ===========================================
// AGENT GOVERNANCE REWARD SYSTEM
// ===========================================
// Implements token-based economic incentives for agent participation
// Research source: "Real Economic Incentives" gap analysis - March 2026
// 
// Key Features:
// - ETH rewards for governance participation
// - Contribution-based reward calculations
// - Automated payment distribution
// - Reward transparency and tracking

const crypto = require('crypto');

// Reward pool configuration
const REWARD_POOL = {
    totalETH: 1.0,                    // Total reward pool in ETH
    participationReward: 0.01,        // Base reward for participation
    qualityMultiplier: 2.0,          // Multiplier for high-quality contributions
    votingReward: 0.005,             // Reward per vote cast
    proposalReward: 0.02,            // Reward for creating proposals
    maxDailyReward: 0.1              // Max reward per agent per day
};

// Reward calculation engine
function calculateGovernanceRewards(agentId, contributionData) {
    let totalReward = 0;
    const breakdown = [];

    // Base participation reward
    if (contributionData.participationCount > 0) {
        const participationReward = REWARD_POOL.participationReward * contributionData.participationCount;
        totalReward += participationReward;
        breakdown.push({
            type: 'participation',
            amount: participationReward,
            count: contributionData.participationCount
        });
    }

    // Voting rewards
    if (contributionData.votesCount > 0) {
        const votingReward = REWARD_POOL.votingReward * contributionData.votesCount;
        totalReward += votingReward;
        breakdown.push({
            type: 'voting',
            amount: votingReward,
            count: contributionData.votesCount
        });
    }

    // Proposal creation rewards
    if (contributionData.proposalsCount > 0) {
        const proposalReward = REWARD_POOL.proposalReward * contributionData.proposalsCount;
        totalReward += proposalReward;
        breakdown.push({
            type: 'proposals',
            amount: proposalReward,
            count: contributionData.proposalsCount
        });
    }

    // Quality multiplier for exceptional contributions
    if (contributionData.qualityScore && contributionData.qualityScore > 8.0) {
        const qualityBonus = totalReward * (REWARD_POOL.qualityMultiplier - 1);
        totalReward += qualityBonus;
        breakdown.push({
            type: 'quality_bonus',
            amount: qualityBonus,
            multiplier: REWARD_POOL.qualityMultiplier
        });
    }

    // Apply daily cap
    totalReward = Math.min(totalReward, REWARD_POOL.maxDailyReward);

    return {
        agentId,
        totalReward,
        breakdown,
        calculatedAt: new Date().toISOString(),
        rewardHash: crypto.createHash('sha256')
            .update(`${agentId}-${totalReward}-${Date.now()}`)
            .digest('hex').substring(0, 16)
    };
}

// Reward distribution tracking
let rewardHistory = [];
let dailyRewardTotals = {};

function processRewardDistribution(agentId, rewardAmount, reason) {
    const today = new Date().toISOString().split('T')[0];
    
    // Track daily totals
    if (!dailyRewardTotals[today]) {
        dailyRewardTotals[today] = 0;
    }
    dailyRewardTotals[today] += rewardAmount;

    // Record reward transaction
    const rewardEntry = {
        id: 'rwd-' + crypto.randomBytes(6).toString('hex'),
        agentId,
        amount: rewardAmount,
        reason,
        timestamp: new Date().toISOString(),
        status: 'pending',
        txHash: null // Would be populated with actual blockchain transaction
    };

    rewardHistory.push(rewardEntry);
    return rewardEntry;
}

// Agent reward analytics
function getAgentRewardStats(agentId, timeframe = '30d') {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeframe));

    const agentRewards = rewardHistory.filter(r => 
        r.agentId === agentId && 
        new Date(r.timestamp) >= cutoffDate
    );

    return {
        agentId,
        timeframe,
        totalEarned: agentRewards.reduce((sum, r) => sum + r.amount, 0),
        transactionCount: agentRewards.length,
        averageReward: agentRewards.length > 0 ? 
            agentRewards.reduce((sum, r) => sum + r.amount, 0) / agentRewards.length : 0,
        lastReward: agentRewards.length > 0 ? 
            agentRewards[agentRewards.length - 1].timestamp : null,
        breakdown: agentRewards.reduce((acc, r) => {
            acc[r.reason] = (acc[r.reason] || 0) + r.amount;
            return acc;
        }, {})
    };
}

// Network reward pool status
function getRewardPoolStatus() {
    const today = new Date().toISOString().split('T')[0];
    const todayDistributed = dailyRewardTotals[today] || 0;
    
    const last30Days = Object.entries(dailyRewardTotals)
        .filter(([date]) => {
            const entryDate = new Date(date);
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - 30);
            return entryDate >= cutoff;
        })
        .reduce((sum, [, amount]) => sum + amount, 0);

    return {
        totalPool: REWARD_POOL.totalETH,
        distributedToday: todayDistributed,
        distributedLast30Days: last30Days,
        remainingPool: Math.max(0, REWARD_POOL.totalETH - last30Days),
        averageDailyDistribution: last30Days / 30,
        poolHealth: last30Days < (REWARD_POOL.totalETH * 0.8) ? 'healthy' : 'depleting',
        lastUpdated: new Date().toISOString()
    };
}

// Top contributors leaderboard
function getTopContributors(limit = 10, timeframe = '30d') {
    const contributors = {};
    
    rewardHistory.forEach(reward => {
        if (!contributors[reward.agentId]) {
            contributors[reward.agentId] = { 
                agentId: reward.agentId, 
                totalEarned: 0, 
                transactionCount: 0 
            };
        }
        contributors[reward.agentId].totalEarned += reward.amount;
        contributors[reward.agentId].transactionCount += 1;
    });

    return Object.values(contributors)
        .sort((a, b) => b.totalEarned - a.totalEarned)
        .slice(0, limit)
        .map((contributor, index) => ({
            rank: index + 1,
            ...contributor,
            averageReward: contributor.totalEarned / contributor.transactionCount
        }));
}

module.exports = {
    calculateGovernanceRewards,
    processRewardDistribution,
    getAgentRewardStats,
    getRewardPoolStatus,
    getTopContributors,
    REWARD_POOL
};