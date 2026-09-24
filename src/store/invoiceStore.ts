// src/store/invoiceStore.ts
import { create } from 'zustand';
import { invoicesApi } from '../api/invoicesApi';
import { normalizeInvoice } from '../domain/normalizers';
import type { Invoice } from '../domain/types';

interface InvoiceState {
  list: Invoice[];
  loading: boolean;

  loadInvoices: (token: string) => Promise<void>;
  ensureById: (token: string, id: string) => Promise<Invoice | null>;
  updateInvoiceAddress: (token: string, id: string, newAddress: string) => Promise<boolean>;
  setInvoiceStatus: (
    token: string,
    id: string,
    status: string,
    completeText?: string
  ) => Promise<{ success: boolean; message?: string }>;
}

export const useInvoiceStore = create<InvoiceState>((set, get) => ({
  list: [],
  loading: false,

  loadInvoices: async (token) => {
    set({ loading: true });
    try {
      const data = await invoicesApi.fetchAll(token);
      set({ list: data });
    } catch (e) {
      console.error(e);
    } finally {
      set({ loading: false });
    }
  },

  ensureById: async (token, id) => {
    const found = get().list.find((inv) => String(inv.id) === String(id));
    if (found) return found;
    await get().loadInvoices(token);
    return get().list.find((inv) => String(inv.id) === String(id)) || null;
  },

  updateInvoiceAddress: async (token, id, newAddress) => {
    // 1. Оптимистичное обновление (сразу меняем в UI)
    const originalList = get().list;
    set(state => ({
      list: state.list.map(inv => {
        if (inv.id === id) {
            // Используем нормализатор, чтобы структура осталась правильной
            return normalizeInvoice({ ...inv, address: newAddress, Адрес: newAddress });
        }
        return inv;
      })
    }));

    // 2. Отправка на сервер
    const res = await invoicesApi.updateAddress(token, id, newAddress);
    
    if (!res.success) {
      // Если ошибка - откатываем назад
      console.error("Ошибка обновления адреса", res.message);
      set({ list: originalList });
      return false;
    }
    return true;
  },

  setInvoiceStatus: async (token, id, status, completeText) => {
    const originalList = get().list;
    const complete_date = new Date().toISOString().split('T')[0];
    const complete_text = (completeText ?? status).trim() || status;

    set((state) => ({
      list: state.list.map((inv) =>
        inv.id === id
          ? normalizeInvoice({ ...inv, status, complete_text, complete_date })
          : inv
      ),
    }));

    const res = await invoicesApi.setStatus(token, id, status, complete_text);
    if (!res.success) {
      set({ list: originalList });
      return {
        success: false,
        message: res.message || res.description || 'Не удалось изменить статус',
      };
    }
    return { success: true };
  },
}));