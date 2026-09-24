export type InvoiceStatus = string;

export interface Invoice {
  id: string;
  number?: string;
  date?: string;
  status?: InvoiceStatus;
  service?: string;
  phone?: string;
  lic?: string;
  client_name?: string;
  applicant?: string;
  owner_name?: string;
  owner_phone?: string;
  addressText?: string;
  object_address?: string;
  address?: unknown;
  works?: unknown[];
  [key: string]: unknown;
}

export interface Lic {
  id?: string | number;
  code?: string;
  account?: string;
  lic?: string;
  fio?: string;
  owner?: string;
  name?: string;
  phone?: string;
  address?: unknown;
  address_go?: unknown;
  counters?: unknown[];
  meters?: unknown[];
  debts?: unknown[];
  agreements?: unknown[];
  equipments?: unknown[];
  [key: string]: unknown;
}

export interface Act {
  id?: string | number;
  type?: string;
  invoice_id?: string;
  act_number?: string;
  act_date?: string;
  status?: string;
  title?: string;
  document_scan_path?: string;
  created_at?: string;
  updated_at?: string;
  lic?: string;
  owner_name?: string;
  owner_phone?: string;
  object_address?: unknown;
  technician_name?: string;
  technician_position?: string;
  details?: Record<string, unknown> | unknown[];
  [key: string]: unknown;
}
