import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const HostRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">My Rooms</h2>
      <Link to="/rooms/add" className="btn-primary mb-4 inline-block">Add New Room</Link>
      {rooms.length === 0 ? (
        <div>No rooms found.</div>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Rent</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => (
              <tr key={room._id}>
                <td className="border px-4 py-2">{room.title}</td>
                <td className="border px-4 py-2">{room.propertyType} / {room.roomType}</td>
                <td className="border px-4 py-2">₹{room.rent}</td>
                <td className="border px-4 py-2">
                  <Link to={`/rooms/edit/${room._id}`} className="mr-2 text-blue-600"><FaEdit /></Link>
                  <button onClick={() => handleDelete(room._id)} className="text-red-600"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HostRooms;
