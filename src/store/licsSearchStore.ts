import { create } from 'zustand';
import { interVestaApi, VestaHouse, VestaSettlement, VestaStreet } from '../api/interVesta';

export type SearchStep = 'settlement' | 'street' | 'house' | 'apartment' | 'lics';

interface LicsSearchState {
  step: SearchStep;
  loading: boolean;
  
  settlements: VestaSettlement[];
  streets: VestaStreet[];
  houses: VestaHouse[];
  apartments: any[]; 
  lics: any[];       
  
  selectedSettlement: VestaSettlement | null;
  selectedStreet: VestaStreet | null;
  selectedHouse: VestaHouse | null;

  loadSettlements: (token: string) => Promise<void>;
  selectSettlement: (token: string, item: VestaSettlement) => Promise<void>;
  selectStreet: (token: string, item: VestaStreet) => Promise<void>;
  selectHouse: (item: VestaHouse) => void;
  selectApartment: (item: any) => void;
  
  resetSearch: () => void;
  goBack: () => void;
}

// 🔥 Хелпер для удаления дублей в результатах поиска
const getUniqueLics = (licsArray: any[]) => {
    if (!Array.isArray(licsArray)) return [];
    return licsArray.filter((lic, index, self) => 
        index === self.findIndex((t) => (
            // Считаем уникальным по коду или аккаунту
            (t.code || t.account) === (lic.code || lic.account)
        ))
    );
};

export const useLicsSearchStore = create<LicsSearchState>((set, get) => ({
  step: 'settlement',
  loading: false,

  settlements: [],
  streets: [],
  houses: [],
  apartments: [],
  lics: [],

  selectedSettlement: null,
  selectedStreet: null,
  selectedHouse: null,

  loadSettlements: async (token) => {
    if (get().settlements.length > 0) return; 
    set({ loading: true });
    try {
      const res = await interVestaApi.getSettlements(token);
      if (res.data) {
        let flatList: VestaSettlement[] = [];
        if (Array.isArray(res.data)) {
            res.data.forEach((u: any) => {
                if (u.settlements) {
                    flatList = [...flatList, ...u.settlements.map((s:any) => ({...s, ulus: u.ulus}))];
                } else {
                    flatList.push(u);
                }
            });
        }
        set({ settlements: flatList });
      }
    } catch (e) {
      console.error(e);
    } finally {
      set({ loading: false });
    }
  },

  selectSettlement: async (token, item) => {
    set({ loading: true, selectedSettlement: item });
    try {
      const res = await interVestaApi.getStreets(token, item.s_id);
      if (res.data) {
        set({ streets: res.data, step: 'street' });
      }
    } finally {
      set({ loading: false });
    }
  },

  selectStreet: async (token, item) => {
    set({ loading: true, selectedStreet: item });
    try {
      const res = await interVestaApi.getHouses(token, item.ids);
      if (res.data) {
        set({ houses: res.data, step: 'house' });
      }
    } finally {
      set({ loading: false });
    }
  },

  selectHouse: (item) => {
    set({ selectedHouse: item });
    
    // Частный дом (сразу л/с)
    if (item.lics && item.lics.length > 0) {
        // 🔥 Фильтруем дубли перед сохранением в стейт
        set({ lics: getUniqueLics(item.lics), step: 'lics' });
    } 
    // Многоквартирный (сначала квартиры)
    else if (item.apartments && item.apartments.length > 0) {
        set({ apartments: item.apartments, step: 'apartment' });
    } else {
        set({ lics: [], step: 'lics' });
    }
  },

  selectApartment: (item) => {
    // 🔥 Фильтруем дубли
    set({ lics: getUniqueLics(item.lics || []), step: 'lics' });
  },

  resetSearch: () => set({
    step: 'settlement',
    selectedSettlement: null,
    selectedStreet: null,
    selectedHouse: null,
    streets: [],
    houses: [],
    lics: []
  }),

  goBack: () => {
    const s = get().step;
    if (s === 'street') set({ step: 'settlement', selectedSettlement: null, streets: [] });
    if (s === 'house') set({ step: 'street', selectedStreet: null, houses: [] });
    if (s === 'apartment') set({ step: 'house', selectedHouse: null, apartments: [] });
    if (s === 'lics') {
        if (get().apartments.length > 0) {
            set({ step: 'apartment', lics: [] });
        } else {
            set({ step: 'house', selectedHouse: null, houses: [] });
        }
    }
  }
}));