// src/utils/licsFormat.ts

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

export const formatAddress = (addr: any): string => {
  if (!addr) return '';

  if (typeof addr === 'string') {
    return addr.replace(/,\s*$/, '').trim();
  }

  if (typeof addr === 'object') {
    if (addr.text) return String(addr.text);
    if (addr.address_go) return String(addr.address_go);
    if (addr.full) return String(addr.full);

    const parts: string[] = [];
    if (addr.settlement) parts.push(String(addr.settlement));
    if (addr.street) parts.push(String(addr.street));
    if (addr.house) parts.push(`д. ${addr.house}`);
    if (addr.apartment) parts.push(`кв. ${addr.apartment}`);

    return parts.join(', ');
  }

  return '';
};
