import React from 'react';

// This component can be used to test error boundaries
const ErrorTest = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Test error for error boundary');
  }

  return (
    <div className="p-4 bg-green-100 border border-green-400 rounded">
      <h3 className="text-green-800 font-semibold">Error Test Component</h3>
      <p className="text-green-700">This component is working correctly.</p>
    </div>
  );
};

export default ErrorTest;
