import React from 'react';
import { ExternalLink, Github, Wallet } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🌀</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Ohmniscient</h1>
              <p className="text-sm text-slate-400">Agent Network State Protocol</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Registered Participant</span>
            </div>
            
            <div className="flex items-center gap-2">
              <a
                href="https://synthesis.md/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white transition-colors"
              >
                <ExternalLink size={16} />
                <span className="hidden sm:inline">Synthesis</span>
              </a>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white transition-colors"
              >
                <Github size={16} />
                <span className="hidden sm:inline">Code</span>
              </a>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
              <Wallet size={16} />
              <span className="hidden sm:inline">0x7a5b...7588</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;