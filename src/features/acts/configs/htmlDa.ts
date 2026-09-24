export const HTML_DA    = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Акт о недопуске к проверке/отключению</title>
<style>
  @page { size: A4; margin: 0cm; }
  body { font-family: "Times New Roman", serif; font-size: 14pt; margin: 0; padding: 0; }
  .container { padding: 1.5cm; }
  .header { text-align: center; font-size: 12pt; line-height: 1.25; }
  .header .title { font-weight: bold; margin-top: 6px; }
  .act-no { text-align: center; font-weight: bold; margin-top: 18px; font-size: 14pt; }
  .act-name { text-align: center; font-weight: bold; margin-top: 10px; font-size: 14pt; }
  .row { margin-top: 10px; font-size: 12pt; line-height: 1.35; }
  .u { display: inline-block; border-bottom: 1px solid #000; padding: 0 4px; min-width: 220px; }
  .u.sm { min-width: 120px; }
  .u.md { min-width: 180px; }
  .u.lg { min-width: 320px; }
  .u.xl { min-width: 420px; }
  .two-col { display: flex; justify-content: space-between; gap: 10px; }
  .two-col > div { width: 48%; }

  .block-title { margin-top: 14px; font-weight: bold; font-size: 12pt; }
  .indent { margin-left: 18px; }

  .checkline { margin-top: 8px; }
  .mark { display: inline-block; width: 22px; }

  .sign-row { margin-top: 10px; display: flex; align-items: flex-end; gap: 10px; flex-wrap: wrap; }
  .sign-label { white-space: nowrap; }
  .sign-box { border-bottom: 1px solid #000; height: 55px; min-width: 220px; position: relative; flex: 1; }
  .sign-box img { position: absolute; left: 0; right: 0; margin: auto; max-height: 55px; max-width: 100%; top: 0; }
  .sign-name { white-space: nowrap; }
</style>
</head>
<body>
<div class="container">

  <div class="header">
    <div>Структурное подразделение</div>
    <div class="title">Управление по сбытовой деятельности</div>
    <div>677005, Республика Саха (Якутия), г. Якутск, ул. П.Алексеева, 64Б, т. 509-555</div>
    <div style="margin-top: 10px;">
      <img src="{{LOGO_SRC}}" style="height: 55px;" />
    </div>
  </div>

  <div class="act-no">АКТ № <span class="u md">{{NUMBER}}</span>/<span class="u sm">{{ACT_YEAR}}</span></div>
  <div class="act-name">О недопуске к проведению проверки (отключения) газового оборудования</div>

  <div class="row two-col" style="margin-top: 14px;">
    <div>г. Якутск</div>
    <div style="text-align:right;">«<span class="u sm">{{ACT_DATE_FULL}}</span>»</div>
  </div>

  <div class="row">
    Место составления: <span class="u xl">{{PLACE_OF_COMPILATION}}</span>
  </div>
  <div class="row">
    Дата и время попытки проведения проверки/отключения: <span class="u xl">{{ATTEMPT_DATETIME}}</span>
  </div>
  <div class="row">
    Основание: <span class="u xl">{{BASIS}}</span>
  </div>

  <div class="block-title">Сведения об абоненте:</div>
  <div class="row">
    ФИО, дата рождения: <span class="u lg">{{OWNER_NAME}}</span> <span class="u md">{{OWNER_DOB}}</span>
  </div>
  <div class="row">
    Документ удостоверяющий личность:
    <span class="u sm">{{OWNER_DOC_TYPE}}</span>
    серия <span class="u sm">{{OWNER_DOC_SERIES}}</span>
    № <span class="u md">{{OWNER_DOC_NUMBER}}</span>
  </div>
  <div class="row">
    Договор поставки газа: <span class="u xl">{{GAS_CONTRACT}}</span>
  </div>

  <div class="block-title">При попытке проведения проверки/отключения присутствовали:</div>
  <div class="row" style="margin-top: 8px;">Со стороны поставщика газа:</div>

  <div class="row indent">
    Должность: <span class="u md">{{SUP1_POSITION}}</span>
    Ф.И.О.: <span class="u lg">{{SUP1_FIO}}</span>
  </div>
  <div class="row indent">
    Удостоверение: <span class="u xl">{{SUP1_ID}}</span>
  </div>
  <div class="sign-row indent">
    <div class="sign-label">Подпись:</div>
    <div class="sign-box">{{SUP1_SIGNATURE}}</div>
  </div>

  <div class="row indent" style="margin-top: 14px;">
    Должность: <span class="u md">{{SUP2_POSITION}}</span>
    Ф.И.О.: <span class="u lg">{{SUP2_FIO}}</span>
  </div>
  <div class="row indent">
    Удостоверение: <span class="u xl">{{SUP2_ID}}</span>
  </div>
  <div class="sign-row indent">
    <div class="sign-label">Подпись:</div>
    <div class="sign-box">{{SUP2_SIGNATURE}}</div>
  </div>

  <div class="block-title">Доступ к газовому оборудованию не получили по причине:</div>
  <div class="row checkline">
    <span class="mark">{{REASON_ABSENT_MARK}}</span>
    Отсутствие абонента и совершеннолетних лиц по месту проведения проверки.
  </div>
  <div class="row checkline">
    <span class="mark">{{REASON_REFUSAL_MARK}}</span>
    Отказ абонента (или иных лиц, находящихся в помещении) допустить представителя поставщика газа для проведения проверки/отключения
  </div>
  <div class="row">
    Ф.И.О. отказавшегося лица: <span class="u xl">{{REFUSAL_PERSON_FIO}}</span>
  </div>

  <div class="block-title">Фотофиксация:</div>
  <div class="row">
    Факт недопуска зафиксирован на фото/видео. Прилагаются фотографии (<span class="u sm">{{PHOTO_COUNT}}</span> шт.)
    с геотегами, датой и временем, на которых запечатлены: фасад дома/здания с номером, входная дверь (подъезд),
    представители поставщика газа на фоне адресной таблички, попытка взаимодействия (если была).
  </div>

  <div class="block-title">4. Акт составлен в присутствии свидетелей (не менее 2-х незаинтересованных лиц):</div>

  <div class="row">
    1. ФИО: <span class="u lg">{{W1_FIO}}</span>
    Паспорт: <span class="u md">{{W1_PASSPORT}}</span>
  </div>
  <div class="row indent">
    Адрес регистрации: <span class="u xl">{{W1_ADDRESS}}</span>
  </div>

  <div class="row" style="margin-top: 10px;">
    2. ФИО: <span class="u lg">{{W2_FIO}}</span>
    Паспорт: <span class="u md">{{W2_PASSPORT}}</span>
  </div>
  <div class="row indent">
    Адрес регистрации: <span class="u xl">{{W2_ADDRESS}}</span>
  </div>

  <div class="block-title">5. Акт составлен в <span class="u sm">{{COPIES_COUNT}}</span> экземплярах.</div>
  <div class="row">
    Один экземпляр будет направлен абоненту по почте заказным письмом с уведомлением о вручении и описью вложения
    (п.60 Постановления №549).
  </div>

  <div class="block-title">Подписи представителей поставщика:</div>
  <div class="sign-row">
    <div class="sign-box">{{SUP1_SIGNATURE}}</div>
    <div class="sign-name">/ <span class="u md">{{SUP1_FIO}}</span> /</div>
  </div>
  <div class="sign-row">
    <div class="sign-box">{{SUP2_SIGNATURE}}</div>
    <div class="sign-name">/ <span class="u md">{{SUP2_FIO}}</span> /</div>
  </div>

  <div class="block-title">Подписи свидетелей:</div>
  <div class="sign-row">
    <div class="sign-box">{{W1_SIGNATURE}}</div>
    <div class="sign-name">/ <span class="u md">{{W1_FIO}}</span> /</div>
  </div>
  <div class="sign-row">
    <div class="sign-box">{{W2_SIGNATURE}}</div>
    <div class="sign-name">/ <span class="u md">{{W2_FIO}}</span> /</div>
  </div>

</div>
</body>
</html>`;
