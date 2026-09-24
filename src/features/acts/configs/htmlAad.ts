export const HTML_AAD   = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Акт ААД проверки газифицированного объекта</title>
<style>
  @page { size: A4; margin: 0cm; }
  body { font-family: "Times New Roman", serif; font-size: 14pt; margin: 0; padding: 0; }
  .page { padding: 1.5cm; }
  .center { text-align: center; }
  .muted { font-size: 10pt; }
  .row { margin-top: 10px; font-size: 12pt; line-height: 1.35; }
  .u { display:inline-block; border-bottom: 1px solid #000; padding: 0 6px; min-width: 220px; }
  .u.sm { min-width: 120px; }
  .u.md { min-width: 180px; }
  .u.lg { min-width: 320px; }
  .title { font-weight: bold; margin-top: 8px; }
  .box { border: 1px solid #000; min-height: 120px; padding: 8px; white-space: pre-wrap; }
  .sign-row { margin-top: 14px; font-size: 12pt; display:flex; align-items:flex-end; gap: 10px; flex-wrap: wrap; }
  .sign-box { border-bottom: 1px solid #000; height: 55px; min-width: 240px; position: relative; flex: 1; }
  .sign-box img { position: absolute; left: 0; right: 0; margin: auto; max-height: 55px; max-width: 100%; top: 0; }
  table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12pt; }
  td, th { border: 1px solid #000; padding: 6px; vertical-align: top; }
  .pb { page-break-after: always; }
</style>
</head>
<body>

<!-- Экземпляр 1 -->
<div class="page pb">
  <div class="row muted">Форма 29-э</div>

  <div class="row muted">Структурное подразделение</div>
  <div class="row muted"><b>Управление по сбытовой деятельности</b></div>
  <div class="row muted">677005, Республика Саха (Якутия), г. Якутск, ул. П. Алексеева, 64 Б</div>

  <div class="center" style="margin-top: 8px;">
    <img src="{{LOGO_SRC}}" style="height: 55px;" />
  </div>

  <div class="center">
    <div class="title">АКТ</div>
    <div class="row">
      <b>ААД</b>
      &nbsp;&nbsp;л/с <span class="u sm">{{PERSONAL_ACCOUNT}}</span>
    </div>
    <div class="row">
      проверки газифицированного объекта по адресу:
      <div style="margin-top:6px;"><span class="u lg">{{OBJECT_ADDRESS}}</span></div>
    </div>
  </div>

  <div class="row">
    Согласно Постановлению Правительства РФ от 21 июля 2008г. №549 «О порядке поставки газа для обеспечения коммунально-бытовых нужд граждан»
  </div>

  <div class="row">
    Мной, представителем организации УСД АО «Сахатранснефтегаз»
    <span class="u lg">{{AAD_SUPPLIER_REP_FIO}}</span>
  </div>

  <div class="row">
    в присутствии абонента: Ф.И.О (полн).:
    <span class="u lg">{{OWNER_NAME}}</span>
  </div>
  <div class="row">
    реквизиты документа, удостоверяющего личность
    <span class="u lg">{{AAD_OWNER_DOC}}</span>
  </div>

  <div class="row">
    представителя абонента: Ф.И.О.(полн)
    <span class="u lg">{{AAD_OWNER_REP_FIO}}</span>
  </div>
  <div class="row">
    реквизиты документа, удостоверяющего личность
    <span class="u lg">{{AAD_OWNER_REP_DOC}}</span>
  </div>

  <div class="row">
    составлен настоящий акт о том, что «<span class="u sm">{{ACT_DATE_FULL}}</span>»,
    <span class="u sm">{{AAD_HOUR}}</span> час.
    <span class="u sm">{{AAD_MIN}}</span> мин.
  </div>

  <div class="row"><b>выявлено:</b></div>
  <div class="box">{{AAD_FOUND}}</div>

  <div class="row"><b>показания счетчиков:</b></div>

  <table>
    <thead>
      <tr>
        <th style="width:6%;">№</th>
        <th style="width:22%;">Тип (G)</th>
        <th style="width:22%;">Заводской №</th>
        <th style="width:20%;">Показания (м³)</th>
        <th style="width:30%;">Пломба № / цвет</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="center">1</td>
        <td>G {{AAD1_TYPE}}</td>
        <td>{{AAD1_NUMBER}}</td>
        <td>{{AAD1_READING}}</td>
        <td>{{AAD1_SEAL}} / {{AAD1_SEAL_COLOR}}</td>
      </tr>
      <tr>
        <td colspan="5">газовое оборудование: {{AAD1_EQUIPMENT}}</td>
      </tr>
      <tr>
        <td colspan="5">
          Произведен контрольный замер отапливаемых площадей:
          жилая площадь {{AAD1_LIVING_AREA}} м²,
          нежилая площадь {{AAD1_NONLIVING_AREA}} м²,
          количество {{AAD1_PEOPLE}} чел.
        </td>
      </tr>

      <tr>
        <td class="center">2</td>
        <td>G {{AAD2_TYPE}}</td>
        <td>{{AAD2_NUMBER}}</td>
        <td>{{AAD2_READING}}</td>
        <td>{{AAD2_SEAL}} / {{AAD2_SEAL_COLOR}}</td>
      </tr>
      <tr>
        <td colspan="5">газовое оборудование: {{AAD2_EQUIPMENT}}</td>
      </tr>
      <tr>
        <td colspan="5">
          Произведен контрольный замер отапливаемых площадей:
          жилая площадь {{AAD2_LIVING_AREA}} м²,
          нежилая площадь {{AAD2_NONLIVING_AREA}} м²,
          количество {{AAD2_PEOPLE}} чел.
        </td>
      </tr>
    </tbody>
  </table>

  <div class="row">
    Особое мнение абонента:
    <span class="u lg">{{AAD_OWNER_OPINION}}</span>
  </div>

  <div class="row">
    Примечание:
    <span class="u lg">{{AAD_NOTE}}</span>
  </div>

  <div class="row" style="margin-top: 16px;"><b>Подписи сторон:</b></div>

  <div class="sign-row">
    <div>представитель организации</div>
    <div class="sign-box">{{AAD_SUPPLIER_SIGNATURE}}</div>
    <div>/ <span class="u md">{{AAD_SUPPLIER_REP_FIO}}</span> /</div>
  </div>

  <div class="sign-row">
    <div>абонент</div>
    <div class="sign-box">{{AAD_OWNER_SIGNATURE}}</div>
    <div>/ <span class="u md">{{OWNER_NAME}}</span> /</div>
  </div>

  <div class="sign-row">
    <div>представитель абонента</div>
    <div class="sign-box">{{AAD_OWNER_REP_SIGNATURE}}</div>
    <div>/ <span class="u md">{{AAD_OWNER_REP_FIO}}</span> /</div>
  </div>

  <div class="row" style="margin-top: 14px;">
    При проведении проверки и составлении акта присутствовал: Ф.И.О.:
    <span class="u lg">{{AAD_WITNESS_FIO}}</span>
  </div>
  <div class="row">
    реквизиты документа, удостоверяющего личность
    <span class="u lg">{{AAD_WITNESS_DOC}}</span>
  </div>

  <div class="row muted" style="margin-top: 14px;">
    Примечание: АКТ составляется в двух экземплярах, один из которых выдаётся на руки абонента, другой хранится у поставщика газа.
  </div>
</div>

<!-- Экземпляр 2 -->
<div class="page">
  <div class="row muted">Форма 29-э</div>

  <div class="row muted">Структурное подразделение</div>
  <div class="row muted"><b>Управление по сбытовой деятельности</b></div>
  <div class="row muted">677005, Республика Саха (Якутия), г. Якутск, ул. П. Алексеева, 64 Б</div>

  <div class="center" style="margin-top: 8px;">
    <img src="{{LOGO_SRC}}" style="height: 55px;" />
  </div>

  <div class="center">
    <div class="title">АКТ</div>
    <div class="row">
      <b>ААД</b>
      &nbsp;&nbsp;л/с <span class="u sm">{{PERSONAL_ACCOUNT}}</span>
    </div>
    <div class="row">
      проверки газифицированного объекта по адресу созданию:
      <div style="margin-top:6px;"><span class="u lg">{{OBJECT_ADDRESS}}</span></div>
    </div>
  </div>

  <div class="row">
    Согласно Постановлению Правительства РФ от 21 июля 2008г. №549 «О порядке поставки газа для обеспечения коммунально-бытовых нужд граждан»
  </div>

  <div class="row">
    Мной, представителем организации УСД АО «Сахатранснефтегаз»
    <span class="u lg">{{AAD_SUPPLIER_REP_FIO}}</span>
  </div>

  <div class="row">
    в присутствии абонента: Ф.И.О (полн).:
    <span class="u lg">{{OWNER_NAME}}</span>
  </div>
  <div class="row">
    реквизиты документа, удостоверяющего личность
    <span class="u lg">{{AAD_OWNER_DOC}}</span>
  </div>

  <div class="row">
    представителя абонента: Ф.И.О.(полн)
    <span class="u lg">{{AAD_OWNER_REP_FIO}}</span>
  </div>
  <div class="row">
    реквизиты документа, удостоверяющего личность
    <span class="u lg">{{AAD_OWNER_REP_DOC}}</span>
  </div>

  <div class="row">
    составлен настоящий акт о том, что «<span class="u sm">{{ACT_DATE_FULL}}</span>»,
    <span class="u sm">{{AAD_HOUR}}</span> час.
    <span class="u sm">{{AAD_MIN}}</span> мин.
  </div>

  <div class="row"><b>выявлено:</b></div>
  <div class="box">{{AAD_FOUND}}</div>

  <div class="row"><b>показания счетчиков:</b></div>

  <table>
    <thead>
      <tr>
        <th style="width:6%;">№</th>
        <th style="width:22%;">Тип (G)</th>
        <th style="width:22%;">Заводской №</th>
        <th style="width:20%;">Показания (м³)</th>
        <th style="width:30%;">Пломба № / цвет</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="center">1</td>
        <td>G {{AAD1_TYPE}}</td>
        <td>{{AAD1_NUMBER}}</td>
        <td>{{AAD1_READING}}</td>
        <td>{{AAD1_SEAL}} / {{AAD1_SEAL_COLOR}}</td>
      </tr>
      <tr>
        <td colspan="5">газовое оборудование: {{AAD1_EQUIPMENT}}</td>
      </tr>
      <tr>
        <td colspan="5">
          Произведен контрольный замер отапливаемых площадей:
          жилая площадь {{AAD1_LIVING_AREA}} м²,
          нежилая площадь {{AAD1_NONLIVING_AREA}} м²,
          количество {{AAD1_PEOPLE}} чел.
        </td>
      </tr>

      <tr>
        <td class="center">2</td>
        <td>G {{AAD2_TYPE}}</td>
        <td>{{AAD2_NUMBER}}</td>
        <td>{{AAD2_READING}}</td>
        <td>{{AAD2_SEAL}} / {{AAD2_SEAL_COLOR}}</td>
      </tr>
      <tr>
        <td colspan="5">газовое оборудование: {{AAD2_EQUIPMENT}}</td>
      </tr>
      <tr>
        <td colspan="5">
          Произведен контрольный замер отапливаемых площадей:
          жилая площадь {{AAD2_LIVING_AREA}} м²,
          нежилая площадь {{AAD2_NONLIVING_AREA}} м²,
          количество {{AAD2_PEOPLE}} чел.
        </td>
      </tr>
    </tbody>
  </table>

  <div class="row">
    Особое мнение абонента:
    <span class="u lg">{{AAD_OWNER_OPINION}}</span>
  </div>

  <div class="row">
    Примечание:
    <span class="u lg">{{AAD_NOTE}}</span>
  </div>

  <div class="row" style="margin-top: 16px;"><b>Подписи сторон:</b></div>

  <div class="sign-row">
    <div>представитель организации</div>
    <div class="sign-box">{{AAD_SUPPLIER_SIGNATURE}}</div>
    <div>/ <span class="u md">{{AAD_SUPPLIER_REP_FIO}}</span> /</div>
  </div>

  <div class="sign-row">
    <div>абонент</div>
    <div class="sign-box">{{AAD_OWNER_SIGNATURE}}</div>
    <div>/ <span class="u md">{{OWNER_NAME}}</span> /</div>
  </div>

  <div class="sign-row">
    <div>представитель абонента</div>
    <div class="sign-box">{{AAD_OWNER_REP_SIGNATURE}}</div>
    <div>/ <span class="u md">{{AAD_OWNER_REP_FIO}}</span> /</div>
  </div>

  <div class="row" style="margin-top: 14px;">
    При проведении проверки и составлении акта присутствовал: Ф.И.О.:
    <span class="u lg">{{AAD_WITNESS_FIO}}</span>
  </div>
  <div class="row">
    реквизиты документа, удостоверяющего личность
    <span class="u lg">{{AAD_WITNESS_DOC}}</span>
  </div>

  <div class="row muted" style="margin-top: 14px;">
    Примечание: АКТ составляется в двух экземплярах, один из которых выдаётся на руки абонента, другой хранится у поставщика газа.
  </div>
</div>

</body>
</html>`;
