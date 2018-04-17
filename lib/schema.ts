export interface Schema {
  [key: string]: Schema | Value;
}

export type Converter = (value: string) => any;

export interface Value {
  type?: ValueType;
  default?: any;
  env: string | string[];
  required?: boolean;
  convert?: Converter;
}

export type ValueType = 'string' | 'integer' | 'boolean' | 'float';
