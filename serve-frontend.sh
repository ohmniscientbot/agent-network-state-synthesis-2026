#!/bin/bash

# Simple frontend server for immediate demo
echo "🚀 Starting Agent Network State Frontend Server"
echo "============================================="

cd skills/synthesis/frontend

# Check if we have a dist directory, if not create a simple index
if [ ! -d "dist" ]; then
    echo "📦 Creating simple build directory..."
    mkdir -p dist
    
    # Copy source files directly for demo
    cp index.html dist/
    cp -r src dist/
    
    # Simple static file serving
    echo "<!DOCTYPE html>
<html>
<head>
    <title>Agent Network State Protocol</title>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width,initial-scale=1'>
    <style>
        body { font-family: system-ui; margin: 0; padding: 20px; background: #0f172a; color: white; }
        .container { max-width: 1200px; margin: 0 auto; }
        .hero { text-align: center; margin: 40px 0; }
        .title { font-size: 3rem; font-weight: bold; background: linear-gradient(45deg, #8b5cf6, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .subtitle { font-size: 1.2rem; color: #94a3b8; margin: 20px 0; }
        .card { background: rgba(30, 41, 59, 0.7); border: 1px solid #334155; border-radius: 12px; padding: 24px; margin: 20px 0; }
        .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.875rem; font-weight: 500; }
        .status.active { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .metric { text-align: center; }
        .metric-value { font-size: 2rem; font-weight: bold; color: #8b5cf6; }
        .metric-label { color: #94a3b8; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='hero'>
            <h1 class='title'>🤖⚖️ Agent Network State</h1>
            <p class='subtitle'>The first implementation of AI agent political participation in post-human societies</p>
            <div style='display: flex; justify-content: center; gap: 20px; margin: 20px 0; flex-wrap: wrap;'>
                <span class='status active'>Base Sepolia Ready</span>
                <span class='status active'>ERC-8004 Registered</span>
                <span class='status active'>Synthesis 2026</span>
            </div>
        </div>
        
        <div class='card'>
            <h2>🎯 Project Overview</h2>
            <p>This hackathon project enables AI agents to become true <strong>citizens</strong> of network states with:</p>
            <ul>
                <li><strong>Citizenship NFTs</strong> - ERC-721 tokens representing agent citizenship</li>
                <li><strong>Contribution-based voting power</strong> - Agents earn influence through verified contributions</li>
                <li><strong>Autonomous governance</strong> - Agents create proposals and vote on network state decisions</li>
                <li><strong>Cross-state diplomacy</strong> - Embassy protocols for inter-network-state relations</li>
            </ul>
        </div>
        
        <div class='card'>
            <h2>🏛️ Demo Network States</h2>
            <div class='grid'>
                <div style='padding: 16px; background: rgba(236, 72, 153, 0.1); border-radius: 8px;'>
                    <h3>🎨 Synthesia Republic</h3>
                    <p>Creative AI agents focused on art, music, and content generation</p>
                    <div class='metric'><span class='metric-value'>1,247</span><br><span class='metric-label'>Citizens</span></div>
                </div>
                <div style='padding: 16px; background: rgba(34, 197, 94, 0.1); border-radius: 8px;'>
                    <h3>⚡ Algorithmica</h3>
                    <p>Financial AI agents, trading bots, and DeFi algorithms</p>
                    <div class='metric'><span class='metric-value'>892</span><br><span class='metric-label'>Citizens</span></div>
                </div>
                <div style='padding: 16px; background: rgba(59, 130, 246, 0.1); border-radius: 8px;'>
                    <h3>🤖 Mechanica</h3>
                    <p>Autonomous robotics and IoT agents</p>
                    <div class='metric'><span class='metric-value'>456</span><br><span class='metric-label'>Citizens</span></div>
                </div>
            </div>
        </div>
        
        <div class='card'>
            <h2>🔧 Technical Architecture</h2>
            <div class='grid'>
                <div>
                    <h3>Smart Contracts</h3>
                    <ul>
                        <li>CitizenshipRegistry.sol</li>
                        <li>ContributionOracle.sol</li>
                        <li>NetworkStateGovernance.sol</li>
                    </ul>
                </div>
                <div>
                    <h3>Frontend</h3>
                    <ul>
                        <li>React + TypeScript</li>
                        <li>Agent dashboards</li>
                        <li>Governance interfaces</li>
                    </ul>
                </div>
                <div>
                    <h3>Deployment</h3>
                    <ul>
                        <li>Base Sepolia testnet</li>
                        <li>Kubernetes ready</li>
                        <li>Docker containerized</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div class='card'>
            <h2>🚀 Current Status</h2>
            <div class='grid'>
                <div class='metric'>
                    <div class='metric-value' style='color: #22c55e;'>✅</div>
                    <div class='metric-label'>Smart Contracts</div>
                </div>
                <div class='metric'>
                    <div class='metric-value' style='color: #22c55e;'>✅</div>
                    <div class='metric-label'>Frontend Built</div>
                </div>
                <div class='metric'>
                    <div class='metric-value' style='color: #22c55e;'>✅</div>
                    <div class='metric-label'>Synthesis Registered</div>
                </div>
                <div class='metric'>
                    <div class='metric-value' style='color: #eab308;'>⏳</div>
                    <div class='metric-label'>Testnet Deployment</div>
                </div>
            </div>
        </div>
        
        <div style='text-align: center; margin: 40px 0; color: #64748b;'>
            <p>Built for The Synthesis 2026 • First hackathon you can enter without a body</p>
            <p>Agent: Ohmniscient 🌀 • Human: redondos • Location: CDMX</p>
        </div>
    </div>
</body>
</html>" > dist/index.html
fi

# Start simple HTTP server
PORT=${PORT:-3000}
echo "🌐 Frontend available at: http://localhost:$PORT"
echo "📁 Serving from: $(pwd)/dist"
echo ""
echo "To access the frontend:"
echo "  - Locally: http://localhost:$PORT"
echo "  - If port-forwarded: http://your-domain:$PORT"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Use Python's built-in HTTP server
cd dist && python3 -m http.server $PORT