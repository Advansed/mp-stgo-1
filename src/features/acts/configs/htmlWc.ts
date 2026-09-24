export const HTML_WC_HR       = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Акт проверки газифицированного объекта (форма по ПП №410)</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            background-color: #e2e8f0;
            font-family: 'Times New Roman', 'Georgia', 'Cambria', serif;
            padding: 40px 20px;
            display: flex;
            justify-content: center;
        }
        .document {
            max-width: 1200px;
            width: 100%;
            background: white;
            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
            padding: 0.5em 0.5em 40px;
            border-radius: 4px;
        }
        /* Верхняя часть с логотипом и реквизитами */
        .top-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 12px;
        }
        .logo-area {
            flex: 0 0 auto;
        }
        .logo-area img {
            height: 70px;
            object-fit: contain;
        }
        .title-area {
            text-align: right;
            font-size: 13px;
            line-height: 1.4;
        }
        .title-area .appendix {
            font-weight: bold;
            font-size: 14px;
        }
        /* Основные стили */
        h1, h2, h3, .act-title {
            text-align: center;
            font-weight: bold;
        }
        .act-main-title {
            font-size: 18px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 8px;
            margin-bottom: 4px;
            font-weight: 700;
            text-align: center;
        }
        .act-sub-title {
            font-size: 15px;
            text-align: center;
            margin-bottom: 12px;
            font-weight: 600;
        }
        .act-number {
            text-align: center;
            font-weight: bold;
            font-size: 16px;
            margin: 8px 0 6px 0;
        }
        .act-date-line {
            text-align: center;
            font-size: 14px;
            margin-bottom: 24px;
            display: inline-block;
            width: auto;
            padding-bottom: 4px;
        }
        .field-row {
            margin-bottom: 12px;
            line-height: 1.4;
        }
        .inline-field {
            display: inline-block;
            min-width: 180px;
            border-bottom: 1px solid #000;
            margin: 0 4px;
            padding: 0 8px;
            font-family: monospace;
            background-color: #fef9e3;
        }
        .dotted-field {
            border-bottom: 1px dotted #333;
            min-width: 200px;
            display: inline-block;
            background: #fcf8e8;
            padding: 0 4px;
        }
        .full-line {
            border-bottom: 1px solid #000;
            background: #fef9e3;
            padding: 2px 6px;
            margin-top: 4px;
            width: 100%;
            display: inline-block;
        }
        .sign-block {
            margin-top: 32px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
        }
        .sign-item {
            width: 45%;
        }
        .sign-line {
            margin-top: 16px;
            border-top: 1px solid #000;
            width: 100%;
            padding-top: 6px;
            font-size: 13px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 13px;
        }
        th, td {
            border: 1px solid #222;
            padding: 6px 8px;
            vertical-align: top;
        }
        th {
            background-color: #f1f5f9;
            font-weight: 700;
            text-align: center;
        }
        .equip-sub {
            font-weight: 600;
            background-color: #fafaf9;
        }
        .checklist {
            margin: 16px 0;
            list-style: none;
            padding-left: 20px;
        }
        .checklist li {
            margin-bottom: 8px;
        }
        .meter-row {
            background: #fefce8;
            margin-bottom: 12px;
            padding: 6px;
            border-left: 3px solid #b45309;
        }
        .note {
            font-size: 12px;
            margin-top: 20px;
            border-top: 1px solid #aaa;
            padding-top: 12px;
            color: #2c3e4e;
        }
        @media print {
            body { background: white; padding: 0; margin: 0; }
            .document { box-shadow: none; padding: 0.5em 0.5em 40px; max-width: 100%; }
            .inline-field, .dotted-field, .full-line { background: none; border-bottom: 1px solid black; }
        }
    </style>
</head>
<body>
<div class="document">
    <!-- ВЕРХНЯЯ ЧАСТЬ: логотип + реквизиты как на картинке -->
    <div class="top-header">
        <div class="logo-area">
            <!-- ⚠️ ЗАМЕНИТЕ ПУТЬ К ЛОГОТИПУ: если файл лежит рядом, укажите "logo.png" или "image.png" -->
            <img src="https://stng.hb.ru-msk.vkcloud-storage.ru/USD.png" 
                 alt="Логотип АО Сахатранснефтегаз"
                 style="height: 70px; object-fit: contain;"
                 onerror="this.onerror=null; this.outerHTML='<div style=\'height:70px; display:flex; align-items:center; font-size:12px; color:#999;\'>[Логотип]</div>';">
        </div>
        <div class="title-area">
            АКЦИОНЕРНОЕ ОБЩЕСТВО<br>
            "САХАТРАНСНЕФТЕГАЗ"<br>
            УПРАВЛЕНИЕ ГАЗОРАСПРЕДЕЛИТЕЛЬНЫХ СЕТЕЙ<br>
            
        </div>
		<div>
			<span class="appendix">Приложение №6</span>
		</div>
    </div>

    <!-- Основные заголовки акта -->
    <div class="act-main-title">АКТ ПРОВЕРКИ ГАЗИФИЦИРОВАННОГО ОБЪЕКТА</div>
    <div class="act-sub-title">И СДАЧИ-ПРИЕМКИ ВЫПОЛНЕННЫХ РАБОТ ПО ТЕХНИЧЕСКОМУ ОБСЛУЖИВАНИЮ (РЕМОНТУ) ВДГО и (или) ВКГО</div>
    
    <div class="act-number">ААА № <span class="inline-field" style="min-width: 100px;">{{act_number}}</span></div>
    <div style="text-align: center; margin-bottom: 20px;">
        от “<span class="inline-field" style="min-width: 40px;">{{act_day}}</span>” __________ 
		<span class="inline-field" style="min-width: 90px;">{{act_month}}</span> 20___ г.
    </div>

    <!-- Представитель и абонент -->
    <div class="field-row">
        Мною, представителем газораспределительной организации УГРС АО "Сахатранснефтегаз"
        <span class="dotted-field" style="min-width: 280px;">{{inspector_name}}</span>
    </div>
    <div class="field-row">
        в присутствии абонента: Ф.И.О. (полн).: <span class="full-line">{{subscriber_fullname}}</span>
    </div>
    <div class="field-row">
        по адресу: <span class="full-line">{{address}}</span> л/с: <span class="inline-field">{{personal_account}}</span>
    </div>
    <div class="field-row">
        реквизиты документа, удостоверяющего личность: <span class="full-line">{{id_document}}</span>
    </div>
    <div class="field-row">
        в присутствии абонента (собственник/представитель): <span class="full-line">{{subscriber_second}}</span>
    </div>
    <div class="field-row">
        реквизиты документа (при необходимости): <span class="full-line">{{id_document_second}}</span>
    </div>

    <!-- Проверка -->
    <div class="field-row" style="margin-top: 16px;">
        1) Произведена проверка газифицированного объекта "<span class="inline-field">{{inspection_date}}</span>" "<span class="inline-field">{{inspection_time}}</span>" и составлен настоящий акт
    </div>
    <div class="field-row">
        в результате которого выявлено: <span class="full-line">{{inspection_result}}</span>
    </div>`;

export const HTML_WC_MR       = `    <!-- Счетчики (первый) -->
    <div class="meter-row">
        <strong>Показания счетчиков:</strong><br>
        1. тип G<span class="inline-field">{{meter1_type}}</span> №<span class="inline-field">{{meter1_number}}</span> составляют: <span class="inline-field">{{meter1_value}}</span> м³ 
        пломба <span class="inline-field">{{meter1_seal}}</span> цвет <span class="inline-field">{{meter1_color}}</span>
    </div>
`;

export const HTML_WC_EQ_HR    = `
    <!-- Таблица оборудования -->
    <table>
        <thead>
            <tr><th>Оборудование</th><th>Марка/Характеристика</th><th>Кол-во / длина / диаметр</th><th>Отключающее устройство</th><th>Дата изготовления</th><th>Мощность (кВт)</th></tr>
        </thead>
        <tbody>
`;

export const HTML_WC_EQ_1     = `
            <tr><td class="equip-sub">Газопровод</td><td><span class="inline-field">{{pipe_brand}}</span></td><td>Длина <span class="inline-field">{{pipe_length}}</span> м, Ø <span class="inline-field">{{pipe_diameter}}</span></td><td><span class="inline-field">{{shutoff_device}}</span></td><td><span class="inline-field">{{pipe_date}}</span></td><td>—</td></tr>
`;

export const HTML_WC_EQ_2     = `
            <tr><td class="equip-sub">Котел</td><td><span class="inline-field">{{boiler_mark}}</span></td><td><span class="inline-field">{{boiler_qty}}</span> шт.</td><td>—</td><td><span class="inline-field">{{boiler_date}}</span></td><td><span class="inline-field">{{boiler_power}}</span></td></tr>
`;

export const HTML_WC_EQ_3     = `
            <tr><td class="equip-sub">Плита</td><td><span class="inline-field">{{stove_mark}}</span></td><td><span class="inline-field">{{stove_qty}}</span> шт.</td><td>—</td><td><span class="inline-field">{{stove_date}}</span></td><td><span class="inline-field">{{stove_power}}</span></td></tr>
`;

export const HTML_WC_EQ_4     = `
            <tr><td class="equip-sub">Конвектор</td><td><span class="inline-field">{{convector_mark}}</span></td><td><span class="inline-field">{{convector_qty}}</span></td><td>—</td><td><span class="inline-field">{{convector_date}}</span></td><td><span class="inline-field">{{convector_power}}</span></td></tr>
`;

export const HTML_WC_EQ_5     = `
            <tr><td class="equip-sub">Водонагреватель</td><td><span class="inline-field">{{heater_mark}}</span></td><td><span class="inline-field">{{heater_qty}}</span></td><td>—</td><td><span class="inline-field">{{heater_date}}</span></td><td><span class="inline-field">{{heater_power}}</span></td></tr>
`;

export const HTML_WC_EQ_6     = `
            <tr><td class="equip-sub">Газопровод</td><td><span class="inline-field">{{pipe_brand}}</span></td><td>Длина <span class="inline-field">{{pipe_length}}</span> м, Ø <span class="inline-field">{{pipe_diameter}}</span></td><td><span class="inline-field">{{shutoff_device}}</span></td><td><span class="inline-field">{{pipe_date}}</span></td><td>—</td></tr>
`;

export const HTML_WC_EQ_7     = `
            <tr><td class="equip-sub">Другое</td><td colspan="5"><span class="full-line">{{other_equipment}}</span></td></tr>
`;

// Тексты для чекбоксов "стр. 2" (SH_2), чтобы форма и печатный HTML совпадали.

export const SH_2_CHECKBOX_LABELS: string[] = [
  'Визуальная проверка целостности внутридомового и (или) внутриквартирного газового оборудования и его соответствия нормативным требованиям.',
  'Визуальная проверка наличия свободного доступа к внутридомовому и (или) внутриквартирному газовому оборудованию.',
  'Визуальная проверка состояния окраски и креплений газопроводов.',
  'Визуальная проверка наличия и целостности футляров, в том числе их уплотнений, в местах прокладки газопроводов через наружные и внутренние конструкции.',
  'Проверка герметичности соединений и отключающих устройств (опрессовка, приборный метод, мыльная эмульсия), принятие мер по устранению выявленной негерметичности.',
  'Проверка работоспособности и смазка отключающих устройств, установленных на газопроводах.',
  'Разборка и смазка кранов бытового газоиспользующего оборудования.',
  'Проверка работоспособности устройств, позволяющих автоматически отключить подачу газа при отклонении контролируемых параметров за допустимые пределы.',
  'Очистка горелок от загрязнений.',
  'Регулировка процесса сжигания газа на всех режимах работы бытового газоиспользующего оборудования.',
  'Проверка наличия тяги в дымовых и вентиляционных каналах, состояния соединительных труб с дымовым каналом.',
  'Выявление неисправностей бытового газоиспользующего оборудования и определение возможности его дальнейшей эксплуатации.',
  'Проверка технического состояния электроизолирующего соединения, установленного на газопроводе.',
  'Проверка давления газа перед газоиспользующим оборудованием при всех работающих горелках и после прекращения подачи газа.',
  'Замена баллонов сжиженных углеводородных газов (при наличии ГБУ).',
  'Инструктаж потребителей газа по безопасному использованию газа при удовлетворении коммунально-бытовых нужд.',
];

export const HTML_WC_SH_2     = `
            <!-- 2) Техническое обслуживание -->
            <div class="field-row" style="margin-top: 10px;">
                2) Произведено техническое обслуживание (ремонт) ВДГО и (или) ВКГО по договору 
                №<span class="inline-field-medium">{{contract_number}}</span> от "<span class="inline-field-small">{{contract_day}}</span>" 
                <span class="inline-field-medium">{{contract_month}}</span> 20<span class="inline-field-small">{{contract_year}}</span> г.
            </div>

            <!-- Чекбоксы с параметрами {{check1}}...{{check16}} -->
            <div class="checklist-grid">
                <div class="checklist-item">
                    <input type="checkbox" {{check1}} id="check1">
                    <label for="check1">Визуальная проверка целостности внутридомового и (или) внутриквартирного газового оборудования и его соответствия нормативным требованиям.</label>
                </div>
                <div class="checklist-item">
                    <input type="checkbox" {{check2}} id="check2">
                    <label for="check2">Визуальная проверка наличия свободного доступа к внутридомовому и (или) внутриквартирному газовому оборудованию.</label>
                </div>
                <div class="checklist-item">
                    <input type="checkbox" {{check3}} id="check3">
                    <label for="check3">Визуальная проверка состояния окраски и креплений газопроводов.</label>
                </div>
                <div class="checklist-item">
                    <input type="checkbox" {{check4}} id="check4">
                    <label for="check4">Визуальная проверка наличия и целостности футляров, в том числе их уплотнений, в местах прокладки газопроводов через наружные и внутренние конструкции.</label>
                </div>
                <div class="checklist-item">
                    <input type="checkbox" {{check5}} id="check5">
                    <label for="check5">Проверка герметичности соединений и отключающих устройств (опрессовка, приборный метод, мыльная эмульсия), принятие мер по устранению выявленной негерметичности.</label>
                </div>
                <div class="checklist-item">
                    <input type="checkbox" {{check6}} id="check6">
                    <label for="check6">Проверка работоспособности и смазка отключающих устройств, установленных на газопроводах.</label>
                </div>
                <div class="checklist-item">
                    <input type="checkbox" {{check7}} id="check7">
                    <label for="check7">Разборка и смазка кранов бытового газоиспользующего оборудования.</label>
                </div>
                <div class="checklist-item">
                    <input type="checkbox" {{check8}} id="check8">
                    <label for="check8">Проверка работоспособности устройств, позволяющих автоматически отключить подачу газа при отклонении контролируемых параметров за допустимые пределы.</label>
                </div>
                <div class="checklist-item">
                    <input type="checkbox" {{check9}} id="check9">
                    <label for="check9">Очистка горелок от загрязнений.</label>
                </div>
                <div class="checklist-item">
                    <input type="checkbox" {{check10}} id="check10">
                    <label for="check10">Регулировка процесса сжигания газа на всех режимах работы бытового газоиспользующего оборудования.</label>
                </div>
                <div class="checklist-item">
                    <input type="checkbox" {{check11}} id="check11">
                    <label for="check11">Проверка наличия тяги в дымовых и вентиляционных каналах, состояния соединительных труб с дымовым каналом.</label>
                </div>
                <div class="checklist-item">
                    <input type="checkbox" {{check12}} id="check12">
                    <label for="check12">Выявление неисправностей бытового газоиспользующего оборудования и определение возможности его дальнейшей эксплуатации.</label>
                </div>
                <div class="checklist-item">
                    <input type="checkbox" {{check13}} id="check13">
                    <label for="check13">Проверка технического состояния электроизолирующего соединения, установленного на газопроводе.</label>
                </div>
                <div class="checklist-item">
                    <input type="checkbox" {{check14}} id="check14">
                    <label for="check14">Проверка давления газа перед газоиспользующим оборудованием при всех работающих горелках и после прекращения подачи газа.</label>
                </div>
                <div class="checklist-item">
                    <input type="checkbox" {{check15}} id="check15">
                    <label for="check15">Замена баллонов сжиженных углеводородных газов (при наличии ГБУ).</label>
                </div>
                <div class="checklist-item">
                    <input type="checkbox" {{check16}} id="check16">
                    <label for="check16">Инструктаж потребителей газа по безопасному использованию газа при удовлетворении коммунально-бытовых нужд.</label>
                </div>
            </div>

            <!-- Примечание про ремонтную заявку -->
            <div class="note-text" style="background: #fef9e3; padding: 8px; margin: 10px 0;">
                <strong>Примечание:</strong> при выявлении необходимости проведения ремонта газоиспользующего оборудования, связанного с заменой узлов и деталей, замены арматуры на газопроводах, футляров и креплений, абонентом оформляется ремонтная заявка.
            </div>

            <!-- Подтверждение выполнения работ -->
            <div class="checklist-item">
                <input type="checkbox" {{work_confirmed}} id="workConfirmed">
                <label for="workConfirmed">По выполненным работам по договору технического обслуживания (ремонта) ВДГО и (или) ВКГО проведено в полном объеме, претензий не имею.</label>
            </div>
            
            <div class="checklist-item">
                <input type="checkbox" {{instruct_passed}} id="instructPassed">
                <label for="instructPassed">Проведен инструктаж по безопасному пользованию газом в быту.</label>
            </div>

            <!-- Уведомление по ПП №410 -->
            <div class="field-row" style="margin-top: 15px; font-size: 12px;">
                Уведомлен согласно ПП №410 от 14 мая 2013г. во избежание начисления пени оплатить стоимость услуг (работ) до 10 числа следующего месяца с даты выполнения работ.
            </div>

            <div class="field-row" style="font-size: 12px;">
                Настоящим уведомлен о необходимости проводить проверку дымовых и вентиляционных каналов не реже 3 раз в год, с обязательным уведомлением о проведении проверки УГРС АО "Сахатранснефтегаз".
            </div>

            <!-- Наличие ГБУ -->
            <div class="field-row" style="margin: 15px 0;">
                <strong>Наличие ГБУ (Газобаллонной установки):</strong>
                <label class="checkbox-label"><input type="radio" name="gbu" value="yes" {{gbu_yes}}> Да</label>
                <label class="checkbox-label"><input type="radio" name="gbu" value="no" {{gbu_no}}> Нет</label>
                <span style="margin-left: 30px;"><strong>Номер телефона абонента:</strong> <span class="inline-field-medium">{{subscriber_phone}}</span></span>
            </div>

            <!-- Оценка работ по ТО ВДГО -->
            <div class="field-row">
                <strong>Оценка работ по техническому обслуживанию ВДГО:</strong>
                <label class="checkbox-label"><input type="radio" name="rating" value="bad" {{rating_bad}}> Неуд.</label>
                <label class="checkbox-label"><input type="radio" name="rating" value="2" {{rating_2}}> 2</label>
                <label class="checkbox-label"><input type="radio" name="rating" value="3" {{rating_3}}> 3</label>
                <label class="checkbox-label"><input type="radio" name="rating" value="4" {{rating_4}}> 4</label>
                <label class="checkbox-label"><input type="radio" name="rating" value="excellent" {{rating_excellent}}> Отл.</label>
            </div>

            <!-- Примечание общее -->
            <div class="field-row">
                <strong>Примечание:</strong> <span class="full-line">{{general_note}}</span>
            </div>

            <!-- Подписи сторон -->
            <div class="signature-line">
                <div class="signature-item">
                    <strong>Представитель газораспределительной организации</strong>
                    <div class="signature-field">{{inspector_signature_name}}</div>
                    <div style="font-size: 12px;">(Ф.И.О.)</div>
                    <div class="signature-field">{{inspector_signature}}</div>
                    <div style="font-size: 12px;">(Подпись)</div>
                </div>
                <div class="signature-item">
                    <strong>Абонент</strong>
                    <div class="signature-field">{{subscriber_signature_name}}</div>
                    <div style="font-size: 12px;">(Ф.И.О.)</div>
                    <div class="signature-field">{{subscriber_signature}}</div>
                    <div style="font-size: 12px;">(Подпись)</div>
                </div>
            </div>

            <div class="signature-line" style="margin-top: 10px;">
                <div class="signature-item">
                    <strong>Представитель абонента (при наличии)</strong>
                    <div class="signature-field">{{representative_signature_name}}</div>
                    <div style="font-size: 12px;">(Ф.И.О.)</div>
                    <div class="signature-field">{{representative_signature}}</div>
                    <div style="font-size: 12px;">(Подпись)</div>
                </div>
            </div>

            <!-- Итоговое примечание -->
            <div class="note-text" style="margin-top: 25px;">
                <strong>Примечание:</strong> АКТ составляется в двух экземплярах, один из которых выдается на руки абоненту, другой хранится в предприятии газового хозяйства.
            </div>
`

export const HTML_WC_EQ_BM    = `
        </tbody>
    </table>

    <div class="field-row">
        Произведен контрольный замер отапливаемых площадей: жилая площадь <span class="inline-field">{{living_area}}</span> м², нежилая площадь <span class="inline-field">{{nonliving_area}}</span> м², количество <span class="inline-field">{{residents_count}}</span> чел.
    </div>
`;

export const HTML_WC_BM = `
</div>
</body>
</html>
`;

/** Полный шаблон акта WC для registry: шапка + 1 счётчик + таблица (газопровод…иное) + площади + конец документа */

export const HTML_WC =
  HTML_WC_HR +
  HTML_WC_MR +
  HTML_WC_EQ_HR +
  HTML_WC_EQ_1 +
  HTML_WC_EQ_2 +
  HTML_WC_EQ_3 +
  HTML_WC_EQ_4 +
  HTML_WC_EQ_5 +
  HTML_WC_EQ_7 +
  HTML_WC_EQ_BM +
  HTML_WC_SH_2 +
  HTML_WC_BM;
