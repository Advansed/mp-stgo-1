import React from 'react';
import { pickArray } from '../../domain/objects';
import type { Lic } from '../../domain/types';
import { formatAddress, formatSum, getDebtStatus, getLicCode, getTotalDebt } from '../../utils/licsFormat';

const safeString = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'object') {
    const maybeAddr = formatAddress(value);
    if (maybeAddr) return maybeAddr;
  }
  return '';
};

const formatDate = (dateString: unknown): string => {
  const s = safeString(dateString);
  if (!s) return '';
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString('ru-RU');
};

export type LicDisplay = {
  code: string;
  name: string;
  debts: unknown[];
  counters: unknown[];
  agreements: unknown[];
  equipments: unknown[];
  debtTotal: number;
  debtChip: string;
};

export function getLicDisplay(lic: Lic | null, fallbackCode = ''): LicDisplay | null {
  if (!lic) return null;

  const debts = pickArray(lic, ['debts', 'debt', 'balances']);
  const debtStatus = getDebtStatus(debts);
  const debtChip =
    debtStatus === 'positive'
      ? 'inv-chip inv-chip--danger'
      : debtStatus === 'negative'
        ? 'inv-chip inv-chip--success'
        : 'inv-chip inv-chip--muted';

  return {
    code: getLicCode(lic) || fallbackCode,
    name: safeString(lic.name ?? lic.fio ?? lic.owner) || 'Не указан',
    debts,
    counters: pickArray(lic, ['counters', 'meters', 'pu']),
    agreements: pickArray(lic, ['agreements', 'agrees', 'contracts', 'dogs']),
    equipments: pickArray(lic, ['equipments', 'equips', 'equipment', 'devices', 'vdgo']),
    debtTotal: getTotalDebt(debts),
    debtChip,
  };
}

const EmptyHint: React.FC<{ text: string }> = ({ text }) => (
  <div className="inv-lic-status">{text}</div>
);

export const LicDebtRows: React.FC<{ debts: unknown[] }> = ({ debts }) => {
  if (!debts.length) return <EmptyHint text="Статей задолженности нет" />;
  return (
    <>
      {debts.map((d: any, i: number) => (
        <div className="inv-row" key={`debt-${i}`}>
          <div className="inv-row__main">
            <div className="inv-row__title">{safeString(d?.label ?? d?.type ?? d?.name ?? d?.service) || 'Услуга'}</div>
            {safeString(d?.period ?? d?.month ?? d?.date) && (
              <div className="inv-row__meta">{safeString(d?.period ?? d?.month ?? d?.date)}</div>
            )}
          </div>
          <div className="inv-row__aside">
            <span className="inv-row__value">{formatSum(d?.sum ?? d?.amount ?? d?.debt ?? 0)}</span>
          </div>
        </div>
      ))}
    </>
  );
};

export const LicCounterRows: React.FC<{ counters: unknown[] }> = ({ counters }) => {
  if (!counters.length) return <EmptyHint text="Приборы учета не найдены" />;
  return (
    <>
      {counters.map((c: any, i: number) => {
        const cCode = safeString(c?.code ?? c?.number ?? c?.counter);
        const cTip = safeString(c?.tip ?? c?.type);
        const indice = safeString(c?.indice ?? c?.value ?? c?.indication);
        const seal = safeString(c?.seal);
        return (
          <div className="inv-row" key={`pu-${i}`}>
            <div className="inv-row__main">
              <div className="inv-row__title">{safeString(c?.name ?? c?.title) || 'Счетчик'}</div>
              <div className="inv-row__meta">
                {cTip ? `${cTip} · ` : ''}
                {cCode ? `№ ${cCode}` : '№ не указан'}
              </div>
              {seal && <div className="inv-row__meta">Пломба: {seal}</div>}
            </div>
            {indice && (
              <div className="inv-row__aside">
                <span className="inv-row__value">{indice}</span>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export const LicAgreementRows: React.FC<{ agreements: unknown[] }> = ({ agreements }) => {
  if (!agreements.length) return <EmptyHint text="Договоры не найдены" />;
  return (
    <>
      {agreements.map((a: any, i: number) => {
        const aNumber = safeString(a?.number ?? a?.num ?? a?.code);
        const beginDate = formatDate(a?.begin_date ?? a?.beginDate ?? a?.date_begin ?? a?.start);
        const endDate = formatDate(a?.end_date ?? a?.endDate ?? a?.date_end ?? a?.finish);
        return (
          <div className="inv-row" key={`agr-${a?.id ?? aNumber ?? i}`}>
            <div className="inv-row__main">
              <div className="inv-row__title">{safeString(a?.name ?? a?.title ?? a?.type) || 'Договор'}</div>
              <div className="inv-row__meta">
                {aNumber ? `№ ${aNumber}` : '№ не указан'}
                {beginDate ? ` · с ${beginDate}` : ''}
                {endDate ? ` по ${endDate}` : ''}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export const LicEquipmentRows: React.FC<{ equipments: unknown[] }> = ({ equipments }) => {
  if (!equipments.length) return <EmptyHint text="Оборудование не найдено" />;
  return (
    <>
      {equipments.map((e: any, i: number) => {
        const number = safeString(e?.number ?? e?.num ?? e?.serial ?? e?.code);
        const tip = safeString(e?.tip ?? e?.type ?? e?.kind);
        return (
          <div className="inv-row" key={`eq-${e?.id ?? number ?? i}`}>
            <div className="inv-row__main">
              <div className="inv-row__title">{safeString(e?.name ?? e?.title ?? e?.model) || 'Оборудование'}</div>
              <div className="inv-row__meta">
                {tip ? `${tip} · ` : ''}
                {number ? `№ ${number}` : '№ не указан'}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export function pickWorks(source: unknown): unknown[] {
  return pickArray(source, ['works', 'work_list', 'jobs', 'services_list']);
}

export function getWorkTitle(work: unknown, index: number): string {
  if (typeof work === 'string' || typeof work === 'number') {
    return String(work).trim() || `Оборудование ${index + 1}`;
  }
  const w = (work && typeof work === 'object' ? work : {}) as Record<string, unknown>;
  return (
    safeString(
      w.equipment ??
        w.equipments ??
        w.equipment_name ??
        w.equip_name ??
        w.model ??
        w.name ??
        w.title ??
        w.type ??
        w.mark ??
        w.label
    ) || `Оборудование ${index + 1}`
  );
}

export function getWorkSubtitle(work: unknown): string {
  if (!work || typeof work !== 'object') return '';
  const w = work as Record<string, unknown>;
  return safeString(w.type ?? w.work ?? w.service ?? w.kind);
}

export const WorkDetailRows: React.FC<{ work: unknown }> = ({ work }) => {
  if (typeof work === 'string' || typeof work === 'number') {
    return (
      <div className="inv-row">
        <div className="inv-row__main">
          <div className="inv-row__title">Наименование</div>
          <div className="inv-row__meta">{String(work)}</div>
        </div>
      </div>
    );
  }

  const w = (work && typeof work === 'object' ? work : {}) as Record<string, unknown>;
  const rows: Array<{ label: string; value: string }> = [];

  const push = (label: string, value: unknown) => {
    const s = safeString(value);
    if (s) rows.push({ label, value: s });
  };

  push('Наименование', w.equipment ?? w.model ?? w.name ?? w.title);
  push('Работа', w.work ?? w.service);
  push('Тип', w.type ?? w.kind ?? w.tip);
  push('Номер', w.number ?? w.num ?? w.serial);
  push('Количество', w.amount ?? w.qty ?? w.quantity ?? w.count);
  push('Тариф', w.tarif ?? w.price ?? w.cost);
  push('Ед. изм.', w.unit ?? w.ed);
  push('Примечание', w.note ?? w.comment ?? w.description);

  if (!rows.length) return <EmptyHint text="Нет данных по работе" />;

  return (
    <>
      {rows.map((row) => (
        <div className="inv-row" key={row.label}>
          <div className="inv-row__main">
            <div className="inv-row__title">{row.label}</div>
            <div className="inv-row__meta">{row.value}</div>
          </div>
        </div>
      ))}
    </>
  );
};

export { formatSum };
