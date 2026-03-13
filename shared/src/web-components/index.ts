import * as exportedComponents from '../components';
import {
  defineReactWebComponent,
  isReactComponentCandidate,
  toCustomElementTag,
  type ReactComponentLike,
} from './registerReactWebComponent';

const PASCAL_CASE_EXPORT = /^[A-Z][A-Za-z0-9]*$/;

export interface RegisterWebComponentsOptions {
  prefix?: string;
  include?: string[];
  exclude?: string[];
}

export const registerWebComponent = (
  exportName: string,
  options: Pick<RegisterWebComponentsOptions, 'prefix'> = {}
): string | null => {
  const candidate = (exportedComponents as Record<string, unknown>)[exportName];

  if (!isReactComponentCandidate(candidate)) {
    return null;
  }

  const tagName = toCustomElementTag(exportName, options.prefix ?? 'tvs');
  defineReactWebComponent(tagName, candidate as ReactComponentLike);
  return tagName;
};

export const registerAllWebComponents = (
  options: RegisterWebComponentsOptions = {}
): string[] => {
  const prefix = options.prefix ?? 'tvs';
  const include = new Set(options.include ?? []);
  const exclude = new Set(options.exclude ?? []);
  const useIncludeFilter = include.size > 0;

  const registeredTags: string[] = [];

  Object.entries(exportedComponents).forEach(([exportName, exportedValue]) => {
    if (!PASCAL_CASE_EXPORT.test(exportName)) return;
    if (useIncludeFilter && !include.has(exportName)) return;
    if (exclude.has(exportName)) return;
    if (!isReactComponentCandidate(exportedValue)) return;

    const tagName = toCustomElementTag(exportName, prefix);
    const didRegister = defineReactWebComponent(
      tagName,
      exportedValue as ReactComponentLike
    );

    if (didRegister) {
      registeredTags.push(tagName);
    }
  });

  return registeredTags;
};

export {
  defineReactWebComponent,
  isReactComponentCandidate,
  toCustomElementTag,
  type ReactComponentLike,
  type ReactWebComponentElement,
} from './registerReactWebComponent';
