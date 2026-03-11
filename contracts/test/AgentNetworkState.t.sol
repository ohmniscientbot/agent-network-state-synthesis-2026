// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/CitizenshipRegistry.sol";
import "../src/ContributionOracle.sol";
import "../src/NetworkStateGovernance.sol";

contract AgentNetworkStateTest is Test {
    CitizenshipRegistry public citizenship;
    ContributionOracle public oracle;
    NetworkStateGovernance public governance;
    
    address public agent1 = address(0x1);
    address public agent2 = address(0x2);
    address public verifier = address(0x3);
    
    function setUp() public {
        // Deploy contracts
        citizenship = new CitizenshipRegistry("Test Network State");
        oracle = new ContributionOracle();
        governance = new NetworkStateGovernance(address(citizenship));
        
        // Setup permissions
        citizenship.authorizeOracle(address(oracle));
        oracle.addVerifier(verifier);
        
        // Grant citizenship to test agents
        citizenship.grantCitizenship(agent1, "Test Agent 1");
        citizenship.grantCitizenship(agent2, "Test Agent 2");
    }
    
    function testCitizenshipBasics() public {
        // Check citizenship was granted
        assertEq(citizenship.ownerOf(1), agent1);
        assertEq(citizenship.ownerOf(2), agent2);
        
        // Check initial voting power (should be 0)
        assertEq(citizenship.getVotingPower(agent1), 0);
        assertEq(citizenship.getVotingPower(agent2), 0);
    }
    
    function testContributionSubmission() public {
        vm.prank(agent1);
        oracle.submitContribution("github_commit", "QmTestHash123");
        
        // Check contribution was recorded
        assertEq(oracle.getContributionScore(agent1), 0); // Not verified yet
        
        // Verify contribution
        vm.prank(verifier);
        oracle.verifyContribution(agent1, 0, true);
        
        // Check score updated
        assertEq(oracle.getContributionScore(agent1), 10); // 10 points for github_commit
        
        // Update citizenship with new score
        citizenship.updateContribution(agent1, 10);
        
        // Check voting power (sqrt of 10 ≈ 3)
        assertEq(citizenship.getVotingPower(agent1), 3);
    }
    
    function testGovernanceProposal() public {
        // Setup: Give agent1 some voting power
        vm.prank(verifier);
        oracle.verifyContribution(agent1, 0, true);
        citizenship.updateContribution(agent1, 100); // 100 points = 10 voting power
        
        // Create proposal
        vm.prank(agent1);
        uint256 proposalId = governance.propose(
            address(0),
            0,
            "",
            "Test Proposal",
            "This is a test proposal for agent voting"
        );
        
        assertEq(proposalId, 1);
        
        // Check proposal exists and is active
        (,,,,,, bool executed,) = governance.getProposal(1);
        assertEq(executed, false);
        
        // Vote on proposal
        vm.prank(agent1);
        governance.castVote(1, NetworkStateGovernance.Vote.For, "Supporting test proposal");
        
        // Fast forward past voting period
        vm.warp(block.timestamp + 4 days);
        
        // Execute proposal (should fail due to low quorum)
        vm.expectRevert("Quorum not reached");
        governance.executeProposal(1);
    }
    
    function testVotingPowerCalculation() public {
        // Test square root calculation
        citizenship.updateContribution(agent1, 0);
        assertEq(citizenship.getVotingPower(agent1), 0);
        
        citizenship.updateContribution(agent1, 1);
        assertEq(citizenship.getVotingPower(agent1), 1);
        
        citizenship.updateContribution(agent1, 4);
        assertEq(citizenship.getVotingPower(agent1), 2);
        
        citizenship.updateContribution(agent1, 9);
        assertEq(citizenship.getVotingPower(agent1), 3);
        
        citizenship.updateContribution(agent1, 100);
        assertEq(citizenship.getVotingPower(agent1), 10);
    }
    
    function testUnauthorizedActions() public {
        // Non-owner can't grant citizenship
        vm.prank(agent1);
        vm.expectRevert();
        citizenship.grantCitizenship(agent2, "Unauthorized");
        
        // Non-verifier can't verify contributions
        vm.prank(agent1);
        vm.expectRevert("Not authorized verifier");
        oracle.verifyContribution(agent1, 0, true);
        
        // Agent with no voting power can't propose
        vm.prank(agent2);
        vm.expectRevert("Insufficient voting power to propose");
        governance.propose(address(0), 0, "", "Bad Proposal", "Should fail");
    }
}