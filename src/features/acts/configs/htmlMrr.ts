export const HTML_MRR   = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Акт снятия показаний ПУГ</title>
<style>
  @page { size: A4; margin: 0cm; }
  body { font-family: "Times New Roman", serif; font-size: 14pt; margin: 0; padding: 0; }
  .page { padding: 1.5cm; }
  .center { text-align: center; }
  .act-no { font-weight: bold; margin-top: 10px; }
  .act-title { font-weight: bold; margin-top: 6px; }
  .u { display:inline-block; border-bottom: 1px solid #000; padding: 0 6px; min-width: 220px; }
  .u.sm { min-width: 120px; }
  .u.md { min-width: 180px; }
  .u.lg { min-width: 320px; }
  .row { margin-top: 10px; font-size: 12pt; line-height: 1.35; }
  table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12pt; }
  td, th { border: 1px solid #000; padding: 6px; vertical-align: top; }
  .muted { font-size: 10pt; }
  .sign-row { margin-top: 16px; font-size: 12pt; display:flex; align-items:flex-end; gap: 10px; flex-wrap: wrap; }
  .sign-box { border-bottom: 1px solid #000; height: 55px; min-width: 240px; position: relative; flex: 1; }
  .sign-box img { position: absolute; left: 0; right: 0; margin: auto; max-height: 55px; max-width: 100%; top: 0; }
  .cut { margin: 14px 0; border-top: 2px dashed #000; }
  .pb { page-break-after: always; }
</style>
</head>
<body>

<!-- Экземпляр 1 -->
<div class="page pb">
  <div class="center">
    <img src="{{LOGO_SRC}}" style="height: 55px;" />
    <div class="act-no">АКТ № <span class="u sm">{{NUMBER}}</span></div>
    <div class="act-title">снятия показаний прибора учета газа</div>
  </div>

  <div class="row center" style="margin-top: 14px;">
    «<span class="u sm">{{ACT_DATE_FULL}}</span>» <span class="u sm">{{ACT_YEAR}}</span> г.
  </div>

  <div class="row">
    Настоящий акт составлен представителем «Поставщика» – УСД АО «Сахатранснефтегаз», в лице
    <span class="u lg">{{TECHNICIAN_NAME}}</span>
    и «Абонентом», в лице
    <span class="u lg">{{OWNER_NAME}}</span>
    о том, что представитель «Поставщика»: произвел проверку показаний прибора учета газа
  </div>

  <div class="row">
    на объекте: <span class="u md">{{MR_OBJECT}}</span>
    по адресу: <span class="u lg">{{OBJECT_ADDRESS}}</span>
  </div>

  <div class="row"><strong>Прибор учета газа:</strong></div>

  <table>
    <thead>
      <tr>
        <th style="width: 6%;">№</th>
        <th style="width: 30%;">Марка, тип</th>
        <th style="width: 26%;">Заводской №</th>
        <th style="width: 20%;">Пломба (№, цвет)</th>
        <th style="width: 18%;">Повер. от (дата)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="center">1</td>
        <td>{{MR1_MODEL}}</td>
        <td>{{MR1_NUMBER}}</td>
        <td>{{MR1_SEAL}}</td>
        <td>{{MR1_VERIFY_DATE}}</td>
      </tr>
      <tr>
        <td colspan="5">
          текущие показания прибора учета составляют <span class="u sm">{{MR1_READING}}</span> м³.
          Направление хода газа: <span class="u md">{{MR1_FLOW}}</span>
        </td>
      </tr>

      <tr>
        <td class="center">2</td>
        <td>{{MR2_MODEL}}</td>
        <td>{{MR2_NUMBER}}</td>
        <td>{{MR2_SEAL}}</td>
        <td>{{MR2_VERIFY_DATE}}</td>
      </tr>
      <tr>
        <td colspan="5">
          текущие показания прибора учета составляют <span class="u sm">{{MR2_READING}}</span> м³.
          Направление хода газа: <span class="u md">{{MR2_FLOW}}</span>
        </td>
      </tr>

      <tr>
        <td class="center">3</td>
        <td>{{MR3_MODEL}}</td>
        <td>{{MR3_NUMBER}}</td>
        <td>{{MR3_SEAL}}</td>
        <td>{{MR3_VERIFY_DATE}}</td>
      </tr>
      <tr>
        <td colspan="5">
          текущие показания прибора учета составляют <span class="u sm">{{MR3_READING}}</span> м³.
          Направление хода газа: <span class="u md">{{MR3_FLOW}}</span>
        </td>
      </tr>
    </tbody>
  </table>

  <div class="row">
    Заключение: <span class="u lg">{{MR_CONCLUSION}}</span>
  </div>

  <div class="sign-row" style="margin-top: 22px;">
    <div>Представитель «Поставщика»</div>
    <div class="sign-box">{{TECHNICIAN_SIGNATURE}}</div>
    <div>/ <span class="u md">{{TECHNICIAN_NAME}}</span> /</div>
  </div>

  <div class="sign-row">
    <div>«Абонент»</div>
    <div class="sign-box">{{OWNER_SIGNATURE}}</div>
    <div>/ <span class="u md">{{OWNER_NAME}}</span> /</div>
  </div>
</div>

<!-- Экземпляр 2 (как в doc повтор) -->
<div class="page">
  <div class="center">
    <img src="{{LOGO_SRC}}" style="height: 55px;" />
    <div class="act-no">АКТ № <span class="u sm">{{NUMBER}}</span></div>
    <div class="act-title">снятия показаний прибора учета газа</div>
  </div>

  <div class="row center" style="margin-top: 14px;">
    «<span class="u sm">{{ACT_DATE_FULL}}</span>» <span class="u sm">{{ACT_YEAR}}</span> г.
  </div>

  <div class="row">
    Настоящий акт составлен представителем «Поставщика» – УСД АО «Сахатранснефтегаз», в лице
    <span class="u lg">{{TECHNICIAN_NAME}}</span>
    и «Абонентом», в лице
    <span class="u lg">{{OWNER_NAME}}</span>
    о том, что представитель «Поставщика»: произвел проверку показаний прибора учета газа
  </div>

  <div class="row">
    на объекте: <span class="u md">{{MR_OBJECT}}</span>
    по адресу: <span class="u lg">{{OBJECT_ADDRESS}}</span>
  </div>

  <div class="row"><strong>Прибор учета газа:</strong></div>

  <table>
    <thead>
      <tr>
        <th style="width: 6%;">№</th>
        <th style="width: 30%;">Марка, тип</th>
        <th style="width: 26%;">Заводской №</th>
        <th style="width: 20%;">Пломба (№, цвет)</th>
        <th style="width: 18%;">Повер. от (дата)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="center">1</td>
        <td>{{MR1_MODEL}}</td>
        <td>{{MR1_NUMBER}}</td>
        <td>{{MR1_SEAL}}</td>
        <td>{{MR1_VERIFY_DATE}}</td>
      </tr>
      <tr>
        <td colspan="5">
          текущие показания прибора учета составляют <span class="u sm">{{MR1_READING}}</span> м³.
          Направление хода газа: <span class="u md">{{MR1_FLOW}}</span>
        </td>
      </tr>

      <tr>
        <td class="center">2</td>
        <td>{{MR2_MODEL}}</td>
        <td>{{MR2_NUMBER}}</td>
        <td>{{MR2_SEAL}}</td>
        <td>{{MR2_VERIFY_DATE}}</td>
      </tr>
      <tr>
        <td colspan="5">
          текущие показания прибора учета составляют <span class="u sm">{{MR2_READING}}</span> м³.
          Направление хода газа: <span class="u md">{{MR2_FLOW}}</span>
        </td>
      </tr>

      <tr>
        <td class="center">3</td>
        <td>{{MR3_MODEL}}</td>
        <td>{{MR3_NUMBER}}</td>
        <td>{{MR3_SEAL}}</td>
        <td>{{MR3_VERIFY_DATE}}</td>
      </tr>
      <tr>
        <td colspan="5">
          текущие показания прибора учета составляют <span class="u sm">{{MR3_READING}}</span> м³.
          Направление хода газа: <span class="u md">{{MR3_FLOW}}</span>
        </td>
      </tr>
    </tbody>
  </table>

  <div class="row">
    Заключение: <span class="u lg">{{MR_CONCLUSION}}</span>
  </div>

  <div class="sign-row" style="margin-top: 22px;">
    <div>Представитель «Поставщика»</div>
    <div class="sign-box">{{TECHNICIAN_SIGNATURE}}</div>
    <div>/ <span class="u md">{{TECHNICIAN_NAME}}</span> /</div>
  </div>

  <div class="sign-row">
    <div>«Абонент»</div>
    <div class="sign-box">{{OWNER_SIGNATURE}}</div>
    <div>/ <span class="u md">{{OWNER_NAME}}</span> /</div>
  </div>
</div>

</body>
</html>`;
