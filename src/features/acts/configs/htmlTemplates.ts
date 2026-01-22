// src/features/acts/configs/htmlTemplates.ts

// =====================================================================
// 1. АКТ ЗАМЕНЫ БАТАРЕИ (HTML_BR) - Детальный шаблон
// =====================================================================
export const HTML_BR = `<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title>АКТ ЗАМЕНЫ АККУМУЛЯТОРНОЙ БАТАРЕИ</title>
  <style>
    @page { size: A4; margin: 0cm; }
    body { font-family: "Times New Roman", serif; font-size: 12pt; line-height: 1.2; margin: 0; padding: 0; }
    .container { width: 21cm; min-height: 29.7cm; margin: 0 auto; padding: 1.5cm 2cm; box-sizing: border-box; }
    .header { text-align: center; margin-bottom: 10px; }
    .logo { text-align: center; margin-bottom: 5px; }
    .company-table { width: 100%; border: 1px solid #000; border-collapse: collapse; margin-bottom: 10px; }
    .company-table td { padding: 2px 5px; border: none; }
    .field-block { margin-bottom: 8px; }
    .field-label { display: inline; }
    /* Стиль для подставляемых значений (подчеркивание) */
    .field-value { display: inline; border-bottom: 1px solid #000; min-width: 200px; padding: 0 5px; text-align: center; font-weight: bold; }
    .inline-value { display: inline-block; border-bottom: 1px solid #000; min-width: 150px; padding: 0 5px; text-align: center; font-weight: bold; }
    .counter-block { margin-left: 30px; margin-bottom: 8px; }
    .signature-line { display: inline-block; border-bottom: 1px solid #000; min-width: 250px; padding: 0 5px; margin-top: 20px; }
    .text-center { text-align: center; }
    .mb-10 { margin-bottom: 10px; }
    .mb-15 { margin-bottom: 15px; }
    .mt-15 { margin-top: 15px; }
    .mt-20 { margin-top: 20px; }
  </style>
</head>
<body>
<div class="container">

  <div class="header">
     <img src="{{LOGO_SRC}}" alt="logo" style="height:60px;" />
    <div style="font-size: 12pt; margin-bottom: 5px;">Акционерное общество</div>
    <div style="font-size: 12pt; margin-bottom: 5px;"><strong>«Сахатранснефтегаз»</strong></div>
  </div>

  <table class="company-table">
    <tr><td class="text-center"><strong>Структурное подразделение</strong></td></tr>
    <tr><td class="text-center"><strong>Управление газораспределительных сетей</strong></td></tr>
    <tr>
      <td class="text-center" style="font-size: 10pt;">
        677005 Республика Саха (Якутия) г. Якутск, ул. П. Алексеева д. 64, тел/факс 46-00-07<br>
        Время работы: <strong>будни</strong> с 8:00 до 17:00, обед с 12:00 до 13:00; <strong>суббота, воскресенье – выходной</strong>
      </td>
    </tr>
  </table>

  <div style="font-size: 12pt; font-weight: bold; text-align: center; margin: 5px 0 10px 0;">
    Акт №: {{NUMBER}}/{{ACT_YEAR}}
  </div>

  <div style="font-size: 14pt; font-weight: bold; text-align: center; text-decoration: underline; margin: 10px 0;">
    АКТ ЗАМЕНЫ АККУМУЛЯТОРНОЙ БАТАРЕИ
  </div>
  <div style="font-size: 14pt; font-weight: bold; text-align: center; text-decoration: underline; margin-bottom: 10px;">
    ГАЗОВОГО СЧЕТЧИКА
  </div>

  <div style="text-align: right; margin: 15px 0;">
    г. Якутск <span class="field-value" style="min-width: 100px;">{{ACT_DATE}}</span> {{ACT_YEAR}} г.
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
      <span class="field-value" style="min-width: 100px;">{{OBJECT_TYPE}}</span>
      (жилом доме, гараже, бане и т.д.)
    </div>

    <div class="field-block mb-15">
      находящегося по адресу:
      <span class="field-value">{{OBJECT_ADDRESS}}</span>
    </div>

    <div class="field-block mt-20 mb-10">
      <strong>Снят</strong>
      <span class="field-value" style="min-width: 100px;">{{REMOVAL_DATE}}</span> {{REMOVAL_YEAR}} г:
    </div>

    <div class="counter-block">
      <div class="field-block">
        Счетчик газа G –
        <span class="inline-value" style="min-width: 100px;">{{REMOVED_METER_MODEL}}</span>
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
      <span class="field-value" style="min-width: 100px;">{{INSTALLATION_DATE}}</span> {{INSTALLATION_YEAR}} г:
    </div>

    <div class="counter-block">
      <div class="field-block">
        Счетчик газа G –
        <span class="inline-value" style="min-width: 100px;">{{INSTALLED_METER_MODEL}}</span>
        № <span class="inline-value">{{INSTALLED_METER_NUMBER}}</span>
        с показаниями
        <span class="inline-value">{{INSTALLED_METER_READING}}</span> м³.
      </div>
      <div class="field-block">
        Пломба № <span class="inline-value">{{INSTALLED_SEAL_NUMBER}}</span>
      </div>
    </div>

    <div style="margin-top: 30px;">
      <div class="field-block mb-10">
        <span class="field-label">Слесарь СТГО АО УГРС «Сахатранснефтегаз»:</span><br>
        <div class="signature-line" style="height: 50px; vertical-align: bottom;">{{TECHNICIAN_SIGNATURE}}</div>
      </div>

      <div class="field-block">
        <span class="field-label">Владелец объекта:</span><br>
        <div class="signature-line" style="height: 50px; vertical-align: bottom;">{{OWNER_SIGNATURE}}</div>
      </div>
    </div>
  </div>
</div>
</body>
</html>`;


// =====================================================================
// ОБЩИЕ СТИЛИ ДЛЯ ОСТАЛЬНЫХ АКТОВ
// =====================================================================
const COMMON_STYLE = `
  <style>
    @page { size: A4; margin: 0cm; }
    body { font-family: "Times New Roman", serif; font-size: 12pt; line-height: 1.3; margin: 0; padding: 2cm; }
    .header { text-align: center; margin-bottom: 20px; }
    .act-title { border: 2px solid #000; padding: 10px; text-align: center; margin: 20px 0; font-weight: bold; font-size: 14pt; }
    .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
    .field { margin-bottom: 10px; }
    .u { border-bottom: 1px solid #000; padding: 0 10px; font-weight: bold; display: inline-block; min-width: 50px; text-align: center; }
    .section-title { margin-top: 25px; margin-bottom: 10px; font-weight: bold; text-decoration: underline; }
    .sign-block { margin-top: 40px; }
    .sign-row { margin-bottom: 30px; }
    .sign-box { border-bottom: 1px solid #000; height: 40px; width: 200px; display: inline-block; vertical-align: bottom; }
    img { max-height: 100%; }
  </style>
`;

const COMMON_HEADER = `
  <div class="header">
    <div style="font-weight: bold;">АО «Сахатранснефтегаз»</div>
    <div>Управление газораспределительных сетей</div>
  </div>
`;

// =====================================================================
// 2. ЗАМЕНА СЧЕТЧИКА (HTML_MR)
// =====================================================================
export const HTML_MR = `<!DOCTYPE html><html><head><meta charset="utf-8">${COMMON_STYLE}</head><body>
  ${COMMON_HEADER}
  <div class="act-title">АКТ № {{NUMBER}}<br>ЗАМЕНЫ ПРИБОРА УЧЕТА ГАЗА</div>
  
  <div class="row">
    <div>г. Якутск</div>
    <div>{{ACT_DATE}} г.</div>
  </div>

  <div class="field">Адрес объекта: <span class="u" style="width: 70%">{{OBJECT_ADDRESS}}</span></div>
  <div class="field">Абонент: <span class="u">{{OWNER_NAME}}</span></div>
  <div class="field">Исполнитель: <span class="u">{{TECHNICIAN_NAME}}</span></div>

  <div class="section-title">СНЯТ ПРИБОР УЧЕТА:</div>
  <div class="field">Модель: <span class="u">{{REMOVED_METER_MODEL}}</span> Номер: <span class="u">{{REMOVED_METER_NUMBER}}</span></div>
  <div class="field">Показания: <span class="u">{{REMOVED_METER_READING}}</span></div>
  <div class="field">Пломба: <span class="u">{{REMOVED_SEAL_NUMBER}}</span></div>

  <div class="section-title">УСТАНОВЛЕН ПРИБОР УЧЕТА:</div>
  <div class="field">Модель: <span class="u">{{INSTALLED_METER_MODEL}}</span> Номер: <span class="u">{{INSTALLED_METER_NUMBER}}</span></div>
  <div class="field">Показания: <span class="u">{{INSTALLED_METER_READING}}</span></div>
  <div class="field">Пломба: <span class="u">{{INSTALLED_SEAL_NUMBER}}</span></div>

  <div class="sign-block">
    <div class="sign-row">
       Исполнитель: <span class="sign-box">{{TECHNICIAN_SIGNATURE}}</span>
    </div>
    <div class="sign-row">
       Абонент: <span class="sign-box">{{OWNER_SIGNATURE}}</span>
    </div>
  </div>
</body></html>`;

// =====================================================================
// 3. ПЛОМБИРОВКА (HTML_PLOMB)
// =====================================================================
export const HTML_PLOMB = `<!DOCTYPE html><html><head><meta charset="utf-8">${COMMON_STYLE}</head><body>
  ${COMMON_HEADER}
  <div class="act-title">АКТ № {{NUMBER}}<br>ПЛОМБИРОВКИ ГАЗОВОГО ОБОРУДОВАНИЯ</div>
  
  <div class="row">
    <div>г. Якутск</div>
    <div>{{ACT_DATE}} г.</div>
  </div>

  <div class="field">Адрес: <span class="u" style="width: 80%">{{OBJECT_ADDRESS}}</span></div>
  <div class="field">Владелец: <span class="u">{{OWNER_NAME}}</span></div>

  <div class="section-title">СВЕДЕНИЯ О ПРИБОРЕ УЧЕТА:</div>
  <div class="field">Модель: <span class="u">{{METER_MODEL}}</span> № <span class="u">{{METER_NUMBER}}</span></div>
  <div class="field">Показания: <span class="u">{{METER_READING}}</span></div>

  <div class="section-title">УСТАНОВЛЕНА ПЛОМБА:</div>
  <div class="field">Номер пломбы: <span class="u" style="font-size: 14pt">{{SEAL_NUMBER}}</span></div>
  <div class="field">Место установки: <span class="u">{{SEAL_PLACE}}</span></div>
  <div class="field">Примечание: <span class="u">{{NOTE}}</span></div>

  <div class="sign-block">
    <div class="sign-row">Техник: <span class="sign-box">{{TECHNICIAN_SIGNATURE}}</span></div>
    <div class="sign-row">Владелец: <span class="sign-box">{{OWNER_SIGNATURE}}</span></div>
  </div>
</body></html>`;

// =====================================================================
// 4. ПЕРВИЧНАЯ УСТАНОВКА (HTML_MI)
// =====================================================================
export const HTML_MI = `<!DOCTYPE html><html><head><meta charset="utf-8">${COMMON_STYLE}</head><body>
  ${COMMON_HEADER}
  <div class="act-title">АКТ № {{NUMBER}}<br>ПЕРВИЧНОЙ УСТАНОВКИ ПРИБОРА УЧЕТА</div>
  
  <div class="row"><div>г. Якутск</div><div>{{ACT_DATE}} г.</div></div>
  <div class="field">Адрес: <span class="u">{{OBJECT_ADDRESS}}</span></div>

  <div class="section-title">УСТАНОВЛЕН СЧЕТЧИК:</div>
  <div class="field">Модель: <span class="u">{{INSTALLED_METER_MODEL}}</span> № <span class="u">{{INSTALLED_METER_NUMBER}}</span></div>
  <div class="field">Начальные показания: <span class="u">{{INSTALLED_METER_READING}}</span></div>
  <div class="field">Установлена пломба №: <span class="u">{{INSTALLED_SEAL_NUMBER}}</span></div>

  <div class="sign-block">
    <div class="sign-row">Техник: <span class="sign-box">{{TECHNICIAN_SIGNATURE}}</span></div>
    <div class="sign-row">Абонент: <span class="sign-box">{{OWNER_SIGNATURE}}</span></div>
  </div>
</body></html>`;

// =====================================================================
// 5. НАРУШЕНИЕ ПЛОМБЫ (HTML_SF)
// =====================================================================
export const HTML_SF = `<!DOCTYPE html><html><head><meta charset="utf-8">${COMMON_STYLE}</head><body>
  ${COMMON_HEADER}
  <div class="act-title">АКТ № {{NUMBER}}<br>НАРУШЕНИЯ ПЛОМБЫ</div>
  
  <div class="row"><div>г. Якутск</div><div>{{ACT_DATE}} г.</div></div>
  <div class="field">Адрес: <span class="u">{{OBJECT_ADDRESS}}</span></div>

  <div class="section-title">ВЫЯВЛЕНО НАРУШЕНИЕ:</div>
  <div class="field">Описание: <span class="u">{{NOTE}}</span></div>
  <div class="field">Сорванная пломба №: <span class="u">{{REMOVED_SEAL_NUMBER}}</span></div>

  <div class="section-title">ПРИНЯТЫЕ МЕРЫ / НОВАЯ ПЛОМБА:</div>
  <div class="field">Установлена пломба №: <span class="u">{{SEAL_NUMBER}}</span></div>
  <div class="field">Показания счетчика: <span class="u">{{METER_READING}}</span></div>

  <div class="sign-block">
    <div class="sign-row">Техник: <span class="sign-box">{{TECHNICIAN_SIGNATURE}}</span></div>
    <div class="sign-row">Абонент: <span class="sign-box">{{OWNER_SIGNATURE}}</span></div>
  </div>
</body></html>`;

// =====================================================================
// 6. ОТКЛЮЧЕНИЕ ГАЗА (HTML_SGE)
// =====================================================================
export const HTML_SGE = `<!DOCTYPE html><html><head><meta charset="utf-8">${COMMON_STYLE}</head><body>
  ${COMMON_HEADER}
  <div class="act-title">АКТ № {{NUMBER}}<br>ОТКЛЮЧЕНИЯ/ОГРАНИЧЕНИЯ ГАЗА</div>
  
  <div class="row"><div>г. Якутск</div><div>{{ACT_DATE}} г.</div></div>
  <div class="field">Адрес: <span class="u">{{OBJECT_ADDRESS}}</span></div>

  <div class="section-title">ПРИЧИНА ОТКЛЮЧЕНИЯ:</div>
  <div class="field"><span class="u">{{REASON}}</span></div>

  <div class="section-title">СПОСОБ ОТКЛЮЧЕНИЯ:</div>
  <div class="field"><span class="u">{{METHOD}}</span></div>
  <div class="field">Установлена пломба/заглушка №: <span class="u">{{SEAL_NUMBER}}</span></div>
  <div class="field">Показания на момент откл.: <span class="u">{{METER_READING}}</span></div>

  <div class="sign-block">
    <div class="sign-row">Техник: <span class="sign-box">{{TECHNICIAN_SIGNATURE}}</span></div>
    <div class="sign-row">Абонент: <span class="sign-box">{{OWNER_SIGNATURE}}</span></div>
  </div>
</body></html>`;