import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { simulateDeferredDeepLink, clearDeferredDeepLink } from '@/hooks/useDeferredDeepLink';
import { storeTestDeepLink } from '@/hooks/useSimpleDeferredLink';
import { useRouter } from 'expo-router';
import { DeepLinkDebugPanel } from '@/components/DeepLinkDebugPanel';

export default function TestDeferredLinkScreen() {
  const [testUrl, setTestUrl] = useState('dinnafind://restaurant/test-restaurant-123');
  const router = useRouter();

  const simulateInstallFlow = async () => {
    // Step 1: Store the deferred link
    await simulateDeferredDeepLink(testUrl);

    Alert.alert(
      'Simulated Install',
      'Deep link stored. The app will now simulate being closed and reopened.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Step 2: Navigate to home to simulate app restart
            // Use push instead of replace to avoid immediate deep link processing
            router.push('/(tabs)');

            // Give a bit more time before processing the deferred link
            setTimeout(() => {
              console.log('[Test] Navigation should be ready now');
            }, 100);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Deferred Deep Links</Text>

      <Text style={styles.label}>Test URL:</Text>
      <TextInput
        style={styles.input}
        value={testUrl}
        onChangeText={setTestUrl}
        placeholder="Enter deep link URL"
      />

      <Button title="Simulate Post-Install Deep Link" onPress={simulateInstallFlow} />

      <View style={{ height: 10 }} />

      <Button title="Clear Stored Links" onPress={clearDeferredDeepLink} color="red" />

      <View style={styles.examples}>
        <Text style={styles.label}>Example URLs:</Text>
        <Text style={styles.example}>dinnafind://restaurant/abc123</Text>
        <Text style={styles.example}>dinnafind://bucket-list</Text>
        <Text style={styles.example}>dinnafind://auth-callback?token=xyz</Text>
      </View>

      {/* Debug Panel */}
      <DeepLinkDebugPanel />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 14,
  },
  examples: {
    marginTop: 40,
  },
  example: {
    fontFamily: 'monospace',
    fontSize: 12,
    marginTop: 5,
    color: '#666',
  },
});
