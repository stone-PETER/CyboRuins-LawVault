'use strict';

const { Contract } = require('fabric-contract-api');

class EvidenceContract extends Contract {
    // Make sure constructor doesn't throw any errors
    constructor() {
        // Call the parent constructor
        super('org.evidencevault.evidencecontract');
    }

    // Ensure async methods properly handle errors
    async initLedger(ctx) {
        console.log('Initializing the ledger with sample evidence records');

        // Sample evidence data
        const evidence = {
            caseID: 'CASE123',
            documentHash:
                'sha256:2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
            ipfsUrl: 'ipfs://QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxX',
            uploadedBy: '0xPoliceOfficer1',
            timestamp: new Date().toISOString(),
        };

        await ctx.stub.putState(
            'CASE123',
            Buffer.from(JSON.stringify(evidence))
        );
        console.log('Sample evidence added to ledger');
    }

    // StoreEvidence adds new evidence to the ledger
    async storeEvidence(ctx, caseID, documentHash, ipfsUrl, uploadedBy) {
        console.log(`Adding evidence for case: ${caseID}`);

        // Check if evidence already exists
        const exists = await this.evidenceExists(ctx, caseID);
        if (exists) {
            throw new Error(`Evidence for case ${caseID} already exists`);
        }

        // Create evidence object
        const evidence = {
            caseID,
            documentHash,
            ipfsUrl,
            uploadedBy,
            timestamp: new Date().toISOString(),
        };

        // Store evidence on the ledger
        await ctx.stub.putState(caseID, Buffer.from(JSON.stringify(evidence)));

        return JSON.stringify(evidence);
    }

    // GetEvidence returns the evidence stored in the ledger
    async getEvidence(ctx, caseID) {
        const evidenceBytes = await ctx.stub.getState(caseID);
        if (!evidenceBytes || evidenceBytes.length === 0) {
            throw new Error(`Evidence for case ${caseID} does not exist`);
        }
        return evidenceBytes.toString();
    }

    // GetAllEvidence returns all evidence found in the world state
    async getAllEvidence(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];

        // Get all evidence between empty strings (effectively all evidence)
        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(
                result.value.value.toString()
            ).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }

        return JSON.stringify(allResults);
    }

    // UpdateEvidence updates an existing evidence in the world state
    async updateEvidence(ctx, caseID, newDocumentHash, newIpfsUrl) {
        const exists = await this.evidenceExists(ctx, caseID);
        if (!exists) {
            throw new Error(`Evidence for case ${caseID} does not exist`);
        }

        // Get existing evidence
        const evidenceString = await this.getEvidence(ctx, caseID);
        const evidence = JSON.parse(evidenceString);

        // Update evidence properties
        evidence.documentHash = newDocumentHash;
        evidence.ipfsUrl = newIpfsUrl;
        evidence.timestamp = new Date().toISOString();

        // Update state with modified evidence
        await ctx.stub.putState(caseID, Buffer.from(JSON.stringify(evidence)));

        return JSON.stringify(evidence);
    }

    // EvidenceExists returns true when evidence with given ID exists in world state
    async evidenceExists(ctx, caseID) {
        const evidenceBytes = await ctx.stub.getState(caseID);
        return evidenceBytes && evidenceBytes.length > 0;
    }

    // DeleteEvidence removes evidence for a specific case from world state
    async deleteEvidence(ctx, caseID) {
        const exists = await this.evidenceExists(ctx, caseID);
        if (!exists) {
            throw new Error(`Evidence for case ${caseID} does not exist`);
        }
        return ctx.stub.deleteState(caseID);
    }

    // QueryEvidenceByUploader finds evidence based on who uploaded it
    // Only available on state databases that support rich queries (e.g. CouchDB)
    async queryEvidenceByUploader(ctx, uploadedBy) {
        const queryString = {
            selector: {
                uploadedBy: uploadedBy,
            },
            use_index: ['_design/indexUploaderDoc', 'indexUploader'],
        };

        const iterator = await ctx.stub.getQueryResult(
            JSON.stringify(queryString)
        );
        const allResults = [];

        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(
                result.value.value.toString()
            ).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }

        return JSON.stringify(allResults);
    }
}

module.exports = EvidenceContract;
