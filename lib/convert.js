'use strict';

const converters = {
  string: v => convertToString(v),
  boolean: v => convertToBoolean(v),
  integer: v => convertToInteger(v),
  float: v => convertTofloat(v)
};

const booleans = {
  'true': true,
  'yes': true,
  'false': false,
  'no': false
};

function convert(value, description) {
  let targetType = description.type || 'string';
  return converterFor(targetType)(value);
}

function converterFor(targetType) {
  let converter = converters[targetType];
  if (!converter) {
    throw new Error(`${targetType} is an invalid type`);
  }
  return converter;
}

function convertToString(value) {
  return value;
}

function convertToBoolean(value) {
  let boolean = booleans[value.toLowerCase()];
  if (boolean === undefined) {
    throw new Error(`${value} is not a valid boolean`);
  }
  return boolean;
}

function convertToInteger(value) {
  var integer = Number.parseInt(value);
  if (Number.isNaN(integer)) {
    throw new Error(`${value} is not a valid integer`);
  }
  return integer;
}

function convertTofloat(value) {
  var float = Number.parseFloat(value);
  if (Number.isNaN(float)) {
    throw new Error(`${value} is not a valid float`);
  }
  return float;
}

module.exports = convert;
