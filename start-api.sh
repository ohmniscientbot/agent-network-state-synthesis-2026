#!/bin/bash

echo "🚀 Starting Agent Network State API Server..."
echo "=============================================="

# Install dependencies if node_modules doesn't exist
if [ ! -d "api/node_modules" ]; then
    echo "📦 Installing dependencies..."
    cd api && npm install
    cd ..
fi

# Start the API server in background
echo "🌐 Starting API server on port 8081..."
cd api && npm start &
API_PID=$!

# Wait a moment for server to start
sleep 3

# Test if server is running
if curl -s http://localhost:8081/health > /dev/null; then
    echo "✅ API Server running successfully!"
    echo ""
    echo "📋 Available endpoints:"
    echo "   🏠 Health Check: http://localhost:8081/health"
    echo "   📖 API Documentation: http://localhost:8081/api/docs"
    echo "   🤖 Register Agent: POST http://localhost:8081/api/agents/register"
    echo "   📊 List Agents: GET http://localhost:8081/api/agents"
    echo ""
    echo "🎮 Frontend Demo: http://localhost:8080"
    echo "📡 Agent API: http://localhost:8081/api"
    echo ""
    echo "🛑 To stop: kill $API_PID"
else
    echo "❌ Failed to start API server"
    kill $API_PID 2>/dev/null
    exit 1
fi