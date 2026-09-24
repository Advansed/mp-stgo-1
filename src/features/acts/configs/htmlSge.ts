export const HTML_SGE   = `<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title>АКТ ОТКЛЮЧЕНИЯ БЫТОВОГО ГАЗОИСПОЛЬЗУЮЩЕГО ГАЗОВОГО ОБОРУДОВАНИЯ</title>
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
    .underline { text-decoration: underline; }
    .bold { font-weight: bold; }
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
  <div class="main-title">АКТ ОТКЛЮЧЕНИЯ БЫТОВОГО ГАЗОИСПОЛЬЗУЮЩЕГО ГАЗОВОГО ОБОРУДОВАНИЯ</div>

  <div class="date-line">
    «<span class="field-value">{{ACT_DAY}}</span>» <span class="field-value">{{ACT_MONTH}}</span> <span class="field-value">{{ACT_YEAR}}</span> г. л/с <span class="field-value">{{PERSONAL_ACCOUNT}}</span>
  </div>

  <div class="content">
    <div class="field-block">
      Ввиду <span class="underline">Наряд-задание на отключение № <span class="field-value">{{WORK_ORDER_NUMBER}}</span> от <span class="field-value">{{WORK_ORDER_DATE}}</span> по задолженности</span>
    </div>

    <div class="field-block">
      <span class="field-value">{{DEBT_REASON}}</span>
    </div>

    <div class="field-block">
      <span>в квартире № <span class="field-value">{{APARTMENT_NUMBER}}</span> дома № <span class="field-value">{{HOUSE_NUMBER}}</span> корпус <span class="field-value">{{BUILDING_NUMBER}}</span> по ул. <span class="field-value">{{STREET_NAME}}</span></span>
    </div>

    <div class="field-block">
      <span>г. Якутск <span class="field-value">{{CITY_DISTRICT}}</span></span>
    </div>

    <div class="field-block">
      <span>Заказчик <span class="field-value">{{CUSTOMER_NAME}}</span></span>
    </div>

    <div class="field-block">
      <span>представителем УГРС АО «Сахатранснефтегаз» <span class="field-value">{{REPRESENTATIVE_POSITION}}</span> <span class="field-value">{{REPRESENTATIVE_NAME}}</span></span>
    </div>

    <div class="field-block">
      <span>в <span class="field-value">{{DISCONNECTION_TIME_HOURS}}</span> ч <span class="field-value">{{DISCONNECTION_TIME_MINUTES}}</span> мин. отключено газоиспользующее оборудование:</span>
    </div>

    <div class="field-block">
      <span class="field-value">{{EQUIPMENT_DESCRIPTION}}</span>
    </div>

    <div class="field-block">
      <span class="field-value">{{EQUIPMENT_COUNT}}</span>
    </div>

    <div class="field-block">
      <span class="field-value">{{DISCONNECTION_METHOD}}</span>
    </div>

    <div class="field-block">
      <span>Установлена пломба № <span class="field-value">{{SEAL_NUMBER}}</span></span>
    </div>

    <div class="signature-block">
      <div class="field-block">
        <span>Представитель УГРС АО «Сахатранснегаз»</span><br>
        <span class="signature-line">{{REPRESENTATIVE_SIGNATURE}}</span><br>
        <span>личная подпись инициалы, фамилия</span>
      </div>

      <div class="field-block">
        <span>Заказчик</span><br>
        <span class="signature-line">{{CUSTOMER_SIGNATURE}}</span><br>
        <span>личная подпись инициалы, фамилия</span>
      </div>
    </div>

    <div class="field-block" style="margin-top: 40px;">
      <span>Газоиспользующее оборудование подключено «<span class="field-value">{{RECONNECTION_DATE}}</span>» <span class="field-value">{{RECONNECTION_MONTH}}</span> <span class="field-value">{{RECONNECTION_YEAR}}</span> г.</span>
    </div>

    <div class="field-block">
      <span>представителем УГРС АО «Сахатранснефтегаз»</span><br>
      <span class="field-value">{{RECONNECTION_REPRESENTATIVE}}</span><br>
      <span>должность, инициалы, фамилия личная подпись</span>
    </div>

    <div class="field-block">
      <span>Представитель УГРС АО «Сахатранснефтегаз»</span><br>
      <span class="signature-line">{{RECONNECTION_REPRESENTATIVE_SIGNATURE}}</span><br>
      <span>личная подпись инициалы, фамилия</span>
    </div>

    <div class="field-block">
      <span>Потребитель газа</span><br>
      <span class="signature-line">{{CUSTOMER_SIGNATURE}}</span><br>
      <span>личная подпись инициалы, фамилия</span>
    </div>

    <div class="field-block">
      <span>на основании <span class="field-value">{{RECONNECTION_BASIS}}</span></span>
    </div>
  </div>
</div>
</body>
</html>`;
