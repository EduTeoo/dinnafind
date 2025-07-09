import { supabase } from '@/utils/supabase';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';

// This ensures the browser dismisses properly after auth
WebBrowser.maybeCompleteAuthSession();

export const signInWithGoogle = async () => {
  try {
    // Create redirect URI based on environment
    const isExpoGo = Constants.appOwnership === 'expo';
    const redirectUrl = isExpoGo
      ? `https://auth.expo.io/@${Constants.manifest?.owner || 'your-username'}/dinnafind`
      : 'dinnafind://auth-callback';

    // Request OAuth URL from Supabase
    const response = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          prompt: 'select_account',
          access_type: 'offline',
        },
        skipBrowserRedirect: true,
      },
    });

    if (response.error) {
      return {
        success: false,
        error: response.error.message,
      };
    }

    if (!response.data?.url) {
      return {
        success: false,
        error:
          'No authentication URL received. Please ensure Google OAuth is configured in Supabase.',
      };
    }

    // Open auth session
    const authSession = await WebBrowser.openAuthSessionAsync(response.data.url, redirectUrl, {
      showInRecents: true,
    });

    if (authSession.type === 'success' && authSession.url) {
      // Parse tokens from the callback URL
      const url = authSession.url;
      if (url.includes('#')) {
        const fragment = url.split('#')[1];
        const params = new URLSearchParams(fragment);
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');

        if (access_token && refresh_token) {
          // Set the session manually
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (error) {
            return { success: false, error: error.message };
          }

          // Double-check the session was created
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session) {
            return { success: true, user: session.user };
          }
        }
      }

      // If we couldn't parse tokens, wait and check for session
      await new Promise(resolve => setTimeout(resolve, 2000));

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        return { success: true, user: session.user };
      } else {
        return {
          success: false,
          error: 'Authentication completed but no session was created. Please try again.',
        };
      }
    } else if (authSession.type === 'cancel') {
      return { success: false, error: 'Authentication was cancelled' };
    } else {
      return { success: false, error: 'Authentication failed' };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

// Sign out function
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Sign out failed',
    };
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    return null;
  }
};
