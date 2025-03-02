'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Find connection profile from multiple possible locations
let ccpPath;

// List of possible connection profile locations
const possibleLocations = [
    path.resolve(__dirname, '..', 'connection-org1.json'),
    path.resolve(__dirname, 'connection-org1.json'),
    path.resolve(
        __dirname,
        '..',
        'test-network',
        'organizations',
        'peerOrganizations',
        'org1.example.com',
        'connection-org1.json'
    ),
    path.resolve(__dirname, '..', 'test-network', 'connection-org1.json'),
];

// Find the first valid connection profile
for (const location of possibleLocations) {
    console.log(`Checking for connection profile at: ${location}`);
    if (fs.existsSync(location)) {
        console.log(`Found connection profile at: ${location}`);
        ccpPath = location;
        break;
    }
}

// If no connection profile is found
if (!ccpPath) {
    console.error(
        'No connection profile found. Creating a sample profile for testing.'
    );

    // Create a basic connection profile for testing
    const testProfile = {
        name: 'test-network',
        version: '1.0.0',
        client: {
            organization: 'Org1',
        },
        organizations: {
            Org1: {
                mspid: 'Org1MSP',
            },
        },
        peers: {
            'peer0.org1.example.com': {},
        },
        certificateAuthorities: {
            'ca.org1.example.com': {
                url: 'https://localhost:7054',
                caName: 'ca-org1',
                tlsCACerts: {
                    pem: '-----BEGIN CERTIFICATE-----\nSample Certificate\n-----END CERTIFICATE-----',
                },
            },
        },
    };

    // Save the test profile
    ccpPath = path.resolve(__dirname, 'connection-org1.json');
    fs.writeFileSync(ccpPath, JSON.stringify(testProfile, null, 2));
    console.log(`Created test connection profile at: ${ccpPath}`);
}

// Get the wallet path
const walletPath = path.join(__dirname, 'wallet');

// Connect to the Fabric network
async function connectToNetwork() {
    try {
        console.log(`Loading connection profile from: ${ccpPath}`);
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        console.log('Connection profile loaded successfully');

        // ADD THIS CODE HERE - Modify profile to use only one peer for simpler testing
        const simplifiedCCP = JSON.parse(JSON.stringify(ccp));
        if (simplifiedCCP.peers) {
            console.log('Peer information from connection profile:');
            console.log(JSON.stringify(simplifiedCCP.peers, null, 2));

            // Keep only the first peer
            const firstPeerName = Object.keys(simplifiedCCP.peers)[0];
            const firstPeer = simplifiedCCP.peers[firstPeerName];
            simplifiedCCP.peers = { [firstPeerName]: firstPeer };
            console.log(
                'Using simplified peer configuration with only one peer:'
            );
            console.log(JSON.stringify(simplifiedCCP.peers, null, 2));
        }
        // END OF NEW CODE

        // Create a new wallet using the file system
        console.log(`Using wallet at: ${walletPath}`);
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check if admin identity exists
        const identity = await wallet.get('admin');
        if (!identity) {
            throw new Error(
                'Admin identity not found in wallet. Please run import-admin.js first'
            );
        }
        console.log('Admin identity found in wallet');

        // Connect to gateway
        console.log('Connecting to gateway...');
        const gateway = new Gateway();

        // UPDATE THIS LINE - Use the simplified connection profile and disable discovery
        await gateway.connect(simplifiedCCP, {
            // Change from ccp to simplifiedCCP
            wallet,
            identity: 'admin',
            discovery: { enabled: false, asLocalhost: true }, // Disable discovery for testing
        });

        console.log('Connected to gateway successfully');

        // Get network and contract
        console.log('Getting network...');
        const network = await gateway.getNetwork('mychannel');
        console.log('Getting contract...');
        const contract = network.getContract(
            'evidence',
            'org.evidencevault.evidence'
        );
        console.log('Successfully connected to network and obtained contract');

        return { gateway, contract };
    } catch (error) {
        console.error(`Failed to connect to the network: ${error}`);
        throw error;
    }
}

// API Endpoints
app.get('/api/evidence/:caseID', async (req, res) => {
    try {
        const { contract } = await connectToNetwork();
        const result = await contract.evaluateTransaction(
            'getEvidence',
            req.params.caseID
        );
        const evidence = JSON.parse(result.toString());
        res.status(200).json(evidence);
    } catch (error) {
        console.error(`Failed to get evidence: ${error}`);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/evidence', async (req, res) => {
    try {
        const { contract } = await connectToNetwork();
        const result = await contract.evaluateTransaction('getAllEvidence');
        const evidences = JSON.parse(result.toString());
        res.status(200).json(evidences);
    } catch (error) {
        console.error(`Failed to get all evidence: ${error}`);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/evidence', async (req, res) => {
    try {
        const { caseID, documentHash, ipfsUrl, uploadedBy } = req.body;

        console.log('Request body:', req.body);

        // Validate request body
        if (!caseID || !documentHash || !ipfsUrl || !uploadedBy) {
            console.log('Missing required fields in request');
            return res.status(400).json({ error: 'Missing required fields' });
        }

        console.log(
            `Storing evidence: ${caseID}, ${documentHash}, ${ipfsUrl}, ${uploadedBy}`
        );

        const { gateway, contract } = await connectToNetwork();
        console.log('Connected to network, submitting transaction...');

        const result = await contract.submitTransaction(
            'storeEvidence',
            caseID,
            documentHash,
            ipfsUrl,
            uploadedBy
        );
        console.log('Transaction submitted successfully');

        const evidence = JSON.parse(result.toString());
        gateway.disconnect();
        console.log('Gateway disconnected');

        res.status(201).json(evidence);
    } catch (error) {
        console.error(`Failed to create evidence: ${error}`);
        if (error.endorsements) {
            console.error('Endorsement errors:', error.endorsements);
        }
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/evidence/:caseID', async (req, res) => {
    try {
        const { newDocumentHash, newIpfsUrl } = req.body;

        // Validate request body
        if (!newDocumentHash || !newIpfsUrl) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const { gateway, contract } = await connectToNetwork();

        const result = await contract.submitTransaction(
            'updateEvidence',
            req.params.caseID,
            newDocumentHash,
            newIpfsUrl
        );

        const evidence = JSON.parse(result.toString());
        gateway.disconnect();

        res.status(200).json(evidence);
    } catch (error) {
        console.error(`Failed to update evidence: ${error}`);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/evidence/:caseID', async (req, res) => {
    try {
        const { gateway, contract } = await connectToNetwork();

        await contract.submitTransaction('deleteEvidence', req.params.caseID);
        gateway.disconnect();

        res.status(204).end();
    } catch (error) {
        console.error(`Failed to delete evidence: ${error}`);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/evidence/query/uploader/:uploadedBy', async (req, res) => {
    try {
        const { contract } = await connectToNetwork();
        const result = await contract.evaluateTransaction(
            'queryEvidenceByUploader',
            req.params.uploadedBy
        );
        const evidences = JSON.parse(result.toString());
        res.status(200).json(evidences);
    } catch (error) {
        console.error(`Failed to query evidence by uploader: ${error}`);
        res.status(500).json({ error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Evidence API server running on port ${PORT}`);
});
