// src/api/http.ts

// URL из .env или используем хардкод как запасной вариант
const BASE_URL = import.meta.env.VITE_API_URL || 'https://fhd.aostng.ru/mi/';
const VESTA_URL = 'https://fhd.aostng.ru/inter_vesta/hs/API_STNG/V2/';

export interface APIResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  description?: string;
  error?: string;
}

const MAX_LOG_STRING = 400;

function redactForLog(value: unknown, depth = 0): unknown {
  if (value == null) return value;
  if (typeof value === 'string') {
    return value.length > MAX_LOG_STRING
      ? `${value.slice(0, MAX_LOG_STRING)}… [${value.length} chars]`
      : value;
  }
  if (typeof value !== 'object' || depth > 4) return value;
  if (Array.isArray(value)) {
    if (value.length > 20) {
      return [...value.slice(0, 20).map((item) => redactForLog(item, depth + 1)), `… +${value.length - 20} items`];
    }
    return value.map((item) => redactForLog(item, depth + 1));
  }

  const out: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    if (key.toLowerCase() === 'token' && typeof item === 'string') {
      out[key] = item ? `${item.slice(0, 6)}…` : item;
      continue;
    }
    out[key] = redactForLog(item, depth + 1);
  }
  return out;
}

function logApiCall(label: string, url: string, params: unknown, result: unknown, error?: unknown) {
  const title = `${label} ${url}`;
  if (error) {
    console.groupCollapsed(`%c${title}`, 'color:#b91c1c;font-weight:700');
  } else {
    console.groupCollapsed(`%c${title}`, 'color:#2563eb;font-weight:700');
  }
  console.log('params', redactForLog(params));
  if (error) {
    console.log('error', error);
  } else {
    console.log('response', redactForLog(result));
  }
  console.groupEnd();
}

async function postJson<T>(url: string, params: any, label: string): Promise<APIResponse<T>> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify(params),
    });
    const json = await response.json();
    logApiCall(label, url, params, json);
    return json;
  } catch (error) {
    logApiCall(label, url, params, undefined, error);
    console.error(`${label} Error (${url}):`, error);
    return { success: false, data: {} as T, message: 'Ошибка сети' };
  }
}

// Основной метод (POST JSON)
export async function post<T = any>(method: string, params: any): Promise<APIResponse<T>> {
  return postJson<T>(`${BASE_URL}${method}`, params, 'API');
}

// Метод для Vesta (getData)
export async function getData<T = any>(method: string, params: any): Promise<APIResponse<T>> {
  return postJson<T>(`${VESTA_URL}${method}`, params, 'Vesta');
}