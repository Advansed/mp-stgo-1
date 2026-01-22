// src/api/endpoints.ts

export const API_METHODS = {
  LOGIN:            'login',
  INVOICES:         'mp_invoices',
  
  // Варианты для обновления адреса (используем в Fallback)
  UPDATE_ADDRESS_V1: 'upd_inv_address',    // Старый (дает ошибку)
  UPDATE_ADDRESS_V2: 'set_inv_address',    // Вероятный новый
  UPDATE_ADDRESS_V3: 'mp_set_inv_address', // Еще вариант
  
  // Лицевые (LICS)
  GET_LICS:         'get_lics',
  ADD_LIC:          'add_lic',
  DELETE_LIC:       'del_lic',
  
  // Акты (ACTS)
  GET_ACTS:         'mp_get_acts',
  GET_ACT:          'mp_get_act',
  SET_ACT:          'mp_set_act',
  GET_PDF:          'mp_get_pdf'
};

export const VESTA_METHODS = {
  SETTLEMENTS:      'getSettlements',
  STREETS:          'getStreets',
  HOUSES:           'getHouses'
};