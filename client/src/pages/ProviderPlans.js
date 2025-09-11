import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { buildApiUrl } from '../config/api';
import { FaEdit, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ProviderPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">My Mess Plans</h2>
      <Link to="/mess/add" className="btn-primary mb-4 inline-block">Add New Plan</Link>
      {plans.length === 0 ? (
        <div>No plans found.</div>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2">Plan Name</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(plan => (
              <tr key={plan._id}>
                <td className="border px-4 py-2">{plan.planName}</td>
                <td className="border px-4 py-2">{plan.planType}</td>
                <td className="border px-4 py-2">₹{plan.price}</td>
                <td className="border px-4 py-2">
                  <Link to={`/mess/edit/${plan._id}`} className="mr-2 text-blue-600"><FaEdit /></Link>
                  <button onClick={() => handleDelete(plan._id)} className="text-red-600"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProviderPlans;
