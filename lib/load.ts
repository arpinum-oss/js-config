import { convert } from './convert';
import { Description, DescriptionLeaf } from './description';

export interface LoadOptions {
  env?: NodeJS.ProcessEnv;
}

export function load(description: Description, options: LoadOptions): any {
  const opts = initializeOptions();
  return Object.keys(description).reduce(
    (result, key) => Object.assign({}, result, loadKey(key)),
    {}
  );

  function initializeOptions() {
    return Object.assign({}, { env: () => process.env }, options);
  }

  function loadKey(key: string): object {
    const descriptionPart = description[key];
    if (descriptionSeemsNested(descriptionPart)) {
      return { [key]: load(descriptionPart as Description, options) };
    }
    const descriptionLeaf = descriptionPart as DescriptionLeaf;
    const variableName = descriptionLeaf.env;
    const envValue = opts.env()[variableName];
    if (envValue !== undefined) {
      return { [key]: callConvert(envValue, descriptionLeaf) };
    }
    if (descriptionLeaf.default !== undefined) {
      return { [key]: descriptionLeaf.default };
    }
    if (descriptionLeaf.required) {
      throw new Error(`${variableName} variable is required but missing`);
    }
    return {};
  }

  function callConvert(envValue: string, leaf: DescriptionLeaf) {
    if (leaf.convert) {
      return leaf.convert(envValue);
    }
    return convert(envValue, leaf.type);
  }

  function descriptionSeemsNested(leafOrNot: Description | DescriptionLeaf) {
    return (leafOrNot as any).env === undefined;
  }
}
