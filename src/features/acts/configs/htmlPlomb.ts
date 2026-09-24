export const HTML_PLOMB = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Акт пломбирования прибора учета газа</title>
<style>
  @page { size: A4; margin: 0cm; }
  body { font-family: "Times New Roman", serif; font-size: 14pt; margin: 0; padding: 0; }
  .container { padding: 1.5cm; }
  .logo { text-align: center; margin-bottom: 10px; }
  .company-table { width: 100%; border-collapse: collapse; text-align: center; font-size: 12pt; margin-top: 10px; }
  .company-table td, .company-table th { border: 1px solid black; padding: 4px; }

  .act-number { text-align: center; margin-top: 10px; font-weight: bold; }
  .title { text-align: center; font-size: 14pt; font-weight: bold; text-transform: uppercase; margin-top: 16px; text-decoration: underline; }
  .date-line { text-align: center; margin-top: 10px; }

  .info { margin-top: 18px; font-size: 12pt; line-height: 1.35; }
  .u { display: inline-block; border-bottom: 1px solid #000; padding: 0 4px; min-width: 180px; }
  .u.sm { min-width: 90px; }
  .u.md { min-width: 140px; }
  .u.lg { min-width: 260px; }
  .u.xl { min-width: 380px; }

  .line { margin-top: 10px; font-size: 12pt; }
  .indent { margin-left: 22px; }

  .sign-row { margin-top: 26px; font-size: 12pt; display: flex; align-items: flex-end; gap: 10px; flex-wrap: wrap; }
  .sign-label { white-space: nowrap; }
  .sign-box { border-bottom: 1px solid #000; height: 55px; min-width: 220px; position: relative; flex: 1; }
  .sign-box img { position: absolute; left: 0; right: 0; margin: auto; max-height: 55px; max-width: 100%; top: 0; }
  .sign-name { white-space: nowrap; }
</style>
</head>
<body>
<div class="container">
  <div class="logo">
    <img src="{{LOGO_SRC}}" style="height: 60px;" />
  </div>

  <table class="company-table">
    <tr>
      <th colspan="2">Акционерное общество<br/>«Сахатранснефтегаз»</th>
    </tr>
    <tr>
      <td colspan="2">Структурное подразделение<br/>Управление по сбытовой деятельности</td>
    </tr>
    <tr>
      <td colspan="2">
        677005 Республика Саха (Якутия), г. Якутск, ул. П.Алексеева, 64, тел/факс 46-09-07<br/>
        (время работы: пн-пт 17:00, сб 12:00-13:00); суббота, воскресенье - выходные дни
      </td>
    </tr>
  </table>

  <div class="act-number">Акт №: {{NUMBER}}/{{ACT_YEAR}}</div>

  <div class="title">Акт пломбирования прибора учета газа</div>
  <div class="date-line">от «<span class="u md">{{ACT_DATE_FULL}}</span>»</div>

  <div class="info">
    Дан(а) ФИО: <span class="u xl">{{OWNER_NAME}}</span><br/>
    По адресу: <span class="u xl">{{OBJECT_ADDRESS}}</span>
  </div>

  <div class="info" style="margin-top: 16px;">
    Прибор учета расхода газа опломбирован:
  </div>

  <div class="line">
    1. G- <span class="u sm">{{M1_MODEL}}</span> № сч <span class="u md">{{M1_NUMBER}}</span>
    пломба № <span class="u md">{{M1_SEAL_NUMBER}}</span> примечания <span class="u lg">{{M1_NOTE}}</span>
  </div>
  <div class="line indent">
    текущие показания прибора учета газа <span class="u sm">{{M1_READING}}</span> м³
  </div>

  <div class="line">
    2. G- <span class="u sm">{{M2_MODEL}}</span> № сч <span class="u md">{{M2_NUMBER}}</span>
    пломба № <span class="u md">{{M2_SEAL_NUMBER}}</span> примечания <span class="u lg">{{M2_NOTE}}</span>
  </div>
  <div class="line indent">
    текущие показания прибора учета газа <span class="u sm">{{M2_READING}}</span> м³
  </div>

  <div class="line">
    3. G- <span class="u sm">{{M3_MODEL}}</span> № сч <span class="u md">{{M3_NUMBER}}</span>
    пломба № <span class="u md">{{M3_SEAL_NUMBER}}</span> примечания <span class="u lg">{{M3_NOTE}}</span>
  </div>
  <div class="line indent">
    текущие показания прибора учета газа <span class="u sm">{{M3_READING}}</span> м³
  </div>

  <div class="sign-row" style="margin-top: 34px;">
    <div class="sign-label">УСД АО «Сахатранснефтегаз»</div>
    <div class="sign-box">{{TECHNICIAN_SIGNATURE}}</div>
    <div class="sign-name">/ <span class="u md">{{TECHNICIAN_NAME}}</span> /</div>
  </div>

  <div class="sign-row">
    <div class="sign-label">АКТ ПОЛУЧИЛ(А)</div>
    <div class="sign-box">{{OWNER_SIGNATURE}}</div>
    <div class="sign-name">/ <span class="u md">{{OWNER_NAME}}</span> /</div>
    <div class="sign-label">Дата</div>
    <div class="sign-name"><span class="u md">{{RECEIVED_DATE}}</span></div>
  </div>
</div>
</body>
</html>`;
