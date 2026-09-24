import type { MeterWithEquipment } from './WorkCompleted';
import { createEmptyMeter, deriveActDateParts } from './WorkCompleted';
import { formatAddress, getLicCode } from '../../utils/licsFormat';
import { pickArray, toDetailsObject } from '../../domain/objects';
import type { Act, Invoice, Lic } from '../../domain/types';

export { getLicCode };

export interface WorkCompletedFormData {
  actNumber: string;
  act_date: string;
  inspectorName: string;
  subscriberFullname: string;
  address: string;
  personalAccount: string;
  idDocument: string;
  subscriberSecond: string;
  idDocumentSecond: string;
  inspectionDate: string;
  inspectionTime: string;
  inspectionResult: string;
  meters: MeterWithEquipment[];
  conclusion: string;
  recommendations: string;
  inspectorSignature: boolean;
  subscriberSignature: boolean;
  serviceChecks: boolean[];
  workConfirmed: boolean;
  instructPassed: boolean;
  subscriberPhone: string;
  gbu: 'yes' | 'no';
  rating: 'bad' | '2' | '3' | '4' | 'excellent';
  generalNote: string;
}

export interface WorkCompletedActMeta {
  id?: string | number;
  invoice_id: string;
  act_number: string;
  status?: string;
  title?: string;
  document_scan_path?: string;
}

const str = (v: unknown): string => (v === null || v === undefined ? '' : String(v).trim());

const todayYmd = () => new Date().toISOString().split('T')[0];

function isWorkCompletedDetails(d: Record<string, unknown>): boolean {
  return Array.isArray(d.meters) || !!str(d.subscriberFullname) || !!str(d.inspectorName);
}

export function shouldEnrichWorkCompletedFromLic(draft?: Act | null): boolean {
  const d = toDetailsObject(draft?.details);
  return !isWorkCompletedDetails(d);
}

export function findLicByCode(list: Lic[], code: string): Lic | null {
  const normalized = str(code);
  if (!normalized) return null;
  return list.find((l) => getLicCode(l) === normalized) ?? null;
}

export function mapLicCountersToMeters(counters: any[]): MeterWithEquipment[] {
  if (!Array.isArray(counters) || counters.length === 0) return [];
  return counters.map((c) => {
    const base = createEmptyMeter();
    return {
      ...base,
      meterType: str(c?.tip ?? c?.type) || base.meterType,
      meterNumber: str(c?.code ?? c?.number ?? c?.counter),
      meterValue: str(c?.predIndice ?? c?.pred_indice ?? c?.indice ?? c?.value ?? c?.indication),
      meterSeal: str(c?.seal ?? c?.seal_number),
    };
  });
}

export function enrichWorkCompletedFromLic(
  base: Partial<WorkCompletedFormData>,
  lic: Lic | null | undefined
): Partial<WorkCompletedFormData> {
  if (!lic) return base;
  const enriched = { ...base };

  const addr = formatAddress(lic.address_go ?? lic.address);
  if (addr) enriched.address = addr;

  const fio = str(lic.fio ?? lic.owner ?? lic.name);
  if (fio && !str(enriched.subscriberFullname)) {
    enriched.subscriberFullname = fio;
  }

  const phone = str(lic.phone ?? lic.owner_phone);
  if (phone && !str(enriched.subscriberPhone)) {
    enriched.subscriberPhone = phone;
  }

  const counters = pickArray(lic, ['counters', 'meters', 'pu']);
  const meters = mapLicCountersToMeters(counters);
  if (meters.length) enriched.meters = meters;

  return enriched;
}

function legacyFieldsFromMeter(m: MeterWithEquipment) {
  const first = (k: string) => m.equipment.find((e) => e.kind === k);
  const allOther = m.equipment.filter((e) => e.kind === 'other');
  const pipe = first('pipe');
  const boiler = first('boiler');
  const stove = first('stove');
  const convector = first('convector');
  const heater = first('heater');
  return {
    pipeBrand: pipe?.pipeBrand ?? '',
    pipeLength: pipe?.pipeLength ?? '',
    pipeDiameter: pipe?.pipeDiameter ?? '',
    shutoffDevice: pipe?.shutoffDevice ?? '',
    pipeDate: pipe?.pipeDate ?? '',
    boilerMark: boiler?.mark ?? '',
    boilerQty: boiler?.qty ?? '',
    boilerDate: boiler?.mfgDate ?? '',
    boilerPower: boiler?.powerKw ?? '',
    stoveMark: stove?.mark ?? '',
    stoveQty: stove?.qty ?? '',
    stoveDate: stove?.mfgDate ?? '',
    stovePower: stove?.powerKw ?? '',
    convectorMark: convector?.mark ?? '',
    convectorQty: convector?.qty ?? '',
    convectorDate: convector?.mfgDate ?? '',
    convectorPower: convector?.powerKw ?? '',
    heaterMark: heater?.mark ?? '',
    heaterQty: heater?.qty ?? '',
    heaterDate: heater?.mfgDate ?? '',
    heaterPower: heater?.powerKw ?? '',
    otherEquipment: allOther
      .map((e) => e.description.trim())
      .filter(Boolean)
      .join('; '),
  };
}

const FORM_KEYS: (keyof WorkCompletedFormData)[] = [
  'actNumber',
  'act_date',
  'inspectorName',
  'subscriberFullname',
  'address',
  'personalAccount',
  'idDocument',
  'subscriberSecond',
  'idDocumentSecond',
  'inspectionDate',
  'inspectionTime',
  'inspectionResult',
  'meters',
  'conclusion',
  'recommendations',
  'inspectorSignature',
  'subscriberSignature',
  'serviceChecks',
  'workConfirmed',
  'instructPassed',
  'subscriberPhone',
  'gbu',
  'rating',
  'generalNote',
];

function pickFormFields(source: Record<string, unknown>): Partial<WorkCompletedFormData> {
  const out: Partial<WorkCompletedFormData> = {};
  for (const key of FORM_KEYS) {
    if (source[key] !== undefined && source[key] !== null) {
      (out as any)[key] = source[key];
    }
  }
  return out;
}

export function buildWorkCompletedInitialValues(source: {
  draft?: Act | null;
  invoice?: Invoice | null;
}): Partial<WorkCompletedFormData> {
  const draft = source.draft;
  const inv = source.invoice;
  const d = toDetailsObject(draft?.details);

  const actDateRaw = draft?.act_date || d.act_date || todayYmd();
  const actDate = String(actDateRaw).slice(0, 10);

  if (isWorkCompletedDetails(d)) {
    return {
      ...pickFormFields(d),
      act_date: str(d.act_date) || actDate,
      actNumber: str(d.actNumber) || str(draft?.act_number) || str(d.act_number),
    };
  }

  return {
    act_date: actDate,
    actNumber: str(draft?.act_number) || str(d.act_number) || '',
    personalAccount: str(d.lic) || str(draft?.lic) || str(inv?.lic) || '',
    subscriberFullname:
      str(d.owner_name) || str(draft?.owner_name) || str(inv?.client_name) || str(inv?.owner_name) || '',
    subscriberPhone: str(d.owner_phone) || str(draft?.owner_phone) || str(inv?.phone) || '',
    address:
      str(d.object_address) || str(draft?.object_address) || str(inv?.addressText) || '',
    inspectorName: str(d.technician_name) || str(draft?.technician_name) || '',
  };
}

export function validateWorkCompletedForm(
  data: WorkCompletedFormData
): { ok: boolean; message?: string } {
  if (!str(data.inspectorName)) {
    return { ok: false, message: 'Укажите представителя ГРО' };
  }
  if (!str(data.subscriberFullname)) {
    return { ok: false, message: 'Укажите ФИО абонента' };
  }
  if (!str(data.address)) {
    return { ok: false, message: 'Укажите адрес объекта' };
  }
  if (!str(data.personalAccount)) {
    return { ok: false, message: 'Укажите лицевой счёт' };
  }
  return { ok: true };
}

export function buildWorkCompletedSavePayload(
  formData: WorkCompletedFormData,
  meta: WorkCompletedActMeta
) {
  const { act_day, act_month, act_year } = deriveActDateParts(formData.act_date);
  const m0 = formData.meters[0];
  const legacyFirst = m0
    ? {
        meter1Type: m0.meterType,
        meter1Number: m0.meterNumber,
        meter1Value: m0.meterValue,
        meter1Seal: m0.meterSeal,
        meter1Color: m0.meterColor,
        ...legacyFieldsFromMeter(m0),
        livingArea: m0.livingArea,
        nonlivingArea: m0.nonlivingArea,
        residentsCount: m0.residentsCount,
      }
    : {};

  const details = {
    ...formData,
    act_number: meta.act_number,
    act_day,
    act_month,
    act_year,
    actDay: act_day,
    actMonth: act_month,
    actYear: act_year,
    ...legacyFirst,
    lic: formData.personalAccount,
    owner_name: formData.subscriberFullname,
    owner_phone: formData.subscriberPhone,
    object_address: formData.address,
    technician_name: formData.inspectorName,
  };

  return {
    id: meta.id,
    invoice_id: meta.invoice_id,
    type: 'work_completed' as const,
    act_number: meta.act_number,
    act_date: formData.act_date,
    status: meta.status || 'draft',
    title: meta.title || 'Акт выполненных работ',
    document_scan_path: meta.document_scan_path || '',
    lic: formData.personalAccount,
    owner_name: formData.subscriberFullname,
    owner_phone: formData.subscriberPhone,
    object_address: formData.address,
    technician_name: formData.inspectorName,
    details,
  };
}
