import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  sessionApi,
  readCloseResult,
  readOpenResult,
  readSessionState,
  type WorkSession,
} from '../api/sessionApi';
import { useAuthStore } from './authStore';

type SessionAction = 'idle' | 'refreshing' | 'opening' | 'closing';

interface SessionState {
  isOpen: boolean;
  session: WorkSession | null;
  action: SessionAction;
  error: string | null;
  /** get_session уже ответил в этом запуске. Не пишется в localStorage. */
  settled: boolean;

  refresh: (token: string) => Promise<void>;
  open: (token: string) => Promise<{ success: boolean; message?: string }>;
  close: (token: string) => Promise<{ success: boolean; message?: string }>;
  clear: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      session: null,
      action: 'idle',
      error: null,
      settled: false,

      refresh: async (token) => {
        if (!token || get().action === 'opening' || get().action === 'closing') return;
        set({ action: 'refreshing', error: null });
        const res = await sessionApi.getSession(token);
        if (useAuthStore.getState().token !== token) {
          if (get().action === 'refreshing') set({ action: 'idle' });
          return;
        }
        if (get().action === 'opening' || get().action === 'closing') return;

        const read = readSessionState(res);
        if (read.state === 'error') {
          set({ action: 'idle', error: read.message, settled: true });
          return;
        }
        if (read.state === 'open') {
          set({ isOpen: true, session: read.session, action: 'idle', error: null, settled: true });
          return;
        }
        set({ isOpen: false, session: null, action: 'idle', error: null, settled: true });
      },

      open: async (token) => {
        if (!token) return { success: false, message: 'Нет авторизации' };
        if (get().action === 'opening' || get().action === 'closing') {
          return { success: false, message: 'Подождите' };
        }

        set({ action: 'opening', error: null });
        const res = await sessionApi.openSession(token);
        if (useAuthStore.getState().token !== token) {
          if (get().action === 'opening') set({ action: 'idle' });
          return { success: false };
        }
        const read = readOpenResult(res);

        if (read.already) {
          set({ action: 'idle' });
          await get().refresh(token);
          if (get().isOpen) return { success: true };
          const message = read.message || 'Не удалось открыть смену';
          set({ error: message, settled: true });
          return { success: false, message };
        }

        if (!read.ok) {
          const message = read.message || 'Не удалось открыть смену';
          set({ action: 'idle', error: message, settled: true });
          return { success: false, message };
        }

        set({
          isOpen: true,
          session: read.session ?? { status: 'open' },
          action: 'idle',
          error: null,
          settled: true,
        });
        return { success: true };
      },

      close: async (token) => {
        if (!token) return { success: false, message: 'Нет авторизации' };
        if (get().action === 'opening' || get().action === 'closing') {
          return { success: false, message: 'Подождите' };
        }

        set({ action: 'closing', error: null });
        const res = await sessionApi.closeSession(token);
        if (useAuthStore.getState().token !== token) {
          if (get().action === 'closing') set({ action: 'idle' });
          return { success: false };
        }
        const read = readCloseResult(res);
        if (!read.ok) {
          const message = read.message || 'Не удалось закрыть смену';
          set({ action: 'idle', error: message, settled: true });
          return { success: false, message };
        }

        set({ isOpen: false, session: null, action: 'idle', error: null, settled: true });
        return { success: true };
      },

      clear: () =>
        set({ isOpen: false, session: null, action: 'idle', error: null, settled: false }),
    }),
    {
      name: 'mp-stgo-session',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ isOpen: state.isOpen, session: state.session }),
    }
  )
);
