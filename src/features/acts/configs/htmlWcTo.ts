export const HTML_WC_TO = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Акт выполненных работ ТО</title>
<style>
  @page { size: A4; margin: 0.8cm; }
  body { font-family: "Times New Roman", serif; font-size: 12pt; margin: 0; padding: 0; }
  .container { padding: 0.6cm 0.8cm; }
  .logo { text-align: center; }
  .logo img { height: 52px; }
  .org { text-align: center; font-weight: bold; font-size: 12pt; line-height: 1.25; margin-top: 4px; }
  .bank { text-align: center; font-size: 10pt; line-height: 1.3; margin-top: 4px; }
  .title { text-align: center; font-weight: bold; font-size: 14pt; margin: 12px 0 6px; text-transform: uppercase; }
  .meta { font-weight: bold; font-size: 12pt; margin: 6px 0; }
  .line { margin: 4px 0; font-size: 12pt; }
  .u { display: inline-block; border-bottom: 1px solid #000; min-width: 80px; padding: 0 4px; }
  .u.sm { min-width: 48px; }
  .u.md { min-width: 120px; }
  .u.lg { min-width: 220px; }
  .u.xl { min-width: 360px; }
  table.works, table.eq { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 10pt; }
  table.works th, table.works td, table.eq th, table.eq td {
    border: 1px solid #000; padding: 3px 4px; vertical-align: middle;
  }
  table.works th, table.eq th { text-align: center; font-weight: normal; }
  .num { text-align: center; width: 28px; }
  .unit { text-align: center; width: 70px; }
  .qty { text-align: center; width: 52px; }
  .money { text-align: right; width: 70px; }
  .done { text-align: center; width: 78px; }
  .total-label { text-align: right; font-weight: bold; }
  .note { font-size: 10pt; color: #333; }
  .sign-row { margin-top: 14px; font-size: 12pt; }
  .sign-box { border-bottom: 1px solid #000; min-height: 42px; position: relative; }
  .sign-box img { max-height: 42px; max-width: 180px; }
  .hint { font-size: 10pt; text-align: center; color: #333; margin-top: 2px; }
  .footer { text-align: center; font-size: 10pt; margin-top: 14px; }
  .eq-wrap { width: 62%; }
</style>
</head>
<body>
<div class="container">
  <div class="logo"><img src="{{LOGO_SRC}}" alt="logo" /></div>
  <div class="org">
    Структурное подразделение<br/>
    Управление газораспределительных сетей
  </div>
  <div class="bank">
    ОГРН 1031402073097, ИНН 1435142972, КПП 143545002,<br/>
    р/с 40602810876000100246, к/с 30101810400000000609, БИК 049805609<br/>
    Якутское отделение №8603 Сбербанка России г. Якутск, тел: (4112) 509-555
  </div>

  <div class="title">Акт выполненных работ № {{ACT_NUMBER}}</div>
  <div class="meta">
    время и дата составления акта:
    <span class="u sm">{{TO_TIME_H}}</span> :
    <span class="u sm">{{TO_TIME_M}}</span>
    &nbsp;&nbsp;"<span class="u sm">{{ACT_DAY}}</span>"
    <span class="u md">{{ACT_MONTH_NAME}}</span>
    <span class="u sm">{{ACT_YEAR}}</span>г.
  </div>

  <div class="line"><b>Характер заявки со стороны абонента :</b> <span class="u xl">{{TO_REQUEST_KIND}}</span></div>
  <div class="line"><b>Текст заявки:</b> <span class="u xl">{{TO_REQUEST_TEXT}}</span></div>
  <div class="line">Представителем службы УГРС АО "Сахатранснефтегаз" выполнены следующие работы:</div>
  <div class="line"><b>На основании прейскуранта, утвержденного Приказом №</b> <span class="u sm">{{TO_PRICE_ORDER_NO}}</span> <b>от</b> <span class="u md">{{TO_PRICE_ORDER_DATE}}</span><b>г.</b></div>

  <table class="works">
    <tr>
      <th rowspan="2" class="num">№</th>
      <th rowspan="2" class="num">п/п</th>
      <th rowspan="2">Наименование услуги</th>
      <th rowspan="2" class="unit">Ед.изм.</th>
      <th rowspan="2" class="qty">Кол-во</th>
      <th class="money">Цена,</th>
      <th rowspan="2" class="money">Сумма</th>
      <th rowspan="2" class="done">Выполнено</th>
    </tr>
    <tr>
      <th class="money">с НДС</th>
    </tr>
    <tr>
      <td class="num">1</td><td></td>
      <td>{{TO_SVC1_NAME}}</td>
      <td class="unit">{{TO_SVC1_UNIT}}</td>
      <td class="qty">{{TO_SVC1_QTY}}</td>
      <td class="money">{{TO_SVC1_PRICE}}</td>
      <td class="money">{{TO_SVC1_SUM}}</td>
      <td class="done">{{TO_SVC1_DONE}}</td>
    </tr>
    <tr>
      <td class="num">2</td><td></td>
      <td>{{TO_SVC2_NAME}}</td>
      <td class="unit">{{TO_SVC2_UNIT}}</td>
      <td class="qty">{{TO_SVC2_QTY}}</td>
      <td class="money">{{TO_SVC2_PRICE}}</td>
      <td class="money">{{TO_SVC2_SUM}}</td>
      <td class="done">{{TO_SVC2_DONE}}</td>
    </tr>
    <tr>
      <td class="num">3</td><td></td>
      <td>{{TO_SVC3_NAME}}</td>
      <td class="unit">{{TO_SVC3_UNIT}}</td>
      <td class="qty">{{TO_SVC3_QTY}}</td>
      <td class="money">{{TO_SVC3_PRICE}}</td>
      <td class="money">{{TO_SVC3_SUM}}</td>
      <td class="done">{{TO_SVC3_DONE}}</td>
    </tr>
    <tr>
      <td class="num">4</td><td></td>
      <td>{{TO_SVC4_NAME}}</td>
      <td class="unit">{{TO_SVC4_UNIT}}</td>
      <td class="qty">{{TO_SVC4_QTY}}</td>
      <td class="money">{{TO_SVC4_PRICE}}</td>
      <td class="money">{{TO_SVC4_SUM}}</td>
      <td class="done">{{TO_SVC4_DONE}}</td>
    </tr>
    <tr>
      <td class="num">5</td><td></td>
      <td>{{TO_SVC5_NAME}}</td>
      <td class="unit">{{TO_SVC5_UNIT}}</td>
      <td class="qty">{{TO_SVC5_QTY}}</td>
      <td class="money">{{TO_SVC5_PRICE}}</td>
      <td class="money">{{TO_SVC5_SUM}}</td>
      <td class="done">{{TO_SVC5_DONE}}</td>
    </tr>
    <tr>
      <td colspan="6" class="total-label">Итого</td>
      <td class="money">{{TO_TOTAL}}</td>
      <td></td>
    </tr>
  </table>
  <div class="line" style="text-align:right;">{{TO_TOTAL_RUB}} руб. {{TO_TOTAL_KOP}} коп.</div>
  <div class="note">(сумма прописью) {{TO_TOTAL_WORDS}}</div>

  <div class="line" style="margin-top:10px;">Примечание <span class="u xl">{{TO_NOTE}}</span></div>
  <div class="line">ФИО абонента: <span class="u xl">{{OWNER_NAME}}</span></div>
  <div class="line">Адрес: <span class="u xl">{{OBJECT_ADDRESS}}</span></div>
  <div class="line">
    дом <span class="u sm">{{TO_HOUSE}}</span>
    &nbsp;&nbsp;кв. <span class="u sm">{{TO_APT}}</span>
    &nbsp;&nbsp;тел. <span class="u md">{{OWNER_PHONE}}</span>
  </div>
  <div class="line">Лицевой счет: <span class="u lg">{{PERSONAL_ACCOUNT}}</span></div>

  <div class="line" style="margin-top:8px;">Оборудование:</div>
  <table class="eq eq-wrap">
    <tr>
      <th>Оборудование</th>
      <th>Марка</th>
      <th class="qty">Кол-во</th>
    </tr>
    <tr><td>Котел</td><td>{{TO_EQ_BOILER_MARK}}</td><td class="qty">{{TO_EQ_BOILER_QTY}}</td></tr>
    <tr><td>Плита</td><td>{{TO_EQ_STOVE_MARK}}</td><td class="qty">{{TO_EQ_STOVE_QTY}}</td></tr>
    <tr><td>Конвектор</td><td>{{TO_EQ_CONV_MARK}}</td><td class="qty">{{TO_EQ_CONV_QTY}}</td></tr>
    <tr><td>Подводящий газопровод</td><td>{{TO_EQ_PIPE_MARK}}</td><td class="qty">{{TO_EQ_PIPE_QTY}}</td></tr>
    <tr><td>Другое</td><td>{{TO_EQ_OTHER_MARK}}</td><td class="qty">{{TO_EQ_OTHER_QTY}}</td></tr>
  </table>

  <div class="line" style="margin-top:8px;">Договор: <span class="u xl">{{TO_CONTRACT}}</span></div>
  <div class="line" style="margin-top:10px;">По выполненным работам претензий не имею.</div>

  <div class="sign-row">
    Исполнитель
    <div class="sign-box">{{TECHNICIAN_SIGNATURE}}</div>
    <div class="hint">/ ФИО, должность, подпись/ {{TECHNICIAN_NAME}} {{TECHNICIAN_POSITION}}</div>
  </div>
  <div class="sign-row">
    Заказчик
    <div class="sign-box">{{OWNER_SIGNATURE}}</div>
    <div class="hint">/ФИО абонента или представителя абонента, подпись/ {{OWNER_NAME}}</div>
  </div>

  <div class="footer">Заявки по обслуживанию тел. 509-555, во внерабочее время и в выходные 04, с сотового 104</div>
</div>
</body>
</html>`;
