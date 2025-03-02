'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

describe('Evidence Contract Integration Tests', () => {
    let gateway;
    let network;
    let contract;

    jest.setTimeout(30000); // Set longer timeout for network operations

    beforeAll(async () => {
        try {
            // Load connection profile
            const ccpPath = path.resolve(
                __dirname,
                '..',
                '..',
                'test-network',
                'organizations',
                'peerOrganizations',
                'org1.example.com',
                'connection-org1.json'
            );
            const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

            // Create wallet and add identity
            const walletPath = path.join(__dirname, 'wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);

            // Check if admin identity exists
            const identity = await wallet.get('admin');
            if (!identity) {
                throw new Error('Admin identity not found in wallet');
            }

            // Connect to gateway
            gateway = new Gateway();
            await gateway.connect(ccp, {
                wallet,
                identity: 'admin',
                discovery: { enabled: true, asLocalhost: true },
            });

            // Get network and contract
            network = await gateway.getNetwork('mychannel');
            contract = network.getContract('evidencevault');
        } catch (error) {
            console.error(`Error in setup: ${error}`);
            throw error;
        }
    });

    afterAll(() => {
        if (gateway) {
            gateway.disconnect();
        }
    });

    test('Store and retrieve evidence', async () => {
        // Generate a unique case ID
        const caseID = `TEST_CASE_${Date.now()}`;
        const documentHash = 'sha256:testHash123';
        const ipfsUrl = 'ipfs://QmTest123';
        const uploadedBy = '0xTestOfficer';

        // Store evidence
        await contract.submitTransaction(
            'storeEvidence',
            caseID,
            documentHash,
            ipfsUrl,
            uploadedBy
        );

        // Retrieve evidence
        const result = await contract.evaluateTransaction(
            'getEvidence',
            caseID
        );
        const evidence = JSON.parse(result.toString());

        // Verify evidence details
        expect(evidence.caseID).toEqual(caseID);
        expect(evidence.documentHash).toEqual(documentHash);
        expect(evidence.ipfsUrl).toEqual(ipfsUrl);
        expect(evidence.uploadedBy).toEqual(uploadedBy);
        expect(evidence.timestamp).toBeDefined();
    });

    // Add more integration tests
    // ...
});
