import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter } from 'react-router';
import * as Sentry from '@sentry/react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN?.trim();

if (!PUBLISHABLE_KEY) {
  throw new Error('VITE_CLERK_PUBLISHABLE_KEY is not defined');
}

const queryClient = new QueryClient();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element with id "root" not found');
}

if (SENTRY_DSN) {
  console.log('Initializing Sentry with DSN:', SENTRY_DSN);
  Sentry.init({
    dsn: SENTRY_DSN,
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
    enableLogs: true,
    integrations: [Sentry.replayIntegration()],
    // Session Replay
    replaysSessionSampleRate: 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
} else {
  console.warn('VITE_SENTRY_DSN is missing. Sentry is disabled.');
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>
);
