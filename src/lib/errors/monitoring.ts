interface ErrorReport {
  error: Error;
  context?: Record<string, unknown>;
  timestamp: number;
  userAgent: string;
  url: string;
  performance?: {
    memory?: {
      usedJSHeapSize?: number;
      totalJSHeapSize?: number;
    };
    timing?: Partial<PerformanceTiming>;
  };
}

const errorQueue: ErrorReport[] = [];
const MAX_QUEUE_SIZE = 100;

export function captureException(error: Error | unknown, context?: Record<string, unknown>) {
  const errorReport: ErrorReport = {
    error: error instanceof Error ? error : new Error(String(error)),
    context,
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    performance: {
      memory: (performance as any)?.memory,
      timing: performance?.timing
    }
  };

  // Add to queue
  errorQueue.push(errorReport);
  
  // Prevent queue from growing too large
  if (errorQueue.length > MAX_QUEUE_SIZE) {
    errorQueue.shift();
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.group('Error captured:');
    console.error(errorReport.error);
    console.info('Context:', errorReport.context);
    console.info('Performance:', errorReport.performance);
    console.groupEnd();
  }
}

export function getErrorQueue(): ErrorReport[] {
  return [...errorQueue];
}

export function clearErrorQueue(): void {
  errorQueue.length = 0;
}

// Add this to your main.tsx or index.tsx
export function initializeErrorMonitoring(): void {
  // Check for root element
  const root = document.getElementById('root');
  if (!root) {
    console.error('Root element not found! This may cause rendering issues.');
  }

  // Check for required environment variables
  const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID'
  ];

  requiredEnvVars.forEach(varName => {
    if (!import.meta.env[varName]) {
      console.error(`Missing required environment variable: ${varName}`);
    }
  });

  // Check browser compatibility
  const compatibility = {
    modules: 'noModule' in document.createElement('script'),
    async: 'async' in document.createElement('script'),
    webWorker: 'Worker' in window,
    localStorage: (() => {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      } catch (e) {
        return false;
      }
    })()
  };

  console.info('Browser compatibility:', compatibility);
}