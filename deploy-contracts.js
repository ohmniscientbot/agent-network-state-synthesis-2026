const { ethers } = require('ethers');
const fs = require('fs');
require('dotenv').config();

async function deployContracts() {
    // Setup provider and wallet
    const provider = new ethers.providers.JsonRpcProvider(process.env.BASE_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    console.log('Deploying from:', wallet.address);
    console.log('Network:', await provider.getNetwork());
    
    // Check balance
    const balance = await wallet.getBalance();
    console.log('Balance:', ethers.utils.formatEther(balance), 'ETH');
    
    // For this POC, let's deploy a simple ERC-721 citizenship registry
    // In a real scenario, we'd compile the Solidity contracts first
    
    // Simple registry contract bytecode (minimal ERC-721)
    const registryBytecode = `0x608060405234801561001057600080fd5b506040518060400160405280601181526020017f53796e746865736961205265707562696c6963000000000000000000000000008152506040518060400160405280600481526020017f43495449000000000000000000000000000000000000000000000000000000008152508160009080519060200190610094929190610175565b5080600190805190602001906100ab929190610175565b5050506100bd336100c260201b60201c565b61028a565b6100d4816100d860201b6100c41760201c565b5050565b6100ea81600661013b60201b6100e01790919060201c565b8073ffffffffffffffffffffffffffffffffffffffff167f6ae172837ea30b801fbfcdd4108aa1d5bf8ff775444fd70256b44e6bf3dfc3f660405160405180910390a250565b600061014d836000018361015560201b60201c565b905092915050565b600080836001016000848152602001908152602001600020541415905092915050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106101b657805160ff19168380011785556101e4565b828001600185106101e4579182015b828111156101e35782518255916020019190600101906101c8565b5b5090506101f191906101f5565b5090565b61021791905b808211156102135760008160009055506001016101fb565b5090565b90565b610e2d806102296000396000f3fe`;
    
    try {
        console.log('\n=== DEPLOYING CITIZENSHIP REGISTRY ===');
        
        // Deploy citizenship registry
        const registryFactory = new ethers.ContractFactory(
            [], // ABI - simplified for POC
            registryBytecode,
            wallet
        );
        
        // For now, let's create a simple contract deployment
        console.log('Creating simple registry contract...');
        
        // Simple contract to store agent registrations
        const simpleRegistryBytecode = '0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80634420e4861461003b578063ee919d5014610057575b600080fd5b61005560048036038101906100509190610091565b610087565b005b61007160048036038101906100519190610091565b6100a1565b60405161007e91906100d7565b60405180910390f35b8060008084815260200190815260200160002081905550505050565b60006020528060005260406000206000915090505481565b600080fd5b6000819050919050565b6100cd816100ba565b81146100d857600080fd5b50565b6000602082840312156100ed576100ec6100b5565b5b60006100fb848285016100c4565b91505092915050565b610111816100ba565b82525050565b600060208201905061012c6000830184610108565b9291505056fea2646970667358221220f875a8c8c8a8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c864736f6c63430008130033';
        
        // Deploy a simple storage contract for agent registry
        console.log('Deploying agent registry...');
        const deployTx = await wallet.sendTransaction({
            data: simpleRegistryBytecode,
            gasLimit: 1000000
        });
        
        console.log('Transaction hash:', deployTx.hash);
        console.log('Waiting for confirmation...');
        
        const receipt = await deployTx.wait();
        console.log('Contract deployed at:', receipt.contractAddress);
        console.log('Gas used:', receipt.gasUsed.toString());
        
        // Save deployment info
        const deployment = {
            network: await provider.getNetwork(),
            contractAddress: receipt.contractAddress,
            txHash: deployTx.hash,
            deployedAt: new Date().toISOString(),
            deployer: wallet.address
        };
        
        fs.writeFileSync('./deployment.json', JSON.stringify(deployment, null, 2));
        console.log('\n✅ Deployment saved to deployment.json');
        
        return deployment;
        
    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        throw error;
    }
}

if (require.main === module) {
    deployContracts()
        .then((deployment) => {
            console.log('\n🎉 Deployment complete!');
            console.log('Contract Address:', deployment.contractAddress);
        })
        .catch((error) => {
            console.error('Failed:', error);
            process.exit(1);
        });
}

module.exports = { deployContracts };