import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearDeferredDeepLink } from '@/hooks/useDeferredDeepLink';

export function DeepLinkDebugPanel() {
  const checkAndClearAll = async () => {
    try {
      // Get all keys
      const keys = await AsyncStorage.getAllKeys();
      const deepLinkKeys = keys.filter(key => key.includes('deeplink') || key.includes('deferred'));

      if (deepLinkKeys.length > 0) {
        await AsyncStorage.multiRemove(deepLinkKeys);
        Alert.alert('Cleared', `Removed ${deepLinkKeys.length} deep link entries`);
      } else {
        Alert.alert('No Deep Links', 'No stored deep links found');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to clear deep links');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deep Link Debug</Text>
      <Button title="Clear ALL Deep Links" onPress={checkAndClearAll} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    margin: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
