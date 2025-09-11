import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '../config/api';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newSocket = io(API_BASE_URL, {
        auth: {
          token: localStorage.getItem('token')
        },
        transports: ['websocket'],
        withCredentials: true
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        newSocket.emit('join', user._id);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

      // Generic listeners that higher-level components can also hook into
      newSocket.on('receiveMessage', (message) => {
        // No-op here; Chat page subscribes directly. Kept for future global badges.
      });
      newSocket.on('messageDelivered', () => {
        // No-op placeholder for delivery receipts.
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [user]);

  const sendMessage = (receiverId, message, messageType = 'text') => {
    if (socket && isConnected) {
      socket.emit('sendMessage', {
        receiverId,
        message,
        messageType
      });
    }
  };

  const joinRoom = (roomId) => {
    if (socket && isConnected) {
      socket.emit('join', roomId);
    }
  };

  const leaveRoom = (roomId) => {
    if (socket && isConnected) {
      socket.emit('leave', roomId);
    }
  };

  const value = {
    socket,
    isConnected,
    sendMessage,
    joinRoom,
    leaveRoom
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 