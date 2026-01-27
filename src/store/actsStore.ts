import { create } from 'zustand';
import { actsApi } from '../api/actsApi';

type AnyObj = Record<string, any>;

const isPlainObject = (v: any): v is AnyObj => {
  return !!v && typeof v === 'object' && !Array.isArray(v);
};

const nowIso = () => new Date().toISOString();

/** Убираем undefined (сервер/SQL часто не любит undefined). */
const stripUndefinedShallow = (obj: AnyObj): AnyObj => {
  const out: AnyObj = {};
  for (const [k, v] of Object.entries(obj || {})) {
    if (v !== undefined) out[k] = v;
  }
  return out;
};

const withoutDetails = (obj: AnyObj): AnyObj => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { details, ...rest } = obj || {};
  return rest;
};

/**
 * Базовая нормализация payload под бэкенд mp_set_act.
 * В старом приложении эти поля всегда присутствовали.
 */
const normalizeActPayload = (actData: AnyObj): AnyObj => {
  const ts = nowIso();

  const base: AnyObj = {
    // Не даём упасть SQL на NOT NULL
    status: actData?.status || 'draft',
    document_scan_path: actData?.document_scan_path ?? '',
    title: actData?.title || actData?.type || 'Акт',
    created_at: actData?.created_at || ts,
    updated_at: ts,
  };

  // details: в старом это был «полный объект формы»
  const detailsFromAct = isPlainObject(actData?.details) ? actData.details : null;
  const details = stripUndefinedShallow(detailsFromAct || withoutDetails(actData));

  // Удаляем undefined на верхнем уровне, чтобы не слать "undefined" в JSON
  return stripUndefinedShallow({
    ...actData,
    ...base,
    details,
  });
};

interface ActsState {
  list: any[];
  currentAct: any | null;
  loading: boolean;

  loadActs: (token: string, invoiceId: string) => Promise<void>;
  loadActDetails: (token: string, invoiceId: string, actId: string) => Promise<void>;

  /** Получить/создать черновик акта по типу (сервер сам выдаёт act_number) */
  loadActDraft: (token: string, invoiceId: string, actType: string) => Promise<any | null>;

  // вернет объект акта или кинет ошибку
  saveAct: (token: string, actData: any) => Promise<any>;

  // «Отправить акты» — ставим status signed всем актам по заявке
  sendAllActs: (token: string, invoiceId: string) => Promise<void>;

  clearCurrentAct: () => void;
  setCurrentAct: (act: any) => void;
}

export const useActsStore = create<ActsState>((set, get) => ({
  list: [],
  currentAct: null,
  loading: false,

  loadActs: async (token, invoiceId) => {
    set({ loading: true });
    try {
      const res = await actsApi.getByInvoice(token, invoiceId);
      if (res.success) set({ list: res.data || [] });
    } finally {
      set({ loading: false });
    }
  },

  loadActDetails: async (token, invoiceId, actId) => {
    set({ loading: true, currentAct: null });
    try {
      const res = await actsApi.getById(token, invoiceId, actId);
      if (res.success) set({ currentAct: res.data });
    } finally {
      set({ loading: false });
    }
  },

  loadActDraft: async (token, invoiceId, actType) => {
    set({ loading: true, currentAct: null });
    try {
      const res = await actsApi.getByType(token, invoiceId, actType);
      if (res.success) {
        set({ currentAct: res.data, loading: false });
        return res.data;
      }
      set({ loading: false });
      return null;
    } catch (e) {
      console.error(e);
      set({ loading: false });
      return null;
    }
  },

  saveAct: async (token, actData) => {
    set({ loading: true });
    try {
      const payload = normalizeActPayload(actData);
      const res = await actsApi.save(token, payload);

      if (res.success) {
        const savedAct = res.data || payload;

        const list = get().list;
        const idx = list.findIndex((a) => a.id === savedAct.id);

        let newList: any[] = [];
        if (idx >= 0) {
          newList = [...list];
          newList[idx] = { ...newList[idx], ...savedAct };
        } else {
          newList = [savedAct, ...list];
        }

        set({ list: newList, currentAct: savedAct, loading: false });
        return savedAct;
      }

      set({ loading: false });
      throw new Error(res.message || 'Не удалось сохранить акт');
    } catch (e) {
      console.error(e);
      set({ loading: false });
      throw e;
    }
  },

  sendAllActs: async (token, invoiceId) => {
    set({ loading: true });
    try {
      const acts = get().list || [];
      if (acts.length === 0) return;

      for (const a of acts) {
        const actId = a?.id;
        if (!actId) continue;

        // берем полный акт, если список вернул "шапку"
        const fullRes = await actsApi.getById(token, invoiceId, String(actId));
        const fullAct = fullRes.success ? (fullRes.data || a) : a;

        const payload = normalizeActPayload({
          ...fullAct,
          invoice_id: invoiceId,
          status: 'signed',
        });

        const saveRes = await actsApi.save(token, payload);
        if (!saveRes.success) {
          throw new Error(saveRes.message || 'Не удалось отправить акты');
        }
      }

      // Перезагружаем список
      const res = await actsApi.getByInvoice(token, invoiceId);
      if (res.success) set({ list: res.data || [] });
    } finally {
      set({ loading: false });
    }
  },

  clearCurrentAct: () => set({ currentAct: null }),
  setCurrentAct: (act) => set({ currentAct: act }),
}));
