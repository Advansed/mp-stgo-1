import React, { useMemo } from 'react';
import {
  HTML_WC_HR,
  HTML_WC_MR,
  HTML_WC_EQ_HR,
  HTML_WC_EQ_1,
  HTML_WC_EQ_2,
  HTML_WC_EQ_3,
  HTML_WC_EQ_4,
  HTML_WC_EQ_5,
  HTML_WC_EQ_7,
  HTML_WC_EQ_BM,
  HTML_WC_SH_2,
  HTML_WC_BM,
} from '../../features/acts/configs/htmlWc';
import styles from './WorkCompletedPrint.module.css';

export type WorkCompletedPrintEquipmentKind =
  | 'pipe'
  | 'boiler'
  | 'stove'
  | 'convector'
  | 'heater'
  | 'other';

export interface WorkCompletedPrintEquipment {
  kind: WorkCompletedPrintEquipmentKind;
  pipeBrand: string;
  pipeLength: string;
  pipeDiameter: string;
  shutoffDevice: string;
  pipeDate: string;
  mark: string;
  qty: string;
  mfgDate: string;
  powerKw: string;
  description: string;
}

export interface WorkCompletedPrintMeter {
  meterType: string;
  meterNumber: string;
  meterValue: string;
  meterSeal: string;
  meterColor: string;
  equipment: WorkCompletedPrintEquipment[];
  livingArea: string;
  nonlivingArea: string;
  residentsCount: string;
}

/** Данные формы для сборки печатного HTML (совместимо с состоянием WorkCompleted) */
export interface WorkCompletedPrintData {
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
  meters: WorkCompletedPrintMeter[];
  conclusion?: string;
  recommendations?: string;
  // Страница 2 (HTML_WC_SH_2)
  inspectorSignature?: boolean;
  subscriberSignature?: boolean;
  serviceChecks?: boolean[]; // check1..check16
  workConfirmed?: boolean;
  instructPassed?: boolean;
  subscriberPhone?: string;
  gbu?: 'yes' | 'no';
  rating?: 'bad' | '2' | '3' | '4' | 'excellent';
  generalNote?: string;
}

function getMonthName(monthIndex: number): string {
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
  ];
  return months[monthIndex];
}

function deriveActDateParts(act_date: string): { act_day: string; act_month: string; act_year: string } {
  const iso = (act_date || '').trim().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    return { act_day: '', act_month: '', act_year: '' };
  }
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) {
    return { act_day: '', act_month: '', act_year: '' };
  }
  return {
    act_day: String(d),
    act_month: getMonthName(dt.getMonth()),
    act_year: String(y).slice(-2),
  };
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fillTemplate(tpl: string, vars: Record<string, string>): string {
  let out = tpl;
  for (const [key, val] of Object.entries(vars)) {
    out = out.split(`{{${key}}}`).join(escapeHtml(val ?? ''));
  }
  return out;
}

function formatRuDate(iso: string): string {
  const s = (iso || '').trim().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return iso || '';
  const [y, m, d] = s.split('-');
  return `${d}.${m}.${y}`;
}

const EQ_TEMPLATE: Record<WorkCompletedPrintEquipmentKind, string> = {
  pipe: HTML_WC_EQ_1,
  boiler: HTML_WC_EQ_2,
  stove: HTML_WC_EQ_3,
  convector: HTML_WC_EQ_4,
  heater: HTML_WC_EQ_5,
  other: HTML_WC_EQ_7,
};

/** Только блок площадей (без закрытия table) — если у счётчика нет строк оборудования */
const HTML_WC_AREAS_ONLY = `
    <div class="field-row">
        Произведен контрольный замер отапливаемых площадей: жилая площадь <span class="inline-field">{{living_area}}</span> м², нежилая площадь <span class="inline-field">{{nonliving_area}}</span> м², количество <span class="inline-field">{{residents_count}}</span> чел.
    </div>
`;

function equipmentVars(row: WorkCompletedPrintEquipment): Record<string, string> {
  switch (row.kind) {
    case 'pipe':
      return {
        pipe_brand: row.pipeBrand,
        pipe_length: row.pipeLength,
        pipe_diameter: row.pipeDiameter,
        shutoff_device: row.shutoffDevice,
        pipe_date: row.pipeDate,
      };
    case 'boiler':
      return {
        boiler_mark: row.mark,
        boiler_qty: row.qty,
        boiler_date: row.mfgDate,
        boiler_power: row.powerKw,
      };
    case 'stove':
      return {
        stove_mark: row.mark,
        stove_qty: row.qty,
        stove_date: row.mfgDate,
        stove_power: row.powerKw,
      };
    case 'convector':
      return {
        convector_mark: row.mark,
        convector_qty: row.qty,
        convector_date: row.mfgDate,
        convector_power: row.powerKw,
      };
    case 'heater':
      return {
        heater_mark: row.mark,
        heater_qty: row.qty,
        heater_date: row.mfgDate,
        heater_power: row.powerKw,
      };
    case 'other':
      return { other_equipment: row.description };
    default:
      return {};
  }
}

function optionalTail(data: WorkCompletedPrintData): string {
  const parts: string[] = [];
  if (data.conclusion?.trim()) {
    parts.push(
      `<div class="field-row" style="margin-top:16px;">Заключение: <span class="full-line">${escapeHtml(data.conclusion.trim())}</span></div>`
    );
  }
  if (data.recommendations?.trim()) {
    parts.push(
      `<div class="field-row">Рекомендации: <span class="full-line">${escapeHtml(data.recommendations.trim())}</span></div>`
    );
  }
  return parts.join('\n');
}

/**
 * Собирает полный HTML: HTML_WC_HR + для каждого счётчика (MR + EQ_HR + строки EQ_* + EQ_BM) + хвост + HTML_WC_BM.
 */
export function buildWorkCompletedPrintHtml(data: WorkCompletedPrintData, previewScale = 0.86): string {
  const { act_day, act_month, act_year } = deriveActDateParts(data.act_date);

  let hr = fillTemplate(HTML_WC_HR, {
    act_number: data.actNumber,
    act_day: act_day || '',
    act_month: act_month || '',
    inspector_name: data.inspectorName,
    subscriber_fullname: data.subscriberFullname,
    address: data.address,
    personal_account: data.personalAccount,
    id_document: data.idDocument,
    subscriber_second: data.subscriberSecond,
    id_document_second: data.idDocumentSecond,
    inspection_date: formatRuDate(data.inspectionDate),
    inspection_time: data.inspectionTime,
    inspection_result:  data.inspectionResult,
  });

  hr = hr.replace(/20___\s*г\.?/g, act_year ? `20${act_year} г.` : '20___ г.');

  const meterBlocks = (data.meters ?? []).map((meter, idx) => {
    const n = idx + 1;
    let mr = fillTemplate(HTML_WC_MR, {
      meter1_type: meter.meterType,
      meter1_number: meter.meterNumber,
      meter1_value: meter.meterValue,
      meter1_seal: meter.meterSeal,
      meter1_color: meter.meterColor,
    });
    mr = mr.replace(/1\. тип G/g, `${n}. тип G`);

    const areaVars = {
      living_area: meter.livingArea,
      nonliving_area: meter.nonlivingArea,
      residents_count: meter.residentsCount,
    };

    let eqBlock = '';
    if (meter.equipment?.length) {
      eqBlock += HTML_WC_EQ_HR;
      for (const row of meter.equipment) {
        const tpl = EQ_TEMPLATE[row.kind];
        if (tpl) eqBlock += fillTemplate(tpl, equipmentVars(row));
      }
      eqBlock += fillTemplate(HTML_WC_EQ_BM, areaVars);
    } else {
      eqBlock += fillTemplate(HTML_WC_AREAS_ONLY, areaVars);
    }

    return `${mr}${eqBlock}`;
  });

  const tail = optionalTail(data);

  const serviceChecks = data.serviceChecks ?? [];
  const checkedAttr = (v: boolean) => (v ? 'checked' : '');
  const serviceVars: Record<string, string> = {};
  for (let i = 1; i <= 16; i++) {
    serviceVars[`check${i}`] = checkedAttr(Boolean(serviceChecks[i - 1]));
  }

  const gbu = data.gbu ?? 'no';
  const rating = data.rating ?? '2';

  const sh2 = fillTemplate(HTML_WC_SH_2, {
    contract_number: data.actNumber || '',
    contract_day: act_day || '',
    contract_month: act_month || '',
    contract_year: act_year || '',
    ...serviceVars,

    work_confirmed: checkedAttr(Boolean(data.workConfirmed ?? false)),
    instruct_passed: checkedAttr(Boolean(data.instructPassed ?? false)),

    subscriber_phone: data.subscriberPhone || '',

    gbu_yes: checkedAttr(gbu === 'yes'),
    gbu_no: checkedAttr(gbu === 'no'),

    rating_bad: checkedAttr(rating === 'bad'),
    rating_2: checkedAttr(rating === '2'),
    rating_3: checkedAttr(rating === '3'),
    rating_4: checkedAttr(rating === '4'),
    rating_excellent: checkedAttr(rating === 'excellent'),

    general_note: data.generalNote || '',

    inspector_signature_name: data.inspectorName || '',
    inspector_signature: data.inspectorSignature ? '✓' : '',

    subscriber_signature_name: data.subscriberFullname || '',
    subscriber_signature: data.subscriberSignature ? '✓' : '',

    representative_signature_name: '',
    representative_signature: '',
  });

  const baseHtml = `${hr}\n${meterBlocks.join('\n')}\n${tail}\n<div class="wc-page-2">${sh2}</div>\n${HTML_WC_BM}`;

  // A4: фиксируем размеры документа и (для предпросмотра) делаем масштаб через transform.
  // При печати убираем transform, чтобы печать была 1:1.
  const a4Css = `
    :root { --wc-a4-scale: ${previewScale}; }
    @page { size: A4; margin: 0; }
    html, body { height: auto !important; }
    body { display: block !important; padding: 0 !important; margin: 0 !important; overflow: auto; }
    .document {
      width: 210mm !important;
      max-width: 210mm !important;
      min-height: 297mm !important;
      box-sizing: border-box;
      padding: 0.5em 0.5em 40px !important;
      transform: scale(var(--wc-a4-scale));
      transform-origin: top left;
    }
    /* В таблице оборудования критичны min-width у .inline-field из HR шаблона.
       Убираем их только внутри таблицы, делаем фиксированную раскладку и разрешаем перенос. */
    .document table {
      table-layout: fixed;
      width: 100% !important;
      max-width: 100% !important;
      margin: 12px 0 !important;
      border-collapse: collapse;
    }
    .document table th,
    .document table td {
      padding: 4px 5px !important;
      word-break: break-word;
      white-space: normal !important;
      vertical-align: top;
    }
    .document table .inline-field,
    .document table .full-line {
      min-width: 0 !important;
      width: auto !important;
      display: inline !important;
      white-space: normal !important;
      padding: 0 !important;
      font-size: inherit !important;
    }
    /* Разрыв страницы перед 2-й страницей */
    .wc-page-2 { break-before: page; page-break-before: always; }
    @media print {
      body { overflow: visible !important; }
      .document {
        transform: none !important;
        width: 210mm !important;
        max-width: 210mm !important;
        box-shadow: none !important;
        padding: 0.5em 0.5em 40px !important;
      }
      .wc-page-2 { break-before: page; page-break-before: always; }
      .document table {
        table-layout: fixed;
        width: 100% !important;
        max-width: 100% !important;
        margin: 10px 0 !important;
      }
    }
  `;

  // Вставляем CSS в <head> перед </head>
  return baseHtml.replace('</head>', `<style>${a4Css}</style></head>`);
}

/** Открывает новое окно с готовым HTML и вызывает печать */
export function printWorkCompletedForm(data: WorkCompletedPrintData): boolean {
  const html = buildWorkCompletedPrintHtml(data);
  const w = window.open('', '_blank', 'noopener,noreferrer');
  if (!w) return false;
  w.document.open();
  w.document.write(html);
  w.document.close();
  w.focus();
  const run = () => {
    try {
      w.print();
    } catch {
      /* ignore */
    }
  };
  setTimeout(run, 300);
  return true;
}

export interface WorkCompletedPrintProps {
  data: WorkCompletedPrintData;
  /** Если задан — подставляется вместо скрытого класса (предпросмотр) */
  className?: string;
  /** Пропорциональное масштабирование preview внутри iframe */
  previewScale?: number;
  /** Ссылка на iframe для печати из родителя */
  iframeRef?: React.RefObject<HTMLIFrameElement | null>;
}

/** Iframe с актуальным HTML акта (скрыт по умолчанию). Печать: ref.current?.contentWindow?.print() */
export const WorkCompletedPrint: React.FC<WorkCompletedPrintProps> = ({
  data,
  className,
  previewScale = 0.86,
  iframeRef,
}) => {
  const html = useMemo(() => buildWorkCompletedPrintHtml({ ...data }, previewScale), [data, previewScale]);
  return (
    <iframe
      ref       = { iframeRef }
      className = { className ?? styles.hiddenFrame }
      srcDoc    = { html }
      title     = "Акт проверки — печать"
    />
  );
};

export default WorkCompletedPrint;
