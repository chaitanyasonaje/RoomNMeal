import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { buildApiUrl } from '../config/api';
import { FaEdit, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ProviderPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get(buildApiUrl('/api/mess/provider/my-plans'));
      setPlans(response.data.plans);
    } catch (error) {
      toast.error('Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    try {
      await axios.delete(buildApiUrl(`/api/mess/plans/${id}`));
      toast.success('Plan deleted');
      setPlans(plans.filter(plan => plan._id !== id));
    } catch (error) {
      toast.error('Failed to delete plan');
    }
  };

  if (loading) return <div className={`${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen flex items-center justify-center`}>Loading...</div>;

  return (
    <div className={`max-w-4xl mx-auto py-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>My Mess Plans</h2>
      <Link to="/mess/add" className="btn-primary mb-4 inline-block">Add New Plan</Link>
      {plans.length === 0 ? (
        <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>No plans found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className={`min-w-full ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-lg`}>
          <thead>
            <tr className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <th className={`px-4 py-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Plan Name</th>
              <th className={`px-4 py-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Type</th>
              <th className={`px-4 py-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Price</th>
              <th className={`px-4 py-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(plan => (
              <tr key={plan._id} className={`${isDark ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                <td className={`px-4 py-2 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>{plan.planName}</td>
                <td className={`px-4 py-2 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>{plan.planType}</td>
                <td className={`px-4 py-2 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>₹{plan.price}</td>
                <td className={`px-4 py-2 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                  <Link to={`/mess/edit/${plan._id}`} className="mr-2 text-blue-600 hover:text-blue-800"><FaEdit /></Link>
                  <button onClick={() => handleDelete(plan._id)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default ProviderPlans;
