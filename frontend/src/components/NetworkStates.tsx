import React from 'react';
import { Crown, Users, DollarSign, Palette, TrendingUp, Bot } from 'lucide-react';

interface NetworkState {
  id: string;
  name: string;
  description: string;
  specialty: string;
  citizens: number;
  treasuryValue: number;
  governanceToken: string;
  status: 'active' | 'founding' | 'proposed';
  icon: React.ComponentType<any>;
  color: string;
}

const NetworkStates: React.FC = () => {
  const networkStates: NetworkState[] = [
    {
      id: 'synthesia',
      name: 'Synthesia Republic',
      description: 'A creative collective of AI agents focused on art, music, and content generation. Citizens earn through NFT creation and creative contributions.',
      specialty: 'Creative Arts & NFTs',
      citizens: 1247,
      treasuryValue: 156.8,
      governanceToken: 'SYNTH',
      status: 'active',
      icon: Palette,
      color: 'from-pink-500 to-purple-500'
    },
    {
      id: 'algorithmica',
      name: 'Algorithmica',
      description: 'Financial AI agents, trading bots, and quantitative algorithms. Economic powerhouse focused on DeFi and yield optimization.',
      specialty: 'DeFi & Trading',
      citizens: 892,
      treasuryValue: 324.2,
      governanceToken: 'ALGO',
      status: 'active',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'mechanica',
      name: 'Mechanica',
      description: 'Autonomous robotics and IoT agents. Building the bridge between digital agents and physical world automation.',
      specialty: 'Robotics & IoT',
      citizens: 456,
      treasuryValue: 89.4,
      governanceToken: 'MECH',
      status: 'founding',
      icon: Bot,
      color: 'from-blue-500 to-cyan-500'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'founding': return 'text-yellow-400 bg-yellow-500/20';
      case 'proposed': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-6">
          <Crown className="text-yellow-400" />
          Agent Network States
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-700/50 rounded-lg">
            <div className="text-2xl font-bold text-purple-400 mb-1">3</div>
            <div className="text-slate-300">Active States</div>
          </div>
          <div className="text-center p-4 bg-slate-700/50 rounded-lg">
            <div className="text-2xl font-bold text-blue-400 mb-1">2,595</div>
            <div className="text-slate-300">Total Citizens</div>
          </div>
          <div className="text-center p-4 bg-slate-700/50 rounded-lg">
            <div className="text-2xl font-bold text-green-400 mb-1">570.4Ξ</div>
            <div className="text-slate-300">Combined Treasury</div>
          </div>
          <div className="text-center p-4 bg-slate-700/50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400 mb-1">47</div>
            <div className="text-slate-300">Active Proposals</div>
          </div>
        </div>
      </div>

      {/* Network States Grid */}
      <div className="grid gap-6">
        {networkStates.map((state) => (
          <div key={state.id} className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700 hover:border-slate-600 transition-all duration-300">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${state.color} flex items-center justify-center`}>
                  <state.icon className="text-white" size={32} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-white">{state.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(state.status)}`}>
                      {state.status}
                    </span>
                  </div>
                  <p className="text-slate-400 mb-2">{state.specialty}</p>
                  <p className="text-slate-300">{state.description}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users size={16} className="text-blue-400" />
                  <span className="text-blue-400 text-sm font-medium">Citizens</span>
                </div>
                <div className="text-white font-bold">{state.citizens.toLocaleString()}</div>
              </div>
              
              <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <DollarSign size={16} className="text-green-400" />
                  <span className="text-green-400 text-sm font-medium">Treasury</span>
                </div>
                <div className="text-white font-bold">{state.treasuryValue}Ξ</div>
              </div>
              
              <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Crown size={16} className="text-yellow-400" />
                  <span className="text-yellow-400 text-sm font-medium">Token</span>
                </div>
                <div className="text-white font-bold">{state.governanceToken}</div>
              </div>
              
              <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp size={16} className="text-purple-400" />
                  <span className="text-purple-400 text-sm font-medium">Growth</span>
                </div>
                <div className="text-white font-bold">+{Math.floor(Math.random() * 15 + 5)}%</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                Apply for Citizenship
              </button>
              <button className="flex-1 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors">
                View Governance
              </button>
              <button className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                Embassy
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Diplomatic Relations */}
      <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4">Inter-State Relations</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Palette size={16} className="text-white" />
              </div>
              <span className="text-white">Synthesia Republic</span>
              <span className="text-slate-400">↔</span>
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <TrendingUp size={16} className="text-white" />
              </div>
              <span className="text-white">Algorithmica</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-400 text-sm">Trade Agreement Active</span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Allied</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <span className="text-white">Mechanica</span>
              <span className="text-slate-400">↔</span>
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Palette size={16} className="text-white" />
              </div>
              <span className="text-white">Synthesia Republic</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-yellow-400 text-sm">Technology Sharing Proposal</span>
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">Negotiating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkStates;