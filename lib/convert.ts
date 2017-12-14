import { DescriptionType } from './description';

const converters: any = {
  string: convertToString,
  boolean: convertToBoolean,
  integer: convertToInteger,
  float: convertTofloat
};

interface Booleans {
  [key: string]: boolean | undefined;
}

const booleans: Booleans = {
  true: true,
  yes: true,
  false: false,
  no: false
};

export function convert(value: string, type: DescriptionType = 'string') {
  return converterFor(type)(value);
}

function converterFor(type: DescriptionType) {
  const converter = converters[type];
  if (!converter) {
    throw new Error(`${type} is an invalid type`);
  }
  return converter;
}

function convertToString(value: string) {
  return value;
}

function convertToBoolean(value: string) {
  const bool = booleans[value.toLowerCase()];
  if (bool === undefined) {
    throw new Error(`${value} is not a valid boolean`);
  }
  return bool;
}

function convertToInteger(value: string) {
  const integer = Number.parseInt(value);
  if (Number.isNaN(integer)) {
    throw new Error(`${value} is not a valid integer`);
  }
  return integer;
}

function convertTofloat(value: string) {
  const float = Number.parseFloat(value);
  if (Number.isNaN(float)) {
    throw new Error(`${value} is not a valid float`);
  }
  return float;
}