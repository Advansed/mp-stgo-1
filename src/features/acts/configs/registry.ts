import type { ActTemplateConfig } from '../types';

const COMMON_FIELDS_TOP = [
  { section: 'Данные акта', key: 'act_number', label: 'Номер акта', type: 'string', required: true },
  { section: 'Данные акта', key: 'act_date', label: 'Дата акта', type: 'date', required: true },

  { section: 'Абонент', key: 'owner_name', label: 'ФИО абонента', type: 'string', required: true },
  { section: 'Абонент', key: 'owner_phone', label: 'Телефон абонента', type: 'string' },

  { section: 'Объект', key: 'object_type', label: 'Тип объекта', type: 'string' },
  { section: 'Объект', key: 'object_address', label: 'Адрес объекта', type: 'address', required: true },
] as const;

export const ACT_TEMPLATES_REGISTRY: Record<string, ActTemplateConfig> = {
  
  actbr: {
    type: 'actbr',
    name: 'Акт замены аккумуляторной батареи',
    fields: [
      ...COMMON_FIELDS_TOP,
      { section: 'Снятый счетчик', key: 'removed_meter_model', label: 'Модель', type: 'string', required: true },
      { section: 'Снятый счетчик', key: 'removed_meter_number', label: 'Номер', type: 'string', required: true },
      { section: 'Снятый счетчик', key: 'removed_meter_reading', label: 'Показания', type: 'string' },
      { section: 'Снятый счетчик', key: 'removed_seal_number', label: 'Номер пломбы', type: 'string' },

      { section: 'Установленный счетчик', key: 'installed_meter_model', label: 'Модель', type: 'string', required: true },
      { section: 'Установленный счетчик', key: 'installed_meter_number', label: 'Номер', type: 'string', required: true },
      { section: 'Установленный счетчик', key: 'installed_meter_reading', label: 'Показания', type: 'string' },
      { section: 'Установленный счетчик', key: 'installed_seal_number', label: 'Номер пломбы', type: 'string' },

      { section: 'Подписи', key: 'technician_name', label: 'ФИО слесаря', type: 'string' },
      { section: 'Подписи', key: 'technician_signature', label: 'Подпись слесаря', type: 'signature' },
      { section: 'Подписи', key: 'owner_signature', label: 'Подпись абонента', type: 'signature' },
    ],
  },

  actplomb: {
    type: 'actplomb',
    name: 'Акт пломбирования',
    fields: [
      ...COMMON_FIELDS_TOP,

      { section: 'Прибор учета (1)', key: 'meter_model', label: 'Модель (после G-)', type: 'string', required: true },
      { section: 'Прибор учета (1)', key: 'meter_number', label: 'Номер счётчика', type: 'string', required: true },
      { section: 'Прибор учета (1)', key: 'meter_reading', label: 'Текущие показания (м³)', type: 'string' },
      { section: 'Прибор учета (1)', key: 'seal_number', label: 'Номер пломбы', type: 'string' },
      { section: 'Прибор учета (1)', key: 'note', label: 'Примечания', type: 'textarea' },

      { section: 'Прибор учета (2)', key: 'meter2_model', label: 'Модель (после G-)', type: 'string' },
      { section: 'Прибор учета (2)', key: 'meter2_number', label: 'Номер счётчика', type: 'string' },
      { section: 'Прибор учета (2)', key: 'meter2_reading', label: 'Текущие показания (м³)', type: 'string' },
      { section: 'Прибор учета (2)', key: 'meter2_seal_number', label: 'Номер пломбы', type: 'string' },
      { section: 'Прибор учета (2)', key: 'meter2_note', label: 'Примечания', type: 'textarea' },

      { section: 'Прибор учета (3)', key: 'meter3_model', label: 'Модель (после G-)', type: 'string' },
      { section: 'Прибор учета (3)', key: 'meter3_number', label: 'Номер счётчика', type: 'string' },
      { section: 'Прибор учета (3)', key: 'meter3_reading', label: 'Текущие показания (м³)', type: 'string' },
      { section: 'Прибор учета (3)', key: 'meter3_seal_number', label: 'Номер пломбы', type: 'string' },
      { section: 'Прибор учета (3)', key: 'meter3_note', label: 'Примечания', type: 'textarea' },

      { section: 'Подписи', key: 'technician_name', label: 'ФИО сотрудника', type: 'string' },
      { section: 'Подписи', key: 'technician_signature', label: 'Подпись сотрудника', type: 'signature' },
      { section: 'Подписи', key: 'owner_signature', label: 'Подпись абонента', type: 'signature' },
      { section: 'Подписи', key: 'received_date', label: 'Дата получения акта (опционально)', type: 'date' },
    ],
  },

  actda: {
    type: 'actda',
    name: 'Акт недопуска для проведения проверки (отключения)',
    fields: [
      ...COMMON_FIELDS_TOP,

      { section: 'Составление', key: 'place_of_compilation', label: 'Место составления', type: 'address', required: true },
      { section: 'Составление', key: 'attempt_datetime', label: 'Дата и время попытки (текстом)', type: 'string', required: true },
      { section: 'Составление', key: 'basis', label: 'Основание', type: 'textarea', required: true },

      { section: 'Абонент (доп.)', key: 'owner_dob', label: 'Дата рождения абонента', type: 'date', required: true },
      { section: 'Абонент (доп.)', key: 'owner_doc_type', label: 'Документ (тип)', type: 'string', required: true },
      { section: 'Абонент (доп.)', key: 'owner_doc_series', label: 'Серия', type: 'string', required: true },
      { section: 'Абонент (доп.)', key: 'owner_doc_number', label: 'Номер', type: 'string', required: true },
      { section: 'Абонент (доп.)', key: 'gas_contract', label: 'Договор поставки газа', type: 'string', required: true },

      { section: 'Поставщик газа (1)', key: 'sup1_position', label: 'Должность', type: 'string', required: true },
      { section: 'Поставщик газа (1)', key: 'sup1_fio', label: 'Ф.И.О.', type: 'string', required: true },
      { section: 'Поставщик газа (1)', key: 'sup1_id', label: 'Удостоверение', type: 'string', required: true },
      { section: 'Поставщик газа (1)', key: 'sup1_signature', label: 'Подпись', type: 'signature', required: true },

      { section: 'Поставщик газа (2)', key: 'sup2_position', label: 'Должность', type: 'string' },
      { section: 'Поставщик газа (2)', key: 'sup2_fio', label: 'Ф.И.О.', type: 'string' },
      { section: 'Поставщик газа (2)', key: 'sup2_id', label: 'Удостоверение', type: 'string' },
      { section: 'Поставщик газа (2)', key: 'sup2_signature', label: 'Подпись', type: 'signature' },

      {
        section: 'Причина недопуска',
        key: 'no_access_reason',
        label: 'Причина',
        type: 'select',
        required: true,
        options: [
          'Отсутствие абонента и совершеннолетних лиц по месту проведения проверки.',
          'Отказ абонента (или иных лиц) допустить представителя поставщика газа для проведения проверки/отключения',
        ],
      },
      { section: 'Причина недопуска', key: 'refusal_person_fio', label: 'Ф.И.О. отказавшегося лица (если отказ)', type: 'string' },

      { section: 'Фотофиксация', key: 'photo_count', label: 'Количество фото (шт.)', type: 'number', required: true },
      { section: 'Фотофиксация', key: 'photo_data', label: 'Одно фото (опционально, для вложения)', type: 'image' },

      { section: 'Свидетель 1', key: 'w1_fio', label: 'ФИО', type: 'string', required: true },
      { section: 'Свидетель 1', key: 'w1_passport', label: 'Паспорт (серия/номер)', type: 'string', required: true },
      { section: 'Свидетель 1', key: 'w1_address', label: 'Адрес регистрации', type: 'address', required: true },
      { section: 'Свидетель 1', key: 'w1_signature', label: 'Подпись', type: 'signature', required: true },

      { section: 'Свидетель 2', key: 'w2_fio', label: 'ФИО', type: 'string', required: true },
      { section: 'Свидетель 2', key: 'w2_passport', label: 'Паспорт (серия/номер)', type: 'string', required: true },
      { section: 'Свидетель 2', key: 'w2_address', label: 'Адрес регистрации', type: 'address', required: true },
      { section: 'Свидетель 2', key: 'w2_signature', label: 'Подпись', type: 'signature', required: true },

      { section: 'Экземпляры', key: 'copies_count', label: 'Количество экземпляров', type: 'number', required: true },
    ],
  },

  actmrr: {
    type: 'actmrr',
    name: 'Акт снятия показаний',
    fields: [
      ...COMMON_FIELDS_TOP,

      { section: 'Объект', key: 'mr_object', label: 'На объекте (название/тип)', type: 'string', required: true },

      { section: 'Прибор 1', key: 'mr1_model', label: 'Марка/тип', type: 'string', required: true },
      { section: 'Прибор 1', key: 'mr1_number', label: 'Заводской №', type: 'string', required: true },
      { section: 'Прибор 1', key: 'mr1_seal', label: 'Пломба (№, цвет)', type: 'string' },
      { section: 'Прибор 1', key: 'mr1_verify_date', label: 'Поверка от (дата)', type: 'date' },
      { section: 'Прибор 1', key: 'mr1_reading', label: 'Текущие показания (м³)', type: 'string' },
      { section: 'Прибор 1', key: 'mr1_flow', label: 'Направление хода газа', type: 'string' },

      { section: 'Прибор 2', key: 'mr2_model', label: 'Марка/тип', type: 'string' },
      { section: 'Прибор 2', key: 'mr2_number', label: 'Заводской №', type: 'string' },
      { section: 'Прибор 2', key: 'mr2_seal', label: 'Пломба (№, цвет)', type: 'string' },
      { section: 'Прибор 2', key: 'mr2_verify_date', label: 'Поверка от (дата)', type: 'date' },
      { section: 'Прибор 2', key: 'mr2_reading', label: 'Текущие показания (м³)', type: 'string' },
      { section: 'Прибор 2', key: 'mr2_flow', label: 'Направление хода газа', type: 'string' },

      { section: 'Прибор 3', key: 'mr3_model', label: 'Марка/тип', type: 'string' },
      { section: 'Прибор 3', key: 'mr3_number', label: 'Заводской №', type: 'string' },
      { section: 'Прибор 3', key: 'mr3_seal', label: 'Пломба (№, цвет)', type: 'string' },
      { section: 'Прибор 3', key: 'mr3_verify_date', label: 'Поверка от (дата)', type: 'date' },
      { section: 'Прибор 3', key: 'mr3_reading', label: 'Текущие показания (м³)', type: 'string' },
      { section: 'Прибор 3', key: 'mr3_flow', label: 'Направление хода газа', type: 'string' },

      { section: 'Заключение', key: 'mr_conclusion', label: 'Заключение', type: 'textarea' },

      { section: 'Подписи', key: 'technician_name', label: 'ФИО представителя поставщика', type: 'string', required: true },
      { section: 'Подписи', key: 'technician_signature', label: 'Подпись поставщика', type: 'signature' },
      { section: 'Подписи', key: 'owner_signature', label: 'Подпись абонента', type: 'signature' },
    ]
  },

  actmi: {
    type: 'actmi',
    name: 'Акт установки прибора',
    fields: [
      ...COMMON_FIELDS_TOP,
      { section: 'Прибор учета', key: 'meter_model', label: 'Модель', type: 'string' },
      { section: 'Прибор учета', key: 'meter_number', label: 'Номер', type: 'string' },
      { section: 'Пломба', key: 'seal_place', label: 'Место установки пломбы', type: 'string' },
    ],
  },

  actdo: {
    type: 'actdo',
    name: 'Акт наряд на отключение (Ф29Э)',
    fields: [
      ...COMMON_FIELDS_TOP,

      { section: 'Кому выдан наряд',        key: 'do_exp_fio',              label: 'ФИО (эксплуатационная орг.)', type: 'string', required: true },
      { section: 'Кому выдан наряд',        key: 'do_exp_position',         label: 'Должность (эксплуатационная орг.)', type: 'string', required: true },

      { section: 'Основание',               key: 'do_reason',               label: 'Причина (ввиду)', type: 'textarea', required: true },
      { section: 'Отключить',               key: 'do_appliances',           label: 'Наименование приборов', type: 'textarea', required: true },

      { section: 'Адрес (как в бланке)',    key: 'do_apt',                  label: 'Квартира №', type: 'string', required: true },
      { section: 'Адрес (как в бланке)',    key: 'do_house',                label: 'Дом №', type: 'string', required: true },
      { section: 'Адрес (как в бланке)',    key: 'do_street',               label: 'Улица', type: 'string', required: true },

      { section: 'Наряд',                   key: 'do_issued_by',            label: 'Наряд выдал (должность, ФИО)', type: 'string', required: true },
      { section: 'Наряд',                   key: 'do_issued_signature',     label: 'Подпись (наряд выдал)', type: 'signature' },

      { section: 'Наряд',                   key: 'do_received_by',          label: 'Наряд получил (должность, ФИО)', type: 'string', required: true },
      { section: 'Наряд',                   key: 'do_received_signature',   label: 'Подпись (наряд получил)', type: 'signature' },

      { section: 'Исполнитель',             key: 'do_executor',             label: 'Мною (должность, ФИО)', type: 'string', required: true },
      { section: 'Отключение',              key: 'do_off_datetime',         label: 'Дата/время отключения (текстом)', type: 'string', required: true },
      { section: 'Отключение',              key: 'do_off_details',          label: 'Что отключено (кол-во, способ)', type: 'textarea', required: true },

      { section: 'Подписи (отключение)',    key: 'do_off_exp_signature',    label: 'Эксплуатационная орг. (подпись)', type: 'signature' },
      { section: 'Подписи (отключение)',    key: 'do_off_owner_signature',  label: 'Абонент (подпись)', type: 'signature' },

      { section: 'Подключение',             key: 'do_on_date',              label: 'Дата подключения (текстом)', type: 'string' },
      { section: 'Подключение',             key: 'do_on_exp',               label: 'Подключил (должность, ФИО)', type: 'string' },
      { section: 'Подключение',             key: 'do_on_by',                label: 'По указанию (должность, ФИО)', type: 'string' },

      { section: 'Подписи (подключение)',   key: 'do_on_exp_signature',     label: 'Эксплуатационная орг. (подпись)', type: 'signature' },
      { section: 'Подписи (подключение)',   key: 'do_on_owner_signature',   label: 'Абонент (подпись)', type: 'signature' },
    ]
  },

  predp: {
    type: 'predp',
    name: 'Предписание',
    fields: [
      ...COMMON_FIELDS_TOP,

      { section: 'Данные проверки', key: 'personal_account', label: 'Л/С', type: 'string', required: true },

      { section: 'Нарушения', key: 'pred_violations', label: 'Выявленные нарушения', type: 'textarea', required: true },
      { section: 'Срок', key: 'pred_deadline', label: 'Устранить до (дата)', type: 'date', required: true },

      { section: 'Подписи', key: 'pred_rep_fio', label: 'Представитель организации (ФИО)', type: 'string', required: true },
      { section: 'Подписи', key: 'pred_rep_signature', label: 'Подпись представителя', type: 'signature' },

      { section: 'Подписи', key: 'pred_owner_signature', label: 'Подпись абонента', type: 'signature' },

      { section: 'Подписи', key: 'pred_owner_rep_fio', label: 'Представитель абонента (ФИО)', type: 'string' },
      { section: 'Подписи', key: 'pred_owner_rep_signature', label: 'Подпись представителя абонента', type: 'signature' },
    ],
  },

  actaad: {
    type: 'actaad',
    name: 'Акт проверки газифицированного объекта (ААД)',
    fields: [
      ...COMMON_FIELDS_TOP,

      { section: 'Данные', key: 'personal_account', label: 'Л/С', type: 'string', required: true },
      { section: 'Время', key: 'aad_time', label: 'Время (HH:MM)', type: 'string', required: true },

      { section: 'Представитель поставщика', key: 'aad_supplier_rep_fio', label: 'ФИО представителя УСД', type: 'string', required: true },
      { section: 'Абонент', key: 'aad_owner_doc', label: 'Документ абонента (реквизиты)', type: 'textarea', required: true },

      { section: 'Представитель абонента', key: 'aad_owner_rep_fio', label: 'ФИО представителя абонента', type: 'string' },
      { section: 'Представитель абонента', key: 'aad_owner_rep_doc', label: 'Документ представителя (реквизиты)', type: 'textarea' },

      { section: 'Выявлено', key: 'aad_found', label: 'Выявлено', type: 'textarea', required: true },

      { section: 'Счетчик 1', key: 'aad1_type', label: 'Тип (после G)', type: 'string' },
      { section: 'Счетчик 1', key: 'aad1_number', label: 'Заводской №', type: 'string' },
      { section: 'Счетчик 1', key: 'aad1_reading', label: 'Показания (м³)', type: 'string' },
      { section: 'Счетчик 1', key: 'aad1_seal', label: 'Пломба №', type: 'string' },
      { section: 'Счетчик 1', key: 'aad1_seal_color', label: 'Цвет пломбы', type: 'string' },
      { section: 'Счетчик 1', key: 'aad1_equipment', label: 'Газовое оборудование', type: 'textarea' },
      { section: 'Счетчик 1', key: 'aad1_living_area', label: 'Жилая площадь (м²)', type: 'string' },
      { section: 'Счетчик 1', key: 'aad1_nonliving_area', label: 'Нежилая площадь (м²)', type: 'string' },
      { section: 'Счетчик 1', key: 'aad1_people', label: 'Количество чел.', type: 'string' },

      { section: 'Счетчик 2', key: 'aad2_type', label: 'Тип (после G)', type: 'string' },
      { section: 'Счетчик 2', key: 'aad2_number', label: 'Заводской №', type: 'string' },
      { section: 'Счетчик 2', key: 'aad2_reading', label: 'Показания (м³)', type: 'string' },
      { section: 'Счетчик 2', key: 'aad2_seal', label: 'Пломба №', type: 'string' },
      { section: 'Счетчик 2', key: 'aad2_seal_color', label: 'Цвет пломбы', type: 'string' },
      { section: 'Счетчик 2', key: 'aad2_equipment', label: 'Газовое оборудование', type: 'textarea' },
      { section: 'Счетчик 2', key: 'aad2_living_area', label: 'Жилая площадь (м²)', type: 'string' },
      { section: 'Счетчик 2', key: 'aad2_nonliving_area', label: 'Нежилая площадь (м²)', type: 'string' },
      { section: 'Счетчик 2', key: 'aad2_people', label: 'Количество чел.', type: 'string' },

      { section: 'Комментарий', key: 'aad_owner_opinion', label: 'Особое мнение абонента', type: 'textarea' },
      { section: 'Комментарий', key: 'aad_note', label: 'Примечание', type: 'textarea' },

      { section: 'Подписи', key: 'aad_supplier_signature', label: 'Подпись представителя организации', type: 'signature' },
      { section: 'Подписи', key: 'aad_owner_signature', label: 'Подпись абонента', type: 'signature' },
      { section: 'Подписи', key: 'aad_owner_rep_signature', label: 'Подпись представителя абонента', type: 'signature' },

      { section: 'Присутствовал', key: 'aad_witness_fio', label: 'ФИО присутствующего', type: 'string' },
      { section: 'Присутствовал', key: 'aad_witness_doc', label: 'Документ присутствующего (реквизиты)', type: 'textarea' },
    ],
  },

  actmr: {
    type: 'actmr',
    name: 'Акт замены газового счетчика',
    fields: [
      ...COMMON_FIELDS_TOP,
      
      { section: 'Основная информация', key: 'act_number', label: 'Номер акта', type: 'string', required: true },
      { section: 'Основная информация', key: 'act_date', label: 'Дата акта', type: 'date', required: true },
      
      { section: 'Исполнитель', key: 'technician_name', label: 'ФИО', type: 'string', required: true },
      { section: 'Исполнитель', key: 'technician_position', label: 'Должность', type: 'string', required: true },
      
      { section: 'Владелец', key: 'owner_name', label: 'ФИО владельца', type: 'string', required: true },
      { section: 'Владелец', key: 'owner_phone', label: 'Телефон', type: 'string' },
      
      { section: 'Объект', key: 'object_type', label: 'Тип объекта', type: 'select', required: true, options: ['Жилой дом', 'Гараж', 'Баня', 'Другое'] },
      { section: 'Объект', key: 'object_address', label: 'Адрес', type: 'address', required: true },
      
      { section: 'Снятый счетчик', key: 'removal_date', label: 'Дата снятия', type: 'date', required: true },
      { section: 'Снятый счетчик', key: 'removed_meter_model', label: 'Модель', type: 'string', required: true },
      { section: 'Снятый счетчик', key: 'removed_meter_number', label: 'Номер', type: 'string', required: true },
      { section: 'Снятый счетчик', key: 'removed_meter_reading', label: 'Показания', type: 'string', required: true },
      { section: 'Снятый счетчик', key: 'removed_seal_number', label: 'Номер пломбы', type: 'string' },
      
      { section: 'Установленный счетчик', key: 'installation_date', label: 'Дата установки', type: 'date', required: true },
      { section: 'Установленный счетчик', key: 'installed_meter_model', label: 'Модель', type: 'string', required: true },
      { section: 'Установленный счетчик', key: 'installed_meter_number', label: 'Номер', type: 'string', required: true },
      { section: 'Установленный счетчик', key: 'installed_meter_reading', label: 'Показания', type: 'string', required: true },
      { section: 'Установленный счетчик', key: 'installed_seal_number', label: 'Номер пломбы', type: 'string' },
      
      { section: 'Подписи', key: 'technician_signature', label: 'Подпись техника', type: 'signature', required: true },
      { section: 'Подписи', key: 'owner_signature', label: 'Подпись владельца', type: 'signature', required: true },
    ],
  },

  actsf: {
    type: 'actsf',
    name: 'Акт срыва/установки пломбы',
    fields: [
      ...COMMON_FIELDS_TOP,
      
      { section: 'Основная информация', key: 'act_number', label: 'Номер акта', type: 'string', required: true },
      { section: 'Основная информация', key: 'act_date', label: 'Дата акта', type: 'date', required: true },
      
      { section: 'Исполнители', key: 'technician1_name', label: 'ФИО слесаря 1', type: 'string', required: true },
      { section: 'Исполнители', key: 'technician2_name', label: 'ФИО слесаря 2', type: 'string' },
      { section: 'Исполнители', key: 'technician_position', label: 'Должность', type: 'string', required: true },
      
      { section: 'Владелец', key: 'owner_name', label: 'ФИО владельца', type: 'string', required: true },
      { section: 'Владелец', key: 'owner_phone', label: 'Телефон', type: 'string', required: true },
      
      { section: 'Объект', key: 'object_type', label: 'Тип объекта', type: 'select', required: true, options: ['Жилой дом', 'Гараж', 'Баня', 'Другое'] },
      { section: 'Объект', key: 'street', label: 'Улица', type: 'string', required: true },
      { section: 'Объект', key: 'house', label: 'Дом', type: 'string', required: true },
      { section: 'Объект', key: 'apartment', label: 'Квартира', type: 'string' },
      
      { section: 'Сорванная пломба', key: 'break_date', label: 'Дата срыва', type: 'date', required: true },
      { section: 'Сорванная пломба', key: 'break_seal_number', label: 'Номер пломбы', type: 'string', required: true },
      { section: 'Сорванная пломба', key: 'break_seal_color', label: 'Цвет пломбы', type: 'string' },
      { section: 'Сорванная пломба', key: 'break_meter_model', label: 'Модель счетчика', type: 'string', required: true },
      { section: 'Сорванная пломба', key: 'break_meter_number', label: 'Номер счетчика', type: 'string', required: true },
      { section: 'Сорванная пломба', key: 'break_meter_reading', label: 'Показания', type: 'string', required: true },
      { section: 'Сорванная пломба', key: 'reason', label: 'Причина срыва', type: 'string', required: true },
      
      { section: 'Установленная пломба', key: 'install_date', label: 'Дата установки', type: 'date', required: true },
      { section: 'Установленная пломба', key: 'install_seal_number', label: 'Номер пломбы', type: 'string', required: true },
      { section: 'Установленная пломба', key: 'install_seal_color', label: 'Цвет пломбы', type: 'string' },
      { section: 'Установленная пломба', key: 'install_meter_model', label: 'Модель счетчика', type: 'string', required: true },
      { section: 'Установленная пломба', key: 'install_meter_number', label: 'Номер счетчика', type: 'string', required: true },
      { section: 'Установленная пломба', key: 'install_meter_reading', label: 'Показания', type: 'string', required: true },
      
      { section: 'Подписи', key: 'technician1_signature', label: 'Подпись слесаря 1', type: 'signature', required: true },
      { section: 'Подписи', key: 'technician2_signature', label: 'Подпись слесаря 2', type: 'signature' },
      { section: 'Подписи', key: 'owner_signature', label: 'Подпись владельца', type: 'signature', required: true },
    ],
  },

  actsge: {
    type: 'actsge',
    name: 'Акт отключения бытового газоиспользующего оборудования',
    fields: [
      ...COMMON_FIELDS_TOP,
      
      { section: 'Основная информация', key: 'act_number', label: 'Номер акта', type: 'string', required: true },
      { section: 'Основная информация', key: 'act_date', label: 'Дата акта', type: 'date', required: true },
      { section: 'Основная информация', key: 'personal_account', label: 'Лицевой счет', type: 'string', required: true },
      
      { section: 'Наряд-задание', key: 'work_order_number', label: 'Номер наряда', type: 'string', required: true },
      { section: 'Наряд-задание', key: 'work_order_date', label: 'Дата наряда', type: 'date', required: true },
      { section: 'Наряд-задание', key: 'debt_reason', label: 'Причина отключения', type: 'string', required: true },
      
      { section: 'Адрес объекта', key: 'apartment_number', label: 'Квартира №', type: 'string', required: true },
      { section: 'Адрес объекта', key: 'house_number', label: 'Дом №', type: 'string', required: true },
      { section: 'Адрес объекта', key: 'building_number', label: 'Корпус', type: 'string', required: true },
      { section: 'Адрес объекта', key: 'street_name', label: 'Улица', type: 'string', required: true },
      { section: 'Адрес объекта', key: 'city_district', label: 'Район города', type: 'string', required: true },
      
      { section: 'Заказчик', key: 'customer_name', label: 'ФИО заказчика', type: 'string', required: true },
      
      { section: 'Представитель УГРС', key: 'representative_position', label: 'Должность', type: 'string', required: true },
      { section: 'Представитель УГРС', key: 'representative_name', label: 'ФИО', type: 'string', required: true },
      
      { section: 'Отключение оборудования', key: 'disconnection_time_hours', label: 'Время отключения (часы)', type: 'string', required: true },
      { section: 'Отключение оборудования', key: 'disconnection_time_minutes', label: 'Время отключения (минуты)', type: 'string', required: true },
      { section: 'Отключение оборудования', key: 'equipment_description', label: 'Описание оборудования', type: 'string', required: true },
      { section: 'Отключение оборудования', key: 'equipment_count', label: 'Количество', type: 'string', required: true },
      { section: 'Отключение оборудования', key: 'disconnection_method', label: 'Способ отключения', type: 'string', required: true },
      { section: 'Отключение оборудования', key: 'seal_number', label: 'Номер пломбы', type: 'string', required: true },
      
      { section: 'Подключение оборудования', key: 'reconnection_date', label: 'Дата подключения', type: 'date' },
      { section: 'Подключение оборудования', key: 'reconnection_representative', label: 'Представитель при подключении', type: 'string' },
      { section: 'Подключение оборудования', key: 'reconnection_basis', label: 'Основание для подключения', type: 'string' },
      
      { section: 'Подписи', key: 'representative_signature', label: 'Подпись представителя', type: 'signature', required: true },
      { section: 'Подписи', key: 'customer_signature', label: 'Подпись заказчика', type: 'signature', required: true },
      { section: 'Подписи', key: 'reconnection_representative_signature', label: 'Подпись при подключении', type: 'signature' },
    ],
  },

  work_completed: {
    type: 'work_completed',
    name: 'Акт выполненных работ',
  },

  work_completed_to: {
    type: 'work_completed_to',
    name: 'Акт выполненных работ ТО',
    fields: [
      { section: 'Реквизиты', key: 'act_number', label: 'Номер акта', type: 'string', required: true },
      { section: 'Реквизиты', key: 'act_date', label: 'Дата акта', type: 'date', required: true },
      { section: 'Реквизиты', key: 'act_time', label: 'Время (ЧЧ:ММ)', type: 'string' },
      { section: 'Реквизиты', key: 'request_kind', label: 'Характер заявки', type: 'string' },
      { section: 'Реквизиты', key: 'request_text', label: 'Текст заявки', type: 'textarea' },
      { section: 'Реквизиты', key: 'price_order_number', label: 'Приказ прейскуранта №', type: 'string' },
      { section: 'Реквизиты', key: 'price_order_date', label: 'Дата приказа', type: 'date' },

      ...[1, 2, 3, 4, 5].flatMap((n) => [
        { section: `Услуга ${n}`, key: `svc${n}_name`, label: 'Наименование', type: 'string' as const, required: n === 1 },
        { section: `Услуга ${n}`, key: `svc${n}_unit`, label: 'Ед. изм.', type: 'string' as const },
        { section: `Услуга ${n}`, key: `svc${n}_qty`, label: 'Количество', type: 'number' as const },
        { section: `Услуга ${n}`, key: `svc${n}_price`, label: 'Цена с НДС', type: 'number' as const },
        {
          section: `Услуга ${n}`,
          key: `svc${n}_done`,
          label: 'Выполнено',
          type: 'select' as const,
          options: ['Да', 'Нет'],
        },
      ]),

      { section: 'Абонент', key: 'owner_name', label: 'ФИО абонента', type: 'string', required: true },
      { section: 'Абонент', key: 'object_address', label: 'Адрес (улица)', type: 'address', required: true },
      { section: 'Абонент', key: 'house', label: 'Дом', type: 'string' },
      { section: 'Абонент', key: 'apartment', label: 'Квартира', type: 'string' },
      { section: 'Абонент', key: 'owner_phone', label: 'Телефон', type: 'string' },
      { section: 'Абонент', key: 'lic', label: 'Лицевой счёт', type: 'string' },
      { section: 'Абонент', key: 'contract', label: 'Договор', type: 'string' },
      { section: 'Абонент', key: 'note', label: 'Примечание', type: 'textarea' },

      { section: 'Оборудование', key: 'eq_boiler_mark', label: 'Котел — марка', type: 'string' },
      { section: 'Оборудование', key: 'eq_boiler_qty', label: 'Котел — кол-во', type: 'number' },
      { section: 'Оборудование', key: 'eq_stove_mark', label: 'Плита — марка', type: 'string' },
      { section: 'Оборудование', key: 'eq_stove_qty', label: 'Плита — кол-во', type: 'number' },
      { section: 'Оборудование', key: 'eq_convector_mark', label: 'Конвектор — марка', type: 'string' },
      { section: 'Оборудование', key: 'eq_convector_qty', label: 'Конвектор — кол-во', type: 'number' },
      { section: 'Оборудование', key: 'eq_pipe_mark', label: 'Подводящий газопровод — марка', type: 'string' },
      { section: 'Оборудование', key: 'eq_pipe_qty', label: 'Подводящий газопровод — кол-во', type: 'number' },
      { section: 'Оборудование', key: 'eq_other_mark', label: 'Другое — марка', type: 'string' },
      { section: 'Оборудование', key: 'eq_other_qty', label: 'Другое — кол-во', type: 'number' },

      { section: 'Подписи', key: 'technician_name', label: 'ФИО исполнителя', type: 'string', required: true },
      { section: 'Подписи', key: 'technician_position', label: 'Должность исполнителя', type: 'string' },
      { section: 'Подписи', key: 'technician_signature', label: 'Подпись исполнителя', type: 'signature' },
      { section: 'Подписи', key: 'owner_signature', label: 'Подпись заказчика', type: 'signature' },
    ],
  },

};

export const ACT_TEMPLATES = ACT_TEMPLATES_REGISTRY;
