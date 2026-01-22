// Добавляем 'photo' в список
export type FieldType = 'string' | 'date' | 'select' | 'address' | 'sign' | 'photo' | 'header';

export interface ActFieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  defaultValue?: any;
  section?: string;
}

export interface ActTemplateConfig {
  type: string;
  name: string;
  htmlTemplate: string;
  fields: ActFieldConfig[];
}