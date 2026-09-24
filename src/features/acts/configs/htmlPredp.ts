export const HTML_PREDP = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Предписание</title>
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
  .box { border: 1px solid #000; min-height: 220px; padding: 8px; margin-top: 10px; white-space: pre-wrap; }
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
  <div class="row muted">Структурное подразделение</div>
  <div class="row muted">Управление по сбытовой деятельности</div>
  <div class="row muted">677005, Республика Саха (Якутия), г. Якутск, ул. П. Алексеева, 64 Б</div>

  <div class="center">
    <div class="title">ПРЕДПИСАНИЕ</div>
    <div class="title">за нарушение правил пользования газом в быту</div>
    <div class="row">«<span class="u sm">{{ACT_DATE_FULL}}</span>»</div>
  </div>

  <div class="row">
    по Вашему адресу при проведении проверки по адресу:
    <span class="u lg">{{OBJECT_ADDRESS}}</span>,
    Л/С <span class="u sm">{{PERSONAL_ACCOUNT}}</span>,
    <span class="u lg">{{OWNER_NAME}}</span>,
    <span class="u.md"></span>
    № телефона <span class="u sm">{{OWNER_PHONE}}</span>
  </div>

  <div class="row">
    Выявлены нарушения СП 62.13330.2011, не соответствующие нормативно-технической документации при эксплуатации газоиспользующего оборудования:
  </div>

  <div class="box">{{PRED_VIOLATIONS}}</div>

  <div class="row">
    В соответствии с подписанным договором Поставки газа, при выявлении Поставщиком газа нарушений ВДГО, предусмотрены штрафные санкции.
  </div>

  <div class="row">
    Предлагаем Вам в срок до «<span class="u sm">{{PRED_DEADLINE}}</span>» устранить выявленные нарушения (внести изменения в договор поставки газа),
    в противном случае будем вынуждены в соответствии с Правилами поставки газа №549 от 21.07.08г. приостановить/прекратить поставку газа.
  </div>

  <div class="row">
    По вопросам устранения нарушений обращаться в Вашу обслуживающую организацию или по адресу:
    г. Якутск ул. П. Алексеева, 64, тел 509-555
  </div>

  <div class="sign-row" style="margin-top: 18px;">
    <div>Предписание вручил: представитель организации</div>
    <div class="sign-box">{{PRED_REP_SIGNATURE}}</div>
    <div>/ <span class="u md">{{PRED_REP_FIO}}</span> /</div>
  </div>

  <div class="sign-row">
    <div>абонент</div>
    <div class="sign-box">{{PRED_OWNER_SIGNATURE}}</div>
    <div>/ <span class="u md">{{OWNER_NAME}}</span> /</div>
  </div>

  <div class="sign-row">
    <div>представитель абонента</div>
    <div class="sign-box">{{PRED_OWNER_REP_SIGNATURE}}</div>
    <div>/ <span class="u md">{{PRED_OWNER_REP_FIO}}</span> /</div>
  </div>

  <div class="row muted" style="margin-top: 14px;">
    Примечание: АКТ составляется в двух экземплярах, один выдаётся абоненту, другой хранится у поставщика газа.
  </div>
</div>

<!-- Экземпляр 2 -->
<div class="page">
  <div class="row muted">Структурное подразделение</div>
  <div class="row muted">Управление по сбытовой деятельности</div>
  <div class="row muted">677005, Республика Саха (Якутия), г. Якутск, ул. П. Алексеева, 64 Б</div>

  <div class="center">
    <div class="title">ПРЕДПИСАНИЕ</div>
    <div class="title">за нарушение правил пользования газом в быту</div>
    <div class="row">«<span class="u sm">{{ACT_DATE_FULL}}</span>»</div>
  </div>

  <div class="row">
    по Вашему адресу при проведении проверки по адресу:
    <span class="u lg">{{OBJECT_ADDRESS}}</span>,
    Л/С <span class="u sm">{{PERSONAL_ACCOUNT}}</span>,
    <span class="u lg">{{OWNER_NAME}}</span>,
    № телефона <span class="u sm">{{OWNER_PHONE}}</span>
  </div>

  <div class="row">
    Выявлены нарушения СП 62.13330.2011, не соответствующие нормативно-технической документации при эксплуатации газоиспользующего оборудования:
  </div>

  <div class="box">{{PRED_VIOLATIONS}}</div>

  <div class="row">
    В соответствии с подписанным договором Поставки газа, при выявлении Поставщиком газа нарушений ВДГО, предусмотрены штрафные санкции.
  </div>

  <div class="row">
    Предлагаем Вам в срок до «<span class="u sm">{{PRED_DEADLINE}}</span>» устранить выявленные нарушения (внести изменения в договор поставки газа),
    в противном случае будем вынуждены в соответствии с Правилами поставки газа №549 от 21.07.08г. приостановить/прекратить поставку газа.
  </div>

  <div class="row">
    По вопросам устранения нарушений обращаться в Вашу обслуживающую организацию или по адресу:
    г. Якутск ул. П. Алексеева, 64, тел 509-555
  </div>

  <div class="sign-row" style="margin-top: 18px;">
    <div>Предписание вручил: представитель организации</div>
    <div class="sign-box">{{PRED_REP_SIGNATURE}}</div>
    <div>/ <span class="u md">{{PRED_REP_FIO}}</span> /</div>
  </div>

  <div class="sign-row">
    <div>абонент</div>
    <div class="sign-box">{{PRED_OWNER_SIGNATURE}}</div>
    <div>/ <span class="u md">{{OWNER_NAME}}</span> /</div>
  </div>

  <div class="sign-row">
    <div>представитель абонента</div>
    <div class="sign-box">{{PRED_OWNER_REP_SIGNATURE}}</div>
    <div>/ <span class="u md">{{PRED_OWNER_REP_FIO}}</span> /</div>
  </div>

  <div class="row muted" style="margin-top: 14px;">
    Примечание: АКТ составляется в двух экземплярах, один выдаётся абоненту, другой хранится у поставщика газа.
  </div>
</div>

</body>
</html>`;
