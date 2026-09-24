import { pickArray } from '../../../domain/objects';
import type { ActTemplateConfig } from '../types';

export const WC_TO_MAX_SERVICES = 5;

type EqSlot = 'boiler' | 'stove' | 'convector' | 'pipe' | 'other';

function asObj(raw: unknown): Record<string, unknown> {
  return raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
}

function str(v: unknown): string {
  return v === null || v === undefined ? '' : String(v).trim();
}

function pickWorksRows(source: unknown): unknown[] {
  const works = pickArray(source, ['works', 'work_list', 'jobs', 'services_list']);
  if (works.length) return works;
  return pickArray(source, ['equipments', 'equips', 'equipment']);
}

function classifyEquipment(row: Record<string, unknown>): EqSlot {
  const hay = `${str(row.type)} ${str(row.equipment)} ${str(row.model)} ${str(row.work)}`.toLowerCase();
  if (hay.includes('котёл') || hay.includes('котел')) return 'boiler';
  if (hay.includes('плит') || hay.includes('вароч')) return 'stove';
  if (hay.includes('конвектор')) return 'convector';
  if (hay.includes('газопровод') || hay.includes('разводк')) return 'pipe';
  return 'other';
}

/** Заполняет svc* и eq_* из табличной части заявки (works). */
export function applyWorksToWcTo(
  data: Record<string, unknown>,
  source?: unknown
): Record<string, unknown> {
  const rows = pickWorksRows(source ?? data);
  if (!rows.length) return data;

  const next = { ...data };
  const hasAnySvc = Array.from({ length: WC_TO_MAX_SERVICES }, (_, i) => i + 1).some((n) =>
    str(next[`svc${n}_name`])
  );

  if (!hasAnySvc) {
    rows.slice(0, WC_TO_MAX_SERVICES).forEach((raw, i) => {
      const row = asObj(raw);
      const n = i + 1;
      next[`svc${n}_name`] = str(row.work ?? row.service ?? row.type);
      const qty = row.amount ?? row.qty ?? row.quantity ?? row.count;
      if (qty !== undefined && qty !== null && qty !== '') next[`svc${n}_qty`] = qty;
      const price = row.tarif ?? row.price ?? row.cost;
      if (price !== undefined && price !== null && price !== '') next[`svc${n}_price`] = price;
      if (!str(next[`svc${n}_unit`])) {
        next[`svc${n}_unit`] = str(row.unit ?? row.ed) || 'операция';
      }
      if (!str(next[`svc${n}_done`])) next[`svc${n}_done`] = 'Да';
    });
  }

  const filledSlots = new Set<EqSlot>();
  for (const raw of rows) {
    const row = asObj(raw);
    const slot = classifyEquipment(row);
    if (filledSlots.has(slot)) continue;

    const markKey = `eq_${slot}_mark`;
    const qtyKey = `eq_${slot}_qty`;
    if (str(next[markKey]) || (next[qtyKey] !== undefined && next[qtyKey] !== null && next[qtyKey] !== '')) {
      filledSlots.add(slot);
      continue;
    }

    const mark = str(row.equipment ?? row.model ?? row.mark ?? row.name);
    const qty = row.amount ?? row.qty ?? row.quantity ?? row.count;
    if (mark) next[markKey] = mark;
    if (qty !== undefined && qty !== null && qty !== '') next[qtyKey] = qty;
    filledSlots.add(slot);
  }

  return next;
}

/** @deprecated используйте applyWorksToWcTo */
export const applyEquipmentsToWcToServices = applyWorksToWcTo;

/** Сколько секций «Услуга N» показывать (без пустых хвостов). */
export function countWcToServiceSlots(data: Record<string, unknown>): number {
  let last = 0;
  for (let n = 1; n <= WC_TO_MAX_SERVICES; n++) {
    if (str(data[`svc${n}_name`])) last = n;
  }
  return Math.max(last, 1);
}

export function trimWcToServiceFields(
  template: ActTemplateConfig,
  serviceCount: number
): ActTemplateConfig {
  if (!template.fields) return template;
  return {
    ...template,
    fields: template.fields.filter((f) => {
      const m = f.section?.match(/^Услуга\s+(\d+)$/i);
      if (!m) return true;
      return Number(m[1]) <= serviceCount;
    }),
  };
}
