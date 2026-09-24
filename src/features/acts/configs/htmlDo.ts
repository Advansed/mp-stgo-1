export const HTML_DO    = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Акт-наряд на отключение газоиспользующего оборудования</title>
<style>
  @page { size: A4; margin: 0cm; }
  body { font-family: "Times New Roman", serif; font-size: 14pt; margin: 0; padding: 0; }
  .page { padding: 1.5cm; }
  .center { text-align: center; }
  .row { margin-top: 10px; font-size: 12pt; line-height: 1.35; }
  .u { display:inline-block; border-bottom: 1px solid #000; padding: 0 6px; min-width: 220px; }
  .u.sm { min-width: 120px; }
  .u.md { min-width: 180px; }
  .u.lg { min-width: 320px; }
  .title { font-weight: bold; margin-top: 10px; }
  .sign-row { margin-top: 14px; font-size: 12pt; display:flex; align-items:flex-end; gap: 10px; flex-wrap: wrap; }
  .sign-box { border-bottom: 1px solid #000; height: 55px; min-width: 240px; position: relative; flex: 1; }
  .sign-box img { position: absolute; left: 0; right: 0; margin: auto; max-height: 55px; max-width: 100%; top: 0; }
  .muted { font-size: 10pt; }
  .pb { page-break-after: always; }
</style>
</head>
<body>

<!-- Экземпляр 1 -->
<div class="page pb">
  <div class="row muted">Форма 29-э</div>

  <div class="center" style="margin-top: 8px;">
    <img src="{{LOGO_SRC}}" style="height: 55px;" />
  </div>

  <div class="center">
    <div class="title">АКТ-НАРЯД № <span class="u sm">{{NUMBER}}</span></div>
    <div class="title">НА ОТКЛЮЧЕНИЕ ГАЗОИСПОЛЬЗУЮЩЕГО<br/>ОБОРУДОВАНИЯ ЖИЛЫХ ЗДАНИЙ</div>
    <div class="row">«<span class="u sm">{{ACT_DATE_FULL}}</span>»</div>
  </div>

  <div class="row">
    Представителю эксплуатационной организации
    <span class="u lg">{{SGE_EXP_FIO}}</span>
    <span class="u md">{{SGE_EXP_POSITION}}</span>
  </div>

  <div class="row">ввиду <span class="u lg">{{SGE_REASON}}</span></div>

  <div class="row">
    поручается отключить <span class="u lg">{{SGE_APPLIANCES}}</span>
  </div>

  <div class="row">
    в квартире № <span class="u sm">{{SGE_APT}}</span>
    дома <span class="u sm">{{SGE_HOUSE}}</span>
    по ул. <span class="u lg">{{SGE_STREET}}</span>
  </div>

  <div class="row">
    у абонента <span class="u lg">{{OWNER_NAME}}</span>
  </div>

  <div class="sign-row" style="margin-top: 16px;">
    <div>Наряд выдал</div>
    <div class="sign-box">{{SGE_ISSUED_SIGNATURE}}</div>
    <div><span class="u md">{{SGE_ISSUED_BY}}</span></div>
  </div>

  <div class="sign-row">
    <div>Наряд получил</div>
    <div class="sign-box">{{SGE_RECEIVED_SIGNATURE}}</div>
    <div><span class="u md">{{SGE_RECEIVED_BY}}</span></div>
  </div>

  <div class="row" style="margin-top: 18px;">
    Мною <span class="u lg">{{SGE_EXECUTOR}}</span>
  </div>

  <div class="row">
    «<span class="u sm">{{SGE_OFF_DATETIME}}</span>»
    произведено отключение газоиспользующего оборудования
    <span class="u lg">{{SGE_OFF_DETAILS}}</span>
  </div>

  <div class="row">
    в квартире № <span class="u sm">{{SGE_APT}}</span>
    дома <span class="u sm">{{SGE_HOUSE}}</span>
    по ул. <span class="u lg">{{SGE_STREET}}</span>
  </div>

  <div class="sign-row" style="margin-top: 16px;">
    <div>Подписи: Представитель эксплуатационной организации</div>
    <div class="sign-box">{{SGE_OFF_EXP_SIGNATURE}}</div>
  </div>

  <div class="sign-row">
    <div>Ответственный квартиросъёмщик (абонент)</div>
    <div class="sign-box">{{SGE_OFF_OWNER_SIGNATURE}}</div>
  </div>

  <div class="row" style="margin-top: 16px;">
    Газоиспользующее оборудование подключено «<span class="u sm">{{SGE_ON_DATE}}</span>»
    представителем эксплуатационной организации <span class="u lg">{{SGE_ON_EXP}}</span>
  </div>

  <div class="row">
    по указанию <span class="u lg">{{SGE_ON_BY}}</span>
  </div>

  <div class="row">
    в квартире № <span class="u sm">{{SGE_APT}}</span>
    дома <span class="u sm">{{SGE_HOUSE}}</span>
    по ул. <span class="u lg">{{SGE_STREET}}</span>
  </div>

  <div class="row">
    у абонента <span class="u lg">{{OWNER_NAME}}</span>
  </div>

  <div class="sign-row" style="margin-top: 16px;">
    <div>Подписи: Представитель эксплуатационной организации</div>
    <div class="sign-box">{{SGE_ON_EXP_SIGNATURE}}</div>
  </div>

  <div class="sign-row">
    <div>Ответственный квартиросъёмщик (абонент)</div>
    <div class="sign-box">{{SGE_ON_OWNER_SIGNATURE}}</div>
  </div>

  <div class="row muted" style="margin-top: 14px;">
    Примечание: Акт-наряд составляется в двух экземплярах, один выдаётся абоненту, другой хранится в эксплуатационной организации.
  </div>
</div>

<!-- Экземпляр 2 -->
<div class="page">
  <div class="row muted">Форма 29-э</div>

  <div class="center" style="margin-top: 8px;">
    <img src="{{LOGO_SRC}}" style="height: 55px;" />
  </div>

  <div class="center">
    <div class="title">АКТ-НАРЯД № <span class="u sm">{{NUMBER}}</span></div>
    <div class="title">НА ОТКЛЮЧЕНИЕ ГАЗОИСПОЛЬЗУЮЩЕГО<br/>ОБОРУДОВАНИЯ ЖИЛЫХ ЗДАНИЙ</div>
    <div class="row">«<span class="u sm">{{ACT_DATE_FULL}}</span>»</div>
  </div>

  <div class="row">
    Представителю эксплуатационной организации
    <span class="u lg">{{SGE_EXP_FIO}}</span>
    <span class="u md">{{SGE_EXP_POSITION}}</span>
  </div>

  <div class="row">ввиду <span class="u lg">{{SGE_REASON}}</span></div>

  <div class="row">
    поручается отключить <span class="u lg">{{SGE_APPLIANCES}}</span>
  </div>

  <div class="row">
    в квартире № <span class="u sm">{{SGE_APT}}</span>
    дома <span class="u sm">{{SGE_HOUSE}}</span>
    по ул. <span class="u lg">{{SGE_STREET}}</span>
  </div>

  <div class="row">
    у абонента <span class="u lg">{{OWNER_NAME}}</span>
  </div>

  <div class="sign-row" style="margin-top: 16px;">
    <div>Наряд выдал</div>
    <div class="sign-box">{{SGE_ISSUED_SIGNATURE}}</div>
    <div><span class="u md">{{SGE_ISSUED_BY}}</span></div>
  </div>

  <div class="sign-row">
    <div>Наряд получил</div>
    <div class="sign-box">{{SGE_RECEIVED_SIGNATURE}}</div>
    <div><span class="u md">{{SGE_RECEIVED_BY}}</span></div>
  </div>

  <div class="row" style="margin-top: 18px;">
    Мною <span class="u lg">{{SGE_EXECUTOR}}</span>
  </div>

  <div class="row">
    «<span class="u sm">{{SGE_OFF_DATETIME}}</span>»
    произведено отключение газоиспользующего оборудования
    <span class="u lg">{{SGE_OFF_DETAILS}}</span>
  </div>

  <div class="row">
    в квартире № <span class="u sm">{{SGE_APT}}</span>
    дома <span class="u sm">{{SGE_HOUSE}}</span>
    по ул. <span class="u lg">{{SGE_STREET}}</span>
  </div>

  <div class="sign-row" style="margin-top: 16px;">
    <div>Подписи: Представитель эксплуатационной организации</div>
    <div class="sign-box">{{SGE_OFF_EXP_SIGNATURE}}</div>
  </div>

  <div class="sign-row">
    <div>Ответственный квартиросъёмщик (абонент)</div>
    <div class="sign-box">{{SGE_OFF_OWNER_SIGNATURE}}</div>
  </div>

  <div class="row" style="margin-top: 16px;">
    Газоиспользующее оборудование подключено «<span class="u sm">{{SGE_ON_DATE}}</span>»
    представителем эксплуатационной организации <span class="u lg">{{SGE_ON_EXP}}</span>
  </div>

  <div class="row">
    по указанию <span class="u lg">{{SGE_ON_BY}}</span>
  </div>

  <div class="row">
    в квартире № <span class="u sm">{{SGE_APT}}</span>
    дома <span class="u sm">{{SGE_HOUSE}}</span>
    по ул. <span class="u lg">{{SGE_STREET}}</span>
  </div>

  <div class="row">
    у абонента <span class="u lg">{{OWNER_NAME}}</span>
  </div>

  <div class="sign-row" style="margin-top: 16px;">
    <div>Подписи: Представитель эксплуатационной организации</div>
    <div class="sign-box">{{SGE_ON_EXP_SIGNATURE}}</div>
  </div>

  <div class="sign-row">
    <div>Ответственный квартиросъёмщик (абонент)</div>
    <div class="sign-box">{{SGE_ON_OWNER_SIGNATURE}}</div>
  </div>

  <div class="row muted" style="margin-top: 14px;">
    Примечание: Акт-наряд составляется в двух экземплярах, один выдаётся абоненту, другой хранится в эксплуатационной организации.
  </div>
</div>

</body>
</html>`;
