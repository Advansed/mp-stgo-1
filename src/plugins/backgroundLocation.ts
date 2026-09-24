import { registerPlugin, type PluginListenerHandle } from '@capacitor/core';

export type BackgroundLocationPoint = {
  latitude: number;
  longitude: number;
  speed?: number | null;
  heading?: number | null;
};

export type BackgroundLocationStartOptions = {
  intervalMs?: number;
  title?: string;
  message?: string;
};

export interface BackgroundLocationPlugin {
  start(options?: BackgroundLocationStartOptions): Promise<void>;
  stop(): Promise<void>;
  addListener(
    eventName: 'location',
    listenerFunc: (point: BackgroundLocationPoint) => void
  ): Promise<PluginListenerHandle>;
}

export const BackgroundLocation = registerPlugin<BackgroundLocationPlugin>(
  'BackgroundLocation'
);
