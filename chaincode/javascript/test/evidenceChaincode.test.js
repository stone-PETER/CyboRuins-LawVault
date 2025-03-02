'use strict';

const { Contract } = require('fabric-contract-api');
const { ChaincodeStub, ClientIdentity } = require('fabric-shim');

// Import the contract
const EvidenceContract = require('../lib/evidenceChaincode');

// Import test libraries
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const expect = chai.expect;

chai.use(chaiAsPromised);

describe('Evidence Contract', () => {
    let contract;
    let ctx;
    let mockStub;
    let mockClientIdentity;

    beforeEach(() => {
        contract = new EvidenceContract();
        mockStub = sinon.createStubInstance(ChaincodeStub);
        mockClientIdentity = sinon.createStubInstance(ClientIdentity);
        ctx = {
            stub: mockStub,
            clientIdentity: mockClientIdentity,
        };
    });

    describe('Evidence Exists', () => {
        it('should return true for an existing evidence', async () => {
            mockStub.getState
                .withArgs('CASE123')
                .resolves(Buffer.from('{"caseID":"CASE123"}'));
            const exists = await contract.evidenceExists(ctx, 'CASE123');
            expect(exists).to.equal(true);
        });

        it('should return false for non-existing evidence', async () => {
            mockStub.getState.withArgs('CASE456').resolves(Buffer.from(''));
            const exists = await contract.evidenceExists(ctx, 'CASE456');
            expect(exists).to.equal(false);
        });
    });

    describe('Store Evidence', () => {
        it('should add evidence to the ledger', async () => {
            mockStub.getState.withArgs('CASE456').resolves(Buffer.from(''));
            mockStub.putState.withArgs('CASE456', sinon.match.any).resolves();

            await contract.storeEvidence(
                ctx,
                'CASE456',
                'hash',
                'ipfs://url',
                'officer2'
            );

            sinon.assert.calledWith(
                mockStub.putState,
                'CASE456',
                sinon.match((buffer) => {
                    const evidence = JSON.parse(buffer.toString());
                    return (
                        evidence.caseID === 'CASE456' &&
                        evidence.documentHash === 'hash' &&
                        evidence.ipfsUrl === 'ipfs://url' &&
                        evidence.uploadedBy === 'officer2'
                    );
                })
            );
        });

        it('should throw error if evidence already exists', async () => {
            mockStub.getState
                .withArgs('CASE123')
                .resolves(Buffer.from('{"caseID":"CASE123"}'));
            await expect(
                contract.storeEvidence(
                    ctx,
                    'CASE123',
                    'hash',
                    'ipfs://url',
                    'officer1'
                )
            ).to.be.rejectedWith('Evidence for case CASE123 already exists');
        });
    });

    describe('Get Evidence', () => {
        it('should return evidence for existing case', async () => {
            const evidence = {
                caseID: 'CASE123',
                documentHash: 'hash123',
                ipfsUrl: 'ipfs://evidence1',
                uploadedBy: 'officer1',
                timestamp: '2023-01-01T00:00:00.000Z',
            };
            mockStub.getState
                .withArgs('CASE123')
                .resolves(Buffer.from(JSON.stringify(evidence)));

            const result = await contract.getEvidence(ctx, 'CASE123');

            expect(JSON.parse(result)).to.deep.equal(evidence);
        });

        it('should throw error for non-existing evidence', async () => {
            mockStub.getState.withArgs('CASE456').resolves(Buffer.from(''));
            await expect(
                contract.getEvidence(ctx, 'CASE456')
            ).to.be.rejectedWith('Evidence for case CASE456 does not exist');
        });
    });

    // Add more test cases for other functions
    // ...
});
