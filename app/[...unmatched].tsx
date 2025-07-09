import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function CatchAllScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  useEffect(() => {
    // Get the current route
    const route = params.unmatched ? (Array.isArray(params.unmatched) ? params.unmatched.join('/') : params.unmatched) : '';
    console.log('Catch-all route hit:', route);
    
    // Small delay to ensure navigation is ready
    const timer = setTimeout(() => {
      // For any unmatched route, go to home
      console.log('Unmatched route, redirecting to home...');
      router.replace('/');
    }, 100);
    
    return () => clearTimeout(timer);
  }, [router, params]);

  // Show loading spinner while redirecting
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FF4500" />
      <Text style={styles.text}>Redirecting...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
