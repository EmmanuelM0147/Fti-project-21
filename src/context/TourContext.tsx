import React, { createContext, useContext, ReactNode } from 'react';
import { useTour } from '../hooks/useTour';

interface TourContextType {
  startTour: () => void;
  stopTour: () => void;
  isActive: boolean;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function TourProvider({ children }: { children: ReactNode }) {
  const tourState = useTour();
  
  return (
    <TourContext.Provider value={tourState}>
      {children}
    </TourContext.Provider>
  );
}

export function useTourContext() {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTourContext must be used within a TourProvider');
  }
  return context;
}