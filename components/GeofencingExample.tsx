import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, SafeAreaView } from 'react-native';
import { GeofenceToggle } from '@/components/GeofenceToggle';
import { useGeofencing } from '@/hooks/useGeofencing';
import GeofencingService from '@/services/GeofencingService';

// Example restaurants - replace with your actual data
const SAMPLE_RESTAURANTS = [
  {
    id: '1',
    name: 'Franklin Barbecue',
    latitude: 30.2701,
    longitude: -97.7312,
    address: '900 E 11th St, Austin, TX',
  },
  {
    id: '2',
    name: 'Uchi',
    latitude: 30.2566,
    longitude: -97.7388,
    address: '801 S Lamar Blvd, Austin, TX',
  },
  {
    id: '3',
    name: "Matt's El Rancho",
    latitude: 30.2452,
    longitude: -97.7704,
    address: '2613 S Lamar Blvd, Austin, TX',
  },
];

export function GeofencingExample() {
  const { error, isInitialized } = useGeofencing();

  useEffect(() => {
    if (error) {
      Alert.alert('Geofencing Error', error);
    }
  }, [error]);

  useEffect(() => {
    // Initialize the service on mount
    GeofencingService.initialize().catch(console.error);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Restaurant Alerts</Text>
        <Text style={styles.subtitle}>Get notified when you're near these restaurants</Text>

        {!isInitialized && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>Initializing location services...</Text>
          </View>
        )}

        <View style={styles.restaurantList}>
          {SAMPLE_RESTAURANTS.map(restaurant => (
            <View key={restaurant.id} style={styles.restaurantCard}>
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <Text style={styles.restaurantAddress}>{restaurant.address}</Text>
              </View>
              <GeofenceToggle restaurant={restaurant} />
            </View>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>How it works</Text>
          <Text style={styles.infoText}>
            • Enable alerts for restaurants you want to visit{'\n'}• Get notified when you're within
            150 meters{'\n'}• Works in the background (with your permission){'\n'}• Disable anytime
            by toggling off
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  warningBox: {
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFE69C',
  },
  warningText: {
    color: '#856404',
    fontSize: 14,
  },
  restaurantList: {
    gap: 16,
  },
  restaurantCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantInfo: {
    flex: 1,
    marginRight: 12,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#666',
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginTop: 32,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1565C0',
    lineHeight: 20,
  },
});
