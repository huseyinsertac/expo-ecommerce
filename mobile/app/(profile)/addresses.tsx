import AddressesHeader from '@/components/AddressesHeader';
import SafeScreen from '@/components/SafeScreen';
import { useAddresses } from '@/hooks/useAddresses';
import { Address } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AddressFormModal from '@/components/AddressFormModal';
import AddressCard from '@/components/AddressCard';

function AddressesScreen() {
  const {
    addAddress,
    addresses,
    deleteAddress,
    isAddingAddress,
    isDeletingAddress,
    isError,
    isLoading,
    isUpdatingAddress,
    updateAddress,
  } = useAddresses();

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: '',
    fullName: '',
    streetAddress: '',
    street: '',
    city: '',
    stateCode: '',
    zip: '',
    phoneNumber: '',
    country: '',
    isDefault: false,
  });

  const handleAddAddress = () => {
    setShowAddressForm(true);
    setEditingAddressId(null);
    setAddressForm({
      label: '',
      fullName: '',
      streetAddress: '',
      street: '',
      city: '',
      stateCode: '',
      zip: '',
      phoneNumber: '',
      country: '',
      isDefault: false,
    });
  };

  const handleEditAddress = (address: Address) => {
    setShowAddressForm(true);
    setEditingAddressId(address._id);
    setAddressForm({
      label: address.label,
      fullName: address.fullName,
      streetAddress: address.streetAddress,
      street: address.street,
      city: address.city,
      stateCode: address.stateCode,
      zip: address.zip,
      phoneNumber: address.phoneNumber,
      country: address.country,
      isDefault: address.isDefault,
    });
  };

  const handleDeleteAddress = (addressId: string, label: string) => {
    Alert.alert(
      'Delete Address',
      `Are you sure you want to delete the address "${label}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteAddress(addressId),
        },
      ]
    );
  };

  const handleSaveAddress = () => {
    if (
      !addressForm.label ||
      !addressForm.fullName ||
      !addressForm.streetAddress ||
      //  !addressForm.street ||
      !addressForm.city ||
      !addressForm.stateCode ||
      !addressForm.zip ||
      !addressForm.phoneNumber ||
      !addressForm.country
    ) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (editingAddressId) {
      updateAddress(
        { addressId: editingAddressId, addressData: addressForm },
        {
          onSuccess: () => {
            setShowAddressForm(false);
            setEditingAddressId(null);
            Alert.alert('Success', 'Address updated successfully');
          },
          onError: (error: any) => {
            console.log('FULL ERROR:', error);
            console.log('RESPONSE:', error?.response?.data);

            Alert.alert(
              'Error',
              error?.response?.data?.message || 'Failed to update address'
            );
          },
        }
      );
    } else {
      addAddress(addressForm, {
        onSuccess: () => {
          setShowAddressForm(false);
          Alert.alert('Success', 'Address added successfully');
        },
        onError: (error: any) => {
          Alert.alert('Error', 'Failed to add address');
        },
      });
    }
  };

  const handleCloseAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddressId(null);
  };

  // todo: create reusable component for ui's.

  if (isLoading) {
    return <LoadingUI />;
  }

  if (isError) {
    return <ErrorUI />;
  }

  return (
    <SafeScreen>
      <AddressesHeader />

      {addresses.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="location-outline" size={80} color="#666" />
          <Text className="text-text-primary font-semibold text-xl mt-4">
            No addresses yet
          </Text>
          <Text className="text-text-secondary text-center mt-2">
            Add your first delivery address
          </Text>
          <TouchableOpacity
            className="bg-primary rounded-2xl px-8 py-4 mt-6"
            activeOpacity={0.8}
            onPress={handleAddAddress}
          >
            <Text className="text-background font-bold text-base">
              Add Address
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-1 px-6 py-4">
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            <View className="px-6 py-4">
              {addresses.map((address) => (
                <AddressCard
                  key={address._id}
                  address={address}
                  onEdit={handleEditAddress}
                  onDelete={handleDeleteAddress}
                  isUpdatingAddress={isUpdatingAddress}
                  isDeletingAddress={isDeletingAddress}
                />
              ))}

              <TouchableOpacity
                className="bg-primary rounded-2xl py-4 mt-2 items-center"
                activeOpacity={0.8}
                onPress={handleAddAddress}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name="add-circle-outline"
                    size={24}
                    color="#121212"
                  />
                  <Text className="text-background font-bold text-base ml-2">
                    Add New Address
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}

      <AddressFormModal
        visible={showAddressForm}
        isEditing={!!editingAddressId}
        addressForm={addressForm}
        isAddingAddress={isAddingAddress}
        isUpdatingAddress={isUpdatingAddress}
        onClose={handleCloseAddressForm}
        onSave={handleSaveAddress}
        onFormChange={setAddressForm}
      />
    </SafeScreen>
  );
}

export default AddressesScreen;

function ErrorUI() {
  return (
    <SafeScreen>
      <AddressesHeader />
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
        <Text className="text-text-primary font-semibold text-xl mt-4">
          Failed to load addresses
        </Text>
        <Text className="text-text-secondary text-center mt-2">
          Please check your connection and try again
        </Text>
      </View>
    </SafeScreen>
  );
}

function LoadingUI() {
  return (
    <SafeScreen>
      <AddressesHeader />
      <View className="flex-1 items-center justify-center px-6">
        <ActivityIndicator size="large" color="#00D9FF" />
        <Text className="text-text-secondary mt-4">Loading addresses...</Text>
      </View>
    </SafeScreen>
  );
}
