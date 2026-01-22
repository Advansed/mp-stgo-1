import { create } from 'zustand';
import { actsApi } from '../api/actsApi';

interface ActsState {
  list: any[];
  currentAct: any | null;
  loading: boolean;
  
  loadActs: (token: string, invoiceId: string) => Promise<void>;
  loadActDetails: (token: string, invoiceId: string, actId: string) => Promise<void>;
  
  // 🔥 Изменили тип возврата на Promise<any> (вернет объект акта или null)
  saveAct: (token: string, actData: any) => Promise<any>; 
  
  clearCurrentAct: () => void;
  setCurrentAct: (act: any) => void; // Новый метод
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

  saveAct: async (token, actData) => {
    set({ loading: true });
    try {
      const res = await actsApi.save(token, actData);
      
      if (res.success) {
        // Сервер обычно возвращает ID созданного акта в res.data
        // Или если это обновление, мы используем actData.id
        const savedAct = res.data || actData;
        
        // Обновляем список
        const list = get().list;
        const idx = list.findIndex(a => a.id === savedAct.id);
        
        let newList = [];
        if (idx >= 0) {
            newList = [...list];
            newList[idx] = { ...newList[idx], ...savedAct };
        } else {
            newList = [savedAct, ...list];
        }

        set({ list: newList, currentAct: savedAct, loading: false });
        return savedAct; // 🔥 Возвращаем сам акт!
      }
      set({ loading: false });
      return null;
    } catch (e) {
      console.error(e);
      set({ loading: false });
      return null;
    }
  },

  clearCurrentAct: () => set({ currentAct: null }),
  setCurrentAct: (act) => set({ currentAct: act })
}));