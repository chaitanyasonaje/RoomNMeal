import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const HostRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://roomnmeal.onrender.com/api/rooms/host/my-rooms');
      setRooms(response.data.rooms);
    } catch (error) {
      toast.error('Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await axios.delete(`https://roomnmeal.onrender.com/api/rooms/${id}`);
      toast.success('Room deleted');
      setRooms(rooms.filter(room => room._id !== id));
    } catch (error) {
      toast.error('Failed to delete room');
    }
  };

  if (loading) return <div className={`${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen flex items-center justify-center`}>Loading...</div>;

  return (
    <div className={`max-w-4xl mx-auto py-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>My Rooms</h2>
      <Link to="/rooms/add" className="btn-primary mb-4 inline-block">Add New Room</Link>
      {rooms.length === 0 ? (
        <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>No rooms found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className={`min-w-full ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-lg`}>
          <thead>
            <tr className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <th className={`px-4 py-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Title</th>
              <th className={`px-4 py-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Type</th>
              <th className={`px-4 py-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Rent</th>
              <th className={`px-4 py-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => (
              <tr key={room._id} className={`${isDark ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                <td className={`px-4 py-2 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>{room.title}</td>
                <td className={`px-4 py-2 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>{room.propertyType} / {room.roomType}</td>
                <td className={`px-4 py-2 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>₹{room.rent}</td>
                <td className={`px-4 py-2 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                  <Link to={`/rooms/edit/${room._id}`} className="mr-2 text-blue-600 hover:text-blue-800"><FaEdit /></Link>
                  <button onClick={() => handleDelete(room._id)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
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

export default HostRooms;
