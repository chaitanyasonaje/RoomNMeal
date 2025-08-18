import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const initialState = {
  title: '',
  description: '',
  propertyType: 'PG',
  roomType: 'Single',
  rent: '',
  securityDeposit: '',
  address: { street: '', city: '', state: '', pincode: '' },
  totalRooms: '',
};

const EditRoom = () => {
  const { id } = useParams();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoom();
    // eslint-disable-next-line
  }, [id]);

  const fetchRoom = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://roomnmeal.onrender.com/api/rooms/${id}`);
      const room = res.data.room;
      setForm({
        ...room,
        totalRooms: room.availability?.totalRooms || '',
        rent: room.rent || '',
        securityDeposit: room.securityDeposit || '',
        address: room.address || initialState.address,
      });
    } catch (error) {
      toast.error('Failed to fetch room');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      setForm({ ...form, address: { ...form.address, [name.split('.')[1]]: value } });
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
        rent: Number(form.rent),
        securityDeposit: Number(form.securityDeposit),
        availability: { totalRooms: Number(form.totalRooms) },
      };
      await axios.put(`https://roomnmeal.onrender.com/api/rooms/${id}`, payload);
      toast.success('Room updated!');
      navigate('/rooms/host');
    } catch (error) {
      toast.error('Failed to update room');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Edit Room</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="input-field w-full" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="input-field w-full" />
        <select name="propertyType" value={form.propertyType} onChange={handleChange} className="input-field w-full">
          <option value="PG">PG</option>
          <option value="Hostel">Hostel</option>
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
        </select>
        <select name="roomType" value={form.roomType} onChange={handleChange} className="input-field w-full">
          <option value="Single">Single</option>
          <option value="Double">Double</option>
          <option value="Triple">Triple</option>
          <option value="Quad">Quad</option>
        </select>
        <input name="rent" value={form.rent} onChange={handleChange} placeholder="Rent (per month)" type="number" className="input-field w-full" required />
        <input name="securityDeposit" value={form.securityDeposit} onChange={handleChange} placeholder="Security Deposit" type="number" className="input-field w-full" />
        <input name="address.street" value={form.address.street} onChange={handleChange} placeholder="Street" className="input-field w-full" />
        <input name="address.city" value={form.address.city} onChange={handleChange} placeholder="City" className="input-field w-full" required />
        <input name="address.state" value={form.address.state} onChange={handleChange} placeholder="State" className="input-field w-full" required />
        <input name="address.pincode" value={form.address.pincode} onChange={handleChange} placeholder="Pincode" className="input-field w-full" />
        <input name="totalRooms" value={form.totalRooms} onChange={handleChange} placeholder="Total Rooms" type="number" className="input-field w-full" required />
        <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Updating...' : 'Update Room'}</button>
      </form>
    </div>
  );
};

export default EditRoom;
