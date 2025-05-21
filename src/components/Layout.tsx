import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ErrorBoundary } from '../lib/errors/ErrorBoundary';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { BackToTop } from './BackToTop';
import { WhatsAppWidget } from './WhatsAppWidget';
import { ThemeProvider } from './ThemeProvider';
import { AuthDialog } from './auth/AuthDialog';
import { TourProvider } from '../context/TourContext';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    // Handle scroll to section after navigation
    if (location.state && location.state.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        // Wait for page to fully load and render
        setTimeout(() => {
          const headerOffset = 80; // Height of fixed header
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          // Check if user prefers reduced motion
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

          window.scrollTo({
            top: offsetPosition,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
          });

          // Set focus to the section for accessibility
          element.focus();
          
          // Clear the state to prevent scrolling on subsequent renders
          window.history.replaceState({}, document.title);
        }, 100);
      }
    }
  }, [location]);

  const handleSignInClick = () => {
    setAuthMode('signin');
    setShowAuthModal(true);
  };

  const handleSignUpClick = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TourProvider>
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
            <Navigation 
              onSignInClick={handleSignInClick}
              onSignUpClick={handleSignUpClick}
            />
            <main className="flex-grow pt-safe-top pb-safe-bottom">
              {children}
            </main>
            <Footer />

            {/* Global UI Elements */}
            <React.Suspense fallback={null}>
              <BackToTop />
              <WhatsAppWidget />
            </React.Suspense>

            <AuthDialog 
              isOpen={showAuthModal}
              onClose={() => setShowAuthModal(false)}
              defaultMode={authMode}
            />
          </div>
        </TourProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}