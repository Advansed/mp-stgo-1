export const HTML_SF    = `<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title>АКТ СРЫВА ПЛОМБЫ</title>
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
    .signature-block { margin-top: 30px; }
    .signature-line { display: inline-block; border-bottom: 1px solid #000; min-width: 250px; padding: 0 5px; margin-top: 20px; }
    .text-center { text-align: center; }
    .act-number { font-size: 12pt; font-weight: bold; text-align: center; margin: 5px 0 10px 0; }
    .reason-block { margin-left: 30px; margin-bottom: 8px; }
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
  <div class="main-title">АКТ СРЫВА ПЛОМБЫ</div>

  <div class="date-line">
    г. Якутск «<span class="field-value">{{ACT_DAY}}</span>» 
    <span class="field-value">{{ACT_MONTH}}</span> 
    <span class="field-value">{{ACT_YEAR}}</span> год
  </div>

  <div class="content">
    <div class="field-block">
      <span>Представителями УГРС АО «Сахатранснефтегаз»:</span>
    </div>
    
    <div class="field-block">
      <span>Слесарем СТГО АО УГРС «Сахатранснефтегаз»:</span>
      <span class="field-value">{{TECHNICIAN1_NAME}}</span>
    </div>

    <div class="field-block">
      <span>Слесарем СТГО АО УГРС «Сахатранснефтегаз»:</span>
      <span class="field-value">{{TECHNICIAN2_NAME}}</span>
    </div>

    <div class="field-block">
      <span>Владельцем объекта:</span>
      <span class="field-value">{{OWNER_NAME}}</span>
    </div>

    <div class="field-block">
      составлен настоящий акт в том, что в
      <span class="field-value">{{OBJECT_TYPE}}</span>
      (жилом доме, гараже, бане и т.д.)
    </div>

    <div class="field-block">
      находящегося по адресу: [г. Якутск ул.]
      <span class="field-value">{{STREET}}</span>
      д. <span class="inline-value">{{HOUSE}}</span> 
      кв. <span class="inline-value">{{APARTMENT}}</span>
    </div>

    <div class="field-block">
      <strong>Сорвана</strong> «<span class="field-value">{{BREAK_DAY}}</span>» 
      <span class="field-value">{{BREAK_MONTH}}</span> 
      <span class="field-value">{{BREAK_YEAR}}</span> г:
    </div>

    <div class="reason-block">
      <div class="field-block">
        1. Пломба № <span class="inline-value">{{BREAK_SEAL_NUMBER}}</span> 
        цвет <span class="inline-value">{{BREAK_SEAL_COLOR}}</span>
      </div>
      <div class="field-block">
        2. Счетчик газа G---<span class="inline-value">{{BREAK_METER_MODEL}}</span> 
        № <span class="inline-value">{{BREAK_METER_NUMBER}}</span>
        с показаниями <span class="inline-value">{{BREAK_METER_READING}}</span> м3.
      </div>
    </div>

    <div class="field-block">
      По причине <span class="field-value">{{REASON}}</span>
    </div>

    <div class="field-block">
      <strong>Установлена</strong> «<span class="field-value">{{INSTALL_DAY}}</span>» 
      <span class="field-value">{{INSTALL_MONTH}}</span> 
      <span class="field-value">{{INSTALL_YEAR}}</span> г:
    </div>

    <div class="reason-block">
      <div class="field-block">
        1. Пломба № <span class="inline-value">{{INSTALL_SEAL_NUMBER}}</span> 
        цвет <span class="inline-value">{{INSTALL_SEAL_COLOR}}</span>
      </div>
      <div class="field-block">
        2. Счетчик газа G---<span class="inline-value">{{INSTALL_METER_MODEL}}</span> 
        № <span class="inline-value">{{INSTALL_METER_NUMBER}}</span>
        с показаниями <span class="inline-value">{{INSTALL_METER_READING}}</span> м3.
      </div>
    </div>

    <div class="signature-block">
      <div class="field-block">
        <span>Подписи сторон:</span>
      </div>
      <div class="field-block">
        <span>Слесарь СТГО АО УГРС «Сахатранснефтегаз»:</span><br>
        <span class="signature-line">{{TECHNICIAN1_SIGNATURE}}</span>
      </div>
      <div class="field-block">
        <span>Слесарь СТГО АО УГРС «Сахатранснефтегаз»:</span><br>
        <span class="signature-line">{{TECHNICIAN2_SIGNATURE}}</span>
      </div>
      <div class="field-block">
        <span>Владелец объекта:</span><br>
        <span class="signature-line">{{OWNER_SIGNATURE}}</span>
      </div>
    </div>
  </div>
</div>
</body>
</html>`;
