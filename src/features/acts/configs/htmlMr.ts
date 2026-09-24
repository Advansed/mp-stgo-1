export const HTML_MR    = `<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title>АКТ ЗАМЕНЫ ГАЗОВОГО СЧЕТЧИКА</title>
  <style>
    @page { size: A4; margin: 0cm; }
    body { font-family: "Times New Roman", serif; font-size: 12pt; line-height: 1.2; margin: 0; padding: 0; }
    .container { width: 21cm; min-height: 29.7cm; margin: 0 auto; padding: 1.5cm 2cm; box-sizing: border-box; }
    .header { text-align: center; margin-bottom: 10px; }
    .company-name { font-size: 12pt; line-height: 1.1; margin-bottom: 5px; }
    .company-table { width: 100%; border: 1px solid #000; border-collapse: collapse; margin-bottom: 10px; }
    .company-table td { padding: 2px 5px; border: none; }
    .main-title { font-size: 14pt; font-weight: bold; text-align: center; text-decoration: underline; margin: 10px 0; }
    .date-line { text-align: right; margin: 15px 0; }
    .content { margin: 10px 0; }
    .field-block { margin-bottom: 8px; }
    .field-value { display: inline; border-bottom: 1px solid #000; min-width: 200px; padding: 0 5px; text-align: center; }
    .inline-value { display: inline-block; border-bottom: 1px solid #000; min-width: 150px; padding: 0 5px; text-align: center; }
    .counter-block { margin-left: 30px; margin-bottom: 8px; }
    .signature-block { margin-top: 30px; }
    .signature-line { display: inline-block; border-bottom: 1px solid #000; min-width: 250px; padding: 0 5px; margin-top: 20px; }
    .text-center { text-align: center; }
    .act-number { font-size: 12pt; font-weight: bold; text-align: center; margin: 5px 0 10px 0; }
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
    <tr><td class="text-center"><strong>Структурное подразделение</strong></td></tr>
    <tr><td class="text-center"><strong>Управление газораспределительных сетей</strong></td></tr>
    <tr><td class="text-center">
      677005 Республика Саха (Якутия) г. Якутск, ул. П. Алексеева д. 64, тел/факс 46-00-07<br>
      Время работы: <strong>будни</strong> с 8:00 до 17:00, обед с 12:00 до 13:00;
      <strong>суббота, воскресенье – выходной</strong>
    </td></tr>
  </table>

  <div class="act-number">Акт №: {{NUMBER}}/{{YEAR}}</div>
  <div class="main-title">АКТ ЗАМЕНЫ ГАЗОВОГО СЧЕТЧИКА</div>

  <div class="date-line">
    г. Якутск <span class="field-value">{{ACT_DATE}}</span> {{ACT_YEAR}} г.
  </div>

  <div class="content">
    <div class="field-block">
      <span>Слесарем СТГО АО УГРС «Сахатранснефтегаз»:</span>
      <span class="field-value">{{TECHNICIAN_NAME}}</span>
    </div>

    <div class="field-block">
      <span>Владельцем объекта:</span>
      <span class="field-value">{{OWNER_NAME}}</span>
    </div>

    <div class="field-block">
      составлен настоящий акт о том, что в
      <span class="field-value">{{OBJECT_TYPE}}</span>
      (жилом доме, гараже, бане и т.д.)
    </div>

    <div class="field-block">
      находящегося по адресу: <strong>г. Якутск ул.</strong>
      <span class="field-value">{{OBJECT_ADDRESS}}</span>
      д. ______ кв. ___
    </div>

    <div class="field-block">
      <strong>Снят</strong>
      <span class="field-value">{{REMOVAL_DATE}}</span>
    </div>

    <div class="counter-block">
      <div class="field-block">
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

    <div class="field-block">
      <strong>Установлен</strong>
      <span class="field-value">{{INSTALLATION_DATE}}</span>
    </div>

    <div class="counter-block">
      <div class="field-block">
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

    <div class="signature-block">
      <div class="field-block">
        <span>Слесарь СТГО АО УГРС «Сахатранснефтегаз»:</span><br>
        <span class="signature-line">{{TECHNICIAN_SIGNATURE}}</span>
      </div>
      <div class="field-block">
        <span>Владелец объекта:</span><br>
        <span class="signature-line">{{OWNER_SIGNATURE}}</span>
      </div>
    </div>
  </div>
</div>
</body>
</html>`
