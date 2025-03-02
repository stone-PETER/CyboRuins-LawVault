import React, { useState } from 'react';

const Vault: React.FC = () => {
  const [evidence, setEvidence] = useState<File | null>(null);
  const [cases, setCases] = useState([
    { id: 1, title: 'Case 1', brief: 'Brief description of Case 1' },
    { id: 2, title: 'Case 2', brief: 'Brief description of Case 2' },
    // Add more cases as needed
  ]);

  const handleEvidenceUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setEvidence(event.target.files[0]);
    }
  };

  const handleEvidenceSubmit = () => {
    if (evidence) {
      // Implement evidence upload functionality here
      console.log('Evidence uploaded:', evidence.name);
    }
  };

  return (
    <div className="vault-page p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-4">Vault Page</h2>
      <p className="text-lg mb-8">Access tamper-proof legal evidence stored on blockchain.</p>

      <section className="upload-evidence mb-8 p-6 bg-white shadow-md rounded-lg">
        <h3 className="text-2xl font-semibold mb-4">Upload Evidence</h3>
        <input
          type="file"
          onChange={handleEvidenceUpload}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />
        <button
          onClick={handleEvidenceSubmit}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Upload
        </button>
      </section>

      <section className="view-cases p-6 bg-white shadow-md rounded-lg">
        <h3 className="text-2xl font-semibold mb-4">View Cases</h3>
        <ul>
          {cases.map((caseItem) => (
            <li key={caseItem.id} className="mb-4 p-4 border-b border-gray-200">
              <h4 className="text-xl font-bold">{caseItem.title}</h4>
              <p className="text-gray-700">{caseItem.brief}</p>
              <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                View Full Case (Premium)
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Vault;