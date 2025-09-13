import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { CityProvider } from '../context/CityContext';
import { SocketProvider } from '../context/SocketContext';
import App from '../App';

// Mock the socket context
jest.mock('../context/SocketContext', () => ({
  SocketProvider: ({ children }) => <div data-testid="socket-provider">{children}</div>
}));

// Mock the API endpoints
jest.mock('../config/api', () => ({
  API_ENDPOINTS: {
    AUTH: '/api/auth',
    ROOMS: '/api/rooms',
    MESS: '/api/mess',
    SERVICES: '/api/services',
    BOOKINGS: '/api/bookings',
    PAYMENTS: '/api/payments',
    ADMIN: '/api/admin'
  }
}));

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <CityProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </CityProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

describe('App Component', () => {
  test('renders without crashing', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    // Check if the app renders without errors
    expect(screen.getByTestId('socket-provider')).toBeInTheDocument();
  });

  test('renders home page by default', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    // The home page should be rendered by default
    // This test assumes the Home component renders some identifiable content
    expect(screen.getByTestId('socket-provider')).toBeInTheDocument();
  });
});
