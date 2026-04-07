import { Stack } from 'expo-router';
import '../global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';

const queryClient = new QueryClient();
const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error('Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY');
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={clerkPublishableKey}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
