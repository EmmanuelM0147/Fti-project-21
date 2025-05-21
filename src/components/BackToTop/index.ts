import { lazy } from 'react';

export const BackToTop = lazy(() => 
  import('./BackToTop').then(module => ({ default: module.BackToTop }))
);