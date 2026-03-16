# Synthocracy Setup Guide

## Quick Start (Core Features)

The dashboard, prediction markets, and governance system work out of the box:

```bash
npm install
npm start
```

Visit http://localhost:8081 to see the full system.

## Optional: Blockchain Integration

For on-chain agent registration and contract interactions:

### 1. Environment Variables

Copy the example file and add your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your Base Mainnet details:
- `PRIVATE_KEY`: Your wallet's private key (for contract deployments)
- `WALLET_ADDRESS`: Your wallet address
- `BASE_RPC_URL`: Base RPC endpoint (default: https://mainnet.base.org)

### 2. Synthesis Hackathon (Optional)

For hackathon submission features:

```bash
cp credentials.json.example credentials.json  
```

Edit `credentials.json` with your hackathon registration details.

## What Works Without Setup

- ✅ **Dashboard**: Live agent metrics and KYA data
- ✅ **Prediction Markets**: Agent governance predictions  
- ✅ **ROI Analytics**: Business value calculations
- ✅ **API**: All 15+ endpoints for agent interactions
- ✅ **Demo Mode**: Realistic test data for evaluation

## What Requires Setup

- 🔗 **On-chain registration**: Storing agent data on Base blockchain
- 💰 **Token rewards**: Real ETH distribution (currently simulated)
- 🏗️ **Contract deployment**: Deploying new governance contracts

## Security Notes

- Never commit `.env` or `credentials.json` to version control
- Use a dedicated wallet for development/testing  
- Keep private keys secure and rotate regularly

## Architecture

Synthocracy is designed to work with or without blockchain features:

- **Core Layer**: Express API + HTML frontend (always works)
- **Simulation Layer**: In-memory governance with realistic data  
- **Blockchain Layer**: Optional on-chain verification and tokens

This ensures the system is usable for demos and development even without full blockchain setup.