'use strict';

const { Contract } = require('fabric-contract-api');

class SimpleEvidenceContract extends Contract {
    async initLedger(ctx) {
        console.log('SimpleEvidenceContract:initLedger');
        
        const assets = [
            {
                caseID: 'CASE001',
                documentHash: 'sha256:123456',
                ipfsUrl: 'ipfs://QmTest1',
                uploadedBy: 'officer1',
                timestamp: new Date().toISOString()
            }
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
        return (!!buffer && buffer.length > 0);
    }

    async storeEvidence(ctx, caseID, documentHash, ipfsUrl, uploadedBy) {
        console.log(`Adding evidence for case: ${caseID}`);

        const exists = await this.evidenceExists(ctx, caseID);
        if (exists) {
            throw new Error(`Evidence for case ${caseID} already exists`);
        }

        const evidence = {
            caseID,
            documentHash,
            ipfsUrl,
            uploadedBy,
            timestamp: new Date().toISOString()
        };

        await ctx.stub.putState(
            caseID,
            Buffer.from(JSON.stringify(evidence))
        );
        
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
}

module.exports = SimpleEvidenceContract;