import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Layout } from '../components/Layout';
import { AuthProvider } from '../lib/hooks/useAuth';
import App from '../App';

// Helper function to handle lazy imports with retry logic
function lazyWithRetry(importFn: () => Promise<any>, retries = 3) {
  return lazy(() => {
    const retry = (attempt: number): Promise<any> =>
      importFn().catch((error) => {
        if (attempt >= retries) {
          throw error;
        }
        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        return new Promise(resolve => setTimeout(resolve, delay)).then(() => retry(attempt + 1));
      });

    return retry(0);
  });
}

// Lazy-loaded components with retry logic
const Programs = lazyWithRetry(() => 
  import('../pages/programs').then(module => ({ default: module.default }))
);

const ProgramDetail = lazyWithRetry(() => 
  import('../pages/programs/[id]').then(module => ({ default: module.default }))
);

const CourseDetail = lazyWithRetry(() => 
  import('../pages/programs/[programId]/courses/[courseId]').then(module => ({ default: module.default }))
);

const Sponsorships = lazyWithRetry(() => 
  import('../pages/sponsorships').then(module => ({ default: module.default }))
);

const PartnershipInquiry = lazyWithRetry(() => 
  import('../pages/partnership-inquiry').then(module => ({ default: module.default }))
);

const Give = lazyWithRetry(() => 
  import('../pages/give').then(module => ({ default: module.default }))
);

const ComputerTechnology = lazyWithRetry(() => 
  import('../pages/programs/computer-technology').then(module => ({ default: module.default }))
);

const VocationalStudies = lazyWithRetry(() => 
  import('../pages/programs/vocational-studies').then(module => ({ default: module.default }))
);

const ConstructionTechnologies = lazyWithRetry(() => 
  import('../pages/programs/construction-technologies').then(module => ({ default: module.default }))
);

const About = lazyWithRetry(() => 
  import('../pages/about').then(module => ({ default: module.default }))
);

const Apply = lazyWithRetry(() => 
  import('../pages/apply').then(module => ({ default: module.default }))
);

const Profile = lazyWithRetry(() => 
  import('../pages/Profile').then(module => ({ default: module.default }))
);

const Settings = lazyWithRetry(() => 
  import('../pages/Settings').then(module => ({ default: module.default }))
);

const Dashboard = lazyWithRetry(() => 
  import('../pages/Dashboard').then(module => ({ default: module.default }))
);

const AuthCallback = lazyWithRetry(() => 
  import('../pages/auth/Callback').then(module => ({ default: module.default }))
);

const ResetPassword = lazyWithRetry(() => 
  import('../pages/auth/ResetPassword').then(module => ({ default: module.default }))
);

const ApplicationsPage = lazyWithRetry(() => 
  import('../pages/applications').then(module => ({ default: module.default }))
);

const ApplicationDetailPage = lazyWithRetry(() => 
  import('../pages/applications/[id]').then(module => ({ default: module.default }))
);

const CareerDevelopment = lazyWithRetry(() => 
  import('../pages/CareerDevelopment').then(module => ({ default: module.default }))
);

// Enhanced Suspense wrapper with error handling
function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner message="Loading page..." />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

// Route configuration with proper error boundaries and suspense
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/about',
    element: (
      <Layout>
        <ErrorBoundary>
          <SuspenseWrapper>
            <About />
          </SuspenseWrapper>
        </ErrorBoundary>
      </Layout>
    ),
  },
  {
    path: '/programs',
    element: (
      <Layout>
        <ErrorBoundary>
          <SuspenseWrapper>
            <Programs />
          </SuspenseWrapper>
        </ErrorBoundary>
      </Layout>
    ),
  },
  {
    path: '/programs/computer-technology',
    element: (
      <Layout>
        <ErrorBoundary>
          <SuspenseWrapper>
            <ComputerTechnology />
          </SuspenseWrapper>
        </ErrorBoundary>
      </Layout>
    ),
  },
  {
    path: '/programs/vocational-studies',
    element: (
      <Layout>
        <ErrorBoundary>
          <SuspenseWrapper>
            <VocationalStudies />
          </SuspenseWrapper>
        </ErrorBoundary>
      </Layout>
    ),
  },
  {
    path: '/programs/construction-technologies',
    element: (
      <Layout>
        <ErrorBoundary>
          <SuspenseWrapper>
            <ConstructionTechnologies />
          </SuspenseWrapper>
        </ErrorBoundary>
      </Layout>
    ),
  },
  {
    path: '/programs/:id',
    element: (
      <Layout>
        <ErrorBoundary>
          <SuspenseWrapper>
            <ProgramDetail />
          </SuspenseWrapper>
        </ErrorBoundary>
      </Layout>
    ),
  },
  {
    path: '/programs/:programId/courses/:courseId',
    element: (
      <Layout>
        <ErrorBoundary>
          <SuspenseWrapper>
            <CourseDetail />
          </SuspenseWrapper>
        </ErrorBoundary>
      </Layout>
    ),
  },
  {
    path: '/sponsorships',
    element: (
      <Layout>
        <ErrorBoundary>
          <SuspenseWrapper>
            <Sponsorships />
          </SuspenseWrapper>
        </ErrorBoundary>
      </Layout>
    ),
  },
  {
    path: '/partnership-inquiry',
    element: (
      <Layout>
        <ErrorBoundary>
          <SuspenseWrapper>
            <PartnershipInquiry />
          </SuspenseWrapper>
        </ErrorBoundary>
      </Layout>
    ),
  },
  {
    path: '/give',
    element: (
      <Layout>
        <ErrorBoundary>
          <SuspenseWrapper>
            <Give />
          </SuspenseWrapper>
        </ErrorBoundary>
      </Layout>
    ),
  },
  {
    path: '/apply',
    element: (
      <Layout>
        <ErrorBoundary>
          <SuspenseWrapper>
            <Apply />
          </SuspenseWrapper>
        </ErrorBoundary>
      </Layout>
    ),
  },
  {
    path: '/profile',
    element: (
      <Layout>
        <ErrorBoundary>
          <SuspenseWrapper>
            <Profile />
          </SuspenseWrapper>
        </ErrorBoundary>
      </Layout>
    ),
  },
  {
    path: '/settings',
    element: (
      <Layout>
        <ErrorBoundary>
          <SuspenseWrapper>
            <Settings />
          </SuspenseWrapper>
        </ErrorBoundary>
      </Layout>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <Layout>
        <ErrorBoundary>
          <SuspenseWrapper>
            <Dashboard />
          </SuspenseWrapper>
        </ErrorBoundary>
      </Layout>
    ),
  },
  {
    path: '/applications',
    element: (
      <Layout>
        <ErrorBoundary>
          <SuspenseWrapper>
            <ApplicationsPage />
          </SuspenseWrapper>
        </ErrorBoundary>
      </Layout>
    ),
  },
  {
    path: '/applications/:id',
    element: (
      <Layout>
        <ErrorBoundary>
          <SuspenseWrapper>
            <ApplicationDetailPage />
          </SuspenseWrapper>
        </ErrorBoundary>
      </Layout>
    ),
  },
  {
    path: '/career-development',
    element: (
      <Layout>
        <ErrorBoundary>
          <SuspenseWrapper>
            <CareerDevelopment />
          </SuspenseWrapper>
        </ErrorBoundary>
      </Layout>
    ),
  },
  {
    path: '/auth/callback',
    element: (
      <ErrorBoundary>
        <SuspenseWrapper>
          <AuthCallback />
        </SuspenseWrapper>
      </ErrorBoundary>
    ),
  },
  {
    path: '/auth/reset-password',
    element: (
      <ErrorBoundary>
        <SuspenseWrapper>
          <ResetPassword />
        </SuspenseWrapper>
      </ErrorBoundary>
    ),
  },
]);

export function AppRouter() {
  return (
    <RouterProvider router={router} />
  );
}