import { useSSO }   from '@clerk/clerk-expo';
import { useState } from 'react';
import { Alert }   from 'react-native';

type SocialStrategy = 'oauth_google' | 'oauth_apple';

function useSocialAuth() {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStrategy, setLoadingStrategy] = useState<SocialStrategy | null>(null);
    const {startSSOFlow} = useSSO();
    const handleSocialAuth = async (strategy: SocialStrategy) => {
        setLoadingStrategy(strategy);
        setIsLoading(true);
        try {
           const {createdSessionId, setActive} = await startSSOFlow({ strategy });
          
           if(createdSessionId && setActive) {
            await setActive({ session: createdSessionId });
        } else {
            Alert.alert('Authentication Canceled', 'No session was created. Please try signing in again.');
        }
        } catch (error) {
           console.log('Social auth error:', error);
           const providerName = strategy === 'oauth_google' ? 'Google' : 'Apple';
           Alert.alert('Authentication Error', `Failed to authenticate with ${providerName}. Please try again.`);
        } finally {
            setIsLoading(false);
                        setLoadingStrategy(null);
        }
    }


    return { isLoading, loadingStrategy, handleSocialAuth }
}

export default useSocialAuth