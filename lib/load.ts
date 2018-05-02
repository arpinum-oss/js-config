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

export function load(schema: Schema, options?: Options): any {
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
    const variableNames = Array.isArray(schemaValue.env)
      ? schemaValue.env
      : [schemaValue.env];
    const envValue = loadEnvValue(variableNames);
    if (envValue !== undefined) {
      return { [key]: callConvert(envValue, schemaValue) };
    }
    if (schemaValue.default !== undefined) {
      return { [key]: schemaValue.default };
    }
    if (schemaValue.required) {
      throw new Error(formatRequiredError(variableNames));
    }
    return {};
  }

  function loadEnvValue(variableNames: string[]) {
    const values = variableNames
      .map(n => opts.env()[n])
      .filter(v => v !== undefined);
    return values.length > 0 ? values[0] : undefined;
  }

  function formatRequiredError(variableNames: string[]): string {
    if (variableNames.length > 1) {
      const variables = variableNames.join(', ');
      return `At least one variable should be defined in: ${variables}`;
    }
    return `${variableNames[0]} variable is required but missing`;
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
