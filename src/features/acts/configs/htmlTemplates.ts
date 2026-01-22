// src/features/acts/configs/htmlTemplates.ts

// Общий стиль для всех актов (чтобы не дублировать)
const STYLE = `
  <style>
    @page { size: A4; margin: 0cm; }
    body { font-family: "Times New Roman", serif; font-size: 12pt; line-height: 1.2; margin: 0; padding: 2cm; }
    .header { text-align: center; margin-bottom: 20px; }
    .act-title { border: 2px solid #000; padding: 10px; text-align: center; margin: 20px 0; font-weight: bold; }
    .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
    .field { margin-bottom: 8px; }
    .u { border-bottom: 1px solid #000; padding: 0 10px; font-weight: bold; display: inline-block; min-width: 50px; text-align: center; }
    .section-title { margin-top: 20px; margin-bottom: 10px; font-weight: bold; text-decoration: underline; }
    .sign-block { margin-top: 40px; }
    .sign-row { margin-bottom: 20px; display: flex; align-items: flex-end; }
    .sign-img { border-bottom: 1px solid #000; min-width: 150px; margin: 0 10px; text-align: center; }
  </style>
`;

const HEADER = `
  <div class="header">
    <img src="{{LOGO_SRC}}" style="height: 60px;" /><br>
    <div style="font-weight: bold; font-size: 14pt;">AO «САХАТРАНСНЕФТЕГАЗ»</div>
    <div>Управление газораспределительных сетей</div>
  </div>
`;

// 1. ЗАМЕНА БАТАРЕИ (уже есть, оставляем как эталон)
export const HTML_BR = `<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title>АКТ ЗАМЕНЫ АККУМУЛЯТОРНОЙ БАТАРЕИ ГАЗОВОГО СЧЕТЧИКА</title>
  <style>
    @page {
      size: A4;
      margin: 0cm;
    }
    body {
      font-family: "Times New Roman", serif;
      font-size: 12pt;
      line-height: 1.2;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 21cm;
      min-height: 29.7cm;
      margin: 0 auto;
      padding: 1.5cm 2cm;
      box-sizing: border-box;
    }
    .header {
      text-align: center;
      margin-bottom: 10px;
    }
    .logo {
      text-align: center;
      margin-bottom: 5px;
    }
    .company-name {
      font-size: 12pt;
      line-height: 1.1;
      margin-bottom: 5px;
    }
    .company-table {
      width: 100%;
      border: 1px solid #000;
      border-collapse: collapse;
      margin-bottom: 10px;
    }
    .company-table td {
      padding: 2px 5px;
      border: none;
    }
    .main-title {
      font-size: 14pt;
      font-weight: bold;
      text-align: center;
      text-decoration: underline;
      margin: 10px 0;
    }
    .sub-title {
      font-size: 14pt;
      font-weight: bold;
      text-align: center;
      text-decoration: underline;
      margin-bottom: 10px;
    }
    .date-line {
      text-align: right;
      margin: 15px 0;
    }
    .content {
      margin: 10px 0;
    }
    .field-block {
      margin-bottom: 8px;
    }
    .field-label {
      display: inline;
    }
    .field-value {
      display: inline;
      border-bottom: 1px solid #000;
      min-width: 200px;
      padding: 0 5px;
      text-align: center;
    }
    .inline-value {
      display: inline-block;
      border-bottom: 1px solid #000;
      min-width: 150px;
      padding: 0 5px;
      text-align: center;
    }
    .counter-section {
      margin: 15px 0;
    }
    .counter-block {
      margin-left: 30px;
      margin-bottom: 8px;
    }
    .signature-block {
      margin-top: 30px;
    }
    .signature-line {
      display: inline-block;
      border-bottom: 1px solid #000;
      min-width: 250px;
      padding: 0 5px;
      margin-top: 20px;
    }
    .text-center {
      text-align: center;
    }
    .text-right {
      text-align: right;
    }
    .mb-5 {
      margin-bottom: 5px;
    }
    .mb-10 {
      margin-bottom: 10px;
    }
    .mb-15 {
      margin-bottom: 15px;
    }
    .mt-10 {
      margin-top: 10px;
    }
    .mt-15 {
      margin-top: 15px;
    }
    .mt-20 {
      margin-top: 20px;
    }
    .ml-30 {
      margin-left: 30px;
    }
    .act-number {
      font-size: 12pt;
      font-weight: bold;
      text-align: center;
      margin: 5px 0 10px 0;
    }
  </style>
</head>
<body>
<div class="container">

  <div class="header">
     <img src="{{LOGO_SRC}}" alt="logo" style="height:60px;" />
    <div class="company-name">Акционерное общество</div>
    <div class="company-name"><strong>«Сахатранснефтегаз»</strong></div>
  </div>

  <table class="company-table">
    <tr>
      <td class="text-center"><strong>Структурное подразделение</strong></td>
    </tr>
    <tr>
      <td class="text-center"><strong>Управление газораспределительных сетей</strong></td>
    </tr>
    <tr>
      <td class="text-center">
        677005 Республика Саха (Якутия) г. Якутск, ул. П. Алексеева д. 64, тел/факс 46-00-07<br>
        Время работы: <strong>будни</strong> с 8:00 до 17:00, обед с 12:00 до 13:00;
        <strong>суббота, воскресенье – выходной</strong>
      </td>
    </tr>
  </table>

  <div class="act-number">Акт №: {{NUMBER}}/{{ACT_YEAR}}</div>

  <div class="main-title">АКТ ЗАМЕНЫ АККУМУЛЯТОРНОЙ БАТАРЕИ</div>
  <div class="sub-title">ГАЗОВОГО СЧЕТЧИКА</div>

  <div class="date-line mb-15">
    г. Якутск <span class="field-value">{{ACT_DATE}}</span> {{ACT_YEAR}} г.
  </div>

  <div class="content">
    <div class="field-block mb-10">
      <span class="field-label">Слесарем СТГО АО УГРС «Сахатранснефтегаз»:</span>
      <span class="field-value">{{TECHNICIAN_NAME}}</span>
    </div>

    <div class="field-block mb-15">
      <span class="field-label">Владельцем объекта:</span>
      <span class="field-value">{{OWNER_NAME}}</span>
    </div>

    <div class="field-block mb-10 mt-15">
      составлен настоящий акт о том, что в
      <span class="field-value">{{OBJECT_TYPE}}</span>
      (жилом доме, гараже, бане и т.д.)
    </div>

    <div class="field-block mb-15">
      находящегося по адресу: <strong>г. Якутск ул.</strong>
      <span class="field-value">{{OBJECT_ADDRESS}}</span>
      д. ______ кв. ___
    </div>

    <div class="field-block mt-20 mb-10">
      <strong>Снят</strong>
      <span class="field-value">{{REMOVAL_DATE}}</span> {{REMOVAL_YEAR}} г:
    </div>

    <div class="counter-block ml-30 mb-15">
      <div class="field-block mb-5">
        Счетчик газа G –
        <span class="inline-value">{{REMOVED_METER_MODEL}}</span>
        № <span class="inline-value">{{REMOVED_METER_NUMBER}}</span>
        с показаниями
        <span class="inline-value">{{REMOVED_METER_READING}}</span> м³.
      </div>

      <div class="field-block">
        Пломба № <span class="inline-value">{{REMOVED_SEAL_NUMBER}}</span>
      </div>
    </div>

    <div class="field-block mt-20 mb-10">
      <strong>Установлен</strong>
      <span class="field-value">{{INSTALLATION_DATE}}</span> {{INSTALLATION_YEAR}} г:
    </div>

    <div class="counter-block ml-30 mb-15">
      <div class="field-block mb-5">
        Счетчик газа G –
        <span class="inline-value">{{INSTALLED_METER_MODEL}}</span>
        № <span class="inline-value">{{INSTALLED_METER_NUMBER}}</span>
        с показаниями
        <span class="inline-value">{{INSTALLED_METER_READING}}</span> м³.
      </div>

      <div class="field-block">
        Пломба № <span class="inline-value">{{INSTALLED_SEAL_NUMBER}}</span>
      </div>
    </div>

    <div class="signature-block mt-20">
      <div class="field-block mb-10">
        <span class="field-label">Слесарь СТГО АО УГРС «Сахатранснефтегаз»:</span><br>
        <span class="signature-line">{{TECHNICIAN_SIGNATURE}}</span>
      </div>

      <div class="field-block">
        <span class="field-label">Владелец объекта:</span><br>
        <span class="signature-line">{{OWNER_SIGNATURE}}</span>
      </div>
    </div>
  </div>
</div>
</body>
</html>`;

// 2. ПЛОМБИРОВКА
export const HTML_PLOMB = `<!DOCTYPE html><html><head><meta charset="utf-8">${STYLE}</head><body>
  ${HEADER}
  <div class="act-title">АКТ ПЛОМБИРОВКИ № {{NUMBER}}</div>
  <div class="row"><div>г. Якутск</div><div>{{ACT_DATE}}</div></div>
  
  <div class="field">Адрес: <span class="u">{{OBJECT_ADDRESS}}</span></div>
  <div class="field">Абонент: <span class="u">{{OWNER_NAME}}</span></div>
  
  <div class="section-title">СВЕДЕНИЯ О ПРИБОРЕ УЧЕТА:</div>
  <div class="field">Модель: <span class="u">{{METER_MODEL}}</span></div>
  <div class="field">Заводской номер: <span class="u">{{METER_NUMBER}}</span></div>
  <div class="field">Показания: <span class="u">{{METER_READING}}</span></div>

  <div class="section-title">УСТАНОВЛЕНА ПЛОМБА:</div>
  <div class="field" style="font-size: 16pt;">НОМЕР: <span class="u">{{SEAL_NUMBER}}</span></div>
  <div class="field">Место установки: <span class="u">{{SEAL_PLACE}}</span></div>
  <div class="field">Примечание: {{NOTE}}</div>

  <div class="sign-block">
    <div class="sign-row">Техник: <div class="sign-img">{{TECHNICIAN_SIGNATURE}}</div></div>
    <div class="sign-row">Абонент: <div class="sign-img">{{OWNER_SIGNATURE}}</div></div>
  </div>
</body></html>`;

// 3. ЗАМЕНА СЧЕТЧИКА (MR)
export const HTML_MR = `<!DOCTYPE html><html><head><meta charset="utf-8">${STYLE}</head><body>
  ${HEADER}
  <div class="act-title">АКТ № {{NUMBER}}<br>ЗАМЕНЫ ГАЗОВОГО СЧЕТЧИКА</div>
  <div class="row"><div>г. Якутск</div><div>{{ACT_DATE}}</div></div>
  <div class="field">Адрес: <span class="u">{{OBJECT_ADDRESS}}</span></div>

  <div class="section-title">СНЯТ СЧЕТЧИК:</div>
  <div class="field">Модель: <span class="u">{{REMOVED_METER_MODEL}}</span> № <span class="u">{{REMOVED_METER_NUMBER}}</span></div>
  <div class="field">Показания: <span class="u">{{REMOVED_METER_READING}}</span></div>
  <div class="field">Пломба: <span class="u">{{REMOVED_SEAL_NUMBER}}</span></div>

  <div class="section-title">УСТАНОВЛЕН СЧЕТЧИК:</div>
  <div class="field">Модель: <span class="u">{{INSTALLED_METER_MODEL}}</span> № <span class="u">{{INSTALLED_METER_NUMBER}}</span></div>
  <div class="field">Показания: <span class="u">{{INSTALLED_METER_READING}}</span></div>
  <div class="field">Пломба №: <span class="u">{{INSTALLED_SEAL_NUMBER}}</span></div>

  <div class="sign-block">
    <div class="sign-row">Техник: <div class="sign-img">{{TECHNICIAN_SIGNATURE}}</div></div>
    <div class="sign-row">Абонент: <div class="sign-img">{{OWNER_SIGNATURE}}</div></div>
  </div>
</body></html>`;

// 4. ПЕРВИЧНАЯ УСТАНОВКА (MI)
export const HTML_MI = `<!DOCTYPE html><html><head><meta charset="utf-8">${STYLE}</head><body>
  ${HEADER}
  <div class="act-title">АКТ № {{NUMBER}}<br>ПЕРВИЧНОЙ УСТАНОВКИ СЧЕТЧИКА</div>
  <div class="row"><div>г. Якутск</div><div>{{ACT_DATE}}</div></div>
  <div class="field">Адрес: <span class="u">{{OBJECT_ADDRESS}}</span></div>

  <div class="section-title">УСТАНОВЛЕН СЧЕТЧИК:</div>
  <div class="field">Модель: <span class="u">{{INSTALLED_METER_MODEL}}</span> № <span class="u">{{INSTALLED_METER_NUMBER}}</span></div>
  <div class="field">Показания (на момент установки): <span class="u">{{INSTALLED_METER_READING}}</span></div>
  <div class="field">Пломба №: <span class="u">{{INSTALLED_SEAL_NUMBER}}</span></div>

  <div class="sign-block">
    <div class="sign-row">Техник: <div class="sign-img">{{TECHNICIAN_SIGNATURE}}</div></div>
    <div class="sign-row">Абонент: <div class="sign-img">{{OWNER_SIGNATURE}}</div></div>
  </div>
</body></html>`;

// 5. НАРУШЕНИЕ ПЛОМБЫ (SF - Seal Fail)
export const HTML_SF = `<!DOCTYPE html><html><head><meta charset="utf-8">${STYLE}</head><body>
  ${HEADER}
  <div class="act-title">АКТ № {{NUMBER}}<br>НАРУШЕНИЯ ПЛОМБИРОВКИ</div>
  <div class="row"><div>г. Якутск</div><div>{{ACT_DATE}}</div></div>
  <div class="field">Адрес: <span class="u">{{OBJECT_ADDRESS}}</span></div>

  <div class="section-title">ВЫЯВЛЕНО НАРУШЕНИЕ:</div>
  <div class="field">Описание: {{NOTE}}</div>
  <div class="field">Номер нарушенной пломбы: <span class="u">{{REMOVED_SEAL_NUMBER}}</span></div>
  
  <div class="section-title">ПРИНЯТЫЕ МЕРЫ / НОВАЯ ПЛОМБА:</div>
  <div class="field">Установлена пломба №: <span class="u">{{SEAL_NUMBER}}</span></div>
  <div class="field">Показания счетчика: <span class="u">{{METER_READING}}</span></div>

  <div class="sign-block">
    <div class="sign-row">Техник: <div class="sign-img">{{TECHNICIAN_SIGNATURE}}</div></div>
    <div class="sign-row">Абонент: <div class="sign-img">{{OWNER_SIGNATURE}}</div></div>
  </div>
</body></html>`;

// 6. ОТКЛЮЧЕНИЕ ГАЗА (SGE)
export const HTML_SGE = `<!DOCTYPE html><html><head><meta charset="utf-8">${STYLE}</head><body>
  ${HEADER}
  <div class="act-title">АКТ № {{NUMBER}}<br>ОТКЛЮЧЕНИЯ/ОГРАНИЧЕНИЯ ГАЗА</div>
  <div class="row"><div>г. Якутск</div><div>{{ACT_DATE}}</div></div>
  <div class="field">Адрес: <span class="u">{{OBJECT_ADDRESS}}</span></div>

  <div class="section-title">ПРИЧИНА ОТКЛЮЧЕНИЯ:</div>
  <div class="field"><span class="u">{{REASON}}</span></div>

  <div class="section-title">СПОСОБ ОТКЛЮЧЕНИЯ:</div>
  <div class="field">Способ: <span class="u">{{METHOD}}</span></div>
  <div class="field">Установлена заглушка/пломба №: <span class="u">{{SEAL_NUMBER}}</span></div>
  <div class="field">Показания счетчика: <span class="u">{{METER_READING}}</span></div>

  <div class="sign-block">
    <div class="sign-row">Техник: <div class="sign-img">{{TECHNICIAN_SIGNATURE}}</div></div>
    <div class="sign-row">Абонент: <div class="sign-img">{{OWNER_SIGNATURE}}</div></div>
  </div>
</body></html>`;