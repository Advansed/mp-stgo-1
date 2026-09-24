export type FieldType =
  | 'string'
  | 'text' 
  | 'textarea'
  | 'number'
  | 'date'
  | 'select'
  | 'address'
  | 'image'
  | 'signature';

export type ActFieldConfig = {
  section?: string;
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
};

export type ActTemplateConfig = {
  type: string;
  name: string;
  fields?: ActFieldConfig[];
};
