import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import RoomDetail from './pages/RoomDetail';
import MessPlans from './pages/MessPlans';
import MessDetail from './pages/MessDetail';
import Services from './pages/Services';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Chat from './pages/Chat';
import Bookings from './pages/Bookings';
import Wallet from './pages/Wallet';
import ProtectedRoute from './components/ProtectedRoute';
import AddRoom from './pages/AddRoom';
import EditRoom from './pages/EditRoom';
import HostRooms from './pages/HostRooms';
import AddMessPlan from './pages/AddMessPlan';
import EditMessPlan from './pages/EditMessPlan';
import ProviderPlans from './pages/ProviderPlans';

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route path="/mess" element={<MessPlans />} />
          <Route path="/mess/:id" element={<MessDetail />} />
          <Route path="/services" element={<Services />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
                                <Route path="/chat" element={
                        <ProtectedRoute>
                          <Chat />
                        </ProtectedRoute>
                      } />
                      <Route path="/bookings" element={
                        <ProtectedRoute>
                          <Bookings />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/wallet" element={
                        <ProtectedRoute>
                          <Wallet />
                        </ProtectedRoute>
                      } />
          <Route path="/rooms/add" element={
            <ProtectedRoute allowedRoles={['host']}>
              <AddRoom />
            </ProtectedRoute>
          } />
          <Route path="/rooms/edit/:id" element={
            <ProtectedRoute allowedRoles={['host']}>
              <EditRoom />
            </ProtectedRoute>
          } />
          <Route path="/rooms/host" element={
            <ProtectedRoute allowedRoles={['host']}>
              <HostRooms />
            </ProtectedRoute>
          } />
          <Route path="/mess/add" element={
            <ProtectedRoute allowedRoles={['messProvider']}>
              <AddMessPlan />
            </ProtectedRoute>
          } />
          <Route path="/mess/edit/:id" element={
            <ProtectedRoute allowedRoles={['messProvider']}>
              <EditMessPlan />
            </ProtectedRoute>
          } />
          <Route path="/mess/provider" element={
            <ProtectedRoute allowedRoles={['messProvider']}>
              <ProviderPlans />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App; 