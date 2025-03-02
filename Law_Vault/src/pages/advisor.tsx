import React from 'react';

const Advisor: React.FC = () => {
  return (
    <div className="advisor-page p-8 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold mb-4 text-blue-600">Advisor Page</h2>
      <p className="text-lg mb-8 text-gray-700 text-center max-w-2xl">
        Get real-time legal analysis with our Advisor.
      </p>
      <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
        Start Analysis
      </button>
    </div>
  );
};

export default Advisor;