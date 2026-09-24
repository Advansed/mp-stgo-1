import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import {
  startLocationTracking,
  stopLocationTracking,
} from '../services/locationTracking';

/** Держит трекинг геолокации в sync с auth (в т.ч. при свёрнутом приложении на Android). */
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

  return null;
}
