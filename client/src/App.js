import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import { CityProvider } from './context/CityContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdvancedChatBot from './components/AdvancedChatBot';
import ErrorBoundary from './components/ErrorBoundary';
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
import FAQ from './pages/FAQ';
import ServiceOrders from './pages/ServiceOrders';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Analytics from './pages/Analytics';
import ServiceDetail from './pages/ServiceDetail';

function App() {
  const { user } = useAuth();
  const location = useLocation();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  };

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <CityProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow pt-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route path="/mess" element={<MessPlans />} />
          <Route path="/mess/:id" element={<MessDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/faq" element={<FAQ />} />
          
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
                      <Route path="/analytics" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <Analytics />
                        </ProtectedRoute>
                      } />
                      <Route path="/wallet" element={
                        <ProtectedRoute>
                          <Wallet />
                        </ProtectedRoute>
                      } />
                      <Route path="/service-orders" element={
                        <ProtectedRoute>
                          <ServiceOrders />
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
                </motion.div>
              </AnimatePresence>
            </main>
            <AdvancedChatBot />
            <Footer />
          </div>
        </CityProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App; 