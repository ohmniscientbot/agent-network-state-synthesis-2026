#!/bin/bash

# Agent Network State - Base Mainnet Deployment Script
# Deploy to the real Base network with real ETH

set -e

echo "🚀 Agent Network State Protocol - Base Mainnet Deployment"
echo "========================================================"
echo "⚠️  WARNING: This is deploying to BASE MAINNET with real ETH!"
echo ""

# Check balance first
echo "📊 Checking wallet balance..."
BALANCE=$(curl -s -X POST https://mainnet.base.org \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_getBalance",
    "params": ["0x7a5b629325f051Fd5e871FFDD97C5f0431817588", "latest"],
    "id": 1
  }' | jq -r '.result')

if [ "$BALANCE" = "0x0" ]; then
    echo "❌ No ETH found in wallet. Please send ETH to:"
    echo "   0x7a5b629325f051Fd5e871FFDD97C5f0431817588"
    echo "   on Base mainnet"
    exit 1
fi

# Convert hex to decimal for display
BALANCE_ETH=$(python3 -c "print(f'{int(\"$BALANCE\", 16) / 10**18:.6f}')")
echo "✅ Wallet balance: $BALANCE_ETH ETH"

if (( $(echo "$BALANCE_ETH < 0.01" | bc -l) )); then
    echo "⚠️  Low balance warning: Less than 0.01 ETH"
    echo "   Deployment may fail due to insufficient gas"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "🔨 Deploying smart contracts to Base mainnet..."
echo "📍 Network: Base (Chain ID: 8453)"
echo "💼 Wallet: 0x7a5b629325f051Fd5e871FFDD97C5f0431817588"
echo ""

cd contracts

# Deploy using Foundry
echo "📜 Deploying CitizenshipRegistry, ContributionOracle, and NetworkStateGovernance..."
forge script script/Deploy.s.sol \
    --broadcast \
    --rpc-url base \
    --slow \
    --legacy

echo ""
echo "✅ Deployment complete!"
echo "🔍 Check deployment on BaseScan:"
echo "   https://basescan.org/address/0x7a5b629325f051Fd5e871FFDD97C5f0431817588"
echo ""
echo "📋 Next steps:"
echo "   1. Verify contracts on BaseScan"
echo "   2. Update frontend with contract addresses"
echo "   3. Test agent interactions on mainnet"
echo ""
echo "🎉 Agent Network State Protocol is now LIVE on Base mainnet!"