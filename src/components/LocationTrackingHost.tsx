import { useEffect } from 'react';
import { App as CapApp } from '@capacitor/app';
import { useAuthStore } from '../store/authStore';
import {
  pauseLocationTracking,
  resumeLocationTracking,
  startLocationTracking,
  stopLocationTracking,
} from '../services/locationTracking';

/** Держит трекинг геолокации в sync с auth и состоянием приложения. */
export function LocationTrackingHost() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (isAuthenticated && token) {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }
    return () => {
      stopLocationTracking();
    };
  }, [isAuthenticated, token]);

  useEffect(() => {
    let handle: { remove: () => Promise<void> } | undefined;

    CapApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive && useAuthStore.getState().token) {
        resumeLocationTracking();
      } else {
        pauseLocationTracking();
      }
    }).then((h) => {
      handle = h;
    });

    return () => {
      void handle?.remove();
    };
  }, []);

  return null;
}
