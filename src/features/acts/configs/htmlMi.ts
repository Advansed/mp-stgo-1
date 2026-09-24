import { COMMON_HEADER, COMMON_STYLE } from './htmlCommon';

export const HTML_MI    = `<!DOCTYPE html><html><head><meta charset="UTF-8">${COMMON_STYLE}</head><body>
${COMMON_HEADER}
<div class="act-title">АКТ УСТАНОВКИ ПРИБОРА</div>
<div class="act-meta">г. Якутск {{ACT_DATE_FULL}} г.</div>

<div class="section">ФИО абонента: {{OWNER_NAME}}</div>
<div class="section">Адрес: {{OBJECT_ADDRESS}}</div>
<div class="section">Модель прибора: {{METER_MODEL}}</div>
<div class="section">Номер прибора: {{METER_NUMBER}}</div>
<div class="section">Место установки пломбы: {{SEAL_PLACE}}</div>

<div class="signature">
  <div>Исполнитель: ___________________</div>
  <div>Абонент: ___________________</div>
</div>
</body></html>`;
