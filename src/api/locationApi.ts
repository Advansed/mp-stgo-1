import { post } from './http';
import { API_METHODS } from './endpoints';

export type LocationPayload = {
  lat: number;
  lon: number;
  speed?: number | null;
  heading?: number | null;
  battery_level?: number;
};

function round6(n: number): number {
  return Math.round(n * 1e6) / 1e6;
}

function cleanMetric(v: unknown): number | undefined {
  if (typeof v !== 'number' || !Number.isFinite(v) || v < 0) return undefined;
  return v;
}

export const locationApi = {
  sendLocation: async (token: string, coords: LocationPayload) => {
    const body: Record<string, unknown> = {
      token,
      lat: round6(coords.lat),
      lon: round6(coords.lon),
    };

    const speed = cleanMetric(coords.speed);
    if (speed !== undefined) body.speed = speed;

    const heading = cleanMetric(coords.heading);
    if (heading !== undefined) body.heading = heading;

    if (
      typeof coords.battery_level === 'number' &&
      Number.isFinite(coords.battery_level)
    ) {
      body.battery_level = Math.max(0, Math.min(100, Math.round(coords.battery_level)));
    }

    const parts = [
      `lat=${body.lat}`,
      `lon=${body.lon}`,
      body.speed !== undefined ? `speed=${body.speed}` : null,
      body.heading !== undefined ? `heading=${body.heading}` : null,
      body.battery_level !== undefined ? `battery_level=${body.battery_level}` : null,
    ].filter(Boolean);
    console.log(`[mp_set_location] payload: ${parts.join(' ')}`);

    return post(API_METHODS.SET_LOCATION, body);
  },
};
