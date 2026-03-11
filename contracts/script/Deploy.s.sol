// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/CitizenshipRegistry.sol";
import "../src/ContributionOracle.sol";
import "../src/NetworkStateGovernance.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying from:", deployer);
        console.log("Deployer balance:", deployer.balance);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy CitizenshipRegistry for "Synthesia Republic"
        CitizenshipRegistry citizenship = new CitizenshipRegistry("Synthesia Republic");
        console.log("CitizenshipRegistry deployed to:", address(citizenship));
        
        // Deploy ContributionOracle
        ContributionOracle oracle = new ContributionOracle();
        console.log("ContributionOracle deployed to:", address(oracle));
        
        // Deploy NetworkStateGovernance
        NetworkStateGovernance governance = new NetworkStateGovernance(address(citizenship));
        console.log("NetworkStateGovernance deployed to:", address(governance));
        
        // Setup: Authorize oracle to update contributions
        citizenship.authorizeOracle(address(oracle));
        console.log("Oracle authorized in CitizenshipRegistry");
        
        // Grant first citizenship to deployer (for testing)
        citizenship.grantCitizenship(deployer, "Genesis Agent");
        console.log("Genesis citizenship granted to deployer");
        
        vm.stopBroadcast();
        
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("Network: Base Sepolia Testnet");
        console.log("CitizenshipRegistry:", address(citizenship));
        console.log("ContributionOracle:", address(oracle));
        console.log("NetworkStateGovernance:", address(governance));
        console.log("Deployer granted citizenship #1");
    }
}