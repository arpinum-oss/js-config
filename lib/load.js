'use strict';

const convert = require('./convert');

function load(description, options) {
  let opts = initializeOptions();
  return Object.keys(description)
    .reduce((result, key) => Object.assign({}, result, loadKey(key)), {});

  function initializeOptions() {
    return Object.assign({}, {env: () => process.env}, options);
  }

  function loadKey(key) {
    let descriptionPart = description[key];
    if (descriptionSeemsNested(descriptionPart)) {
      return {[key]: load(descriptionPart, options)};
    }
    let variableName = descriptionPart.env;
    let envValue = opts.env()[variableName];
    if (envValue !== undefined) {
      let convertFunction = convertFunctionFrom(descriptionPart);
      return {[key]: convertFunction(envValue, descriptionPart)};
    }
    if (descriptionPart.default !== undefined) {
      return {[key]: descriptionPart.default};
    }
    if (descriptionPart.required) {
      throw new Error(`${variableName} variable is required but missing`);
    }
    return {};
  }

  function convertFunctionFrom(description) {
    return description.convert || convert;
  }

  function descriptionSeemsNested(description) {
    return description.env === undefined;
  }
}

module.exports = load;
