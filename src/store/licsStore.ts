import { create } from 'zustand';
import { licsApi } from '../api/licsApi';
import { unwrapLic, unwrapLicList } from '../domain/objects';
import type { Lic } from '../domain/types';
import { getLicCode } from '../utils/licsFormat';

interface LicsState {
  list: Lic[];
  byCode: Record<string, Lic>;
  loading: boolean;

  fetchLics: (token: string) => Promise<void>;
  fetchByCode: (token: string, code: string) => Promise<Lic | null>;
  addLicToUser: (token: string, lic: Lic | string) => Promise<{ success: boolean; message?: string }>;
  deleteLicFromUser: (token: string, licCode: string) => Promise<boolean>;
}

export const useLicsStore = create<LicsState>((set, get) => ({
  list: [],
  byCode: {},
  loading: false,

  fetchLics: async (token) => {
    set({ loading: true });
    try {
      const res = await licsApi.getLics(token);
      const list = unwrapLicList(res) as Lic[];
      const byCode = { ...get().byCode };
      for (const lic of list) {
        const code = getLicCode(lic);
        if (code) byCode[code] = lic;
      }
      set({ list, byCode });
    } catch (e) {
      console.error(e);
      set({ list: [] });
    } finally {
      set({ loading: false });
    }
  },

  fetchByCode: async (token, code) => {
    const key = String(code || '').trim();
    if (!key) return null;

    const cached = get().byCode[key];
    if (cached) return cached;

    try {
      const res = await licsApi.getLic(token, key);
      let lic = unwrapLic(res) as Lic | null;

      if (!lic) {
        const list = get().list.length
          ? get().list
          : (unwrapLicList(await licsApi.getLics(token)) as Lic[]);
        if (!get().list.length && list.length) set({ list });
        lic = list.find((item) => getLicCode(item) === key) || null;
      }

      if (!lic) return null;
      const next = { ...get().byCode, [key]: lic };
      const canonical = getLicCode(lic);
      if (canonical && canonical !== key) next[canonical] = lic;
      set({ byCode: next });
      return lic;
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  addLicToUser: async (token, lic) => {
    const lc = getLicCode(lic);
    if (!lc) return { success: false, message: 'Пустой код лицевого счёта' };

    if (!get().list.length) {
      await get().fetchLics(token);
    }

    const currentList = get().list;
    const exists = currentList.some((l) => getLicCode(l) === lc);
    if (exists) return { success: true, message: 'Уже добавлен' };

    const payload =
      typeof lic === 'string'
        ? ({ code: lc, account: lc, lic: lc } as Lic)
        : ({ ...lic, code: lc, account: lc, lic: lc } as Lic);

    // Оптимистично в список — без ожидания полного get_lics
    set({
      list: [payload, ...currentList],
      byCode: { ...get().byCode, [lc]: payload },
    });

    try {
      const res = await licsApi.addLic(token, lic);
      const isSuccess = res?.success === true;
      const msg = String(res?.message || '').toLowerCase();
      const alreadyOnServer =
        msg.includes('уже') || msg.includes('exist') || msg.includes('already');

      if (isSuccess || alreadyOnServer) {
        void get().fetchByCode(token, lc);
        return { success: true };
      }

      set({
        list: currentList,
        byCode: Object.fromEntries(Object.entries(get().byCode).filter(([k]) => k !== lc)),
      });
      return { success: false, message: res?.message || 'Ошибка сервера' };
    } catch (e: any) {
      console.error(e);
      set({
        list: currentList,
        byCode: Object.fromEntries(Object.entries(get().byCode).filter(([k]) => k !== lc)),
      });
      return { success: false, message: e?.message || 'Ошибка сети' };
    }
  },

  deleteLicFromUser: async (token, licCode) => {
    const code = String(licCode || '').trim();
    if (!code) return false;

    const prevList = get().list;
    const prevByCode = get().byCode;
    const nextList = prevList.filter((l) => getLicCode(l) !== code);
    const nextByCode = { ...prevByCode };
    delete nextByCode[code];

    // Сразу убираем из UI — без loading и без полного refetch
    set({ list: nextList, byCode: nextByCode });

    try {
      const res = await licsApi.deleteLic(token, code);
      if (res?.success === true) return true;

      set({ list: prevList, byCode: prevByCode });
      return false;
    } catch (e) {
      console.error(e);
      set({ list: prevList, byCode: prevByCode });
      return false;
    }
  },
}));
