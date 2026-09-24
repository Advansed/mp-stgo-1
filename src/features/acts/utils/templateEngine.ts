import { normalizeAddress as formatAddress } from '../../../utils/formatters';

const MONTHS_GEN = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

const formatDateSmart = (value?: string) => {
  const empty = { full: '___', short: '__.__', year: '____', day: '__', monthName: '____________' };
  if (!value) return empty;
  const s = String(value).trim();

  const pack = (y: string, mm: string, dd: string) => ({
    full: `${dd}.${mm}.${y}`,
    short: `${dd}.${mm}`,
    year: y,
    day: dd,
    monthName: MONTHS_GEN[Number(mm) - 1] || '____________',
  });

  const m1 = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m1) {
    const [, y, mm, dd] = m1;
    return pack(y, mm, dd);
  }

  const m2 = s.match(/^(\d{2})\.(\d{2})\.(\d{4})/);
  if (m2) {
    const [, dd, mm, y] = m2;
    return pack(y, mm, dd);
  }

  const m3 = s.match(/^(\d{2})\.(\d{2})/);
  if (m3) {
    const [, dd, mm] = m3;
    return { full: `${dd}.${mm}.____`, short: `${dd}.${mm}`, year: '____', day: dd, monthName: MONTHS_GEN[Number(mm) - 1] || '____________' };
  }

  return { ...empty, full: s, short: s };
};

const safeStr = (v: any, fallback = '________________') => {
  const s = v === null || v === undefined ? '' : String(v);
  const t = s.trim();
  return t.length ? t : fallback;
};

const formatSign = (sign: any) => {
  const dataUrl = sign && sign.dataUrl ? sign.dataUrl : sign;
  if (typeof dataUrl === 'string' && dataUrl.startsWith('data:') && dataUrl.length > 32) {
    return `<img src="${dataUrl}" alt="sign" />`;
  }
  return '';
};

// Для произвольных изображений (фото результата и т.п.)
const formatImg = (img: any, maxHeight = 220) => {
  const val = img && img.dataUrl ? img.dataUrl : img;
  if (typeof val === 'string' && val.startsWith('data:') && val.length > 32) {
    return `<img src="${val}" alt="img" style="max-width: 100%; max-height: ${maxHeight}px; object-fit: contain;" />`;
  }
  return '';
};

const parseNum = (v: any): number | null => {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(String(v).replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};

const formatMoney = (n: number | null): string => {
  if (n === null) return '';
  return n.toFixed(2).replace('.', ',');
};

const cell = (v: any): string => {
  const s = v === null || v === undefined ? '' : String(v).trim();
  return s;
};

const isDone = (v: any): boolean => {
  const s = String(v ?? '').trim().toLowerCase();
  return s === 'да' || s === 'yes' || s === 'true' || s === '1' || v === true;
};

const UNITS_M = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
const UNITS_F = ['', 'одна', 'две', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
const TEENS = ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'];
const TENS = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'];
const HUNDREDS = ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'];

const plural = (n: number, forms: [string, string, string]) => {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return forms[0];
  if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return forms[1];
  return forms[2];
};

const triadToWords = (n: number, gender: 'm' | 'f'): string => {
  const units = gender === 'f' ? UNITS_F : UNITS_M;
  const h = Math.floor(n / 100);
  const t = Math.floor((n % 100) / 10);
  const u = n % 10;
  const parts: string[] = [];
  if (h) parts.push(HUNDREDS[h]);
  if (t === 1) {
    parts.push(TEENS[u]);
  } else {
    if (t) parts.push(TENS[t]);
    if (u) parts.push(units[u]);
  }
  return parts.join(' ');
};

const intToWords = (n: number, gender: 'm' | 'f'): string => {
  if (n === 0) return gender === 'f' ? 'ноль' : 'ноль';
  const parts: string[] = [];
  const millions = Math.floor(n / 1_000_000);
  const thousands = Math.floor((n % 1_000_000) / 1000);
  const rest = n % 1000;
  if (millions) {
    parts.push(triadToWords(millions, 'm'), plural(millions, ['миллион', 'миллиона', 'миллионов']));
  }
  if (thousands) {
    parts.push(triadToWords(thousands, 'f'), plural(thousands, ['тысяча', 'тысячи', 'тысяч']));
  }
  if (rest) parts.push(triadToWords(rest, gender));
  return parts.filter(Boolean).join(' ');
};

const moneyToWords = (amount: number): string => {
  const rub = Math.floor(Math.abs(amount));
  const kop = Math.round((Math.abs(amount) - rub) * 100) % 100;
  const rubWords = intToWords(rub, 'm') || 'ноль';
  const capitalized = rubWords.charAt(0).toUpperCase() + rubWords.slice(1);
  return `${capitalized} ${plural(rub, ['рубль', 'рубля', 'рублей'])} ${String(kop).padStart(2, '0')} ${plural(kop, ['копейка', 'копейки', 'копеек'])}`;
};

const parseActTime = (d: Record<string, any>) => {
  const raw = String(d.act_time || '').trim();
  const m = raw.match(/^(\d{1,2})[:.hHч\s]+(\d{2})/);
  if (m) return { h: m[1].padStart(2, '0'), min: m[2] };
  return {
    h: String(d.act_time_h || '').trim() || '__',
    min: String(d.act_time_m || '').trim() || '__',
  };
};

const normalizeAddress = (value: any) => formatAddress(value) || '________________';

export const fillActTemplate = async (htmlTemplate: string, act: any) => {
  const { USD_LOGO_BASE64 } = await import('../../../constants/logo');
  const common = act || {};
  const d = common.details || {};

  const actDate = formatDateSmart(d.act_date || common.act_date);
  const number = safeStr(d.act_number || common.act_number || common.number || common.id || 'Б/Н', 'Б/Н');

  // ВАЖНО: PERSONAL_ACCOUNT объявляем ОДИН раз (иначе warning дубль ключа)
  // В заявках лицевой счёт чаще приходит как "lic", но в шаблонах используем PERSONAL_ACCOUNT.
  const personalAccount = d.personal_account || d.lic || '________________';

  // Для акта выполненных работ
  const workDescription = String(d.work_description || d.service || '').trim() || '________________';
  const workAmount = (d.amount ?? d.work_amount ?? '') === '' ? '________________' : String(d.amount ?? d.work_amount);
  const workWarranty = String(d.warranty || '').trim() || '________________';
  const photoResult = formatImg(d.photo_result, 220);

  const replacements: Record<string, string> = {
    '{{LOGO_SRC}}': USD_LOGO_BASE64,

    '{{NUMBER}}': number,
    '{{ACT_DATE_FULL}}': actDate.full,
    '{{ACT_DATE_SHORT}}': actDate.short,
    '{{ACT_YEAR}}': actDate.year,

    '{{OWNER_NAME}}': safeStr(d.owner_name || common.owner_name),
    '{{OWNER_PHONE}}': safeStr(d.owner_phone || common.owner_phone),
    '{{OBJECT_TYPE}}': safeStr(d.object_type),
    '{{OBJECT_ADDRESS}}': normalizeAddress(d.object_address || d.address || d.object),
    '{{PERSONAL_ACCOUNT}}': personalAccount,

    // ---- Акт выполненных работ ----
    '{{WORK_DESCRIPTION}}': workDescription.replace(/\n/g, '<br />'),
    '{{WORK_AMOUNT}}': workAmount,
    '{{WORK_WARRANTY}}': workWarranty,
    '{{PHOTO_RESULT}}': photoResult,

    // Общие подписи
    '{{TECHNICIAN_NAME}}': safeStr(d.technician_name || d.executor_name || common.executor_name),
    '{{TECHNICIAN_SIGNATURE}}': formatSign(d.technician_signature),
    '{{OWNER_SIGNATURE}}': formatSign(d.owner_signature),

    // BR (замена батареи)
    '{{ACT_NUMBER}}': safeStr(d.act_number || number),
    '{{ACT_DATE}}': actDate.full,
    '{{TECHNICIAN_POSITION}}': safeStr(d.technician_position || d.executor_position),
    '{{REMOVAL_DATE}}': safeStr(d.removal_date),
    '{{REMOVAL_YEAR}}': formatDateSmart(d.removal_date).year,
    '{{REMOVAL_TIME}}': safeStr(d.removal_time),
    '{{REMOVED_METER_MODEL}}': safeStr(d.removed_meter_model),
    '{{REMOVED_METER_NUMBER}}': safeStr(d.removed_meter_number),
    '{{REMOVED_METER_READING}}': safeStr(d.removed_meter_reading),
    '{{REMOVED_SEAL_NUMBER}}': safeStr(d.removed_seal_number),
    '{{INSTALLATION_DATE}}': safeStr(d.installation_date),
    '{{INSTALLATION_YEAR}}': formatDateSmart(d.installation_date).year,
    '{{INSTALLED_METER_MODEL}}': safeStr(d.installed_meter_model),
    '{{INSTALLED_METER_NUMBER}}': safeStr(d.installed_meter_number),
    '{{INSTALLED_METER_READING}}': safeStr(d.installed_meter_reading),
    '{{INSTALLED_SEAL_NUMBER}}': safeStr(d.installed_seal_number),

    // MI (установка прибора)
    '{{MI_SERVICE_ID}}': safeStr(d.mi_service_id),
    '{{MI_ADDRESS}}': normalizeAddress(d.mi_address || d.object_address),
    '{{MI_PHONE}}': safeStr(d.mi_phone || d.owner_phone),
    '{{MI_ACCOUNT}}': safeStr(d.mi_account || d.lic || personalAccount),
    '{{MI_DATE}}': safeStr(d.mi_date || d.act_date),
    '{{MI_DEVICE_NAME}}': safeStr(d.mi_device_name),
    '{{MI_DEVICE_NUM}}': safeStr(d.mi_device_num),
    '{{MI_DEVICE_G}}': safeStr(d.mi_device_g),
    '{{MI_DEVICE_PRICE}}': safeStr(d.mi_device_price),
    '{{MI_INSTALL_WORK_PRICE}}': safeStr(d.mi_install_work_price),
    '{{MI_TOTAL_PRICE}}': safeStr(d.mi_total_price),

    // MR (снятие показаний)
    '{{MR_PERSON}}': safeStr(d.mr_person || d.owner_name),
    '{{MR_ADDRESS}}': normalizeAddress(d.mr_address || d.object_address),
    '{{MR_PHONE}}': safeStr(d.mr_phone || d.owner_phone),
    '{{MR_ACCOUNT}}': safeStr(d.mr_account || personalAccount),
    '{{MR_DATE}}': safeStr(d.mr_date || d.act_date),
    '{{MR_METER_TYPE}}': safeStr(d.mr_meter_type),
    '{{MR_METER_NUM}}': safeStr(d.mr_meter_num),
    '{{MR_READING}}': safeStr(d.mr_reading),
    '{{MR_RESULT}}': safeStr(d.mr_result),
    '{{MR_NOTE}}': safeStr(d.mr_note),

    // Пломбирование (3 счетчика)
    '{{M1_MODEL}}': safeStr(d.m1_model),
    '{{M1_NUMBER}}': safeStr(d.m1_number),
    '{{M1_SEAL_NUMBER}}': safeStr(d.m1_seal_number),
    '{{M1_NOTE}}': safeStr(d.m1_note),
    '{{M1_READING}}': safeStr(d.m1_reading),

    '{{M2_MODEL}}': safeStr(d.m2_model),
    '{{M2_NUMBER}}': safeStr(d.m2_number),
    '{{M2_SEAL_NUMBER}}': safeStr(d.m2_seal_number),
    '{{M2_NOTE}}': safeStr(d.m2_note),
    '{{M2_READING}}': safeStr(d.m2_reading),

    '{{M3_MODEL}}': safeStr(d.m3_model),
    '{{M3_NUMBER}}': safeStr(d.m3_number),
    '{{M3_SEAL_NUMBER}}': safeStr(d.m3_seal_number),
    '{{M3_NOTE}}': safeStr(d.m3_note),
    '{{M3_READING}}': safeStr(d.m3_reading),

    '{{RECEIVED_DATE}}': safeStr(d.received_date || d.act_date),

    // SF (недопуск/отключение)
    '{{SF_REASON}}': safeStr(d.sf_reason),
    '{{SF_CHECKBOX_1}}': d.sf_checkbox_1 ? 'X' : '',
    '{{SF_CHECKBOX_2}}': d.sf_checkbox_2 ? 'X' : '',
    '{{SF_CHECKBOX_3}}': d.sf_checkbox_3 ? 'X' : '',
    '{{SF_NOTE}}': safeStr(d.sf_note),

    // SGE / предписание
    '{{SGE_OBJECT_NAME}}': safeStr(d.sge_object_name),
    '{{SGE_OBJECT_ADDRESS}}': normalizeAddress(d.sge_object_address || d.object_address),
    '{{SGE_DEFECTS}}': safeStr(d.sge_defects),
    '{{SGE_DEADLINE}}': safeStr(d.sge_deadline),

    // AAD
    '{{AAD_OBJECT_ADDRESS}}': normalizeAddress(d.aad_object_address || d.object_address),
    '{{AAD_PERSONAL_ACCOUNT}}': safeStr(d.aad_personal_account || d.lic || personalAccount),
    '{{AAD_SUPPLIER_REP_FIO}}': safeStr(d.aad_supplier_rep_fio),
    '{{AAD_CUSTOMER_FIO}}': safeStr(d.aad_customer_fio || d.owner_name),

    '{{ACT_DAY}}': actDate.day,
    '{{ACT_MONTH_NAME}}': actDate.monthName,
  };

  const toTime = parseActTime({ ...common, ...d });
  const src = { ...common, ...d };
  replacements['{{TO_TIME_H}}'] = toTime.h;
  replacements['{{TO_TIME_M}}'] = toTime.min;
  replacements['{{TO_REQUEST_KIND}}'] = safeStr(src.request_kind || src.request_type || '');
  replacements['{{TO_REQUEST_TEXT}}'] = safeStr(src.request_text || src.service || '');
  replacements['{{TO_PRICE_ORDER_NO}}'] = safeStr(src.price_order_number || '', '________');
  replacements['{{TO_PRICE_ORDER_DATE}}'] = src.price_order_date
    ? formatDateSmart(src.price_order_date).full
    : '______________';
  replacements['{{TO_NOTE}}'] = safeStr(src.note || src.warranty || '');
  replacements['{{TO_HOUSE}}'] = cell(src.house || (typeof src.object_address === 'object' ? src.object_address?.house : ''));
  replacements['{{TO_APT}}'] = cell(src.apartment || src.flat || (typeof src.object_address === 'object' ? src.object_address?.flat : ''));
  replacements['{{TO_CONTRACT}}'] = safeStr(src.contract || '');
  replacements['{{TO_EQ_BOILER_MARK}}'] = cell(src.eq_boiler_mark);
  replacements['{{TO_EQ_BOILER_QTY}}'] = cell(src.eq_boiler_qty);
  replacements['{{TO_EQ_STOVE_MARK}}'] = cell(src.eq_stove_mark);
  replacements['{{TO_EQ_STOVE_QTY}}'] = cell(src.eq_stove_qty);
  replacements['{{TO_EQ_CONV_MARK}}'] = cell(src.eq_convector_mark);
  replacements['{{TO_EQ_CONV_QTY}}'] = cell(src.eq_convector_qty);
  replacements['{{TO_EQ_PIPE_MARK}}'] = cell(src.eq_pipe_mark);
  replacements['{{TO_EQ_PIPE_QTY}}'] = cell(src.eq_pipe_qty);
  replacements['{{TO_EQ_OTHER_MARK}}'] = cell(src.eq_other_mark);
  replacements['{{TO_EQ_OTHER_QTY}}'] = cell(src.eq_other_qty);

  let toTotal = 0;
  let toHasSum = false;
  for (let i = 1; i <= 5; i++) {
    const name = cell(src[`svc${i}_name`]);
    const qty = parseNum(src[`svc${i}_qty`]);
    const price = parseNum(src[`svc${i}_price`]);
    const sum = name && qty !== null && price !== null ? qty * price : null;
    if (sum !== null) {
      toTotal += sum;
      toHasSum = true;
    }
    replacements[`{{TO_SVC${i}_NAME}}`] = name;
    replacements[`{{TO_SVC${i}_UNIT}}`] = name ? (cell(src[`svc${i}_unit`]) || 'операция') : '';
    replacements[`{{TO_SVC${i}_QTY}}`] = qty === null ? '' : String(qty);
    replacements[`{{TO_SVC${i}_PRICE}}`] = formatMoney(price);
    replacements[`{{TO_SVC${i}_SUM}}`] = formatMoney(sum);
    replacements[`{{TO_SVC${i}_DONE}}`] = name && isDone(src[`svc${i}_done`]) ? 'V' : '';
  }
  const toRub = Math.floor(toTotal);
  const toKop = Math.round((toTotal - toRub) * 100) % 100;
  replacements['{{TO_TOTAL}}'] = toHasSum ? formatMoney(toTotal) : '';
  replacements['{{TO_TOTAL_RUB}}'] = toHasSum ? String(toRub) : '_____';
  replacements['{{TO_TOTAL_KOP}}'] = toHasSum ? String(toKop).padStart(2, '0') : '____';
  replacements['{{TO_TOTAL_WORDS}}'] = toHasSum ? moneyToWords(toTotal) : '';

  let html = htmlTemplate;
  for (const [key, value] of Object.entries(replacements)) {
    html = html.split(key).join(value);
  }
  return html;
};
