import React from 'react';
import WalletManager from '../components/WalletManager';

const Wallet = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wallet</h1>
          <p className="text-gray-600 mt-2">
            Manage your wallet balance, recharge, and view transaction history
          </p>
        </div>
        <WalletManager />
      </div>
    </div>
  );
};

export default Wallet; 