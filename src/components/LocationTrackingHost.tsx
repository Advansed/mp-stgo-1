import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useSessionStore } from '../store/sessionStore';
import {
  startLocationTracking,
  stopLocationTracking,
} from '../services/locationTracking';

/** Трекинг только при открытой смене (и пока пользователь авторизован). */
export function LocationTrackingHost() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const token = useAuthStore((s) => s.token);
  const isOpen = useSessionStore((s) => s.isOpen);
  const refresh = useSessionStore((s) => s.refresh);
  const [authHydrated, setAuthHydrated] = useState(() =>
    useAuthStore.persist.hasHydrated()
  );
  const [sessionHydrated, setSessionHydrated] = useState(() =>
    useSessionStore.persist.hasHydrated()
  );

  useEffect(() => {
    setAuthHydrated(useAuthStore.persist.hasHydrated());
    return useAuthStore.persist.onFinishHydration(() => setAuthHydrated(true));
  }, []);

  useEffect(() => {
    setSessionHydrated(useSessionStore.persist.hasHydrated());
    return useSessionStore.persist.onFinishHydration(() => setSessionHydrated(true));
  }, []);

  useEffect(() => {
    if (!authHydrated || !sessionHydrated) return;
    if (isAuthenticated && token) {
      void refresh(token);
    }
  }, [authHydrated, sessionHydrated, isAuthenticated, token, refresh]);

  useEffect(() => {
    if (!authHydrated || !sessionHydrated) {
      console.log('[LocationTrackingHost] waiting for hydrate');
      return;
    }

    if (isAuthenticated && token && isOpen) {
      console.log('[LocationTrackingHost] start (shift open)');
      startLocationTracking();
    } else {
      console.log('[LocationTrackingHost] stop (shift closed or logged out)');
      stopLocationTracking();
    }
  }, [authHydrated, sessionHydrated, isAuthenticated, token, isOpen]);

  return null;
}
