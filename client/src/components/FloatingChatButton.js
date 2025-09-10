import React, { useMemo } from 'react';
import { FaComments } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FloatingChatButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const hiddenOnRoutes = useMemo(() => ['/chat', '/login', '/register'], []);
  const isHidden = hiddenOnRoutes.some((r) => location.pathname.startsWith(r));

  if (isHidden) return null;

  const handleClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/chat');
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Open chat"
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 rounded-full shadow-glow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 pointer-events-auto transition-all duration-300 group pb-safe"
    >
      <div className="relative flex items-center">
        <div className="p-3 md:p-4 rounded-full bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 dark:from-gray-800 dark:to-gray-900 dark:text-primary-300 dark:hover:from-gray-900 dark:hover:to-gray-800 shadow-lg transition-transform duration-200 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:transform-none">
          {/* Optionally add an image/icon here */}
          <FaComments className="h-6 w-6 md:h-7 md:w-7" />
        </div>
        <span className="hidden lg:inline ml-3 px-3 py-2 rounded-full bg-white text-primary-700 shadow-soft text-sm font-medium dark:bg-gray-900 dark:text-primary-200 dark:shadow-none border border-gray-100 dark:border-gray-700">
          Chat
        </span>
      </div>
    </button>
  );
};

export default FloatingChatButton;


