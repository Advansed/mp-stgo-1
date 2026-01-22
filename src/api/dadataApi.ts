// src/api/dadataApi.ts

// 🔥 Берем из .env
const DADATA_TOKEN = import.meta.env.VITE_DADATA_TOKEN;

// Проверка для разработчика (чтобы не тупить, если забыл создать файл)
if (!DADATA_TOKEN) {
  console.error("⚠️ Внимание! Не найден VITE_DADATA_TOKEN в файле .env");
}

export interface DaDataSuggestion {
  value: string;
  unrestricted_value: string;
  data: {
    geo_lat?: string;
    geo_lon?: string;
    city?: string;
    street?: string;
    house?: string;
  };
}

export const dadataApi = {
  getSuggestions: async (query: string): Promise<DaDataSuggestion[]> => {
    if (!query || query.length < 3) return [];
    if (!DADATA_TOKEN) return []; // Защита

    try {
      const response = await fetch("https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Token " + DADATA_TOKEN
        },
        body: JSON.stringify({ query: query, count: 5 })
      });

      const json = await response.json();
      return json.suggestions || [];
    } catch (error) {
      console.error("DaData error:", error);
      return [];
    }
  },

  geolocate: async (lat: number, lon: number): Promise<DaDataSuggestion | null> => {
    if (!DADATA_TOKEN) return null;

    try {
      const response = await fetch("https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Token " + DADATA_TOKEN
        },
        body: JSON.stringify({ lat, lon, count: 1 })
      });

      const json = await response.json();
      return json.suggestions?.[0] || null;
    } catch (error) {
      console.error("DaData Geo error:", error);
      return null;
    }
  }
};