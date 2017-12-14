export interface Description {
  [key: string]: Description | DescriptionLeaf;
}

export interface DescriptionLeaf {
  type?: DescriptionType;
  default?: any;
  env: string;
  required?: boolean;
  convert?(value: string): any;
}

export type DescriptionType = 'string' | 'integer' | 'boolean' | 'float';
