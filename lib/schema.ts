export interface Schema {
  [key: string]: Schema | Value;
}

export interface Value {
  type?: ValueType;
  default?: any;
  env: string;
  required?: boolean;
  convert?(value: string): any;
}

export type ValueType = 'string' | 'integer' | 'boolean' | 'float';
