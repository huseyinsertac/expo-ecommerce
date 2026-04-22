import { Stack } from 'expo-router';
import '../global.css';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import * as Sentry from '@sentry/react-native';
import { StripeProvider, initStripe } from '@stripe/stripe-react-native';
import { Platform } from 'react-native';

const sentryDsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

async function initSentry() {
  if (!sentryDsn) {
    return;
  }

  Sentry.init({
    dsn: sentryDsn,

    // Adds more context data to events (IP address, cookies, user, etc.)
    // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
    sendDefaultPii: true,

    // Enable Logs
    enableLogs: true,

    // Configure Session Replay
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1,
    integrations: [Sentry.mobileReplayIntegration()],

    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
    // spotlight: __DEV__,
  });
}

void initSentry();

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any, query) => {
      Sentry.captureException(error, {
        tags: {
          type: 'react-query-error',
          queryKey: (query.queryKey[0] as string).toString() || 'unknown',
        },
        extra: {
          errorMessage: error.message,
          statusCode: error.response?.status || 'unknown',
          queryKey: query.queryKey,
        },
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: any) => {
      Sentry.captureException(error, {
        tags: {
          type: 'react-query-mutation-error',
        },
        extra: {
          errorMessage: error.message,
          statusCode: error.response?.status || 'unknown',
        },
      });
    },
  }),
});
const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error('Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY');
}

const stripePublishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;

function AppContent() {
  const content = <Stack screenOptions={{ headerShown: false }} />;

  if (!stripePublishableKey) {
    return content;
  }

  return (
    <StripeProvider
      publishableKey={stripePublishableKey}
      merchantIdentifier="merchant.com.anonymous.mobile"
      urlScheme="mobile"
    >
      {content}
    </StripeProvider>
  );
}

export default Sentry.wrap(function RootLayout() {
  if (__DEV__) {
    console.log('Clerk publishable key configured:', !!clerkPublishableKey);
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={clerkPublishableKey}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </ClerkProvider>
  );
});
