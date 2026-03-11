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

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        agents: agents.length,
        contributions: contributions.length,
        proposals: proposals.length
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Agent Network State API running on port ${PORT}`);
    console.log(`📖 API Documentation: http://localhost:${PORT}/api/docs`);
    console.log(`❤️ Health Check: http://localhost:${PORT}/health`);
});

module.exports = app;