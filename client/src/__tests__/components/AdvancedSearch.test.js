import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdvancedSearch from '../../components/AdvancedSearch';
import { ThemeProvider } from '../../context/ThemeContext';

const TestWrapper = ({ children }) => (
  <ThemeProvider>
    {children}
  </ThemeProvider>
);

describe('AdvancedSearch Component', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  test('renders search input correctly', () => {
    render(
      <TestWrapper>
        <AdvancedSearch onSearch={mockOnSearch} searchType="rooms" />
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText('Search rooms...')).toBeInTheDocument();
  });

  test('calls onSearch when search query changes', async () => {
    render(
      <TestWrapper>
        <AdvancedSearch onSearch={mockOnSearch} searchType="rooms" />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Search rooms...');
    fireEvent.change(searchInput, { target: { value: 'test query' } });

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith({
        query: 'test query',
        filters: expect.any(Object)
      });
    });
  });

  test('toggles filters visibility', () => {
    render(
      <TestWrapper>
        <AdvancedSearch onSearch={mockOnSearch} searchType="rooms" showFilters={true} />
      </TestWrapper>
    );

    const filterButton = screen.getByText('Filters');
    fireEvent.click(filterButton);

    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Price Range (₹)')).toBeInTheDocument();
  });

  test('updates filters correctly', async () => {
    render(
      <TestWrapper>
        <AdvancedSearch onSearch={mockOnSearch} searchType="rooms" showFilters={true} />
      </TestWrapper>
    );

    // Open filters
    const filterButton = screen.getByText('Filters');
    fireEvent.click(filterButton);

    // Change location
    const locationInput = screen.getByPlaceholderText('Enter city or area');
    fireEvent.change(locationInput, { target: { value: 'Mumbai' } });

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith({
        query: '',
        filters: expect.objectContaining({
          location: 'Mumbai'
        })
      });
    });
  });

  test('toggles amenities correctly', async () => {
    render(
      <TestWrapper>
        <AdvancedSearch onSearch={mockOnSearch} searchType="rooms" showFilters={true} />
      </TestWrapper>
    );

    // Open filters
    const filterButton = screen.getByText('Filters');
    fireEvent.click(filterButton);

    // Click on WiFi amenity
    const wifiButton = screen.getByText('WiFi');
    fireEvent.click(wifiButton);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith({
        query: '',
        filters: expect.objectContaining({
          amenities: ['wifi']
        })
      });
    });
  });

  test('clears all filters correctly', async () => {
    render(
      <TestWrapper>
        <AdvancedSearch onSearch={mockOnSearch} searchType="rooms" showFilters={true} />
      </TestWrapper>
    );

    // Open filters
    const filterButton = screen.getByText('Filters');
    fireEvent.click(filterButton);

    // Set some filters
    const locationInput = screen.getByPlaceholderText('Enter city or area');
    fireEvent.change(locationInput, { target: { value: 'Mumbai' } });

    // Clear all filters
    const clearButton = screen.getByText('Clear All');
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith({
        query: '',
        filters: expect.objectContaining({
          location: '',
          priceRange: { min: 0, max: 50000 },
          rating: 0,
          amenities: [],
          propertyType: '',
          availability: '',
          sortBy: 'relevance'
        })
      });
    });
  });

  test('shows correct property types for different search types', () => {
    const { rerender } = render(
      <TestWrapper>
        <AdvancedSearch onSearch={mockOnSearch} searchType="rooms" showFilters={true} />
      </TestWrapper>
    );

    // Open filters
    const filterButton = screen.getByText('Filters');
    fireEvent.click(filterButton);

    expect(screen.getByText('Single Room')).toBeInTheDocument();
    expect(screen.getByText('Double Room')).toBeInTheDocument();

    // Test mess search type
    rerender(
      <TestWrapper>
        <AdvancedSearch onSearch={mockOnSearch} searchType="mess" showFilters={true} />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Filters'));
    expect(screen.getByText('Vegetarian')).toBeInTheDocument();
    expect(screen.getByText('Non-Vegetarian')).toBeInTheDocument();
  });
});
