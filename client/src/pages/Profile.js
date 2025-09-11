import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEdit, FaSave, FaTimes, FaCamera, FaShieldAlt, FaBell, FaWallet } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getMockData } from '../data/mockData';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    collegeName: '',
    collegeId: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    preferences: {
      notifications: {
        email: true,
        sms: true,
        push: true
      },
      dietaryRestrictions: [],
      mealTimings: {
        breakfast: '',
        lunch: '',
        dinner: ''
      }
    }
  });

  useEffect(() => {
    if (user) {
      // Use mock data if available
      const mockUser = getMockData.getUserById(user._id) || user;
      setFormData({
        name: mockUser.name || '',
        email: mockUser.email || '',
        phone: mockUser.phone || '',
        collegeName: mockUser.collegeName || '',
        collegeId: mockUser.collegeId || '',
        address: {
          street: mockUser.address?.street || '',
          city: mockUser.address?.city || '',
          state: mockUser.address?.state || '',
          pincode: mockUser.address?.pincode || ''
        },
        preferences: {
          notifications: {
            email: mockUser.preferences?.notifications?.email ?? true,
            sms: mockUser.preferences?.notifications?.sms ?? true,
            push: mockUser.preferences?.notifications?.push ?? true
          },
          dietaryRestrictions: mockUser.preferences?.dietaryRestrictions || [],
          mealTimings: {
            breakfast: mockUser.preferences?.mealTimings?.breakfast || '',
            lunch: mockUser.preferences?.mealTimings?.lunch || '',
            dinner: mockUser.preferences?.mealTimings?.dinner || ''
          }
        }
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handleNotificationChange = (type) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        notifications: {
          ...prev.preferences.notifications,
          [type]: !prev.preferences.notifications[type]
        }
      }
    }));
  };

  const handleMealTimingChange = (meal, time) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        mealTimings: {
          ...prev.preferences.mealTimings,
          [meal]: time
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setIsEditing(false);
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original user data
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        collegeName: user.collegeName || '',
        collegeId: user.collegeId || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          pincode: user.address?.pincode || ''
        },
        preferences: {
          notifications: {
            email: user.preferences?.notifications?.email ?? true,
            sms: user.preferences?.notifications?.sms ?? true,
            push: user.preferences?.notifications?.push ?? true
          },
          dietaryRestrictions: user.preferences?.dietaryRestrictions || [],
          mealTimings: {
            breakfast: user.preferences?.mealTimings?.breakfast || '',
            lunch: user.preferences?.mealTimings?.lunch || '',
            dinner: user.preferences?.mealTimings?.dinner || ''
          }
        }
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <FaUser className="h-10 w-10 text-primary-600" />
                )}
              </div>
              {isEditing && (
                <button className="absolute -bottom-1 -right-1 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700">
                  <FaCamera className="h-4 w-4" />
                </button>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-red-100 text-red-800' :
                  user.role === 'host' ? 'bg-blue-100 text-blue-800' :
                  user.role === 'messProvider' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                {user.isVerified && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Verified</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FaEdit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <FaSave className="h-4 w-4" />
                  <span>{loading ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <FaTimes className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">College Name</label>
                    <input
                      type="text"
                      name="collegeName"
                      value={formData.collegeName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">College ID</label>
                    <input
                      type="text"
                      name="collegeId"
                      value={formData.collegeId}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
                {/* Address */}
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                      <input
                        type="text"
                        name="street"
                        value={formData.address.street}
                        onChange={handleAddressChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.address.city}
                        onChange={handleAddressChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.address.state}
                        onChange={handleAddressChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.address.pincode}
                        onChange={handleAddressChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Wallet */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-4">
                <FaWallet className="h-6 w-6 text-green-600" />
                <h3 className="text-base font-semibold text-gray-900">Wallet</h3>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">₹{user.wallet?.balance || 0}</p>
                <p className="text-xs text-gray-600">Available Balance</p>
              </div>
            </div>
            {/* Notifications */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-4">
                <FaBell className="h-6 w-6 text-blue-600" />
                <h3 className="text-base font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.preferences.notifications.email}
                    onChange={() => handleNotificationChange('email')}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Email Notifications</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.preferences.notifications.sms}
                    onChange={() => handleNotificationChange('sms')}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">SMS Notifications</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.preferences.notifications.push}
                    onChange={() => handleNotificationChange('push')}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Push Notifications</span>
                </label>
              </div>
            </div>
            {/* Account Security */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-4">
                <FaShieldAlt className="h-6 w-6 text-red-600" />
                <h3 className="text-base font-semibold text-gray-900">Account Security</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-700">Last Login</span>
                  <span className="text-xs text-gray-500">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-700">Member Since</span>
                  <span className="text-xs text-gray-500">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-700">Referral Code</span>
                  <span className="text-xs font-mono text-gray-500">{user.referralCode}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 