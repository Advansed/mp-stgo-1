import { post } from './http';
import { API_METHODS } from './endpoints';

export const actsApi = {
  // Получить список актов по заявке
  getByInvoice: async (token: string, invoiceId: string) => {
    return await post(API_METHODS.GET_ACTS, { token, invoice_id: invoiceId });
  },

  // Получить конкретный акт (полные данные)
  getById: async (token: string, invoiceId: string, actId: string) => {
    return await post(API_METHODS.GET_ACT, { token, invoice_id: invoiceId, act_id: actId });
  },

  // Создать/Обновить акт
  save: async (token: string, actData: any) => {
    return await post(API_METHODS.SET_ACT, { token, ...actData });
  },

  // Генерация PDF
  getPdf: async (token: string, templateHtml: string) => {
    return await post(API_METHODS.GET_PDF, { token, template: templateHtml });
  }
};