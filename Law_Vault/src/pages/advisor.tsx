import React, { useState } from 'react';
import axios from 'axios';

const Advisor: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };

  const handleAnalysis = async () => {
    try {
      console.log('Sending question:', question);
      const res = await axios.post('http://127.0.0.1:8000/legal-advisory/', { question });
      setResponse(res.data.response);
    } catch (error) {
      console.error('Error fetching legal advice:', error);
    }
  };

  return (
    <div className="advisor-page p-8 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold mb-4 text-blue-600">Advisor Page</h2>
      <p className="text-lg mb-8 text-gray-700 text-center max-w-2xl">
        Get real-time legal analysis with our Advisor.
      </p>
      <input
        type="text"
        value={question}
        onChange={handleInputChange}
        placeholder="Enter your legal question"
        className="mb-4 p-2 border border-gray-300 rounded-lg w-full max-w-md"
      />
      <button
        onClick={handleAnalysis}
        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Start Analysis
      </button>
      {response && (
        <div className="mt-8 p-4 bg-white shadow-md rounded-lg max-w-2xl">
          <h3 className="text-2xl font-semibold mb-4">Response</h3>
          <p className="text-gray-700">{response}</p>
        </div>
      )}
    </div>
  );
};

export default Advisor;