import useSocialAuth from '@/hooks/useSocialAuth';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

const AuthScreen = () => {
  const { isLoading, loadingStrategy, handleSocialAuth } = useSocialAuth(); // Ensure the hook is used to initialize social auth logic
  const isButtonLoading = Boolean(isLoading);
  const isGoogleLoading = isButtonLoading && loadingStrategy === 'oauth_google';
  const isAppleLoading = isButtonLoading && loadingStrategy === 'oauth_apple';

  return (
    <View className="px-8 flex-1 justify-center items-center">
      <Image
        source={require('@/assets/images/auth-image.png')}
        className="size-96"
        resizeMode="contain"
      />

      <View className="gap-2 mt-3">
        {/* GOOGLE SIGN IN BUTTON */}
        <TouchableOpacity
          className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full px-6 py-3"
          onPress={() => handleSocialAuth('oauth_google')}
          disabled={isButtonLoading}
          style={{
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          {isGoogleLoading ? (
            <ActivityIndicator size={'small'} color={'#4285f4'} />
          ) : (
            <View className="flex-row items-center justify-center">
              <Image
                source={require('@/assets/images/google.png')}
                className="size-10 mr-3"
                resizeMode="contain"
              />
              <Text className="text-black font-medium text-base">
                Continue with Google
              </Text>
            </View>
          )}
        </TouchableOpacity>
        {/* APPLE SIGN IN BUTTON */}
        <TouchableOpacity
          className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full px-6 py-3"
          onPress={() => handleSocialAuth('oauth_apple')}
          disabled={isButtonLoading}
          style={{
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          {isAppleLoading ? (
            <ActivityIndicator size={'small'} color={'#4285f4'} />
          ) : (
            <View className="flex-row items-center justify-center">
              <Image
                source={require('@/assets/images/apple.png')}
                className="size-10 mr-3"
                resizeMode="contain"
              />
              <Text className="text-black font-medium text-base">
                Continue with Apple
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Text className="text-center text-gray-500 text-xs leading-4 mt-6 px-2">
        By continuing, you agree to our{' '}
        <Text className="text-blue-500">Terms of Service</Text> {', and '}{' '}
        <Text className="text-blue-500">Privacy Policy</Text>.
      </Text>
    </View>
  );
};

export default AuthScreen;
