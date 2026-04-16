import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import SafeScreen from './SafeScreen';
import { Ionicons } from '@expo/vector-icons';

interface AddressFormData {
  label: string;
  fullName: string;
  streetAddress: string;
  street: string;
  city: string;
  stateCode: string;
  zip: string;
  phoneNumber: string;
  country: string;
  isDefault: boolean;
}

interface AddressFormModalProps {
  visible: boolean;
  isEditing: boolean;
  addressForm: AddressFormData;
  isAddingAddress: boolean;
  isUpdatingAddress: boolean;
  onClose: () => void;
  onSave: () => void;
  onFormChange: (form: AddressFormData) => void;
}

const AddressFormModal = ({
  addressForm,
  isAddingAddress,
  isEditing,
  isUpdatingAddress,
  onClose,
  onFormChange,
  onSave,
  visible,
}: AddressFormModalProps) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <SafeScreen>
          {/* HEADER */}
          <View className="px-6 py-5 border-b border-surface flex-row items-center justify-between">
            <Text className="text-text-primary text-2xl font-bold">
              {isEditing ? 'Edit Address' : 'Add New Address'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 50 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="p-6">
              {/* LABEL INPUT */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">
                  Label
                </Text>
                <TextInput
                  className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-base"
                  placeholder="e.g. Home, Work, etc."
                  placeholderTextColor="#888"
                  value={addressForm.label}
                  onChangeText={(text) =>
                    onFormChange({ ...addressForm, label: text })
                  }
                />
              </View>
              {/* NAME INPUT */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">
                  Full Name
                </Text>
                <TextInput
                  className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-base"
                  placeholder="e.g. John Doe"
                  placeholderTextColor="#666"
                  value={addressForm.fullName}
                  onChangeText={(text) =>
                    onFormChange({ ...addressForm, fullName: text })
                  }
                />
              </View>
              {/* STREET ADDRESS INPUT */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">
                  Street Address
                </Text>
                <TextInput
                  className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-base"
                  placeholder="e.g. 123 Main St"
                  placeholderTextColor="#666"
                  value={addressForm.streetAddress}
                  onChangeText={(text) =>
                    onFormChange({ ...addressForm, streetAddress: text })
                  }
                />
              </View>
              {/* STREET INPUT */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">
                  Street
                </Text>
                <TextInput
                  className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-base"
                  placeholder="e.g. Apt 4B"
                  placeholderTextColor="#666"
                  value={addressForm.street}
                  onChangeText={(text) =>
                    onFormChange({ ...addressForm, street: text })
                  }
                />
              </View>
              {/* CITY, STATE, ZIP */}
              <View className="flex-row -mx-2 mb-5">
                <View className="flex-1 px-2">
                  <Text className="text-text-primary font-semibold mb-2">
                    City
                  </Text>
                  <TextInput
                    className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-base"
                    placeholder="City"
                    placeholderTextColor="#666"
                    value={addressForm.city}
                    onChangeText={(text) =>
                      onFormChange({ ...addressForm, city: text })
                    }
                  />
                </View>
                <View className="flex-1 px-2">
                  <Text className="text-text-primary font-semibold mb-2">
                    State
                  </Text>
                  <TextInput
                    className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-base"
                    placeholder="State"
                    placeholderTextColor="#666"
                    value={addressForm.stateCode}
                    onChangeText={(text) =>
                      onFormChange({ ...addressForm, stateCode: text })
                    }
                  />
                </View>
                <View className="flex-1 px-2">
                  <Text className="text-text-primary font-semibold mb-2">
                    ZIP
                  </Text>
                  <TextInput
                    className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-base"
                    placeholder="ZIP Code"
                    placeholderTextColor="#666"
                    value={addressForm.zip}
                    onChangeText={(text) =>
                      onFormChange({ ...addressForm, zip: text })
                    }
                  />
                </View>
              </View>
              {/* COUNTRY INPUT */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">
                  Country
                </Text>
                <TextInput
                  className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-base"
                  placeholder="e.g. United States"
                  placeholderTextColor="#666"
                  value={addressForm.country}
                  onChangeText={(text) =>
                    onFormChange({ ...addressForm, country: text })
                  }
                />
              </View>
              {/* PHONE NUMBER INPUT */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">
                  Phone Number
                </Text>
                <TextInput
                  className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-base"
                  placeholder="e.g. (123) 456-7890"
                  placeholderTextColor="#666"
                  value={addressForm.phoneNumber}
                  onChangeText={(text) =>
                    onFormChange({ ...addressForm, phoneNumber: text })
                  }
                />
              </View>

              {/*default address toggle */}
              <View className="bg-surface rounded-2xl p-4 flex-row items-center justify-between mb-6">
                <Text className="text-text-primary font-semibold">
                  Set as default address
                </Text>
                <Switch
                  value={addressForm.isDefault}
                  onValueChange={(value) =>
                    onFormChange({ ...addressForm, isDefault: value })
                  }
                  thumbColor="white"
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity
                className="bg-primary rounded-2xl py-5 items-center"
                activeOpacity={0.8}
                onPress={onSave}
                disabled={isAddingAddress || isUpdatingAddress}
              >
                {isAddingAddress || isUpdatingAddress ? (
                  <ActivityIndicator size="small" color="#121212" />
                ) : (
                  <Text className="text-background font-bold text-lg">
                    {isEditing ? 'Save Changes' : 'Add Address'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeScreen>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddressFormModal;
