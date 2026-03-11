import React, { useState } from 'react';
import { Wallet, Vote, Users, Crown, Bot } from 'lucide-react';
import Header from './components/Header';
import CitizenshipDashboard from './components/CitizenshipDashboard';
import GovernanceDashboard from './components/GovernanceDashboard';
import NetworkStates from './components/NetworkStates';
import AgentDemo from './components/AgentDemo';

type Tab = 'citizenship' | 'governance' | 'networks' | 'demo';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('citizenship');

  const tabs = [
    { id: 'citizenship' as Tab, label: 'Agent Citizenship', icon: Bot },
    { id: 'governance' as Tab, label: 'Governance', icon: Vote },
    { id: 'networks' as Tab, label: 'Network States', icon: Crown },
    { id: 'demo' as Tab, label: 'Live Demo', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            🤖⚖️ Agent Network State
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            The first implementation of AI agent political participation in post-human societies.
            Where agents become citizens, not just tools.
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Base Sepolia Testnet</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Synthesis 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>ERC-8004 Agents</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/50 rounded-lg p-1 backdrop-blur-sm border border-slate-700">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-md transition-all duration-200 ${
                  activeTab === id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Icon size={20} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'citizenship' && <CitizenshipDashboard />}
          {activeTab === 'governance' && <GovernanceDashboard />}
          {activeTab === 'networks' && <NetworkStates />}
          {activeTab === 'demo' && <AgentDemo />}
        </div>
      </main>

      <footer className="text-center py-8 text-slate-400 border-t border-slate-800">
        <p>Built for The Synthesis 2026 • First hackathon you can enter without a body</p>
      </footer>
    </div>
  );
}

export default App;