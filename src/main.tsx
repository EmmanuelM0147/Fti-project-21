import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from './routes';
import { setupGlobalErrorHandlers } from './lib/errors/ErrorHandler';
import { initializeErrorMonitoring } from './lib/errors/monitoring';
import { ErrorBoundary } from './lib/errors/ErrorBoundary';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './lib/hooks/useAuth';
import { Toaster } from 'react-hot-toast';
import './index.css';

// Add console logs for debugging
console.log('Starting application initialization...');

// Initialize error monitoring
initializeErrorMonitoring();

// Configure error handling
setupGlobalErrorHandlers();

// Configure QueryClient with error handling and logging
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      onError: (error) => {
        console.error('Query error:', error);
      }
    },
  },
});

// Get root element with enhanced error handling
const rootElement = document.getElementById('root');
console.log('Root element found:', !!rootElement);

if (!rootElement) {
  console.error('Failed to find root element - check if index.html contains <div id="root"></div>');
  throw new Error('Failed to find root element');
}

// Add error logging
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

try {
  console.log('Attempting to render application...');
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary onError={(error) => console.error('Error boundary caught:', error)}>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <AuthProvider>
                <AppRouter />
                <Toaster position="top-right" />
              </AuthProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </StrictMode>
  );
  console.log('Application rendered successfully');
} catch (error) {
  console.error('Error rendering app:', error);
  // Display a user-friendly error message
  rootElement.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h1>Something went wrong</h1>
      <p>Please try refreshing the page. If the problem persists, contact support.</p>
    </div>
  `;
}