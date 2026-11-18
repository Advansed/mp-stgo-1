import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import type { PluginListenerHandle } from '@capacitor/core';
import { locationApi } from '../api/locationApi';
import { useAuthStore } from '../store/authStore';
import { BackgroundLocation } from '../plugins/backgroundLocation';

const INTERVAL_MS = 15 * 1000;

let intervalId: ReturnType<typeof setInterval> | null = null;
let listenerHandle: PluginListenerHandle | null = null;
let running = false;
let tickInFlight = false;
let lastSentAt = 0;
let permissionAsked = false;
let settingsPrompted = false;
let nativeStarted = false;

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
  source?: string;
}): Promise<void> {
  const source = coords.source ?? 'unknown';
  if (tickInFlight) {
    console.warn(`[locationTracking] skip (${source}): tick in flight`);
    return;
  }
  const token = useAuthStore.getState().token;
  if (!token) {
    console.warn(`[locationTracking] skip (${source}): no token`);
    stopLocationTracking();
    return;
  }

  const now = Date.now();
  if (lastSentAt && now - lastSentAt < INTERVAL_MS - 500) {
    console.log(
      `[locationTracking] skip (${source}): throttle ${Math.round((INTERVAL_MS - (now - lastSentAt)) / 1000)}s left`
    );
    return;
  }

  const { latitude, longitude, speed, heading } = coords;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    console.warn(`[locationTracking] skip (${source}): invalid coords`);
    return;
  }

  tickInFlight = true;
  try {
    const battery_level = await readBatteryLevel();
    const payload = {
      lat: latitude,
      lon: longitude,
      speed,
      heading,
      battery_level,
    };
    console.log(
      `[locationTracking] отправка (${source}): ` +
        `lat=${payload.lat} lon=${payload.lon}` +
        (payload.speed != null && Number.isFinite(payload.speed) ? ` speed=${payload.speed}` : '') +
        (payload.heading != null && Number.isFinite(payload.heading) ? ` heading=${payload.heading}` : '') +
        (payload.battery_level != null ? ` battery_level=${payload.battery_level}` : '')
    );
    await locationApi.sendLocation(token, payload);
    lastSentAt = Date.now();
    console.log('[locationTracking] отправлено ok');
  } catch (e) {
    console.warn('[locationTracking] send failed', e);
  } finally {
    tickInFlight = false;
  }
}

async function ensureWebPermission(): Promise<boolean> {
  // Browser: requestPermissions() is unimplemented; getCurrentPosition shows the prompt.
  if (!Capacitor.isNativePlatform()) {
    try {
      const status = await Geolocation.checkPermissions();
      if (status.location === 'denied') {
        console.warn(
          '[locationTracking] permissions denied (web). ' +
            'Разрешите геолокацию для этого сайта: замок слева от URL → ' +
            'Настройки сайта → Местоположение → Разрешить, затем обновите страницу.'
        );
        return false;
      }
      console.log(`[locationTracking] web permission state=${status.location}`);
    } catch (e) {
      console.log('[locationTracking] web permissions API unavailable, will try getCurrentPosition', e);
    }
    return true;
  }

  try {
    let status = await Geolocation.checkPermissions();
    if (status.location === 'granted' || status.coarseLocation === 'granted') {
      return true;
    }
    if (permissionAsked && status.location === 'denied') {
      console.warn('[locationTracking] permissions denied');
      return false;
    }
    permissionAsked = true;
    status = await Geolocation.requestPermissions();
    const ok =
      status.location === 'granted' || status.coarseLocation === 'granted';
    console.warn(`[locationTracking] permissions request => ${ok ? 'granted' : status.location}`);
    return ok;
  } catch (e) {
    console.warn('[locationTracking] permissions', e);
    return false;
  }
}

async function webTick(): Promise<void> {
  console.log('[locationTracking] web tick begin');
  const token = useAuthStore.getState().token;
  if (!token) {
    console.warn('[locationTracking] web tick: no token');
    stopLocationTracking();
    return;
  }

  try {
    const allowed = await ensureWebPermission();
    if (!allowed) return;

    console.log('[locationTracking] getCurrentPosition…');
    const pos = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000,
    });
    console.log(
      `[locationTracking] got position lat=${pos.coords.latitude} lon=${pos.coords.longitude}`
    );

    await sendCoords({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      speed: pos.coords.speed,
      heading: pos.coords.heading,
      source: 'geolocation',
    });
  } catch (e) {
    console.warn('[locationTracking] web tick failed', e);
  }
}

function startWebTracking(): void {
  if (intervalId != null) {
    void webTick();
    return;
  }
  console.log('[locationTracking] web interval start');
  void webTick();
  intervalId = setInterval(() => {
    void webTick();
  }, INTERVAL_MS);
}

async function startNativeTracking(): Promise<void> {
  try {
    listenerHandle = await BackgroundLocation.addListener('location', (point) => {
      console.log(
        `[locationTracking] listener point lat=${point.latitude} lon=${point.longitude}`
      );
      void sendCoords({
        latitude: point.latitude,
        longitude: point.longitude,
        speed: point.speed,
        heading: point.heading,
        source: 'native',
      });
    });

    await BackgroundLocation.start({
      intervalMs: INTERVAL_MS,
      title: 'МП СТГО',
      message: 'Отслеживание местоположения',
    });
    nativeStarted = true;
    console.log('[locationTracking] native start ok');
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
  if (nativeStarted) {
    try {
      await BackgroundLocation.stop();
    } catch {
      // ignore
    }
    nativeStarted = false;
  }
}

function stopWebTracking(): void {
  if (intervalId != null) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('[locationTracking] web interval stop');
  }
}

export function startLocationTracking(): void {
  const token = useAuthStore.getState().token;
  if (!token) {
    console.log('[locationTracking] start skipped: no token');
    return;
  }

  // Heal / re-arm after HMR, Strict Mode, or login while already marked running
  if (running) {
    console.log('[locationTracking] already running — force tick');
    startWebTracking();
    if (
      Capacitor.isNativePlatform() &&
      Capacitor.getPlatform() === 'android' &&
      !nativeStarted
    ) {
      void startNativeTracking();
    }
    return;
  }

  running = true;
  const platform = Capacitor.getPlatform();
  console.log(
    `[locationTracking] start platform=${platform} native=${Capacitor.isNativePlatform()}`
  );

  startWebTracking();

  if (Capacitor.isNativePlatform() && platform === 'android') {
    void startNativeTracking();
  }
}

export function stopLocationTracking(): void {
  if (!running && intervalId == null && !nativeStarted) return;
  console.log('[locationTracking] stop');
  stopWebTracking();
  void stopNativeTracking();
  running = false;
}

export function isLocationTrackingRunning(): boolean {
  return running;
}
