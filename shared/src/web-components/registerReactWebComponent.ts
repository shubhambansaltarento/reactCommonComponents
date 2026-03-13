import React from 'react';
import { createRoot, type Root } from 'react-dom/client';

type GenericProps = Record<string, unknown>;

export type ReactComponentLike =
  | React.ComponentType<Record<string, unknown>>
  | React.ExoticComponent<Record<string, unknown>>;

export interface ReactWebComponentElement extends HTMLElement {
  props: GenericProps;
  setProp: (key: string, value: unknown) => void;
}

const toCamelCase = (value: string): string =>
  value.replace(/[-_:]+(.)?/g, (_match, char: string) =>
    char ? char.toUpperCase() : ''
  );

const toKebabCase = (value: string): string =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();

const parseAttributeValue = (value: string): unknown => {
  const trimmed = value.trim();

  if (trimmed === '') return true;
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed === 'null') return null;

  if (!Number.isNaN(Number(trimmed)) && trimmed !== '') {
    return Number(trimmed);
  }

  if (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return value;
    }
  }

  return value;
};

const toEventDetail = (args: unknown[]): unknown =>
  args.length <= 1 ? args[0] : args;

const createCallbackFromAttribute = (
  host: HTMLElement,
  propName: string,
  explicitEventName?: string | null
) => {
  const fallbackEventName = toKebabCase(propName.replace(/^on/, ''));
  const eventName = explicitEventName?.trim() || fallbackEventName;

  return (...args: unknown[]) => {
    host.dispatchEvent(
      new CustomEvent(eventName, {
        detail: toEventDetail(args),
        bubbles: true,
        composed: true,
      })
    );
  };
};

export const defineReactWebComponent = (
  tagName: string,
  Component: ReactComponentLike
): boolean => {
  if (typeof window === 'undefined' || !globalThis.customElements) {
    return false;
  }

  if (customElements.get(tagName)) {
    return false;
  }

  class ReactCustomElement extends HTMLElement implements ReactWebComponentElement {
    private root?: Root;

    private mountPoint?: HTMLDivElement;

    private attributeObserver?: MutationObserver;

    private attributeProps: GenericProps = {};

    private propertyProps: GenericProps = {};

    get props(): GenericProps {
      return { ...this.attributeProps, ...this.propertyProps };
    }

    set props(value: GenericProps) {
      this.propertyProps = value || {};
      this.renderComponent();
    }

    setProp = (key: string, value: unknown) => {
      this.propertyProps = {
        ...this.propertyProps,
        [key]: value,
      };
      this.renderComponent();
    };

    connectedCallback(): void {
      if (!this.mountPoint) {
        this.mountPoint = document.createElement('div');
        this.appendChild(this.mountPoint);
      }

      if (!this.root && this.mountPoint) {
        this.root = createRoot(this.mountPoint);
      }

      this.syncAttributesToProps();
      this.attributeObserver = new MutationObserver(() => {
        this.syncAttributesToProps();
      });

      this.attributeObserver.observe(this, {
        attributes: true,
      });

      this.renderComponent();
    }

    disconnectedCallback(): void {
      this.attributeObserver?.disconnect();
      this.attributeObserver = undefined;
      this.root?.unmount();
      this.root = undefined;
    }

    private syncAttributesToProps(): void {
      const nextAttributeProps: GenericProps = {};

      this.getAttributeNames().forEach((attrName) => {
        const attrValue = this.getAttribute(attrName);

        if (attrName.startsWith('on-')) {
          const callbackName = `on${toCamelCase(attrName.slice(3)).replace(
            /^./,
            (char) => char.toUpperCase()
          )}`;
          nextAttributeProps[callbackName] = createCallbackFromAttribute(
            this,
            callbackName,
            attrValue
          );
          return;
        }

        const propName = toCamelCase(attrName);
        nextAttributeProps[propName] = parseAttributeValue(attrValue ?? '');
      });

      this.attributeProps = nextAttributeProps;
      this.renderComponent();
    }

    private renderComponent(): void {
      if (!this.root) return;

      this.root.render(React.createElement(Component, this.props));
    }
  }

  customElements.define(tagName, ReactCustomElement);
  return true;
};

export const isReactComponentCandidate = (value: unknown): value is ReactComponentLike => {
  if (typeof value === 'function') return true;

  if (typeof value === 'object' && value !== null) {
    return '$$typeof' in value || 'render' in value;
  }

  return false;
};

export const toCustomElementTag = (name: string, prefix = 'tvs'): string => {
  const normalizedName = toKebabCase(name);
  return `${prefix}-${normalizedName}`;
};
