import { post, type APIResponse } from './http';
import { API_METHODS } from './endpoints';

export type WorkSession = {
  id?: string;
  openedAt?: string;
  status?: string;
};

export type SessionRead =
  | { state: 'open'; session: WorkSession }
  | { state: 'closed' }
  | { state: 'error'; message: string };

const NO_SESSION_RE =
  /не открыт|нет (открыт|активн)|смен[аы]\s+не|уже закрыт|session.*(not|no|closed)|not found|отсутств/i;

const ALREADY_OPEN_RE = /уже открыт/i;

const CLOSED_STATUS_RE = /close|закры|finish|end|заверш/i;
const OPEN_STATUS_RE = /open|active|откры|работ/i;

function apiMessage(res: APIResponse<unknown> | null | undefined): string {
  return res?.message || res?.description || res?.error || 'Ошибка сервера';
}

function isFailed(res: APIResponse<unknown> | null | undefined): boolean {
  const success = res?.success as unknown;
  return (
    !res ||
    success === false ||
    success === 0 ||
    success === '0' ||
    success === 'false'
  );
}

function asBool(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') return value;
  if (value === 1 || value === '1' || value === 'true') return true;
  if (value === 0 || value === '0' || value === 'false') return false;
  return undefined;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asText(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return undefined;
}

function firstText(obj: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const text = asText(obj[key]);
    if (text) return text;
  }
  return undefined;
}

function parseJsonish(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  const text = value.trim();
  if (
    (text.startsWith('{') && text.endsWith('}')) ||
    (text.startsWith('[') && text.endsWith(']'))
  ) {
    try {
      return JSON.parse(text);
    } catch {
      return value;
    }
  }
  return value;
}

function unwrapData(data: unknown, depth = 0): unknown {
  if (depth > 4) return data;
  const value = parseJsonish(data);
  if (Array.isArray(value)) return unwrapData(value[0] ?? null, depth + 1);

  const obj = asRecord(value);
  if (!obj) return value;

  if ('session' in obj && obj.session != null) return unwrapData(obj.session, depth + 1);

  const numericKeys = Object.keys(obj)
    .filter((key) => /^\d+$/.test(key))
    .sort((a, b) => Number(a) - Number(b));
  const hasSessionFields = !!(
    firstText(obj, ['id', 'session_id', 'id_session', 'guid', 'status', 'state']) ||
    asBool(obj.is_open) !== undefined ||
    asBool(obj.open) !== undefined
  );
  if (numericKeys.length && !hasSessionFields) {
    return unwrapData(obj[numericKeys[0]], depth + 1);
  }

  if (isPlainEnvelope(obj) && 'data' in obj && !hasSessionFields) {
    return unwrapData(obj.data, depth + 1);
  }
  return obj;
}

function isPlainEnvelope(obj: Record<string, unknown>): boolean {
  return 'success' in obj || 'message' in obj || 'description' in obj || 'error' in obj;
}

function isEmpty(value: unknown): boolean {
  if (value == null || value === false) return true;
  if (typeof value === 'string') {
    const text = value.trim().toLowerCase();
    return text === '' || text === 'null' || text === 'none' || text === 'closed';
  }
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value as object).length === 0;
  return false;
}

function toSession(data: unknown): { closed: boolean; session: WorkSession | null } {
  const value = unwrapData(data);
  if (isEmpty(value)) return { closed: true, session: null };

  if (typeof value === 'string') {
    if (CLOSED_STATUS_RE.test(value) || NO_SESSION_RE.test(value)) {
      return { closed: true, session: null };
    }
    if (OPEN_STATUS_RE.test(value)) return { closed: false, session: { status: 'open' } };
    return { closed: false, session: { id: value, status: 'open' } };
  }

  const obj = asRecord(value);
  if (!obj) return { closed: true, session: null };

  const status = firstText(obj, ['status', 'state', 'session_status']) ?? '';
  const closedAt = firstText(obj, [
    'closed_at',
    'close_date',
    'dt_close',
    'date_close',
    'ended_at',
  ]);
  const closedFlag = asBool(obj.closed) ?? asBool(obj.is_closed);
  const openFlag = asBool(obj.is_open) ?? asBool(obj.open) ?? asBool(obj.active);

  const explicitlyClosed =
    closedFlag === true ||
    openFlag === false ||
    (!!closedAt && closedAt !== 'null') ||
    CLOSED_STATUS_RE.test(status);

  const explicitlyOpen = openFlag === true || OPEN_STATUS_RE.test(status);

  const message = firstText(obj, ['message', 'description', 'error']) ?? '';
  if (!explicitlyOpen && NO_SESSION_RE.test(message)) {
    return { closed: true, session: null };
  }

  if (explicitlyClosed) {
    return { closed: true, session: null };
  }

  const id = firstText(obj, ['id', 'session_id', 'id_session', 'guid']);
  const openedAt = firstText(obj, [
    'opened_at',
    'open_date',
    'dt_open',
    'date_open',
    'started_at',
    'dt_start',
  ]);

  const hasIdentity = !!(id || openedAt || explicitlyOpen || status);
  if (!hasIdentity && message) {
    return { closed: true, session: null };
  }

  return {
    closed: false,
    session: {
      id,
      openedAt,
      status: status || 'open',
    },
  };
}

export function readSessionState(res: APIResponse<unknown>): SessionRead {
  if (isFailed(res)) {
    const message = apiMessage(res);
    if (NO_SESSION_RE.test(message)) return { state: 'closed' };
    return { state: 'error', message };
  }

  const parsed = toSession(res.data);
  if (parsed.closed || !parsed.session) return { state: 'closed' };
  return { state: 'open', session: parsed.session };
}

export function readOpenResult(res: APIResponse<unknown>): {
  ok: boolean;
  already?: boolean;
  session?: WorkSession;
  message?: string;
} {
  if (!isFailed(res)) {
    const parsed = toSession(res.data);
    return {
      ok: true,
      session: parsed.session ?? { status: 'open' },
    };
  }

  const message = apiMessage(res);
  if (ALREADY_OPEN_RE.test(message)) return { ok: false, already: true, message };
  if (NO_SESSION_RE.test(message)) return { ok: false, message };
  return { ok: false, message };
}

export function readCloseResult(res: APIResponse<unknown>): { ok: boolean; message?: string } {
  if (isFailed(res)) {
    const message = apiMessage(res);
    if (NO_SESSION_RE.test(message)) return { ok: true };
    return { ok: false, message };
  }
  return { ok: true };
}

export const sessionApi = {
  getSession: (token: string) => post(API_METHODS.GET_SESSION, { token }),
  openSession: (token: string) => post(API_METHODS.OPEN_SESSION, { token }),
  closeSession: (token: string) => post(API_METHODS.CLOSE_SESSION, { token }),
};
