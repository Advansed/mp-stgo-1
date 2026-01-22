import { create } from 'zustand';
import { licsApi } from '../api/licsApi';

interface LicsState {
  list: any[];
  loading: boolean;
  
  fetchLics: (token: string) => Promise<void>;
  addLicToUser: (token: string, lic: any) => Promise<{ success: boolean; message?: string }>;
  deleteLicFromUser: (token: string, licCode: string) => Promise<boolean>;
}

export const useLicsStore = create<LicsState>((set, get) => ({
  list: [],
  loading: false,

  fetchLics: async (token) => {
    set({ loading: true });
    try {
      const res = await licsApi.getLics(token);
      
      const isSuccess = res?.success === true || res?.error === false;
      const dataArr = Array.isArray(res?.data) ? res.data : (Array.isArray(res?.data?.data) ? res.data.data : []);

      if (isSuccess && Array.isArray(dataArr)) {
        // 🔥 ФИКС: Умная фильтрация дублей. 
        // Если прилетел null/undefined, не считаем их равными.
        const uniqueLics = dataArr.filter((lic: any, index: number, self: any[]) => 
            index === self.findIndex((t: any) => {
                const tCode = t.code || t.account || t.lic;
                const lCode = lic.code || lic.account || lic.lic;
                return tCode && lCode && tCode === lCode;
            })
        );
        
        set({ list: uniqueLics });
      } else {
         set({ list: [] });
      }
    } catch (e) {
      console.error(e);
      set({ list: [] });
    } finally {
      set({ loading: false });
    }
  },

  addLicToUser: async (token, lic) => {
      // Нормализуем код
      const lc = typeof lic === 'string' ? lic : (lic?.code || lic?.account || lic?.lic);

      // Проверка: есть ли уже такой в списке (чтобы не спамить API)
      const currentList = get().list;
      const exists = currentList.some((l: any) => {
          const existingCode = l.code || l.account || l.lic;
          return existingCode && existingCode === lc;
      });
      
      if (exists) return { success: true, message: 'Уже добавлен' };

      set({ loading: true });
      try {
          // Отправляем запрос
          const res = await licsApi.addLic(token, lic);
          
          // Проверяем успех
          const isSuccess = res?.success === true || res?.error === false;

          if (isSuccess) {
              // 🔥 ОБЯЗАТЕЛЬНО обновляем список с сервера
              await get().fetchLics(token);
              return { success: true };
          }
          return { success: false, message: res?.message || 'Ошибка сервера' };
      } catch (e: any) {
          console.error(e);
          return { success: false, message: e?.message || 'Ошибка сети' };
      } finally {
          set({ loading: false });
      }
  },

  deleteLicFromUser: async (token, licCode) => {
      set({ loading: true });
      try {
          const res = await licsApi.deleteLic(token, licCode);
          const isSuccess = res?.success === true || res?.error === false;
          
          if (isSuccess) {
              await get().fetchLics(token);
              return true;
          }
          return false;
      } finally {
          set({ loading: false });
      }
  }
}));