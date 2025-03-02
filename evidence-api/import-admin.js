'use strict';

const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // Path to crypto materials
        const cryptoPath = path.resolve(__dirname, '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com');
        const certDir = path.resolve(cryptoPath, 'users', 'Admin@org1.example.com', 'msp', 'signcerts');
        const keyDir = path.resolve(cryptoPath, 'users', 'Admin@org1.example.com', 'msp', 'keystore');
        
        console.log(`Looking for certificate in: ${certDir}`);
        console.log(`Looking for private key in: ${keyDir}`);

        // Check if directories exist
        if (!fs.existsSync(certDir)) {
            console.error(`Certificate directory does not exist: ${certDir}`);
            return;
        }
        if (!fs.existsSync(keyDir)) {
            console.error(`Key directory does not exist: ${keyDir}`);
            return;
        }
        
        // Find certificate file
        const certFiles = fs.readdirSync(certDir);
        if (certFiles.length === 0) {
            console.error(`No certificate files found in ${certDir}`);
            return;
        }
        
        const certFile = path.resolve(certDir, certFiles[0]);
        console.log(`Using certificate file: ${certFile}`);
        const cert = fs.readFileSync(certFile, 'utf8');

        // Find key file
        const keyFiles = fs.readdirSync(keyDir);
        if (keyFiles.length === 0) {
            console.error(`No key files found in ${keyDir}`);
            return;
        }
        
        const keyFile = path.resolve(keyDir, keyFiles[0]);
        console.log(`Using key file: ${keyFile}`);
        const key = fs.readFileSync(keyFile, 'utf8');

        // Create a new file system based wallet
        const walletPath = path.join(__dirname, 'wallet');
        console.log(`Wallet path: ${walletPath}`);
        
        if (!fs.existsSync(walletPath)) {
            fs.mkdirSync(walletPath, { recursive: true });
            console.log(`Created wallet directory at ${walletPath}`);
        }
        
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check if the admin identity already exists
        const identity = await wallet.get('admin');
        if (identity) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }

        // Import the certificate and key into the wallet
        const x509Identity = {
            credentials: {
                certificate: cert,
                privateKey: key,
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };

        await wallet.put('admin', x509Identity);
        console.log('Successfully imported admin identity into the wallet');
    } catch (error) {
        console.error(`Failed to import admin identity: ${error}`);
    }
}

main();