import React from 'react';
import { useFirebase } from '../../contexts/FirebaseContext';

const FirebaseTest = () => {
  const { firebaseData, loading, error, getData, setData } = useFirebase();

  const handleTestGet = async () => {
    await getData('/test');
  };

  const handleTestSet = async () => {
    await setData('/test', { 
      message: 'Test data from Firebase Test Component',
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Firebase Test Component</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
        <div className="space-x-4">
          <button
            onClick={handleTestGet}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Test Get Data
          </button>
          <button
            onClick={handleTestSet}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Test Set Data
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Status</h2>
        {loading && (
          <div className="text-blue-600">
            <i className="fas fa-spinner fa-spin mr-2"></i>
            Loading...
          </div>
        )}
        {error && (
          <div className="text-red-600 bg-red-50 p-3 rounded">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            Error: {error}
          </div>
        )}
        {firebaseData && (
          <div className="text-green-600 bg-green-50 p-3 rounded">
            <h3 className="font-semibold mb-2">Data:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(firebaseData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default FirebaseTest;