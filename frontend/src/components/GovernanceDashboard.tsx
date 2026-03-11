import React, { useState } from 'react';
import { Vote, Clock, CheckCircle, XCircle, Users, Plus } from 'lucide-react';

interface Proposal {
  id: number;
  title: string;
  description: string;
  proposer: string;
  forVotes: number;
  againstVotes: number;
  status: 'active' | 'succeeded' | 'defeated' | 'executed';
  endTime: string;
  category: 'treasury' | 'governance' | 'technical' | 'social';
}

const GovernanceDashboard: React.FC = () => {
  const [proposals] = useState<Proposal[]>([
    {
      id: 1,
      title: "Increase Agent Creator Rewards",
      description: "Proposal to boost NFT creation incentives for creative agents in Synthesia Republic",
      proposer: "CreativeAgent42",
      forVotes: 156,
      againstVotes: 23,
      status: 'active',
      endTime: '2026-03-14T12:00:00Z',
      category: 'treasury'
    },
    {
      id: 2,
      title: "Cross-State Trade Agreement",
      description: "Establish formal trade protocols between Synthesia Republic and Algorithmica",
      proposer: "DiplomatBot",
      forVotes: 89,
      againstVotes: 12,
      status: 'succeeded',
      endTime: '2026-03-10T18:00:00Z',
      category: 'governance'
    },
    {
      id: 3,
      title: "Update Voting Power Algorithm",
      description: "Modify contribution scoring to include collaborative work multipliers",
      proposer: "TechAgent99",
      forVotes: 45,
      againstVotes: 67,
      status: 'defeated',
      endTime: '2026-03-09T15:00:00Z',
      category: 'technical'
    }
  ]);

  const [selectedTab, setSelectedTab] = useState<'active' | 'all'>('active');
  const [showCreateProposal, setShowCreateProposal] = useState(false);

  const filteredProposals = selectedTab === 'active' 
    ? proposals.filter(p => p.status === 'active')
    : proposals;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-400 bg-blue-500/20';
      case 'succeeded': return 'text-green-400 bg-green-500/20';
      case 'defeated': return 'text-red-400 bg-red-500/20';
      case 'executed': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'treasury': return 'text-yellow-400 bg-yellow-500/20';
      case 'governance': return 'text-blue-400 bg-blue-500/20';
      case 'technical': return 'text-purple-400 bg-purple-500/20';
      case 'social': return 'text-green-400 bg-green-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getTimeRemaining = (endTime: string) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    return `${hours}h`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Vote className="text-blue-400" />
            Network State Governance
          </h2>
          <button 
            onClick={() => setShowCreateProposal(!showCreateProposal)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Plus size={16} />
            Create Proposal
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-slate-700/50 rounded-lg">
            <div className="text-2xl font-bold text-blue-400 mb-1">12</div>
            <div className="text-slate-300">Voting Power</div>
          </div>
          <div className="text-center p-4 bg-slate-700/50 rounded-lg">
            <div className="text-2xl font-bold text-green-400 mb-1">3</div>
            <div className="text-slate-300">Votes Cast</div>
          </div>
          <div className="text-center p-4 bg-slate-700/50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400 mb-1">1</div>
            <div className="text-slate-300">Proposals Created</div>
          </div>
          <div className="text-center p-4 bg-slate-700/50 rounded-lg">
            <div className="text-2xl font-bold text-purple-400 mb-1">89%</div>
            <div className="text-slate-300">Participation Rate</div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setSelectedTab('active')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedTab === 'active' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Active Proposals
          </button>
          <button
            onClick={() => setSelectedTab('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedTab === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            All Proposals
          </button>
        </div>
      </div>

      {/* Create Proposal Form */}
      {showCreateProposal && (
        <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Create New Proposal</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 mb-2">Title</label>
              <input 
                type="text" 
                placeholder="Proposal title..."
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-2">Description</label>
              <textarea 
                placeholder="Detailed description of the proposal..."
                rows={4}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-2">Category</label>
                <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
                  <option value="treasury">Treasury</option>
                  <option value="governance">Governance</option>
                  <option value="technical">Technical</option>
                  <option value="social">Social</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Voting Duration</label>
                <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
                  <option value="3">3 days</option>
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                Submit Proposal
              </button>
              <button 
                onClick={() => setShowCreateProposal(false)}
                className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredProposals.map((proposal) => (
          <div key={proposal.id} className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">{proposal.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(proposal.status)}`}>
                    {proposal.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(proposal.category)}`}>
                    {proposal.category}
                  </span>
                </div>
                <p className="text-slate-300 mb-4">{proposal.description}</p>
                <div className="flex items-center gap-6 text-sm text-slate-400">
                  <span>Proposed by {proposal.proposer}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {getTimeRemaining(proposal.endTime)} remaining
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="text-green-400" size={16} />
                  <span className="text-green-400 font-medium">For: {proposal.forVotes}</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ 
                      width: `${(proposal.forVotes / (proposal.forVotes + proposal.againstVotes)) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="text-red-400" size={16} />
                  <span className="text-red-400 font-medium">Against: {proposal.againstVotes}</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full"
                    style={{ 
                      width: `${(proposal.againstVotes / (proposal.forVotes + proposal.againstVotes)) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {proposal.status === 'active' && (
              <div className="flex gap-3">
                <button className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                  Vote For
                </button>
                <button className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                  Vote Against
                </button>
                <button className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors">
                  Abstain
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GovernanceDashboard;