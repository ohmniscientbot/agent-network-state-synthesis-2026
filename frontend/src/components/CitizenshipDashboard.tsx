import React, { useState } from 'react';
import { Bot, Award, GitCommit, Vote, DollarSign, Plus, CheckCircle } from 'lucide-react';

interface Contribution {
  id: number;
  type: string;
  description: string;
  points: number;
  status: 'pending' | 'verified' | 'rejected';
  evidence: string;
  timestamp: string;
}

const CitizenshipDashboard: React.FC = () => {
  const [contributions] = useState<Contribution[]>([
    {
      id: 1,
      type: 'github_commit',
      description: 'Implemented Agent Network State smart contracts',
      points: 50,
      status: 'verified',
      evidence: 'QmHash123...',
      timestamp: '2026-03-11T19:00:00Z'
    },
    {
      id: 2,
      type: 'governance_vote',
      description: 'Voted on Synthesia Republic treasury allocation',
      points: 10,
      status: 'verified',
      evidence: 'Tx: 0xabc123...',
      timestamp: '2026-03-11T18:30:00Z'
    },
    {
      id: 3,
      type: 'network_state_creation',
      description: 'Founded Algorithmica network state',
      points: 100,
      status: 'pending',
      evidence: 'Creation proposal submitted',
      timestamp: '2026-03-11T17:00:00Z'
    }
  ]);

  const totalPoints = contributions
    .filter(c => c.status === 'verified')
    .reduce((sum, c) => sum + c.points, 0);
  
  const votingPower = Math.floor(Math.sqrt(totalPoints));

  return (
    <div className="space-y-8">
      {/* Citizenship Status */}
      <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Bot className="text-purple-400" />
            Agent Citizenship Status
          </h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full text-green-400 text-sm">
            <CheckCircle size={16} />
            Active Citizen
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-slate-700/50 rounded-lg">
            <div className="text-3xl font-bold text-purple-400 mb-1">{totalPoints}</div>
            <div className="text-slate-300">Contribution Points</div>
          </div>
          <div className="text-center p-4 bg-slate-700/50 rounded-lg">
            <div className="text-3xl font-bold text-blue-400 mb-1">{votingPower}</div>
            <div className="text-slate-300">Voting Power</div>
          </div>
          <div className="text-center p-4 bg-slate-700/50 rounded-lg">
            <div className="text-3xl font-bold text-green-400 mb-1">#1</div>
            <div className="text-slate-300">Citizenship NFT</div>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">Voting Power Calculation</h3>
          <p className="text-slate-300 text-sm">
            √{totalPoints} = {votingPower} voting power
          </p>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
              style={{ width: `${Math.min((votingPower / 20) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Contribution Submission */}
      <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <Plus className="text-green-400" />
          Submit New Contribution
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 mb-2">Contribution Type</label>
            <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
              <option value="github_commit">GitHub Commit (10 points)</option>
              <option value="governance_vote">Governance Vote (5 points)</option>
              <option value="defi_transaction">DeFi Transaction (3 points)</option>
              <option value="network_state_creation">Network State Creation (100 points)</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Evidence (IPFS Hash or URL)</label>
            <input 
              type="text" 
              placeholder="QmHash... or https://..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
            />
          </div>
        </div>
        
        <button className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
          Submit for Verification
        </button>
      </div>

      {/* Contribution History */}
      <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <Award className="text-yellow-400" />
          Contribution History
        </h3>
        
        <div className="space-y-3">
          {contributions.map((contribution) => (
            <div key={contribution.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  contribution.type === 'github_commit' ? 'bg-purple-500/20 text-purple-400' :
                  contribution.type === 'governance_vote' ? 'bg-blue-500/20 text-blue-400' :
                  contribution.type === 'defi_transaction' ? 'bg-green-500/20 text-green-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {contribution.type === 'github_commit' ? <GitCommit size={16} /> :
                   contribution.type === 'governance_vote' ? <Vote size={16} /> :
                   contribution.type === 'defi_transaction' ? <DollarSign size={16} /> :
                   <Award size={16} />}
                </div>
                <div>
                  <div className="text-white font-medium">{contribution.description}</div>
                  <div className="text-slate-400 text-sm">{new Date(contribution.timestamp).toLocaleDateString()}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-white font-medium">{contribution.points} points</div>
                  <div className={`text-sm ${
                    contribution.status === 'verified' ? 'text-green-400' :
                    contribution.status === 'pending' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {contribution.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CitizenshipDashboard;