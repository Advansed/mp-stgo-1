import { ActTemplateConfig } from '../types';
import { HTML_BR, HTML_PLOMB, HTML_MR, HTML_MI, HTML_SF, HTML_SGE } from './htmlTemplates';

export const ACT_TEMPLATES: Record<string, ActTemplateConfig> = {
  // 1. ЗАМЕНА БАТАРЕИ
  'actbr': {
    type: 'actbr',
    name: 'Замена батареи',
    htmlTemplate: HTML_BR,
    fields: [
      { section: 'Основное', key: 'act_number', label: 'Номер акта', type: 'string', required: true },
      { key: 'act_date', label: 'Дата', type: 'date', required: true },
      { section: 'Исполнитель', key: 'technician_name', label: 'ФИО Техника', type: 'string' },
      { key: 'owner_name', label: 'ФИО Абонента', type: 'string' },
      { key: 'object_address', label: 'Адрес', type: 'address' },
      
      { section: 'Снятый элемент', key: 'removed_meter_number', label: 'Номер счетчика', type: 'string' },
      { key: 'removed_meter_reading', label: 'Показания', type: 'string' },
      { key: 'removed_seal_number', label: 'Пломба', type: 'string' },

      { section: 'Установленный элемент', key: 'installed_meter_number', label: 'Номер счетчика', type: 'string' },
      { key: 'installed_meter_reading', label: 'Показания', type: 'string' },
      { key: 'installed_seal_number', label: 'Пломба', type: 'string' },

      // 🔥 ДОБАВИЛИ ФОТО
      { section: 'Фотофиксация', key: 'photo_meter', label: 'Фото счетчика', type: 'photo' },
      { key: 'photo_seal', label: 'Фото пломбы', type: 'photo' },

      { section: 'Подписи', key: 'technician_signature', label: 'Техник', type: 'sign' },
      { key: 'owner_signature', label: 'Абонент', type: 'sign' }
    ]
  },

  // 2. ЗАМЕНА СЧЕТЧИКА
  'actmr': {
    type: 'actmr',
    name: 'Замена счетчика',
    htmlTemplate: HTML_MR,
    fields: [
      { section: 'Основное', key: 'act_number', label: 'Номер', type: 'string', required: true },
      { key: 'act_date', label: 'Дата', type: 'date', required: true },
      { key: 'technician_name', label: 'Техник', type: 'string' },
      { key: 'owner_name', label: 'Владелец', type: 'string' },
      { key: 'object_address', label: 'Адрес', type: 'address' },

      { section: 'Снятый счетчик', key: 'removed_meter_model', label: 'Модель', type: 'string' },
      { key: 'removed_meter_number', label: 'Номер', type: 'string' },
      { key: 'removed_meter_reading', label: 'Показания', type: 'string' },
      { key: 'removed_seal_number', label: 'Пломба', type: 'string' },

      { section: 'Новый счетчик', key: 'installed_meter_model', label: 'Модель', type: 'string' },
      { key: 'installed_meter_number', label: 'Номер', type: 'string' },
      { key: 'installed_meter_reading', label: 'Показания', type: 'string' },
      { key: 'installed_seal_number', label: 'Пломба', type: 'string' },

      // 🔥 ДОБАВИЛИ ФОТО
      { section: 'Фотофиксация', key: 'photo_old_meter', label: 'Фото старого ПУ', type: 'photo' },
      { key: 'photo_new_meter', label: 'Фото нового ПУ', type: 'photo' },

      { section: 'Подписи', key: 'technician_signature', label: 'Техник', type: 'sign' },
      { key: 'owner_signature', label: 'Владелец', type: 'sign' }
    ]
  },

  // 3. ПЛОМБИРОВКА
  'actplomb': {
    type: 'actplomb',
    name: 'Пломбировка',
    htmlTemplate: HTML_PLOMB,
    fields: [
      { section: 'Основное', key: 'act_number', label: 'Номер', type: 'string', required: true },
      { key: 'act_date', label: 'Дата', type: 'date', required: true },
      { key: 'object_address', label: 'Адрес', type: 'address' },
      { key: 'owner_name', label: 'Владелец', type: 'string' },

      { section: 'Счетчик', key: 'meter_model', label: 'Модель', type: 'string' },
      { key: 'meter_number', label: 'Номер', type: 'string' },
      { key: 'meter_reading', label: 'Показания', type: 'string' },

      { section: 'Пломба', key: 'seal_number', label: 'Номер пломбы', type: 'string', required: true },
      { key: 'seal_place', label: 'Место установки', type: 'string' },
      { key: 'note', label: 'Примечание', type: 'string' },

      // 🔥 ДОБАВИЛИ ФОТО
      { section: 'Фотофиксация', key: 'photo_seal', label: 'Фото пломбы', type: 'photo' },

      { section: 'Подписи', key: 'technician_signature', label: 'Техник', type: 'sign' },
      { key: 'owner_signature', label: 'Владелец', type: 'sign' }
    ]
  },
  
  // Остальные типы тоже можно обновить по аналогии...
   'actmi': {
    type: 'actmi',
    name: 'Первичная установка',
    htmlTemplate: HTML_MI,
    fields: [
      { section: 'Основное', key: 'act_number', label: 'Номер', type: 'string', required: true },
      { key: 'act_date', label: 'Дата', type: 'date', required: true },
      { key: 'object_address', label: 'Адрес', type: 'address' },
      
      { section: 'Установленный счетчик', key: 'installed_meter_model', label: 'Модель', type: 'string' },
      { key: 'installed_meter_number', label: 'Номер', type: 'string' },
      { key: 'installed_meter_reading', label: 'Показания', type: 'string' },
      { key: 'installed_seal_number', label: 'Пломба', type: 'string' },
      
      { section: 'Фото', key: 'photo_meter', label: 'Фото установки', type: 'photo' }, // ФОТО

      { section: 'Подписи', key: 'technician_signature', label: 'Техник', type: 'sign' },
      { key: 'owner_signature', label: 'Владелец', type: 'sign' }
    ]
  },
  
  'actsf': {
    type: 'actsf',
    name: 'Нарушение пломбы',
    htmlTemplate: HTML_SF,
    fields: [
      { section: 'Основное', key: 'act_number', label: 'Номер', type: 'string', required: true },
      { key: 'act_date', label: 'Дата', type: 'date', required: true },
      { key: 'object_address', label: 'Адрес', type: 'address' },

      { section: 'Нарушение', key: 'note', label: 'Описание нарушения', type: 'string' },
      { key: 'removed_seal_number', label: 'Сорванная пломба №', type: 'string' },

      { section: 'Новая пломба', key: 'seal_number', label: 'Новая пломба №', type: 'string' },
      { key: 'meter_reading', label: 'Показания счетчика', type: 'string' },
      
      { section: 'Фото', key: 'photo_violation', label: 'Фото нарушения', type: 'photo' }, // ФОТО

      { section: 'Подписи', key: 'technician_signature', label: 'Техник', type: 'sign' },
      { key: 'owner_signature', label: 'Владелец', type: 'sign' }
    ]
  },
  
  'actsge': {
    type: 'actsge',
    name: 'Отключение газа',
    htmlTemplate: HTML_SGE,
    fields: [
      { section: 'Основное', key: 'act_number', label: 'Номер', type: 'string', required: true },
      { key: 'act_date', label: 'Дата', type: 'date', required: true },
      { key: 'object_address', label: 'Адрес', type: 'address' },

      { section: 'Детали', key: 'reason', label: 'Причина', type: 'select', options: ['Задолженность', 'Аварийная ситуация', 'Заявление абонента'] },
      { key: 'method', label: 'Способ', type: 'select', options: ['Пломбировка крана', 'Установка заглушки', 'Сварка'] },
      
      { key: 'seal_number', label: 'Номер пломбы/заглушки', type: 'string' },
      { key: 'meter_reading', label: 'Показания', type: 'string' },
      
      { section: 'Фото', key: 'photo_cut', label: 'Фото отключения', type: 'photo' }, // ФОТО

      { section: 'Подписи', key: 'technician_signature', label: 'Техник', type: 'sign' },
      { key: 'owner_signature', label: 'Владелец', type: 'sign' }
    ]
  }
};