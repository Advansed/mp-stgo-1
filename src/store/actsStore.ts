import { create } from 'zustand';
import { actsApi } from '../api/actsApi';
import { toDetailsObject as toDetails } from '../domain/objects';
import type { Act } from '../domain/types';

type AnyObj = Record<string, any>;

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

const toDetailsObject = (details: any): AnyObj => toDetails(details) as AnyObj;

const META_KEYS = new Set([
  'id',
  'type',
  'invoice_id',
  'act_number',
  'act_date',
  'created_at',
  'updated_at',
  'status',
  'title',
  'document_scan_path',
  'details',
]);

const stripMetaKeys = (obj: AnyObj): AnyObj => {
  const out: AnyObj = {};
  for (const [k, v] of Object.entries(obj || {})) {
    if (META_KEYS.has(k)) continue;
    if (k === '0') continue;
    out[k] = v;
  }
  return out;
};

/**
 * Базовая нормализация payload под бэкенд mp_set_act.
 * В старом приложении эти поля всегда присутствовали.
 */
const normalizeActPayload = (actData: AnyObj): AnyObj => {
  const ts = nowIso();

  // 1) Забираем details в виде объекта (поддерживаем массивы и {0:{...}})
  const detailsObj = toDetailsObject(actData?.details);

  // 2) Мета-данные: берем верхний уровень, а если нет — вытаскиваем из details
  const id = actData?.id ?? detailsObj?.id;
  const type = actData?.type ?? detailsObj?.type;
  const invoice_id = actData?.invoice_id ?? detailsObj?.invoice_id;
  const act_number = actData?.act_number ?? detailsObj?.act_number;
  const act_date = actData?.act_date ?? detailsObj?.act_date;
  const status = actData?.status ?? detailsObj?.status ?? 'draft';
  const title = actData?.title ?? detailsObj?.title ?? type ?? 'Акт';
  const document_scan_path = actData?.document_scan_path ?? detailsObj?.document_scan_path ?? '';
  const created_at = actData?.created_at ?? detailsObj?.created_at ?? ts;

  // 3) Поля формы могут приходить плоско (owner_name, mr1_model...) — собираем их в details.
  //    Приоритет: то, что явно пришло в actData.details, должно побеждать плоские поля.
  const fromFlat = stripMetaKeys(withoutDetails(actData));
  const fromDetails = stripMetaKeys(detailsObj);
  const details = stripUndefinedShallow({ ...fromFlat, ...fromDetails });

  // 4) Совместимость с бэком: дублируем ключевые поля наверх, если они есть в details.
  const up: AnyObj = {
    lic: actData?.lic ?? details.lic,
    owner_name: actData?.owner_name ?? details.owner_name,
    owner_phone: actData?.owner_phone ?? details.owner_phone,
    object_address: actData?.object_address ?? details.object_address,
    technician_name: actData?.technician_name ?? details.technician_name,
    technician_position: actData?.technician_position ?? details.technician_position,
    object_type: actData?.object_type ?? details.object_type,
  };

  return stripUndefinedShallow({
    ...stripMetaKeys(actData),
    ...up,

    id,
    type,
    invoice_id,
    act_number,
    act_date,

    status,
    title,
    document_scan_path,
    created_at,
    updated_at: ts,

    details,
  });
};

interface ActsState {
  list: Act[];
  currentAct: Act | null;
  loading: boolean;

  loadActs: (token: string, invoiceId: string) => Promise<void>;
  loadActDetails: (token: string, invoiceId: string, actId: string) => Promise<void>;
  loadActDraft: (token: string, invoiceId: string, actType: string) => Promise<Act | null>;
  saveAct: (token: string, actData: AnyObj) => Promise<Act>;
  clearCurrentAct: () => void;
  setCurrentAct: (act: Act) => void;
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

        let newList: Act[] = [];
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
      throw new Error(res.description || res.message || 'Не удалось сохранить акт');
    } catch (e) {
      console.error(e);
      set({ loading: false });
      throw e;
    }
  },

  clearCurrentAct: () => set({ currentAct: null }),
  setCurrentAct: (act) => set({ currentAct: act }),
}));
