import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import PaymentModal from './PaymentModal';

const WalletManager = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const [balanceRes, transactionsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/payments/wallet/balance`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get(`${API_BASE_URL}/api/payments/transactions?type=wallet_recharge&limit=10`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      setBalance(balanceRes.data.balance);
      setTransactions(transactionsRes.data.transactions);
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
      setError('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const handleRecharge = (amount) => {
    setRechargeAmount(amount);
    setShowRechargeModal(true);
  };

  const handleRechargeSuccess = (data) => {
    setBalance(data.newBalance || balance + parseInt(rechargeAmount));
    fetchWalletData(); // Refresh transactions
    setShowRechargeModal(false);
    setRechargeAmount('');
  };

  const handleRechargeFailure = (error) => {
    console.error('Recharge failed:', error);
    setError('Recharge failed. Please try again.');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">My Wallet</h2>
          <button
            onClick={() => setShowRechargeModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Recharge Wallet
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
            <h3 className="text-sm font-medium opacity-90">Current Balance</h3>
            <p className="text-3xl font-bold">₹{balance.toLocaleString()}</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
            <h3 className="text-sm font-medium opacity-90">Total Recharged</h3>
            <p className="text-3xl font-bold">
              ₹{transactions
                .filter(t => t.type === 'wallet_recharge' && t.status === 'completed')
                .reduce((sum, t) => sum + t.amount, 0)
                .toLocaleString()}
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
            <h3 className="text-sm font-medium opacity-90">Total Spent</h3>
            <p className="text-3xl font-bold">
              ₹{transactions
                .filter(t => t.type !== 'wallet_recharge' && t.status === 'completed')
                .reduce((sum, t) => sum + t.amount, 0)
                .toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <button
            onClick={() => handleRecharge(100)}
            className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg text-center"
          >
            <p className="font-semibold">₹100</p>
            <p className="text-sm text-gray-600">Quick Recharge</p>
          </button>
          <button
            onClick={() => handleRecharge(500)}
            className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg text-center"
          >
            <p className="font-semibold">₹500</p>
            <p className="text-sm text-gray-600">Popular</p>
          </button>
          <button
            onClick={() => handleRecharge(1000)}
            className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg text-center"
          >
            <p className="font-semibold">₹1000</p>
            <p className="text-sm text-gray-600">Most Popular</p>
          </button>
          <button
            onClick={() => setShowRechargeModal(true)}
            className="bg-blue-100 hover:bg-blue-200 p-3 rounded-lg text-center"
          >
            <p className="font-semibold">Custom</p>
            <p className="text-sm text-gray-600">Enter Amount</p>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No transactions yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Description</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {formatDate(transaction.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.type === 'wallet_recharge' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {transaction.type === 'wallet_recharge' ? 'Recharge' : 'Payment'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      ₹{transaction.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {transaction.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recharge Modal */}
      <PaymentModal
        isOpen={showRechargeModal}
        onClose={() => setShowRechargeModal(false)}
        amount={parseInt(rechargeAmount) || 0}
        type="wallet_recharge"
        description="Wallet Recharge"
        onSuccess={handleRechargeSuccess}
        onFailure={handleRechargeFailure}
      />
    </div>
  );
};

export default WalletManager; 