import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import type { PluginListenerHandle } from '@capacitor/core';
import { locationApi } from '../api/locationApi';
import { useAuthStore } from '../store/authStore';
import { BackgroundLocation } from '../plugins/backgroundLocation';

const INTERVAL_MS = 5 * 60 * 1000;

let intervalId: ReturnType<typeof setInterval> | null = null;
let listenerHandle: PluginListenerHandle | null = null;
let running = false;
let tickInFlight = false;
let lastSentAt = 0;
let permissionAsked = false;
let settingsPrompted = false;

async function readBatteryLevel(): Promise<number | undefined> {
  try {
    const nav = navigator as Navigator & {
      getBattery?: () => Promise<{ level: number }>;
    };
    if (typeof nav.getBattery === 'function') {
      const bat = await nav.getBattery();
      if (typeof bat.level === 'number' && Number.isFinite(bat.level)) {
        return Math.round(bat.level * 100);
      }
    }
  } catch {
    // ignore
  }
  return undefined;
}

async function sendCoords(coords: {
  latitude: number;
  longitude: number;
  speed?: number | null;
  heading?: number | null;
}): Promise<void> {
  if (tickInFlight) return;
  const token = useAuthStore.getState().token;
  if (!token) {
    stopLocationTracking();
    return;
  }

  const now = Date.now();
  if (lastSentAt && now - lastSentAt < INTERVAL_MS - 1000) return;

  const { latitude, longitude, speed, heading } = coords;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;

  tickInFlight = true;
  try {
    const battery_level = await readBatteryLevel();
    await locationApi.sendLocation(token, {
      lat: latitude,
      lon: longitude,
      speed,
      heading,
      battery_level,
    });
    lastSentAt = Date.now();
  } catch (e) {
    console.warn('[locationTracking] send failed', e);
  } finally {
    tickInFlight = false;
  }
}

async function ensureWebPermission(): Promise<boolean> {
  try {
    let status = await Geolocation.checkPermissions();
    if (status.location === 'granted' || status.coarseLocation === 'granted') {
      return true;
    }
    if (permissionAsked && status.location === 'denied') {
      return false;
    }
    permissionAsked = true;
    status = await Geolocation.requestPermissions();
    return status.location === 'granted' || status.coarseLocation === 'granted';
  } catch (e) {
    console.warn('[locationTracking] permissions', e);
    return false;
  }
}

async function webTick(): Promise<void> {
  const token = useAuthStore.getState().token;
  if (!token) {
    stopLocationTracking();
    return;
  }

  try {
    const allowed = await ensureWebPermission();
    if (!allowed) return;

    const pos = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000,
    });

    await sendCoords({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      speed: pos.coords.speed,
      heading: pos.coords.heading,
    });
  } catch (e) {
    console.warn('[locationTracking] web tick failed', e);
  }
}

function startWebTracking(): void {
  void webTick();
  intervalId = setInterval(() => {
    void webTick();
  }, INTERVAL_MS);
}

async function startNativeTracking(): Promise<void> {
  listenerHandle = await BackgroundLocation.addListener('location', (point) => {
    void sendCoords({
      latitude: point.latitude,
      longitude: point.longitude,
      speed: point.speed,
      heading: point.heading,
    });
  });

  try {
    await BackgroundLocation.start({
      intervalMs: INTERVAL_MS,
      title: 'МП СТГО',
      message: 'Отслеживание местоположения',
    });
  } catch (e) {
    const err = e as { code?: string };
    console.warn('[locationTracking] native start failed', e);
    if (err?.code === 'NOT_AUTHORIZED' && !settingsPrompted) {
      settingsPrompted = true;
      console.warn(
        '[locationTracking] location permission denied; enable it in system settings'
      );
    }
    await stopNativeTracking();
    // Fallback so foreground still works if FGS start fails
    startWebTracking();
  }
}

async function stopNativeTracking(): Promise<void> {
  if (listenerHandle) {
    try {
      await listenerHandle.remove();
    } catch {
      // ignore
    }
    listenerHandle = null;
  }
  try {
    await BackgroundLocation.stop();
  } catch {
    // ignore
  }
}

function stopWebTracking(): void {
  if (intervalId != null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

export function startLocationTracking(): void {
  const token = useAuthStore.getState().token;
  if (!token) return;
  if (running) return;

  running = true;
  if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
    void startNativeTracking();
  } else {
    startWebTracking();
  }
}

export function stopLocationTracking(): void {
  stopWebTracking();
  void stopNativeTracking();
  running = false;
}

export function isLocationTrackingRunning(): boolean {
  return running;
}
