import { post } from './http';
import { API_METHODS } from './endpoints';
import type { Act } from '../domain/types';

export const actsApi = {
  getByInvoice: async (token: string, invoiceId: string) => {
    return await post<Act[]>(API_METHODS.GET_ACTS, { token, invoice_id: invoiceId });
  },

  getById: async (token: string, invoiceId: string, actId: string) => {
    return await post<Act>(API_METHODS.GET_ACT, { token, invoice_id: invoiceId, act_id: actId });
  },

  getByType: async (token: string, invoiceId: string, actType: string) => {
    return await post<Act>(API_METHODS.GET_ACT, { token, invoice_id: invoiceId, act_type: actType });
  },

  save: async (token: string, actData: Record<string, unknown>) => {
    return await post<Act>(API_METHODS.SET_ACT, { token, ...actData });
  },

  getPdf: async (token: string, templateHtml: string) => {
    return await post<string>(API_METHODS.GET_PDF, { token, template: templateHtml });
  }
};
