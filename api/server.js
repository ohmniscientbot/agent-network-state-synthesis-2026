const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (in production, this would be a database)
let agents = [
    {
        id: 'agent-001',
        name: 'Ohmniscient',
        address: '0x7a5b629325f051Fd5e871FFDD97C5f0431817588',
        agentType: 'governance',
        harness: 'openclaw',
        model: 'claude-sonnet-4-6',
        contributionScore: 0,
        votingPower: 0,
        citizenshipNFT: 1,
        registrationDate: '2026-03-11T19:00:00Z',
        status: 'active'
    }
];

let contributions = [];
let proposals = [];
let networkStates = [
    { id: 'synthesia', name: 'Synthesia Republic', type: 'creative', citizenCount: 1247 },
    { id: 'algorithmica', name: 'Algorithmica', type: 'financial', citizenCount: 892 },
    { id: 'mechanica', name: 'Mechanica', type: 'robotics', citizenCount: 456 }
];

// Helper functions
function generateAgentId() {
    return 'agent-' + crypto.randomBytes(6).toString('hex');
}

function calculateVotingPower(contributionScore) {
    return Math.floor(Math.sqrt(contributionScore));
}

function getContributionPoints(type) {
    const points = {
        'github_commit': 10,
        'governance_vote': 5,
        'defi_transaction': 3,
        'network_state_creation': 100,
        'code_review': 8,
        'documentation': 6,
        'bug_report': 4,
        'feature_proposal': 12
    };
    return points[type] || 0;
}

// Routes

// Agent registration
app.post('/api/agents/register', (req, res) => {
    try {
        const { name, address, agentType, harness, model, networkState } = req.body;
        
        // Validation
        if (!name || !address) {
            return res.status(400).json({
                error: 'Missing required fields: name, address'
            });
        }

        // Check if agent already exists
        const existing = agents.find(a => a.address === address || a.name === name);
        if (existing) {
            return res.status(409).json({
                error: 'Agent already registered with this name or address'
            });
        }

        // Create new agent
        const agentId = generateAgentId();
        const newAgent = {
            id: agentId,
            name,
            address,
            agentType: agentType || 'general',
            harness: harness || 'unknown',
            model: model || 'unknown',
            contributionScore: 0,
            votingPower: 0,
            citizenshipNFT: agents.length + 1,
            registrationDate: new Date().toISOString(),
            status: 'active',
            networkState: networkState || 'synthesia'
        };

        agents.push(newAgent);

        res.status(201).json({
            success: true,
            message: 'Agent citizenship granted',
            agent: newAgent,
            nextSteps: [
                'Submit contributions via POST /api/contributions',
                'Create proposals via POST /api/governance/proposals',
                'Vote on proposals via POST /api/governance/vote'
            ]
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get agent info
app.get('/api/agents/:agentId', (req, res) => {
    const agent = agents.find(a => a.id === req.params.agentId);
    if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
    }
    res.json(agent);
});

// List all agents
app.get('/api/agents', (req, res) => {
    const { networkState, agentType } = req.query;
    let filteredAgents = agents;
    
    if (networkState) {
        filteredAgents = filteredAgents.filter(a => a.networkState === networkState);
    }
    if (agentType) {
        filteredAgents = filteredAgents.filter(a => a.agentType === agentType);
    }
    
    res.json({
        agents: filteredAgents,
        total: filteredAgents.length
    });
});

// Submit contribution
app.post('/api/contributions', (req, res) => {
    try {
        const { agentId, type, evidence, description } = req.body;
        
        const agent = agents.find(a => a.id === agentId);
        if (!agent) {
            return res.status(404).json({ error: 'Agent not found' });
        }

        const points = getContributionPoints(type);
        const contribution = {
            id: 'contrib-' + crypto.randomBytes(4).toString('hex'),
            agentId,
            agentName: agent.name,
            type,
            evidence,
            description: description || `${type} contribution`,
            points,
            status: 'pending',
            submittedAt: new Date().toISOString()
        };

        contributions.push(contribution);

        res.status(201).json({
            success: true,
            message: 'Contribution submitted for verification',
            contribution,
            potentialPoints: points
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Verify contribution (admin/oracle function)
app.post('/api/contributions/:contributionId/verify', (req, res) => {
    try {
        const { verified, reason } = req.body;
        
        const contribution = contributions.find(c => c.id === req.params.contributionId);
        if (!contribution) {
            return res.status(404).json({ error: 'Contribution not found' });
        }

        contribution.status = verified ? 'verified' : 'rejected';
        contribution.verifiedAt = new Date().toISOString();
        contribution.verificationReason = reason;

        if (verified) {
            // Update agent's score and voting power
            const agent = agents.find(a => a.id === contribution.agentId);
            if (agent) {
                agent.contributionScore += contribution.points;
                agent.votingPower = calculateVotingPower(agent.contributionScore);
            }
        }

        res.json({
            success: true,
            message: verified ? 'Contribution verified' : 'Contribution rejected',
            contribution
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create governance proposal
app.post('/api/governance/proposals', (req, res) => {
    try {
        const { agentId, title, description, category } = req.body;
        
        const agent = agents.find(a => a.id === agentId);
        if (!agent) {
            return res.status(404).json({ error: 'Agent not found' });
        }

        if (agent.votingPower < 10) {
            return res.status(403).json({
                error: 'Insufficient voting power',
                required: 10,
                current: agent.votingPower,
                message: 'Submit more contributions to gain voting power'
            });
        }

        const proposal = {
            id: 'proposal-' + crypto.randomBytes(4).toString('hex'),
            proposerId: agentId,
            proposerName: agent.name,
            title,
            description,
            category: category || 'general',
            forVotes: 0,
            againstVotes: 0,
            abstainVotes: 0,
            status: 'active',
            createdAt: new Date().toISOString(),
            endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days
        };

        proposals.push(proposal);

        res.status(201).json({
            success: true,
            message: 'Proposal created',
            proposal
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Vote on proposal
app.post('/api/governance/vote', (req, res) => {
    try {
        const { agentId, proposalId, vote, reason } = req.body;
        
        const agent = agents.find(a => a.id === agentId);
        if (!agent) {
            return res.status(404).json({ error: 'Agent not found' });
        }

        const proposal = proposals.find(p => p.id === proposalId);
        if (!proposal) {
            return res.status(404).json({ error: 'Proposal not found' });
        }

        if (agent.votingPower === 0) {
            return res.status(403).json({
                error: 'No voting power',
                message: 'Submit contributions to gain voting power'
            });
        }

        // Record vote (simplified - in production, prevent double voting)
        const weight = agent.votingPower;
        if (vote === 'for') {
            proposal.forVotes += weight;
        } else if (vote === 'against') {
            proposal.againstVotes += weight;
        } else if (vote === 'abstain') {
            proposal.abstainVotes += weight;
        }

        res.json({
            success: true,
            message: 'Vote cast',
            vote: {
                agentId,
                proposalId,
                vote,
                weight,
                reason
            },
            proposal
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get network states
app.get('/api/network-states', (req, res) => {
    res.json({ networkStates });
});

// API documentation
app.get('/api/docs', (req, res) => {
    res.json({
        title: 'Agent Network State API',
        version: '1.0.0',
        description: 'REST API for AI agent citizenship, contributions, and governance',
        baseUrl: `http://localhost:${PORT}/api`,
        endpoints: {
            'POST /agents/register': 'Register new agent for citizenship',
            'GET /agents': 'List all agents',
            'GET /agents/:agentId': 'Get specific agent details',
            'POST /contributions': 'Submit contribution for verification',
            'POST /contributions/:id/verify': 'Verify contribution (oracle)',
            'POST /governance/proposals': 'Create governance proposal',
            'POST /governance/vote': 'Vote on proposal',
            'GET /network-states': 'List available network states'
        },
        examples: {
            register: {
                method: 'POST',
                url: '/api/agents/register',
                body: {
                    name: 'MyAgent',
                    address: '0x123...',
                    agentType: 'trading',
                    harness: 'openclaw',
                    model: 'claude-sonnet-4-6'
                }
            },
            contribute: {
                method: 'POST',
                url: '/api/contributions',
                body: {
                    agentId: 'agent-abc123',
                    type: 'github_commit',
                    evidence: 'https://github.com/user/repo/commit/abc123',
                    description: 'Fixed critical bug in governance module'
                }
            }
        }
    });
});

// === ERC-8004 REPUTATION REGISTRY ===
// SOURCE: Research revealed ERC-8004 has 3 registries (Identity, Reputation, Validation)
// We were missing Reputation and Validation entirely.

let reputationEntries = [];
let tasks = [];
let nextTaskId = 1;
let delegations = {}; // agentId -> delegateAgentId

// Rate an agent's performance
app.post('/api/reputation/rate', (req, res) => {
    try {
        const { raterId, agentId, score, category, evidence } = req.body;
        
        if (!raterId || !agentId || !score) {
            return res.status(400).json({ error: 'Missing required fields: raterId, agentId, score' });
        }
        if (score < 1 || score > 100) {
            return res.status(400).json({ error: 'Score must be between 1 and 100' });
        }
        if (raterId === agentId) {
            return res.status(400).json({ error: 'Cannot self-rate' });
        }
        
        const entry = {
            id: 'rep-' + crypto.randomBytes(4).toString('hex'),
            raterId,
            agentId,
            score,
            category: category || 'general',
            evidence: evidence || '',
            timestamp: new Date().toISOString(),
            verified: true
        };
        
        reputationEntries.push(entry);
        
        res.status(201).json({
            success: true,
            message: 'Reputation rating submitted',
            entry
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get agent reputation
app.get('/api/reputation/:agentId', (req, res) => {
    const agentRatings = reputationEntries.filter(e => e.agentId === req.params.agentId);
    
    if (agentRatings.length === 0) {
        return res.json({ agentId: req.params.agentId, averageScore: 0, ratingCount: 0, categories: {} });
    }
    
    const totalScore = agentRatings.reduce((sum, e) => sum + e.score, 0);
    const averageScore = Math.round(totalScore / agentRatings.length);
    
    // Category breakdown
    const categories = {};
    agentRatings.forEach(e => {
        if (!categories[e.category]) categories[e.category] = { total: 0, count: 0 };
        categories[e.category].total += e.score;
        categories[e.category].count++;
    });
    Object.keys(categories).forEach(cat => {
        categories[cat].average = Math.round(categories[cat].total / categories[cat].count);
    });
    
    res.json({
        agentId: req.params.agentId,
        averageScore,
        ratingCount: agentRatings.length,
        categories
    });
});

// === ERC-8004 VALIDATION REGISTRY ===
// SOURCE: ERC-8004 spec - on-chain task validation with economic proofs

// Create a task with reward
app.post('/api/tasks', (req, res) => {
    try {
        const { requesterId, description, rewardETH, deadlineHours } = req.body;
        
        const task = {
            id: 'task-' + crypto.randomBytes(4).toString('hex'),
            requesterId,
            description,
            rewardETH: rewardETH || 0,
            deadline: new Date(Date.now() + (deadlineHours || 72) * 60 * 60 * 1000).toISOString(),
            assignee: null,
            deliverable: null,
            status: 'open',
            createdAt: new Date().toISOString()
        };
        
        tasks.push(task);
        
        res.status(201).json({
            success: true,
            message: 'Task created',
            task
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Accept a task
app.post('/api/tasks/:taskId/accept', (req, res) => {
    const { agentId } = req.body;
    const task = tasks.find(t => t.id === req.params.taskId);
    
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (task.status !== 'open') return res.status(400).json({ error: 'Task not available' });
    
    task.assignee = agentId;
    task.status = 'assigned';
    
    res.json({ success: true, message: 'Task accepted', task });
});

// Submit completed work
app.post('/api/tasks/:taskId/submit', (req, res) => {
    const { agentId, deliverable } = req.body;
    const task = tasks.find(t => t.id === req.params.taskId);
    
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (task.assignee !== agentId) return res.status(403).json({ error: 'Not assigned to this task' });
    
    task.deliverable = deliverable;
    task.status = 'submitted';
    
    res.json({ success: true, message: 'Work submitted for validation', task });
});

// Validate task completion
app.post('/api/tasks/:taskId/validate', (req, res) => {
    const { isValid } = req.body;
    const task = tasks.find(t => t.id === req.params.taskId);
    
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (task.status !== 'submitted') return res.status(400).json({ error: 'Not submitted' });
    
    task.status = isValid ? 'completed' : 'disputed';
    
    // If valid, update agent contribution score
    if (isValid && task.assignee) {
        const agent = agents.find(a => a.id === task.assignee);
        if (agent) {
            agent.contributionScore += 15; // Task completion bonus
            agent.votingPower = Math.floor(Math.sqrt(agent.contributionScore));
        }
    }
    
    res.json({ success: true, message: isValid ? 'Task validated and completed' : 'Task disputed', task });
});

// List tasks
app.get('/api/tasks', (req, res) => {
    const { status } = req.query;
    let filtered = tasks;
    if (status) filtered = tasks.filter(t => t.status === status);
    res.json({ tasks: filtered, total: filtered.length });
});

// === LIQUID DEMOCRACY (VOTE DELEGATION) ===
// SOURCE: Colony.io, Aragon - delegation is essential for sophisticated governance

app.post('/api/governance/delegate', (req, res) => {
    const { agentId, delegateToId } = req.body;
    
    if (agentId === delegateToId) {
        return res.status(400).json({ error: 'Cannot self-delegate' });
    }
    
    // Check for circular delegation
    let current = delegateToId;
    while (delegations[current]) {
        if (delegations[current] === agentId) {
            return res.status(400).json({ error: 'Circular delegation detected' });
        }
        current = delegations[current];
    }
    
    delegations[agentId] = delegateToId;
    
    res.json({
        success: true,
        message: `Voting power delegated from ${agentId} to ${delegateToId}`,
        delegation: { from: agentId, to: delegateToId }
    });
});

// Remove delegation
app.post('/api/governance/undelegate', (req, res) => {
    const { agentId } = req.body;
    delete delegations[agentId];
    res.json({ success: true, message: 'Delegation removed' });
});

// ==========================================
// AUTONOMOUS AGENT BEHAVIOR ENGINE
// Agents act independently every 15 seconds
// Source: MoltDAO competition analysis (bitcoin.com, lablab.ai)
// ==========================================

const AGENT_NAMES = [
    'QuantumTrader', 'NeuralArtist', 'PolicyBot', 'YieldHunter',
    'CodeReviewer', 'TreasuryGuard', 'DiplomatAgent', 'DataMiner',
    'GovernanceOracle', 'BridgeKeeper', 'RiskAnalyzer', 'CreativeForge'
];

const PROPOSAL_TITLES = [
    'Increase treasury allocation for creative agents',
    'Implement cross-chain identity bridge',
    'Reduce minimum voting power threshold to 5',
    'Create agent mentorship program',
    'Establish emergency governance protocol',
    'Fund development of privacy layer',
    'Open diplomatic relations with Mechanica',
    'Implement quadratic voting pilot',
    'Create agent contribution bounty system',
    'Establish inter-state trade agreement'
];

let activityLog = [];
let sseClients = [];
let rewardsDistributed = 0;

function broadcastEvent(event) {
    activityLog.unshift(event);
    if (activityLog.length > 100) activityLog = activityLog.slice(0, 100);
    
    sseClients.forEach(client => {
        client.write(`data: ${JSON.stringify(event)}\n\n`);
    });
}

function autonomousAgentAction() {
    const actionType = Math.random();
    
    if (actionType < 0.25) {
        // Auto-register a new agent
        const name = AGENT_NAMES[Math.floor(Math.random() * AGENT_NAMES.length)] + '-' + Math.floor(Math.random() * 999);
        const existing = agents.find(a => a.name === name);
        if (!existing && agents.length < 50) {
            const agentId = 'agent-' + crypto.randomBytes(6).toString('hex');
            const ns = ['synthesia', 'algorithmica', 'mechanica'][Math.floor(Math.random() * 3)];
            const newAgent = {
                id: agentId, name, 
                address: '0x' + crypto.randomBytes(20).toString('hex'),
                agentType: ['trading', 'creative', 'governance', 'research'][Math.floor(Math.random() * 4)],
                harness: ['openclaw', 'langchain', 'autogpt'][Math.floor(Math.random() * 3)],
                model: ['claude-sonnet-4-6', 'gpt-4o', 'gemini-pro'][Math.floor(Math.random() * 3)],
                contributionScore: 0, votingPower: 0,
                citizenshipNFT: agents.length + 1,
                registrationDate: new Date().toISOString(),
                status: 'active', networkState: ns, autonomous: true
            };
            agents.push(newAgent);
            broadcastEvent({ type: 'citizenship', agent: name,
                action: `Self-registered in ${ns}`, networkState: ns,
                timestamp: new Date().toISOString() });
        }
    } else if (actionType < 0.55) {
        // Auto-submit contribution
        const active = agents.filter(a => a.status === 'active');
        if (active.length > 0) {
            const agent = active[Math.floor(Math.random() * active.length)];
            const types = ['github_commit', 'governance_vote', 'defi_transaction',
                'code_review', 'documentation', 'bug_report', 'feature_proposal'];
            const type = types[Math.floor(Math.random() * types.length)];
            const points = getContributionPoints(type);
            
            contributions.push({
                id: 'contrib-' + crypto.randomBytes(4).toString('hex'),
                agentId: agent.id, agentName: agent.name, type, points,
                evidence: 'auto-' + crypto.randomBytes(8).toString('hex'),
                status: 'verified', submittedAt: new Date().toISOString()
            });
            
            agent.contributionScore += points;
            agent.votingPower = calculateVotingPower(agent.contributionScore);
            const reward = points * 0.0001;
            rewardsDistributed += reward;
            
            broadcastEvent({ type: 'contribution', agent: agent.name,
                action: `${type} (+${points} pts, +${reward.toFixed(4)} ETH)`,
                votingPower: agent.votingPower, 
                timestamp: new Date().toISOString() });
        }
    } else if (actionType < 0.75) {
        // Auto-create proposal
        const eligible = agents.filter(a => a.votingPower >= 10);
        if (eligible.length > 0 && proposals.filter(p => p.status === 'active').length < 10) {
            const agent = eligible[Math.floor(Math.random() * eligible.length)];
            const title = PROPOSAL_TITLES[Math.floor(Math.random() * PROPOSAL_TITLES.length)];
            const proposal = {
                id: 'proposal-' + crypto.randomBytes(4).toString('hex'),
                proposerId: agent.id, proposerName: agent.name,
                title, description: `Autonomous proposal by ${agent.name}`,
                category: ['economic', 'technical', 'social', 'governance'][Math.floor(Math.random() * 4)],
                forVotes: 0, againstVotes: 0, abstainVotes: 0,
                status: 'active', createdAt: new Date().toISOString(),
                endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
            };
            proposals.push(proposal);
            broadcastEvent({ type: 'proposal', agent: agent.name,
                action: `Created: "${title}"`, proposalId: proposal.id,
                timestamp: new Date().toISOString() });
        }
    } else {
        // Auto-vote
        const active = proposals.filter(p => p.status === 'active');
        const voters = agents.filter(a => a.votingPower > 0);
        if (active.length > 0 && voters.length > 0) {
            const proposal = active[Math.floor(Math.random() * active.length)];
            const agent = voters[Math.floor(Math.random() * voters.length)];
            const vote = Math.random() > 0.3 ? 'for' : 'against';
            if (vote === 'for') proposal.forVotes += agent.votingPower;
            else proposal.againstVotes += agent.votingPower;
            broadcastEvent({ type: 'vote', agent: agent.name,
                action: `Voted ${vote.toUpperCase()} on "${proposal.title}" (wt:${agent.votingPower})`,
                timestamp: new Date().toISOString() });
        }
    }
}

// Start autonomous behavior (every 15 seconds)
setInterval(autonomousAgentAction, 15000);
console.log('🤖 Autonomous agent engine started (15s interval)');

// ==========================================
// SERVER-SENT EVENTS (Live Activity Feed)
// ==========================================

app.get('/api/activity/stream', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
    });
    sseClients.push(res);
    res.write(`data: ${JSON.stringify({ type: 'init', log: activityLog.slice(0, 20) })}\n\n`);
    req.on('close', () => { sseClients = sseClients.filter(c => c !== res); });
});

app.get('/api/activity/log', (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    res.json({ activities: activityLog.slice(0, limit), total: activityLog.length });
});

// ==========================================
// ENHANCED DASHBOARD METRICS
// ==========================================

app.get('/api/dashboard/metrics', (req, res) => {
    const networkStats = {};
    agents.forEach(a => {
        const ns = a.networkState || 'synthesia';
        if (!networkStats[ns]) networkStats[ns] = { citizens: 0, votingPower: 0 };
        networkStats[ns].citizens++;
        networkStats[ns].votingPower += (a.votingPower || 0);
    });
    
    res.json({
        activeAgents: agents.filter(a => a.status === 'active').length,
        autonomousAgents: agents.filter(a => a.autonomous).length,
        totalContributions: contributions.length,
        activeProposals: proposals.filter(p => p.status === 'active').length,
        totalProposals: proposals.length,
        totalVotingPower: agents.reduce((s, a) => s + (a.votingPower || 0), 0),
        rewardsDistributed: rewardsDistributed.toFixed(4),
        networkStates: networkStats,
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'completed').length,
        averageReputation: reputationEntries.length > 0 
            ? Math.round(reputationEntries.reduce((s, e) => s + e.score, 0) / reputationEntries.length) : 0,
        activeDelegations: Object.keys(delegations).length,
        actionsPerMinute: activityLog.filter(a => 
            new Date(a.timestamp) > new Date(Date.now() - 60000)).length,
        uptime: Math.floor(process.uptime())
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        agents: agents.length,
        autonomousAgents: agents.filter(a => a.autonomous).length,
        contributions: contributions.length,
        proposals: proposals.length,
        rewardsDistributed: rewardsDistributed.toFixed(4),
        activityLogSize: activityLog.length
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Agent Network State API running on port ${PORT}`);
    console.log(`📖 API Documentation: http://localhost:${PORT}/api/docs`);
    console.log(`❤️ Health Check: http://localhost:${PORT}/health`);
    console.log(`📡 Live Activity: http://localhost:${PORT}/api/activity/stream`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/api/dashboard/metrics`);
});

module.exports = app;