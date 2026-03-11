#!/bin/bash

echo "🤖 Manual Autonomous Improvement Trigger"
echo "======================================="
echo ""
echo "This will run one improvement cycle manually for testing."
echo "The system normally runs every 30 minutes automatically."
echo ""

# Check if Python script exists
if [ ! -f "autonomous-improvement.py" ]; then
    echo "❌ autonomous-improvement.py not found!"
    exit 1
fi

echo "🔍 Starting manual improvement cycle..."
echo ""

# Run the improvement system
cd "$(dirname "$0")"
python3 autonomous-improvement.py

echo ""
echo "✅ Manual improvement cycle completed!"
echo ""
echo "📄 Check the improvements/ directory for:"
echo "   - changelog.json - Complete improvement history"
echo "   - improvement_cycle_*.md - Detailed cycle documentation"
echo "   - research-ideas.md - Research findings and ideas"
echo ""
echo "🔄 Next automatic cycle will run every 30 minutes"