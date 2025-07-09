import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, type MapView as MapViewType, type Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useAppSelector } from '@/hooks/redux';
import { selectBucketListItems } from '@/store/slices/bucketListSlice';
import { type BucketListItem } from '@/models/bucket-list';

export const ExploreScreen: React.FC = () => {
  const {
    coordinates,
    loading: locationLoading,
    error: locationError,
    permissionGranted,
    requestLocation,
  } = useGeolocation();
  const bucketListItems = useAppSelector(selectBucketListItems) as BucketListItem[];

  const initialRegion = coordinates
    ? {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

  const mapRef = useRef<MapViewType>(null);

  useEffect(() => {
    if (coordinates && mapRef.current) {
      const region: Region = {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      mapRef.current.animateToRegion(region, 1000);
    }
  }, [coordinates]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        {locationLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#FF4500" />
            <Text>Getting your location...</Text>
          </View>
        )}
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={!!coordinates}
        >
          {/* User location marker (optional, since showsUserLocation is true) */}
          {coordinates && <Marker coordinate={coordinates} title="You are here" pinColor="blue" />}
          {/* Bucket list markers */}
          {bucketListItems.map((item: BucketListItem) =>
            item.venue.coordinates ? (
              <Marker
                key={item.id}
                coordinate={item.venue.coordinates}
                title={item.venue.name}
                description={item.venue.address}
              />
            ) : null
          )}
        </MapView>
      </View>
      <View style={styles.content}>
        <Ionicons color="#CCCCCC" name="map-outline" size={64} />
        <Text style={styles.title}>Explore Restaurants</Text>
        <Text style={styles.description}>
          This screen shows your location and saved bucket list restaurants on the map.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/search')}>
          <Text style={styles.buttonText}>Search Restaurants</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  mapContainer: {
    width: '100%',
    height: Dimensions.get('window').height * 0.5,
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 20,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#FF4500',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ExploreScreen;
