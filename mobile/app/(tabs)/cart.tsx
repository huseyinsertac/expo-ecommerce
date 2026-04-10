import { View, Text } from 'react-native';
import { Cart } from '@/types';
import SafeScreen from '@/components/SafeScreen';

const CartScreen = () => {
  return (
    <SafeScreen>
      <Text className="text-white">CartScreen</Text>
    </SafeScreen>
  );
};

export default CartScreen;
