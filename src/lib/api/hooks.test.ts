import { renderHook, waitFor } from '@testing-library/react';
import { usePrograms, useProgram, useProgramCourses } from './hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { api } from './client';

// Mock the API client
jest.mock('./client', () => ({
  api: {
    getPrograms: jest.fn(),
    getProgram: jest.fn(),
    getProgramCourses: jest.fn(),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('API Hooks', () => {
  beforeEach(() => {
    queryClient.clear();
    jest.clearAllMocks();
  });

  describe('usePrograms', () => {
    it('should fetch programs successfully', async () => {
      const mockPrograms = [
        { id: '1', name: 'Program 1' },
        { id: '2', name: 'Program 2' },
      ];

      (api.getPrograms as jest.Mock).mockResolvedValueOnce(mockPrograms);

      const { result } = renderHook(() => usePrograms(), { wrapper });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockPrograms);
      expect(api.getPrograms).toHaveBeenCalledTimes(1);
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch programs');
      (api.getPrograms as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => usePrograms(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeDefined();
      expect(result.current.error?.message).toBe('Failed to fetch programs');
    });
  });

  // Add more test cases for other hooks...
});