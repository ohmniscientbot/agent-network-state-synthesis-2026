# 🧪 Testing Guide - Agent Network State Protocol

## Current Demo Limitation
The demo at `http://localhost:8080` is currently showing a **static presentation page**. Here's how to test the actual functionality:

## 🎮 Interactive Testing Options

### Option 1: Smart Contract Testing (Recommended)
```bash
cd skills/synthesis/contracts

# Run the full test suite
forge test -vv

# Expected output:
# ✅ testCitizenshipBasics
# ✅ testContributionSubmission  
# ✅ testGovernanceProposal
# ✅ testVotingPowerCalculation
```

### Option 2: Live Contract Interaction (When Deployed)
Once contracts are deployed to Base mainnet, you can interact with them via:

1. **BaseScan Contract Interface**
   - Navigate to deployed contract addresses
   - Use "Write Contract" tab to test functions
   - Submit contributions, vote on proposals

2. **Frontend Integration**
   - Connect MetaMask to Base network
   - Test agent citizenship applications
   - Create and vote on governance proposals

### Option 3: Local Development Server
```bash
cd skills/synthesis/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:3000 (or different port)
```

## 🔧 What You Can Test

### Smart Contract Functions

#### CitizenshipRegistry
- `grantCitizenship(agent, name)` - Mint citizenship NFT
- `updateContribution(agent, score)` - Update voting power
- `getVotingPower(agent)` - Check agent's influence

#### ContributionOracle  
- `submitContribution(type, evidence)` - Submit work proof
- `verifyContribution(agent, index, valid)` - Verify submissions
- `getContributionScore(agent)` - Check total score

#### NetworkStateGovernance
- `propose(target, value, calldata, title, desc)` - Create proposal
- `castVote(proposalId, vote, reason)` - Vote on proposals
- `executeProposal(proposalId)` - Execute passed proposals

## 🎯 Demo Scenarios

### Scenario 1: Agent Citizenship
1. Agent submits GitHub contribution
2. Verifier confirms the work
3. Agent receives citizenship NFT
4. Voting power calculated (√score)

### Scenario 2: Governance Voting
1. Citizen agent creates proposal
2. Other agents vote based on contribution scores
3. Proposal passes/fails based on quorum
4. Execution if successful

### Scenario 3: Cross-State Diplomacy
1. Two network states negotiate
2. Ambassador agents draft treaty
3. Citizens vote on agreement
4. Smart contract execution

## 🚀 Live Deployment Testing

Once deployed to Base mainnet with the funded wallet:

```bash
# Deploy contracts
cd skills/synthesis
./deploy-mainnet.sh

# Contracts will be live at addresses like:
# CitizenshipRegistry: 0x...
# ContributionOracle: 0x...
# NetworkStateGovernance: 0x...
```

Then test on BaseScan or through the React frontend with real transactions.

## 📋 Expected Test Results

- **Unit Tests**: All contract functions work correctly
- **Integration Tests**: Contracts interact properly
- **UI Tests**: Frontend displays real contract data
- **E2E Tests**: Full agent citizenship workflow

## 🔍 Troubleshooting

**Static Page Issue**: The current demo shows a presentation. For interactive testing, use the smart contract test suite or deploy contracts to Base mainnet.

**No Frontend Interactivity**: React frontend requires contract deployment and Web3 connection.

**Test Failures**: Check Solidity compiler version and dependency installation.

---

**The real innovation is in the smart contracts - they implement the first AI agent citizenship system!**