import { ActTemplateConfig } from '../types';
import { HTML_BR, HTML_PLOMB, HTML_MR, HTML_MI, HTML_SF, HTML_SGE } from './htmlTemplates';

// 🔥 ОБЩИЕ ПОЛЯ (ВЕРХНЯЯ ЧАСТЬ)
// Оставляем это, чтобы гарантировать отсутствие дубликатов в шапке
const COMMON_FIELDS_TOP = [
  { section: 'Основное', key: 'act_number', label: 'Номер акта', type: 'string', required: true },
  { key: 'act_date', label: 'Дата составления', type: 'date', required: true },
  
  { section: 'Абонент', key: 'lic', label: 'Лицевой счет', type: 'string', required: true },
  { key: 'owner_name', label: 'ФИО Абонента', type: 'string', required: true },
  { key: 'owner_phone', label: 'Телефон', type: 'string' },
  { key: 'object_address', label: 'Адрес объекта', type: 'address', required: true },
  
  { section: 'Исполнитель', key: 'technician_name', label: 'ФИО Исполнителя', type: 'string' }
];

export const ACT_TEMPLATES: Record<string, ActTemplateConfig> = {
  // 1. ЗАМЕНА БАТАРЕИ
  'actbr': {
    type: 'actbr',
    name: 'Замена батареи',
    htmlTemplate: HTML_BR,
    fields: [
      ...COMMON_FIELDS_TOP,
      
      { section: 'Снятый элемент', key: 'removed_meter_model', label: 'Модель счетчика', type: 'string' },
      { key: 'removed_meter_number', label: 'Номер счетчика', type: 'string' },
      { key: 'removed_meter_reading', label: 'Показания', type: 'string' },
      { key: 'removed_seal_number', label: 'Номер пломбы', type: 'string' },

      { section: 'Установленный элемент', key: 'installed_meter_model', label: 'Модель счетчика', type: 'string' },
      { key: 'installed_meter_number', label: 'Номер счетчика', type: 'string' },
      { key: 'installed_meter_reading', label: 'Показания', type: 'string' },
      { key: 'installed_seal_number', label: 'Номер пломбы', type: 'string' },
      
      // 🔥 НИЖНЯЯ ЧАСТЬ (Фото и Подписи)
      { section: 'Фотофиксация', key: 'photo_meter', label: 'Фото счетчика', type: 'image' },
      { key: 'photo_seal', label: 'Фото пломбы', type: 'image' },
      
      { section: 'Подписи', key: 'owner_signature', label: 'Подпись абонента', type: 'signature' },
      { key: 'technician_signature', label: 'Подпись исполнителя', type: 'signature' }
    ]
  },

  // 2. ПЛОМБИРОВКА
  'actplomb': {
    type: 'actplomb',
    name: 'Пломбировка',
    htmlTemplate: HTML_PLOMB,
    fields: [
      ...COMMON_FIELDS_TOP,

      { section: 'Прибор учета', key: 'meter_model', label: 'Модель', type: 'string' },
      { key: 'meter_number', label: 'Заводской номер', type: 'string' },
      { key: 'meter_reading', label: 'Показания', type: 'string' },

      { section: 'Пломба', key: 'seal_number', label: 'Номер пломбы', type: 'string', required: true },
      { key: 'seal_place', label: 'Место установки', type: 'string' },
      { key: 'note', label: 'Примечание', type: 'string' },
      
      // 🔥 НИЖНЯЯ ЧАСТЬ (Фото и Подписи)
      { section: 'Фотофиксация', key: 'photo_meter', label: 'Фото счетчика', type: 'image' },
      { key: 'photo_seal', label: 'Фото пломбы', type: 'image' },
      
      { section: 'Подписи', key: 'owner_signature', label: 'Подпись абонента', type: 'signature' },
      { key: 'technician_signature', label: 'Подпись исполнителя', type: 'signature' }
    ]
  },

  // 3. ЗАМЕНА СЧЕТЧИКА
  'actmr': {
    type: 'actmr',
    name: 'Замена счетчика',
    htmlTemplate: HTML_MR,
    fields: [
      ...COMMON_FIELDS_TOP,

      { section: 'Снят счетчик', key: 'removed_meter_model', label: 'Модель', type: 'string' },
      { key: 'removed_meter_number', label: 'Номер', type: 'string' },
      { key: 'removed_meter_reading', label: 'Показания', type: 'string' },
      { key: 'removed_seal_number', label: 'Пломба', type: 'string' },

      { section: 'Установлен счетчик', key: 'installed_meter_model', label: 'Модель', type: 'string' },
      { key: 'installed_meter_number', label: 'Номер', type: 'string' },
      { key: 'installed_meter_reading', label: 'Показания', type: 'string' },
      { key: 'installed_seal_number', label: 'Пломба', type: 'string' },
      
      // 🔥 НИЖНЯЯ ЧАСТЬ (Фото и Подписи)
      { section: 'Фотофиксация', key: 'photo_meter', label: 'Фото счетчика', type: 'image' },
      { key: 'photo_seal', label: 'Фото пломбы', type: 'image' },
      
      { section: 'Подписи', key: 'owner_signature', label: 'Подпись абонента', type: 'signature' },
      { key: 'technician_signature', label: 'Подпись исполнителя', type: 'signature' }
    ]
  },

  // 4. ПЕРВИЧНАЯ УСТАНОВКА
  'actmi': {
    type: 'actmi',
    name: 'Первичная установка',
    htmlTemplate: HTML_MI,
    fields: [
      ...COMMON_FIELDS_TOP,

      { section: 'Установлен счетчик', key: 'installed_meter_model', label: 'Модель', type: 'string' },
      { key: 'installed_meter_number', label: 'Номер', type: 'string' },
      { key: 'installed_meter_reading', label: 'Показания', type: 'string' },
      { key: 'installed_seal_number', label: 'Пломба', type: 'string' },
      
      // 🔥 НИЖНЯЯ ЧАСТЬ (Фото и Подписи)
      { section: 'Фотофиксация', key: 'photo_meter', label: 'Фото счетчика', type: 'image' },
      { key: 'photo_seal', label: 'Фото пломбы', type: 'image' },
      
      { section: 'Подписи', key: 'owner_signature', label: 'Подпись абонента', type: 'signature' },
      { key: 'technician_signature', label: 'Подпись исполнителя', type: 'signature' }
    ]
  },

  // 5. НАРУШЕНИЕ ПЛОМБЫ
  'actsf': {
    type: 'actsf',
    name: 'Нарушение пломбы',
    htmlTemplate: HTML_SF,
    fields: [
      ...COMMON_FIELDS_TOP,

      { section: 'Нарушение', key: 'removed_seal_number', label: 'Номер сорванной пломбы', type: 'string' },
      { key: 'note', label: 'Описание нарушения', type: 'string' },

      { section: 'Принятые меры', key: 'seal_number', label: 'Установлена новая пломба', type: 'string' },
      { key: 'meter_reading', label: 'Показания счетчика', type: 'string' },
      
      // 🔥 НИЖНЯЯ ЧАСТЬ (Фото и Подписи)
      { section: 'Фотофиксация', key: 'photo_meter', label: 'Фото счетчика', type: 'image' },
      { key: 'photo_seal', label: 'Фото пломбы', type: 'image' },
      
      { section: 'Подписи', key: 'owner_signature', label: 'Подпись абонента', type: 'signature' },
      { key: 'technician_signature', label: 'Подпись исполнителя', type: 'signature' }
    ]
  },

  // 6. ОТКЛЮЧЕНИЕ ГАЗА
  'actsge': {
    type: 'actsge',
    name: 'Отключение газа',
    htmlTemplate: HTML_SGE,
    fields: [
      ...COMMON_FIELDS_TOP,

      { section: 'Детали', key: 'reason', label: 'Причина', type: 'select', options: ['Задолженность', 'Аварийная ситуация', 'Заявление абонента'] },
      { key: 'method', label: 'Способ', type: 'select', options: ['Пломбировка крана', 'Установка заглушки', 'Сварка'] },
      { key: 'seal_number', label: 'Номер пломбы/заглушки', type: 'string' },
      { key: 'meter_reading', label: 'Показания на момент откл.', type: 'string' },
      
      // 🔥 НИЖНЯЯ ЧАСТЬ (Фото и Подписи)
      { section: 'Фотофиксация', key: 'photo_meter', label: 'Фото счетчика', type: 'image' },
      { key: 'photo_seal', label: 'Фото пломбы', type: 'image' },
      
      { section: 'Подписи', key: 'owner_signature', label: 'Подпись абонента', type: 'signature' },
      { key: 'technician_signature', label: 'Подпись исполнителя', type: 'signature' }
    ]
  },

  // 🔥 7. АКТ ВЫПОЛНЕННЫХ РАБОТ (ФИНАЛЬНЫЙ)
  'actfinal': {
    type: 'actfinal',
    name: 'Акт выполненных работ',
    htmlTemplate: HTML_BR, // Используем базовый HTML, можно создать свой при необходимости
    fields: [
      ...COMMON_FIELDS_TOP,

      { section: 'Выполненные работы', key: 'work_description', label: 'Описание работ', type: 'textarea', required: true },
      { key: 'amount', label: 'Сумма к оплате (руб)', type: 'number' },
      { key: 'warranty', label: 'Гарантия (мес)', type: 'string' },

      // Фото и подписи
      { section: 'Фотофиксация', key: 'photo_result', label: 'Фото итога', type: 'image' },
      
      { section: 'Подписи', key: 'owner_signature', label: 'Подпись заказчика', type: 'signature' },
      { key: 'technician_signature', label: 'Подпись исполнителя', type: 'signature' }
    ]
  }
};