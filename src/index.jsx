import React from 'react';
import { createRoot } from 'react-dom/client';
import './services/i18n/i18n';
import { StoreProvider } from '@ska-telescope/ska-gui-local-storage';

import App from './components/App/App';
import Loader from './components/Loader/Loader';

const container = document.getElementById('root');
const root = createRoot(container);

// Simpler rendering without StrictMode to avoid double-rendering issues
root.render(
  <React.Suspense fallback={<Loader />}>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.Suspense>
);
