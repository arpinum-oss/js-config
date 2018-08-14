import { convert } from './convert';
import { Schema, Value } from './schema';

export interface ProcessEnv {
  [key: string]: string | undefined;
}

declare var process: {
  env: ProcessEnv;
};

export interface LoadOptions {
  env?: () => ProcessEnv;
  defaults?: any;
}

interface EffectiveOptions {
  env: () => ProcessEnv;
  defaults?: any;
}

export function load(schema: Schema, options?: LoadOptions): any {
  const opts = initializeOptions(options);
  return doLoad(schema, opts.defaults, opts);
}

function doLoad(schema: Schema, defaults: any, options: EffectiveOptions): any {
  return Object.keys(schema).reduce(
    (result, key) =>
      Object.assign({}, result, loadKey(key, schema, defaults, options)),
    {}
  );
}

function initializeOptions(options?: LoadOptions): EffectiveOptions {
  return Object.assign({}, { env: () => process.env }, options);
}

function loadKey(
  key: string,
  schema: Schema,
  defaults: any,
  options: EffectiveOptions
): object {
  const schemaPart = schema[key];
  if (schemaSeemsNested(schemaPart)) {
    const nestedDefault = defaults !== undefined ? defaults[key] : undefined;
    return { [key]: doLoad(schemaPart as Schema, nestedDefault, options) };
  }
  const schemaValue = schemaPart as Value;
  const variableNames = Array.isArray(schemaValue.env)
    ? schemaValue.env
    : [schemaValue.env];
  const envValue = loadEnvValue(variableNames, options);
  if (envValue !== undefined) {
    return { [key]: callConvert(envValue, schemaValue) };
  }
  if (defaults !== undefined && defaults[key] !== undefined) {
    return { [key]: defaults[key] };
  }
  if (schemaValue.default !== undefined) {
    return { [key]: schemaValue.default };
  }
  if (schemaValue.required) {
    throw new Error(formatRequiredError(variableNames));
  }
  return {};
}

function loadEnvValue(variableNames: string[], options: EffectiveOptions) {
  const values = variableNames
    .map(n => options.env()[n])
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
