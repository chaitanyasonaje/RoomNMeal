import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { 
  FaWallet, 
  FaPlus, 
  FaArrowUp, 
  FaArrowDown, 
  FaHistory, 
  FaCreditCard,
  FaRupeeSign,
  FaShoppingCart,
  FaUtensils,
  FaBed
} from 'react-icons/fa';

const Wallet = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock transaction data
      const mockTransactions = [
        {
          id: 1,
          type: 'credit',
          amount: 1000,
          description: 'Wallet Top-up',
          category: 'topup',
          date: new Date('2024-01-20'),
          status: 'completed'
        },
        {
          id: 2,
          type: 'debit',
          amount: 2500,
          description: 'Room Rent Payment',
          category: 'room',
          date: new Date('2024-01-18'),
          status: 'completed'
        },
        {
          id: 3,
          type: 'debit',
          amount: 1800,
          description: 'Mess Plan Subscription',
          category: 'mess',
          date: new Date('2024-01-15'),
          status: 'completed'
        },
        {
          id: 4,
          type: 'debit',
          amount: 200,
          description: 'Laundry Service',
          category: 'service',
          date: new Date('2024-01-12'),
          status: 'completed'
        },
        {
          id: 5,
          type: 'credit',
          amount: 500,
          description: 'Refund - Room Deposit',
          category: 'refund',
          date: new Date('2024-01-10'),
          status: 'completed'
        }
      ];

      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'topup':
        return <FaPlus className="h-4 w-4" />;
      case 'room':
        return <FaBed className="h-4 w-4" />;
      case 'mess':
        return <FaUtensils className="h-4 w-4" />;
      case 'service':
        return <FaShoppingCart className="h-4 w-4" />;
      case 'refund':
        return <FaArrowUp className="h-4 w-4" />;
      default:
        return <FaWallet className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'topup':
        return 'text-green-500';
      case 'room':
        return 'text-blue-500';
      case 'mess':
        return 'text-orange-500';
      case 'service':
        return 'text-purple-500';
      case 'refund':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const totalBalance = transactions.reduce((sum, transaction) => {
    return transaction.type === 'credit' ? sum + transaction.amount : sum - transaction.amount;
  }, 5000); // Starting balance

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
            isDark ? 'border-white' : 'border-primary-600'
          } mx-auto mb-4`}></div>
          <p className={`text-lg ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Loading wallet...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header Section */}
      <div className={`py-12 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className={`text-3xl sm:text-4xl font-heading font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              My Wallet
            </h1>
            <p className={`text-lg ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Manage your payments and transactions
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`rounded-2xl p-6 mb-8 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-3 rounded-xl">
                <FaWallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Current Balance
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Available for payments
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <FaPlus className="h-4 w-4" />
              <span>Add Money</span>
            </motion.button>
          </div>
          
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              ₹{totalBalance.toLocaleString()}
            </div>
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`rounded-2xl p-6 mb-8 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-xl text-center transition-colors duration-200 ${
                isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <FaPlus className="h-6 w-6 text-primary-600 mx-auto mb-2" />
              <p className={`text-sm font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Add Money
              </p>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-xl text-center transition-colors duration-200 ${
                isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <FaArrowUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className={`text-sm font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Send Money
              </p>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-xl text-center transition-colors duration-200 ${
                isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <FaCreditCard className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className={`text-sm font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Pay Bills
              </p>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-xl text-center transition-colors duration-200 ${
                isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <FaHistory className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className={`text-sm font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                History
              </p>
            </motion.button>
          </div>
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`rounded-2xl p-6 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Recent Transactions
            </h3>
            <button className={`text-sm font-medium ${
              isDark ? 'text-primary-400' : 'text-primary-600'
            } hover:underline`}>
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-xl ${
                  isDark ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {getCategoryIcon(transaction.category)}
                  </div>
                  <div>
                    <p className={`font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {transaction.description}
                    </p>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {transaction.date.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                  </p>
                  <p className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {transaction.status}
          </p>
        </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Wallet; 