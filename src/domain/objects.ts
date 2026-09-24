export type AnyObj = Record<string, unknown>;

export const isPlainObject = (v: unknown): v is AnyObj =>
  !!v && typeof v === 'object' && !Array.isArray(v);

/** Нормализует details акта: массив, {0:{...}} или обычный объект. */
export function toDetailsObject(details: unknown): AnyObj {
  if (!details) return {};
  if (Array.isArray(details)) {
    const firstObj = details.find((x) => isPlainObject(x));
    return (firstObj as AnyObj) || {};
  }
  if (isPlainObject(details)) {
    const maybe0 = details['0'];
    if (isPlainObject(maybe0)) {
      const rest = { ...details };
      delete rest['0'];
      return { ...maybe0, ...rest };
    }
    return details;
  }
  return {};
}

/** Конверт API: {success, data} или сам payload. */
function payloadOf(res: unknown): unknown {
  if (Array.isArray(res)) return res;
  if (!isPlainObject(res)) return res;
  const looksEnvelope =
    'success' in res || 'error' in res || 'message' in res || 'description' in res;
  if (looksEnvelope && 'data' in res) return res.data;
  return res;
}

function objectsFromNumericKeys(obj: AnyObj): AnyObj[] {
  const keys = Object.keys(obj)
    .filter((k) => /^\d+$/.test(k))
    .sort((a, b) => Number(a) - Number(b));
  if (!keys.length) return [];
  return keys.map((k) => obj[k]).filter(isPlainObject);
}

function looksLikeLic(obj: AnyObj): boolean {
  return !!(obj.code || obj.account || obj.lic || obj.lc || obj.ls || obj.fio || obj.owner);
}

/** Ответ get_lic: объект, массив, конверт API или {0:{...}}. */
export function unwrapLic(data: unknown): AnyObj | null {
  const payload = payloadOf(data);
  if (Array.isArray(payload)) {
    const first = payload.find(isPlainObject);
    return first ? unwrapLic(first) : null;
  }
  if (!isPlainObject(payload)) return null;
  if (isPlainObject(payload.data) || Array.isArray(payload.data)) {
    const nested = unwrapLic(payload.data);
    if (nested) return nested;
  }
  const numeric = objectsFromNumericKeys(payload);
  if (numeric.length === 1) return numeric[0];
  if (numeric.length > 1) {
    const withCode = numeric.find(looksLikeLic);
    if (withCode) return withCode;
  }
  const obj = toDetailsObject(payload);
  return Object.keys(obj).length ? obj : null;
}

/** Список ЛС из get_lics: массив, {0:{...}}, data.lics и т.п. */
export function unwrapLicList(res: unknown): AnyObj[] {
  const payload = payloadOf(res);
  if (Array.isArray(payload)) return payload.filter(isPlainObject);
  if (!isPlainObject(payload)) return [];

  for (const key of ['lics', 'items', 'list', 'accounts']) {
    const val = payload[key];
    if (Array.isArray(val)) return val.filter(isPlainObject);
  }

  const numeric = objectsFromNumericKeys(payload);
  if (numeric.length) return numeric;

  if (looksLikeLic(payload)) return [payload];
  return [];
}

/** Первый массив по списку ключей (предпочитает непустой). */
export function pickArray(source: unknown, keys: string[]): unknown[] {
  if (!source || typeof source !== 'object') return [];
  const obj = source as Record<string, unknown>;
  const toArr = (val: unknown): unknown[] => {
    if (Array.isArray(val)) return val;
    if (isPlainObject(val)) return objectsFromNumericKeys(val);
    return [];
  };
  for (const key of keys) {
    const arr = toArr(obj[key]);
    if (arr.length > 0) return arr;
  }
  for (const key of keys) {
    const arr = toArr(obj[key]);
    if (arr.length) return arr;
  }
  return [];
}
