import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { getDistance, getDistanceString } from '../utils/distanceUtils';
import { GeofencingEvent } from '@/store/slices/geofencingSlice';
import { store } from '@/store'; // Import the Redux store
import { selectDistanceMiles } from '@/store/slices/bucketListSlice';
const NOTIFICATION_COOLDOWN = 300000; // 5 minutes in milliseconds
const GEOFENCE_TASK_NAME = 'DINNAFIND_GEOFENCE_TASK';
export const GEOFENCE_RADIUS = 2000; // meters - reasonable walking distance
const STORAGE_KEY = 'dinnafind_geofences';

// DinnaFind branded notification messages
function getNotificationTitle(): string {
  return 'DinnaFind! 🍽️';
}

function getNotificationBody(
  restaurantName: string,
  distance?: number,
  userLat?: number,
  userLon?: number,
  venueLat?: number,
  venueLon?: number
): string {
  let distanceText = '';
  if (
    typeof userLat === 'number' &&
    typeof userLon === 'number' &&
    typeof venueLat === 'number' &&
    typeof venueLon === 'number'
  ) {
    distanceText = getDistanceString(userLat, userLon, venueLat, venueLon);
  } else if (typeof distance === 'number') {
    // distance is in miles (from getDistance)
    if (distance < 0.1) {
      const feet = Math.round(distance * 5280);
      distanceText = `${feet} ft`;
    } else {
      distanceText = `${distance.toFixed(1)} mi`;
    }
  } else {
    distanceText = '';
  }
  return `${restaurantName} is only ${distanceText} away! 🚶‍♂️`;
}

export interface GeofenceRegion {
  id: string;
  latitude: number;
  longitude: number;
  radius: number;
  restaurantName: string;
  restaurantId: string;
}

// Define the task at module level (outside the class)
TaskManager.defineTask(GEOFENCE_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('[Geofencing] Task error:', error);
    return;
  }

  if (data) {
    const { eventType, region } = data as any;

    try {
      const regionId = region.identifier || 'unknown';
      console.log(`[Geofencing] ⚡️ Event: ${eventType} for region: ${regionId}`);

      // Load geofences from storage to get restaurant details
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (!storedData) {
        console.log('[Geofencing] No geofences found in storage');
        return;
      }

      const regions: GeofenceRegion[] = JSON.parse(storedData);
      const geofence = regions.find(r => r.id === region.identifier);

      if (!geofence) {
        console.log(`[Geofencing] ⚠️ Geofence not found for region: ${regionId}`);
        return;
      }

      console.log(`[Geofencing] Restaurant: ${geofence.restaurantName}`);

      // Only send notification for enter events
      if (eventType === Location.GeofencingEventType.Enter) {
        // Check if we've recently sent a notification for this restaurant
        const now = Date.now();
        const lastNotificationTime = await AsyncStorage.getItem(`last_notification_${geofence.id}`);
        const lastTime = lastNotificationTime ? parseInt(lastNotificationTime, 10) : 0;
        const currentPosition = await Location.getLastKnownPositionAsync();
        if (
          !currentPosition ||
          typeof currentPosition.coords?.latitude !== 'number' ||
          typeof currentPosition.coords?.longitude !== 'number'
        ) {
          console.log(
            '[Geofencing] ⚠️ Could not get valid current position, skipping notification.'
          );
          return;
        }
        const distance = getDistance(
          currentPosition.coords.latitude,
          currentPosition.coords.longitude,
          geofence.latitude,
          geofence.longitude
        );
        // Read distanceMiles from Redux (with safety check)
        let distanceMiles = 1.25; // default fallback
        try {
          const state = store.getState();
          distanceMiles = state.bucketList?.distanceMiles ?? 1.25;
        } catch (reduxError) {
          console.warn(
            '[Geofencing] Could not access Redux store, using default distance:',
            reduxError
          );
        }
        const withinDistance = distance <= distanceMiles;
        console.log(
          `🗺️[Geofencing] 📏 Distance: ${distance} miles, Alert Distance: ${distanceMiles} miles`
        );
        if (withinDistance) {
          console.log('🟢 [Geofencing] Within alert distance!');
        } else {
          console.log('🔴 [Geofencing] Outside alert distance.');
        }
        if (withinDistance && now - lastTime > NOTIFICATION_COOLDOWN) {
          // 5 minute cooldown
          await Notifications.scheduleNotificationAsync({
            content: {
              title: getNotificationTitle(),
              body: getNotificationBody(
                geofence.restaurantName,
                distance,
                currentPosition.coords.latitude,
                currentPosition.coords.longitude,
                geofence.latitude,
                geofence.longitude
              ),
              data: {
                restaurantId: geofence.restaurantId,
                restaurantName: geofence.restaurantName,
                eventType: 'enter',
              },
              sound: true,
            },
            trigger: null, // immediate
          });

          // Store the time of this notification
          await AsyncStorage.setItem(`last_notification_${geofence.id}`, now.toString());
          console.log(`🟢🔈[Geofencing] Notification sent for: ${geofence.restaurantName}`);
        } else if (withinDistance) {
          console.log(
            `🟡 [Geofencing] Cooldown active, not sending notification for: ${geofence.restaurantName}`
          );
        }
      }
    } catch (error) {
      console.error('🔴[Geofencing] Failed to handle event:', error);
    }
  }
});

class GeofencingService {
  subscribe(onEvent: (event: GeofencingEvent) => void, onError: (error: Error) => void) {
    throw new Error('Method not implemented.');
  }
  unsubscribe(): void {
    throw new Error('Method not implemented.');
  }
  private static instance: GeofencingService;
  private activeRegions: Map<string, GeofenceRegion> = new Map();
  private isInitialized: boolean = false;
  private lastNotificationTimes: Map<string, number> = new Map();

  private constructor() {}

  static getInstance(): GeofencingService {
    if (!GeofencingService.instance) {
      GeofencingService.instance = new GeofencingService();
    }
    return GeofencingService.instance;
  }

  async initialize() {
    if (this.isInitialized) {
      return;
    }

    // Request foreground location permission first
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus !== 'granted') {
      throw new Error('Location permission not granted');
    }

    // Request background location permission (required for geofencing)
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus !== 'granted') {
      throw new Error(
        'Background location permission is required for location alerts. ' +
          'Please enable "Always Allow" location access in your device settings.'
      );
    }

    // Request notification permissions
    const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
    if (notificationStatus !== 'granted') {
      console.warn('🔴 Notification permission not granted');
    }

    // Configure notifications
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    // The background task is already defined at module level
    // No need to redefine it here

    // Load saved geofences
    await this.loadGeofences();

    // Start geofencing if we have active regions
    if (this.activeRegions.size > 0) {
      await this.startGeofencing();
    }

    this.isInitialized = true;
  }

  async checkPermissions(): Promise<{
    foreground: boolean;
    background: boolean;
    notifications: boolean;
  }> {
    const { status: foregroundStatus } = await Location.getForegroundPermissionsAsync();
    const { status: backgroundStatus } = await Location.getBackgroundPermissionsAsync();
    const { status: notificationStatus } = await Notifications.getPermissionsAsync();

    return {
      foreground: foregroundStatus === 'granted',
      background: backgroundStatus === 'granted',
      notifications: notificationStatus === 'granted',
    };
  }

  async addGeofence(restaurant: { id: string; name: string; latitude: number; longitude: number }) {
    // Ensure we're initialized
    if (!this.isInitialized) {
      console.log('🔄 Geofencing service not initialized, initializing now...');
      await this.initialize();
    }

    const region: GeofenceRegion = {
      id: `geofence_${restaurant.id}`,
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
      radius: GEOFENCE_RADIUS,
      restaurantName: restaurant.name,
      restaurantId: restaurant.id,
    };

    console.log(`📍 Adding geofence for: ${restaurant.name} (${restaurant.id})`);
    this.activeRegions.set(region.id, region);
    await this.saveGeofences();
    await this.startGeofencing();

    return region;
  }

  async removeGeofence(restaurantId: string) {
    const regionId = `geofence_${restaurantId}`;
    this.activeRegions.delete(regionId);
    await this.saveGeofences();

    if (this.activeRegions.size === 0) {
      await this.stopGeofencing();
    } else {
      await this.startGeofencing();
    }
  }

  async removeAllGeofences() {
    console.log('🗑️ Removing all geofences...');
    this.activeRegions.clear();
    await this.saveGeofences();
    await this.stopGeofencing();
    console.log('✅ All geofences removed');
  }

  async startGeofencing() {
    // If no regions, stop geofencing instead
    if (this.activeRegions.size === 0) {
      await this.stopGeofencing();
      return;
    }

    // Check if we have the required permissions
    const permissions = await this.checkPermissions();
    if (!permissions.background) {
      throw new Error(
        'Background location permission is required for location alerts. ' +
          'Please enable "Always Allow" location access in your device settings.'
      );
    }

    const regions = Array.from(this.activeRegions.values()).map(region => ({
      identifier: region.id,
      latitude: region.latitude,
      longitude: region.longitude,
      radius: region.radius,
      notifyOnEnter: true,
      notifyOnExit: false, // Only notify on enter to reduce notification spam
    }));

    // Double-check regions array is not empty
    if (regions.length === 0) {
      console.log('🔴 No regions to monitor, stopping geofencing');
      await this.stopGeofencing();
      return;
    }

    try {
      // Ensure the task is defined before starting
      if (!TaskManager.isTaskDefined(GEOFENCE_TASK_NAME)) {
        console.log('🔴 Task not defined, cannot start geofencing');
        throw new Error('Geofencing task not defined');
      }

      // Stop existing geofencing task if running
      const isRegistered = await TaskManager.isTaskRegisteredAsync(GEOFENCE_TASK_NAME);
      console.log(`🔍 Task registered: ${isRegistered}`);

      if (isRegistered) {
        try {
          await Location.stopGeofencingAsync(GEOFENCE_TASK_NAME);
          // Small delay to ensure the task is fully stopped
          await new Promise(resolve => setTimeout(resolve, 100));
          console.log('🔄 Stopped existing geofencing task');
        } catch (stopError: any) {
          // Ignore E_TASK_NOT_FOUND errors
          if (!stopError.message || !stopError.message.includes('E_TASK_NOT_FOUND')) {
            console.error('🔴 Error stopping existing geofencing:', stopError);
          }
        }
      }

      // Start geofencing with new regions
      console.log(
        `🚀 Starting geofencing for ${regions.length} regions:`,
        regions.map(r => r.identifier)
      );
      await Location.startGeofencingAsync(GEOFENCE_TASK_NAME, regions);
      console.log(`🟢 Started geofencing for ${regions.length} regions`);
    } catch (error) {
      console.error('🔴 Failed to start geofencing:', error);
      throw error;
    }
  }

  async stopGeofencing() {
    try {
      const hasTask = await TaskManager.isTaskRegisteredAsync(GEOFENCE_TASK_NAME);
      console.log(`🔍 Stopping geofencing - Task registered: ${hasTask}`);

      if (hasTask) {
        // Check if the task is actually running before trying to stop it
        try {
          await Location.stopGeofencingAsync(GEOFENCE_TASK_NAME);
          console.log('🟢 Successfully stopped geofencing');
        } catch (stopError: any) {
          // If the error is E_TASK_NOT_FOUND, it's not really an error
          if (stopError.message && stopError.message.includes('E_TASK_NOT_FOUND')) {
            console.log('🟡 Geofencing task was not running (expected)');
          } else {
            // Re-throw other errors
            console.error('🔴 Error stopping geofencing task:', stopError);
            throw stopError;
          }
        }
      } else {
        console.log(
          '🟡 No geofencing task registered (this is normal when no geofences are active)'
        );
      }
    } catch (error) {
      console.error('🔴 Error checking geofencing task:', error);
    }
  }

  // Static method to handle geofence events in the background task
  private static async handleGeofenceEventStatic(
    eventType: Location.GeofencingEventType,
    region: Location.LocationRegion
  ) {
    try {
      const regionId = region.identifier || 'unknown';
      console.log(`🔈🔂[Geofencing] Event received: ${eventType} for region: ${regionId}`);

      // Load geofences from storage to get restaurant details
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (!data) {
        console.log(`[Geofencing] No geofences found in storage for region: ${regionId}`);
        return;
      }

      const regions: GeofenceRegion[] = JSON.parse(data);
      const geofence = regions.find(r => r.id === region.identifier);
      if (!geofence) {
        console.log(`↪️[Geofencing] Geofence not found for region: ${regionId}`);
        return;
      }

      console.log(`↪️[Geofencing] Found geofence for restaurant: ${geofence.restaurantName}`);

      // Only send notification for enter events
      if (eventType === Location.GeofencingEventType.Enter) {
        // Check if we've recently sent a notification for this restaurant
        const now = Date.now();
        const lastNotificationTime = await AsyncStorage.getItem(`last_notification_${geofence.id}`);
        const lastTime = lastNotificationTime ? parseInt(lastNotificationTime, 10) : 0;

        if (now - lastTime > NOTIFICATION_COOLDOWN) {
          // 5 minute cooldown
          console.log(`↪️ 🔈[Geofencing] Sending notification for: ${geofence.restaurantName}`);
          await Notifications.scheduleNotificationAsync({
            content: {
              title: getNotificationTitle(),
              body: getNotificationBody(
                geofence.restaurantName,
                GEOFENCE_RADIUS,
                undefined, // userLat
                undefined, // userLon
                geofence.latitude,
                geofence.longitude
              ),
              data: {
                restaurantId: geofence.restaurantId,
                restaurantName: geofence.restaurantName,
                eventType: 'enter',
              },
              sound: true,
            },
            trigger: null, // immediate
          });

          // Store the time of this notification
          await AsyncStorage.setItem(`last_notification_${geofence.id}`, now.toString());
          console.log(
            `↪️ 🔈[Geofencing] Notification sent successfully for: ${geofence.restaurantName}`
          );
        } else {
          console.log(
            `⤵️ 🔈[Geofencing] Skipping notification for ${geofence.restaurantName} - cooldown active`
          );
        }
      } else {
        console.log(`⤵️[Geofencing] Ignoring ${eventType} event for: ${geofence.restaurantName}`);
      }
    } catch (error) {
      console.error('🔴[Geofencing] Failed to handle geofence event:', error);
    }
  }

  private async handleGeofenceEvent(
    eventType: Location.GeofencingEventType,
    region: Location.LocationRegion
  ) {
    const regionId = region.identifier || 'unknown';
    console.log(`🔈↗️[Geofencing] Foreground event received: ${eventType} for region: ${regionId}`);

    const geofence = region.identifier ? this.activeRegions.get(region.identifier) : undefined;
    if (!geofence) {
      console.log(`⤵️[Geofencing] No active geofence found for region: ${regionId}`);
      return;
    }

    console.log(
      `🗺️↪️[Geofencing] Found active geofence for restaurant: ${geofence.restaurantName}`
    );

    if (eventType === Location.GeofencingEventType.Enter) {
      console.log(
        `↪️ 🔈[Geofencing] Sending foreground notification for: ${geofence.restaurantName}`
      );
      await Notifications.scheduleNotificationAsync({
        content: {
          title: getNotificationTitle(),
          body: getNotificationBody(
            geofence.restaurantName,
            GEOFENCE_RADIUS,
            undefined, // userLat
            undefined, // userLon
            geofence.latitude,
            geofence.longitude
          ),
          data: {
            restaurantId: geofence.restaurantId,
            restaurantName: geofence.restaurantName,
            eventType: 'enter',
          },
          sound: true,
        },
        trigger: null, // immediate
      });
      console.log(`↗️ 🔈[Geofencing] Foreground notification sent for: ${geofence.restaurantName}`);
    } else {
      console.log(
        `⤵️ ↘️[Geofencing] Ignoring foreground ${eventType} event for: ${geofence.restaurantName}`
      );
    }
  }

  private async saveGeofences() {
    const data = Array.from(this.activeRegions.values());
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  private async loadGeofences() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const regions: GeofenceRegion[] = JSON.parse(data);
        regions.forEach(region => {
          this.activeRegions.set(region.id, region);
        });
        console.log(`↪️ 🔄[Geofencing] Loaded ${regions.length} geofences from storage`);
      }
    } catch (error) {
      console.error('🔴[Geofencing] Failed to load geofences:', error);
    }
  }

  getActiveGeofences(): GeofenceRegion[] {
    return Array.from(this.activeRegions.values());
  }

  isGeofenceActive(restaurantId: string): boolean {
    return this.activeRegions.has(`geofence_${restaurantId}`);
  }

  // Get detailed status for debugging
  async getStatus() {
    const permissions = await this.checkPermissions();
    const activeCount = this.activeRegions.size;
    const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(GEOFENCE_TASK_NAME);

    return {
      isInitialized: this.isInitialized,
      permissions,
      activeGeofences: activeCount,
      taskRegistered: isTaskRegistered,
      regions: Array.from(this.activeRegions.values()).map(r => ({
        id: r.restaurantId,
        name: r.restaurantName,
        latitude: r.latitude,
        longitude: r.longitude,
        radius: r.radius,
      })),
    };
  }

  // Debug method to log current status
  async logStatus() {
    const status = await this.getStatus();
    console.log('🔄 ℹ[Geofencing] Current Status:', JSON.stringify(status, null, 2));
  }

  // Debug method to test geofencing functionality
  async testGeofencing() {
    console.log('🧪 Testing geofencing functionality...');

    try {
      // Check if task is defined
      const isTaskDefined = TaskManager.isTaskDefined(GEOFENCE_TASK_NAME);
      console.log(`🔍 Task defined: ${isTaskDefined}`);

      // Check if task is registered
      const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(GEOFENCE_TASK_NAME);
      console.log(`🔍 Task registered: ${isTaskRegistered}`);

      // Check permissions
      const permissions = await this.checkPermissions();
      console.log(`🔍 Permissions:`, permissions);

      // Check active geofences
      const activeCount = this.activeRegions.size;
      console.log(`🔍 Active geofences: ${activeCount}`);

      return {
        taskDefined: isTaskDefined,
        taskRegistered: isTaskRegistered,
        permissions,
        activeGeofences: activeCount,
        isInitialized: this.isInitialized,
      };
    } catch (error) {
      console.error('🔴 Error testing geofencing:', error);
      throw error;
    }
  }
}

// Ensure the task is defined when the module loads
if (!TaskManager.isTaskDefined(GEOFENCE_TASK_NAME)) {
  console.warn('🔴 Geofencing task not defined at module load - this should not happen');
} else {
  console.log('🟢 Geofencing task properly defined at module load');
}

// Add global debug functions for testing
if (__DEV__) {
  (globalThis as any).testGeofencing = async () => {
    try {
      const result = await GeofencingService.getInstance().testGeofencing();
      console.log('🧪 Global geofencing test result:', result);
      return result;
    } catch (error) {
      console.error('🔴 Global geofencing test failed:', error);
      throw error;
    }
  };

  (globalThis as any).addTestGeofence = async () => {
    try {
      const testRestaurant = {
        id: 'test-restaurant-123',
        name: 'Test Restaurant',
        latitude: 30.2672,
        longitude: -97.7431,
      };
      const result = await GeofencingService.getInstance().addGeofence(testRestaurant);
      console.log('📍 Added test geofence:', result);
      return result;
    } catch (error) {
      console.error('🔴 Failed to add test geofence:', error);
      throw error;
    }
  };
}

export default GeofencingService.getInstance();
