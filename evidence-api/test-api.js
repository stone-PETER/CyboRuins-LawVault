const axios = require('axios');
const colors = require('colors');

// Base URL for the API
const API_URL = 'http://localhost:3000/api';

// Add authentication headers if needed
const apiConfig = {
    headers: {
        Authorization: 'Bearer your-auth-token', // If you're using token-based auth
    },
};

// Test data
const testData = {
    caseID: `TEST_CASE_${Date.now()}`,
    documentHash: 'sha256:testHash12345',
    ipfsUrl: 'ipfs://QmTestHash12345',
    uploadedBy: '0xTestOfficer123',
};

// Updated test data
const updatedData = {
    newDocumentHash: 'sha256:updatedHash12345',
    newIpfsUrl: 'ipfs://QmUpdatedHash12345',
};

// Helper to print responses nicely
function printResponse(title, data) {
    console.log('\n' + colors.yellow('===================='));
    console.log(colors.cyan(title));
    console.log(colors.yellow('===================='));
    console.log(colors.green(JSON.stringify(data, null, 2)));
}

// Helper for error handling
function handleError(error, endpoint) {
    console.log(colors.red(`Error with ${endpoint}:`));
    if (error.response) {
        console.log(colors.red(`Status: ${error.response.status}`));
        console.log(colors.red(`Data: ${JSON.stringify(error.response.data)}`));
    } else {
        console.log(colors.red(error.message));
    }
}

// Main testing function
async function testAPI() {
    try {
        console.log(colors.yellow('\nStarting API Tests...'));

        // 1. Get all evidence (initial state)
        console.log(colors.blue('\nTesting: Get All Evidence (Initial)'));
        try {
            const initialRes = await axios.get(
                `${API_URL}/evidence`,
                apiConfig
            );
            printResponse('Initial Evidence Collection:', initialRes.data);
        } catch (error) {
            handleError(error, 'GET /evidence');
        }

        // 2. Store new evidence
        console.log(colors.blue('\nTesting: Store New Evidence'));
        const storeRes = await axios.post(`${API_URL}/evidence`, testData);
        printResponse('Stored Evidence:', storeRes.data);

        // 3. Get specific evidence
        console.log(colors.blue('\nTesting: Get Specific Evidence'));
        const getRes = await axios.get(
            `${API_URL}/evidence/${testData.caseID}`
        );
        printResponse('Retrieved Evidence:', getRes.data);

        // 4. Update evidence
        console.log(colors.blue('\nTesting: Update Evidence'));
        const updateRes = await axios.put(
            `${API_URL}/evidence/${testData.caseID}`,
            updatedData
        );
        printResponse('Updated Evidence:', updateRes.data);

        // 5. Query by uploader
        console.log(colors.blue('\nTesting: Query By Uploader'));
        try {
            const queryRes = await axios.get(
                `${API_URL}/evidence/query/uploader/${testData.uploadedBy}`
            );
            printResponse('Evidence By Uploader:', queryRes.data);
        } catch (error) {
            handleError(error, 'GET /evidence/query/uploader');
        }

        // 6. Get all evidence (final state)
        console.log(colors.blue('\nTesting: Get All Evidence (Final)'));
        const finalRes = await axios.get(`${API_URL}/evidence`);
        printResponse('Final Evidence Collection:', finalRes.data);

        // 7. Delete evidence
        console.log(colors.blue('\nTesting: Delete Evidence'));
        try {
            await axios.delete(`${API_URL}/evidence/${testData.caseID}`);
            console.log(
                colors.green(
                    `Successfully deleted evidence with case ID: ${testData.caseID}`
                )
            );
        } catch (error) {
            handleError(error, `DELETE /evidence/${testData.caseID}`);
        }

        // 8. Verify deletion
        console.log(colors.blue('\nTesting: Verify Evidence Deletion'));
        try {
            await axios.get(`${API_URL}/evidence/${testData.caseID}`);
        } catch (error) {
            if (error.response && error.response.status === 500) {
                console.log(
                    colors.green(
                        'Evidence was successfully deleted (expected 500 error)'
                    )
                );
            } else {
                handleError(error, `GET /evidence/${testData.caseID}`);
            }
        }

        console.log(colors.yellow('\nAPI Tests Completed!'));
    } catch (error) {
        console.log(colors.red('\nTest failed:'));
        console.error(error);
    }
}

// Run the tests
testAPI();
