import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface GeofenceToggleProps {
  restaurant: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  };
  style?: any;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function GeofenceToggle({ restaurant, style, enabled, onToggle }: GeofenceToggleProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handlePress = async () => {
    setIsLoading(true);
    try {
      onToggle(!enabled);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style, enabled && styles.active]}
      onPress={handlePress}
      disabled={isLoading}
    >
      <View style={styles.content}>
        <Ionicons
          name={enabled ? 'location' : 'location-outline'}
          size={20}
          color={enabled ? '#fff' : '#007AFF'}
        />
        <Text style={[styles.text, enabled && styles.activeText]}>
          {enabled ? 'Notifications On' : 'Enable Alerts'}
        </Text>
      </View>
      {isLoading && (
        <ActivityIndicator
          size="small"
          color={enabled ? '#fff' : '#007AFF'}
          style={styles.loader}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
  },
  active: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
  activeText: {
    color: '#fff',
  },
  loader: {
    marginLeft: 8,
  },
});
