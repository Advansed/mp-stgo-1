export const HTML_BR       = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Акт замены аккумуляторной батареи</title>
<style>
  @page { size: A4; margin: 0cm; }
  body { font-family: "Times New Roman", serif; font-size: 14pt; margin: 0; padding: 0; }
  .container { padding: 1.5cm; }
  .logo { text-align: center; margin-bottom: 10px; }
  .company-table { width: 100%; border-collapse: collapse; text-align: center; font-size: 12pt; margin-top: 10px; }
  .company-table td, .company-table th { border: 1px solid black; padding: 4px; }
  .act-number { text-align: center; margin-top: 10px; font-weight: bold; }
  .title { text-align: center; font-size: 14pt; font-weight: bold; text-transform: uppercase; margin-top: 20px; text-decoration: underline; }
  .sub-title { text-align: center; font-weight: bold; margin-top: 10px; }
  .info { margin-top: 20px; font-size: 12pt; }
  .info span { text-decoration: underline; font-weight: bold; }
  .field-block { margin-top: 10px; }
  .field-label { display: inline-block; min-width: 180px; }
  .field-value { display: inline-block; border-bottom: 1px solid black; min-width: 200px; padding: 0 5px; }
  .signatures { margin-top: 50px; display: flex; justify-content: space-between; }
  .signature-block { width: 45%; text-align: center; }
  .signature-line { border-bottom: 1px solid black; height: 50px; margin-top: 20px; position: relative; }
  .signature-line img { position: absolute; left: 0; right: 0; margin: auto; max-height: 55px; max-width: 100%; top: 0; }
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
      <td colspan="2">Структурное подразделение<br/>Управление газораспределительных сетей</td>
    </tr>
    <tr>
      <td colspan="2">
        677005 Республика Саха (Якутия), г. Якутск, ул. П.Алексеева, 64, тел/факс 46-09-07<br/>
        (время работы: пн-пт 17:00, сб 12:00-13:00); суббота, воскресенье - выходные дни
      </td>
    </tr>
  </table>

  <div class="act-number">Акт №: {{NUMBER}}/{{ACT_YEAR}}</div>

  <div class="title">Акт замены аккумуляторной батареи<br/>газового счетчика</div>

  <div class="info">
    Слесарем СТГО АО УГРС «Сахатранснефтегаз»: <span>{{TECHNICIAN_NAME}}</span><br/>
    Владельца объекта: <span>{{OWNER_NAME}}</span><br/>
    составлен настоящий акт о том, что в <span>{{OBJECT_TYPE}}</span>, находящегося в <span>{{OBJECT_ADDRESS}}</span>
  </div>

  <div class="field-block">
    <span class="field-label">Снят <span>{{ACT_DATE}}</span> {{ACT_YEAR}} г.:</span>
    Счетчик газа G-<span class="field-value">{{REMOVED_METER_MODEL}}</span> №
    <span class="field-value">{{REMOVED_METER_NUMBER}}</span> с показаниями
    <span class="field-value">{{REMOVED_METER_READING}}</span> м³.
  </div>

  <div class="field-block">
    <span class="field-label">Пломба №</span>
    <span class="field-value">{{REMOVED_SEAL_NUMBER}}</span>
  </div>

  <div class="field-block">
    <span class="field-label">Установлен <span>{{ACT_DATE}}</span> {{ACT_YEAR}} г.:</span>
    Счетчик газа G-<span class="field-value">{{INSTALLED_METER_MODEL}}</span> №
    <span class="field-value">{{INSTALLED_METER_NUMBER}}</span> с показаниями
    <span class="field-value">{{INSTALLED_METER_READING}}</span> м³.
  </div>

  <div class="field-block">
    <span class="field-label">Пломба №</span>
    <span class="field-value">{{INSTALLED_SEAL_NUMBER}}</span>
  </div>

  <div class="signatures">
    <div class="signature-block">
      Слесарь СТГО АО УГРС «Сахатранснефтегаз»
      <div class="signature-line">{{TECHNICIAN_SIGNATURE}}</div>
    </div>
    <div class="signature-block">
      Владелец объекта:
      <div class="signature-line">{{OWNER_SIGNATURE}}</div>
    </div>
  </div>
</div>
</body>
</html>`;
