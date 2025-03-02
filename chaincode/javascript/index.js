'use strict';

const { Contract } = require('fabric-contract-api');

// Main chaincode class
class EvidenceContract extends Contract {
    constructor() {
        // This is just a namespace, not the chaincode name
        super('org.evidencevault.evidence');
    }

    async initLedger(ctx) {
        console.log('EvidenceContract:initLedger');

        const assets = [
            {
                caseID: 'CASE001',
                documentHash: 'sha256:123456',
                ipfsUrl: 'ipfs://QmTest1',
                uploadedBy: 'officer1',
                timestamp: new Date().toISOString(),
            },
        ];

        for (const asset of assets) {
            await ctx.stub.putState(
                asset.caseID,
                Buffer.from(JSON.stringify(asset))
            );
        }

        return JSON.stringify(assets);
    }

    async evidenceExists(ctx, caseID) {
        const buffer = await ctx.stub.getState(caseID);
        return !!buffer && buffer.length > 0;
    }

    async storeEvidence(ctx, caseID, documentHash, ipfsUrl, uploadedBy) {
        console.log(`Adding evidence for case: ${caseID}`);
        console.log(`Transaction submitted by: ${ctx.clientIdentity.getID()}`);

        const exists = await this.evidenceExists(ctx, caseID);
        if (exists) {
            throw new Error(`Evidence for case ${caseID} already exists`);
        }

        const evidence = {
            caseID,
            documentHash,
            ipfsUrl,
            uploadedBy,
            timestamp: new Date().toISOString(),
        };

        await ctx.stub.putState(caseID, Buffer.from(JSON.stringify(evidence)));

        return JSON.stringify(evidence);
    }

    async getEvidence(ctx, caseID) {
        const exists = await this.evidenceExists(ctx, caseID);
        if (!exists) {
            throw new Error(`Evidence for case ${caseID} does not exist`);
        }

        const buffer = await ctx.stub.getState(caseID);
        const evidence = JSON.parse(buffer.toString());

        return JSON.stringify(evidence);
    }

    async getAllEvidence(ctx) {
        const startKey = '';
        const endKey = '';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);
        const allResults = [];

        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                const Key = res.value.key;
                let Record;

                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }

                allResults.push({ Key, Record });
            }

            if (res.done) {
                await iterator.close();
                return JSON.stringify(allResults);
            }
        }
    }

    async updateEvidence(ctx, caseID, newDocumentHash, newIpfsUrl) {
        console.log(`Updating evidence for case ${caseID}`);

        const exists = await this.evidenceExists(ctx, caseID);
        if (!exists) {
            throw new Error(`Evidence for case ${caseID} does not exist`);
        }

        // Get current evidence
        const buffer = await ctx.stub.getState(caseID);
        const evidence = JSON.parse(buffer.toString());

        // Update fields
        evidence.documentHash = newDocumentHash;
        evidence.ipfsUrl = newIpfsUrl;
        evidence.timestamp = new Date().toISOString(); // Update timestamp

        // Save back to state
        await ctx.stub.putState(caseID, Buffer.from(JSON.stringify(evidence)));

        return JSON.stringify(evidence);
    }

    async deleteEvidence(ctx, caseID) {
        console.log(`Deleting evidence for case ${caseID}`);

        const exists = await this.evidenceExists(ctx, caseID);
        if (!exists) {
            throw new Error(`Evidence for case ${caseID} does not exist`);
        }

        await ctx.stub.deleteState(caseID);

        return true;
    }

    async queryEvidenceByUploader(ctx, uploadedBy) {
        console.log(`Querying evidence by uploader ${uploadedBy}`);

        const startKey = '';
        const endKey = '';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);
        const results = [];

        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                let record;
                try {
                    record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    record = res.value.value.toString('utf8');
                }

                if (record.uploadedBy === uploadedBy) {
                    results.push(record);
                }
            }

            if (res.done) {
                await iterator.close();
                break;
            }
        }

        return JSON.stringify(results);
    }
}

// Export the contract
module.exports = EvidenceContract;
module.exports.contracts = [EvidenceContract];
