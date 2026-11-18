// src/api/invoicesApi.ts
import { post } from './http';
import { normalizeInvoice } from '../domain/normalizers';
import { API_METHODS } from './endpoints';
import type { Invoice } from '../domain/types';

export const invoicesApi = {
  fetchAll: async (token: string): Promise<Invoice[]> => {
    const res = await post(API_METHODS.INVOICES, { token });
    if (res.success && Array.isArray(res.data)) {
      return res.data.map(normalizeInvoice);
    }
    return [];
  },

  updateAddress: async (token: string, id: string, address: string) => {
    const looksMissing = (res: { success?: boolean; description?: string; message?: string }) =>
      !res.success &&
      ((res.description || res.message || '').includes('method') ||
        (res.description || res.message || '').includes('404'));

    let res = await post(API_METHODS.UPDATE_ADDRESS_V1, { token, id, address });
    if (looksMissing(res)) {
      res = await post(API_METHODS.UPDATE_ADDRESS_V2, { token, id, address });
    }
    if (looksMissing(res)) {
      res = await post(API_METHODS.UPDATE_ADDRESS_V3, { token, id, address });
    }
    return res;
  },

  completeInvoice: async (token: string, id: string, completeText: string) => {
    return invoicesApi.setStatus(token, id, 'Завершено', completeText);
  },

  setStatus: async (
    token: string,
    id: string,
    status: string,
    completeText?: string
  ) => {
    const complete_date = new Date().toISOString().split('T')[0];
    const complete_text = (completeText ?? status).trim() || status;
    return post(API_METHODS.SET_INV, {
      token,
      id,
      status,
      complete_date,
      complete_text,
    });
  },

  createSbp: async (token: string, invoiceId: string, amount: number) => {
    return post<{ orderId?: string; payload?: string | null; renderedQr?: string | null; formUrl?: string | null }>(
      API_METHODS.SBP,
      { token, invoice_id: invoiceId, amount }
    );
  },

  checkSbp: async (token: string, invoiceId: string) => {
    return post<Array<{ id: string; orderId: string; amount: number; status: number | null; error: string | null }>>(
      API_METHODS.SBP_STATUS,
      { token, invoice_id: invoiceId }
    );
  },
};