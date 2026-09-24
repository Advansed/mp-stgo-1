import { getData } from './http';
import { VESTA_METHODS } from './endpoints';

// Типы ответов от Vesta
export interface VestaSettlement {
  s_id: string;
  settlement: string;
  ulus: string;
  // В старом коде улусы и поселения были смешаны, 
  // но Vesta обычно отдает плоский список или группированный
}

export interface VestaStreet {
  ids: string[]; // Массив ID (странность 1С)
  street: string;
}

export interface VestaHouse {
  house: string;
  lics?: any[];      // Если частный дом
  apartments?: any[]; // Если многоквартирный
}

export const interVestaApi = {
  // 1. Получить населенные пункты (обычно кешируется)
  getSettlements: async (token: string) => {
    return await getData(VESTA_METHODS.SETTLEMENTS, { token });
  },

  getStreets: async (token: string, settlementId: string) => {
    return await getData(VESTA_METHODS.STREETS, { token, s_id: settlementId });
  },

  getHouses: async (token: string, streetIds: string[]) => {
    return await getData(VESTA_METHODS.HOUSES, { token, ids: streetIds });
  }
};