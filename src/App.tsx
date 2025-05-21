import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { Programs } from './components/Programs';
import { Stats } from './components/Stats';
import { Testimonials } from './components/Testimonials';
import { AdmissionProcess } from './components/AdmissionProcess';
import { NewsAndEvents } from './components/NewsAndEvents';
import { Contact } from './components/Contact';
import { ErrorBoundary } from './lib/errors/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';
import { WelcomeModal } from './components/WelcomeModal';

function App() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  
  const handleSignUpClick = () => {
    // This will be handled by the Layout component
    const authModal = document.querySelector('[role="dialog"]');
    if (authModal) {
      (authModal as HTMLElement).setAttribute('aria-hidden', 'false');
    }
  };

  return (
    <Layout>
      {showWelcomeModal && (
        <WelcomeModal onClose={() => setShowWelcomeModal(false)} />
      )}
      <ErrorBoundary>
        <Hero onApplyClick={handleSignUpClick} />
      </ErrorBoundary>
      <ErrorBoundary>
        <Programs />
      </ErrorBoundary>
      <ErrorBoundary>
        <Stats />
      </ErrorBoundary>
      <ErrorBoundary>
        <Testimonials />
      </ErrorBoundary>
      <ErrorBoundary>
        <AdmissionProcess onApplyClick={handleSignUpClick} />
      </ErrorBoundary>
      <ErrorBoundary>
        <NewsAndEvents />
      </ErrorBoundary>
      <ErrorBoundary>
        <Contact />
      </ErrorBoundary>
    </Layout>
  );
}

export default App;