import { post } from './http';
import { API_METHODS } from './endpoints';

// ✅ Логика как раньше: add_lic должен уметь отправлять lc + id
// Чтобы не ломать существующий код, addLic принимает (token, payload),
// где payload может быть string (lc) или объект {code/account/lic + id}
export const licsApi = {
  getLics: async (token: string) => {
    return await post(API_METHODS.GET_LICS, { token });
  },

  addLic: async (token: string, payload: any) => {
    // payload может быть строкой (код ЛС) или объектом
    const lc = typeof payload === 'string'
      ? payload
      : (payload?.code || payload?.account || payload?.lic);

    // ✅ ВАЖНО: id как в старом рабочем коде
    const id = typeof payload === 'object'
      ? (payload?.id ?? payload?.lc_id ?? payload?.lic_id ?? payload?.ID ?? payload?._id)
      : undefined;

    // Если lc не нашли — вернем ошибку в том же формате
    if (!lc) {
      return { success: false, message: 'Некорректные данные: lc пустой' };
    }

    const body: any = { token, lc };
    if (id !== undefined && id !== null) body.id = id;

    return await post(API_METHODS.ADD_LIC, body);
  },

  // camelCase метод, как просили
  deleteLic: async (token: string, code: string) => {
    return await post(API_METHODS.DELETE_LIC, { token, lc: code });
  }
};