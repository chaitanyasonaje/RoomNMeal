import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { buildApiUrl } from '../config/api';
import toast from 'react-hot-toast';

const initialState = {
  planName: '',
  description: '',
  planType: 'monthly',
  duration: '',
  price: '',
  mealTypes: [],
  capacity: '',
};

const EditMessPlan = () => {
  const { id } = useParams();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlan();
    // eslint-disable-next-line
  }, [id]);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const res = await axios.get(buildApiUrl(`/api/mess/plans/${id}`));
      const plan = res.data.plan;
      setForm({
        ...plan,
        duration: plan.duration || '',
        price: plan.price || '',
        mealTypes: plan.mealTypes || [],
        capacity: plan.capacity || '',
      });
    } catch (error) {
      toast.error('Failed to fetch plan');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, mealTypes: checked ? [...form.mealTypes, value] : form.mealTypes.filter(m => m !== value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        duration: Number(form.duration),
        price: Number(form.price),
        capacity: Number(form.capacity),
      };
      await axios.put(`https://roomnmeal.onrender.com/api/mess/plans/${id}`, payload);
      toast.success('Mess plan updated!');
      navigate('/mess/provider');
    } catch (error) {
      toast.error('Failed to update mess plan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={`${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen flex items-center justify-center`}>Loading...</div>;

  return (
    <div className={`max-w-xl mx-auto py-8 px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Edit Mess Plan</h2>
      <form onSubmit={handleSubmit} className={`space-y-4 ${isDark ? 'bg-gray-800' : 'bg-white'} p-4 sm:p-6 rounded shadow`}>
        <input name="planName" value={form.planName} onChange={handleChange} placeholder="Plan Name" className="input-field w-full" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="input-field w-full" />
        <select name="planType" value={form.planType} onChange={handleChange} className="input-field w-full">
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <input name="duration" value={form.duration} onChange={handleChange} placeholder="Duration (days)" type="number" className="input-field w-full" required />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" className="input-field w-full" required />
        <div>
          <label className={`block mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Meal Types</label>
          <label className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}><input type="checkbox" name="mealTypes" value="breakfast" checked={form.mealTypes.includes('breakfast')} onChange={handleChange} /> Breakfast </label>
          <label className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}><input type="checkbox" name="mealTypes" value="lunch" checked={form.mealTypes.includes('lunch')} onChange={handleChange} /> Lunch </label>
          <label className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}><input type="checkbox" name="mealTypes" value="dinner" checked={form.mealTypes.includes('dinner')} onChange={handleChange} /> Dinner </label>
        </div>
        <input name="capacity" value={form.capacity} onChange={handleChange} placeholder="Capacity" type="number" className="input-field w-full" required />
        <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Updating...' : 'Update Plan'}</button>
      </form>
    </div>
  );
};

export default EditMessPlan;
