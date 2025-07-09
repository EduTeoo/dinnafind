import { Middleware } from '@reduxjs/toolkit';
import GeofencingService from '@/services/GeofencingService';
import { addToBucketList, removeFromBucketList } from './slices/bucketListSlice';

export const geofencingMiddleware: Middleware = store => next => action => {
  const result = next(action);

  if (addToBucketList.fulfilled.match(action)) {
    const item = action.payload;
    if (item.notificationsEnabled && item.venue?.coordinates) {
      GeofencingService.addGeofence({
        id: item.id,
        name: item.venue.name,
        latitude: item.venue.coordinates.latitude,
        longitude: item.venue.coordinates.longitude,
      });
    }
  }

  if (removeFromBucketList.fulfilled.match(action)) {
    const itemId = action.payload;
    GeofencingService.removeGeofence(itemId);
  }

  return result;
};
