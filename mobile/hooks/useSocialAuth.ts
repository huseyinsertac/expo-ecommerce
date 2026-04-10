import { useSSO } from '@clerk/clerk-expo';
import * as AuthSession from 'expo-auth-session';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

type SocialStrategy = 'oauth_google' | 'oauth_apple';

let pendingSocialStrategy: SocialStrategy | null = null;

function useSocialAuth() {
    const [isLoading, setIsLoading] = useState(Boolean(pendingSocialStrategy));
    const [loadingStrategy, setLoadingStrategy] =
        useState<SocialStrategy | null>(pendingSocialStrategy);
    const { startSSOFlow } = useSSO();
    const router = useRouter();
    const redirectUrl = AuthSession.makeRedirectUri();

    const handleSocialAuth = async (strategy: SocialStrategy) => {
        pendingSocialStrategy = strategy;
        setLoadingStrategy(strategy);
        setIsLoading(true);
        try {
            const { createdSessionId, setActive } = await startSSOFlow({
                strategy,
                redirectUrl,
            });

            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId });
                router.replace('/(tabs)');
            } else {
                Alert.alert(
                    'Authentication Canceled',
                    'No session was created. Please try signing in again.'
                );
            }
        } catch (error) {
            console.log('Social auth error:', error);
            const providerName = strategy === 'oauth_google' ? 'Google' : 'Apple';
            Alert.alert(
                'Authentication Error',
                `Failed to authenticate with ${providerName}. Please try again.`
            );
        } finally {
            pendingSocialStrategy = null;
            setIsLoading(false);
            setLoadingStrategy(null);
        }
    };

    return { isLoading, loadingStrategy, handleSocialAuth };
}

export default useSocialAuth