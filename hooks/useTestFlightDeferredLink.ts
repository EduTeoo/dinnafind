import * as Clipboard from 'expo-clipboard';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLIPBOARD_CHECK_KEY = 'dinnafind_clipboard_checked';

/**
 * TestFlight Deep Link Handler using Clipboard
 * 
 * This is a clever workaround for testing deferred deep links in TestFlight
 * without needing a backend service.
 */
export function useTestFlightDeferredLink(onDeepLink: (url: string) => void) {
  useEffect(() => {
    const checkClipboardForDeepLink = async () => {
      try {
        // Only check clipboard once per app install
        const hasChecked = await AsyncStorage.getItem(CLIPBOARD_CHECK_KEY);
        if (hasChecked) return;

        // Get clipboard content
        const clipboardContent = await Clipboard.getStringAsync();
        
        // Check if it's a DinnaFind deep link
        if (clipboardContent && clipboardContent.startsWith('dinnafind://')) {
          console.log('Found DinnaFind link in clipboard:', clipboardContent);
          
          // Mark as checked
          await AsyncStorage.setItem(CLIPBOARD_CHECK_KEY, 'true');
          
          // Clear clipboard for privacy
          await Clipboard.setStringAsync('');
          
          // Handle the deep link
          setTimeout(() => {
            onDeepLink(clipboardContent);
          }, 1000); // Small delay to ensure app is ready
        }
      } catch (error) {
        console.error('Error checking clipboard:', error);
      }
    };

    checkClipboardForDeepLink();
  }, [onDeepLink]);
}

// For testing: Copy deep link to clipboard before install
export async function prepareTestFlightDeepLink(url: string) {
  await Clipboard.setStringAsync(url);
  console.log('Deep link copied to clipboard for TestFlight test:', url);
}