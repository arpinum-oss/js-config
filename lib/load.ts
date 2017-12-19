import { convert } from './convert';
import { Schema, Value } from './schema';

export interface ProcessEnv {
  [key: string]: string | undefined;
}

declare var process: {
  env: ProcessEnv;
};

export interface Options {
  env?: ProcessEnv;
}

export function load(schema: Schema, options: Options): any {
  const opts = initializeOptions();
  return Object.keys(schema).reduce(
    (result, key) => Object.assign({}, result, loadKey(key)),
    {}
  );

  function initializeOptions() {
    return Object.assign({}, { env: () => process.env }, options);
  }

  function loadKey(key: string): object {
    const schemaPart = schema[key];
    if (schemaSeemsNested(schemaPart)) {
      return { [key]: load(schemaPart as Schema, options) };
    }
    const schemaValue = schemaPart as Value;
    const variableName = schemaValue.env;
    const envValue = opts.env()[variableName];
    if (envValue !== undefined) {
      return { [key]: callConvert(envValue, schemaValue) };
    }
    if (schemaValue.default !== undefined) {
      return { [key]: schemaValue.default };
    }
    if (schemaValue.required) {
      throw new Error(`${variableName} variable is required but missing`);
    }
    return {};
  }

  function callConvert(envValue: string, schemaValue: Value) {
    if (schemaValue.convert) {
      return schemaValue.convert(envValue);
    }
    return convert(envValue, schemaValue.type);
  }

  function schemaSeemsNested(valueOrNot: Schema | Value) {
    return (valueOrNot as any).env === undefined;
  }
}
