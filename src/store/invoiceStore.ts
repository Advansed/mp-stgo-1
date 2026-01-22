// src/store/invoiceStore.ts
import { create } from 'zustand';
import { invoicesApi } from '../api/invoicesApi';
import { normalizeInvoice } from '../domain/normalizers';

interface InvoiceState {
  list: any[];
  loading: boolean;
  
  loadInvoices: (token: string) => Promise<void>;
  updateInvoiceAddress: (token: string, id: string, newAddress: string) => Promise<boolean>;
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
  }
}));