import { Geolocation } from '@capacitor/geolocation';
import { locationApi } from '../api/locationApi';
import { useAuthStore } from '../store/authStore';

const INTERVAL_MS = 5 * 60 * 1000;

let intervalId: ReturnType<typeof setInterval> | null = null;
let running = false;
let tickInFlight = false;
let lastSentAt = 0;
let permissionAsked = false;

async function ensurePermission(): Promise<boolean> {
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

async function tick(): Promise<void> {
  if (tickInFlight) return;
  const token = useAuthStore.getState().token;
  if (!token) {
    stopLocationTracking();
    return;
  }

  const now = Date.now();
  if (lastSentAt && now - lastSentAt < INTERVAL_MS - 1000) return;

  tickInFlight = true;
  try {
    const allowed = await ensurePermission();
    if (!allowed) return;

    const pos = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000,
    });

    const { latitude, longitude, speed, heading } = pos.coords;
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;

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
    console.warn('[locationTracking] tick failed', e);
  } finally {
    tickInFlight = false;
  }
}

export function startLocationTracking(): void {
  const token = useAuthStore.getState().token;
  if (!token) return;
  if (running) return;

  running = true;
  void tick();
  intervalId = setInterval(() => {
    void tick();
  }, INTERVAL_MS);
}

export function stopLocationTracking(): void {
  if (intervalId != null) {
    clearInterval(intervalId);
    intervalId = null;
  }
  running = false;
}

export function pauseLocationTracking(): void {
  stopLocationTracking();
}

export function resumeLocationTracking(): void {
  if (!useAuthStore.getState().token) return;
  startLocationTracking();
}

export function isLocationTrackingRunning(): boolean {
  return running;
}
