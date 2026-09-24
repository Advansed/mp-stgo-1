// src/utils/licsFormat.ts

import { normalizeAddress } from './formatters';

export const formatSum = (sum: number | string | undefined | null): string => {
  const val = Number(sum);
  if (isNaN(val)) return '0,00 ₽';

  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 2,
  }).format(val);
};

// ✅ ДОБАВИТЬ / ГАРАНТИРОВАТЬ ЭКСПОРТ ИМЕННО getTotalDebt
export const getTotalDebt = (debts: any[] | undefined | null): number => {
  if (!debts || !Array.isArray(debts)) return 0;

  // поддержка sum/amount/debt, строки/числа
  return debts.reduce((acc, curr) => {
    const v = Number(curr?.sum ?? curr?.amount ?? curr?.debt ?? 0);
    return acc + (isNaN(v) ? 0 : v);
  }, 0);
};

// ✅ ДОБАВИТЬ / ГАРАНТИРОВАТЬ ЭКСПОРТ getDebtStatus
export const getDebtStatus = (
  debts: any[] | undefined | null
): 'none' | 'positive' | 'negative' => {
  const total = getTotalDebt(debts);
  if (total > 0) return 'positive';   // долг
  if (total < 0) return 'negative';   // переплата
  return 'none';
};

export const formatAddress = (addr: unknown): string => normalizeAddress(addr);

export function getLicCode(lic: unknown): string {
  if (!lic) return '';
  if (typeof lic === 'string') return lic.trim();
  if (typeof lic !== 'object') return '';
  const o = lic as Record<string, unknown>;
  return String(o.code ?? o.account ?? o.lic ?? o.lc ?? o.ls ?? o.personal_account ?? '').trim();
}
