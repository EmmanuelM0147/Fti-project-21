import { captureException } from './monitoring';

// Enhanced error handler with detailed logging
export function setupGlobalErrorHandlers() {
  // Handle uncaught promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', {
      reason: event.reason,
      stack: event.reason?.stack,
      message: event.reason?.message
    });
    captureException(event.reason);
  });

  // Handle runtime errors
  window.addEventListener('error', (event) => {
    console.error('Runtime error:', {
      error: event.error,
      stack: event.error?.stack,
      message: event.error?.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
    captureException(event.error);
  });

  // Handle chunk loading errors
  window.addEventListener('error', (event) => {
    if (event.target && 'src' in event.target) {
      const target = event.target as HTMLScriptElement;
      if (target.src && target.src.includes('chunk-')) {
        console.error('Chunk loading error:', {
          src: target.src,
          type: target.type,
          async: target.async,
          defer: target.defer
        });
        // Attempt to reload the chunk
        const newScript = document.createElement('script');
        newScript.src = target.src;
        document.head.appendChild(newScript);
        event.preventDefault();
      }
    }
  }, true);

  // Add performance monitoring
  if ('performance' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
        }
        if (entry.entryType === 'first-input') {
          console.log('FID:', entry.processingStart - entry.startTime);
        }
      }
    });
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
  }
}

export function handleError(error: unknown, context?: string): Error {
  const normalizedError = error instanceof Error ? error : new Error(String(error));
  
  const errorDetails = {
    message: normalizedError.message,
    stack: normalizedError.stack,
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  if (context) {
    console.error(`Error in ${context}:`, errorDetails);
  } else {
    console.error('Error:', errorDetails);
  }

  captureException(normalizedError);
  return normalizedError;
}