import { lazy } from 'react';

export const WhatsAppWidget = lazy(() => 
  import('./WhatsAppWidget').then(module => ({ default: module.WhatsAppWidget }))
);