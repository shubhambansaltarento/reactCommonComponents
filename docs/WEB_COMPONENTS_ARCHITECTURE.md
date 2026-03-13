# Web Components Architecture Guide

This document explains how shared React components are transformed into framework-agnostic Web Components and how to extend this for new components.

## Overview

The Web Components bridge connects React components to the Web Components standard, allowing the same components to be used in:
- ✅ React / Next.js
- ✅ Vue 2 & 3
- ✅ Angular
- ✅ Svelte
- ✅ Vanilla JavaScript / HTML
- ✅ Any framework that supports Web Components

## Architecture

```
┌─────────────────────────────────────────┐
│  Shared React Components                │
│  (CustomButton, Input, Table, etc.)     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  registerReactWebComponent()             │
│  (Wraps React components in DOM)        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Web Components Registry                │
│  (Custom Elements API)                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Applications (React, Vue, Angular, etc)│
│  <tvs-custom-button /> works anywhere   │
└─────────────────────────────────────────┘
```

## File Structure

```
shared/src/
└── web-components/
    ├── index.ts                           # Public API
    ├── registerReactWebComponent.ts        # Core registration logic
    ├── USAGE_GUIDE.md                     # User-facing documentation
    └── ARCHITECTURE.md                    # This file
```

## Core Concepts

### 1. HTML Attribute to Prop Mapping

Web Components communicate via attributes (strings), but React components expect typed props (objects, functions, etc.).

**Conversion Rules:**

```
HTML Attribute           → React Prop
─────────────────────────────────────
label="Save"            → { label: "Save" }
count="5"               → { count: 5 }
enabled                 → { enabled: true }
data-id="[1,2,3]"       → { dataId: [1, 2, 3] }
on-click="clickName"    → { onClick: (...) => dispatch("clickName") }
```

### 2. Event Bridging

HTML fire standard events via `dispatchEvent()`, React uses callback props.

```tsx
// React Component Prop
<CustomButton onClick={() => console.log('clicked')} />

// Web Component Usage (HTML)
<tvs-custom-button on-click="myClickEvent"></tvs-custom-button>

// Listening to event
element.addEventListener('myClickEvent', (e) => {
  console.log('clicked', e.detail);
});
```

The `on-*` attribute tells the registration wrapper to:
1. Create a callback that dispatches a CustomEvent
2. Pass the callback as `on<X>` prop to the React component
3. When clicked, fire the CustomEvent with any args as `detail`

### 3. Complex Props via JavaScript

For objects, arrays, and functions that can't be expressed as HTML attributes:

```ts
// Set directly on the element
element.props = {
  rows: [...],
  columns: [...],
  onRowClick: (row) => { ... },
};

// Or use the setProp method
element.setProp('rows', newRows);
```

## Implementation Details

### registerReactWebComponent()

This function is the core of the bridge:

```ts
export const defineReactWebComponent = (
  tagName: string,
  Component: ReactComponentLike
): boolean => {
  // 1. Check if tag already registered
  if (customElements.get(tagName)) return false;

  // 2. Create HTMLElement subclass
  class ReactCustomElement extends HTMLElement {
    // 3. Manage React render tree
    private root?: Root;
    private mountPoint?: HTMLDivElement;

    // 4. Sync HTML attributes to props
    connectedCallback() {
      this.syncAttributesToProps();
      this.renderComponent();
    }

    // 5. Render React component
    private renderComponent() {
      if (!this.root) return;
      this.root.render(React.createElement(Component, this.props));
    }
  }

  // 6. Register with browser
  customElements.define(tagName, ReactCustomElement);
  return true;
};
```

**Key mechanisms:**

- **Mount Point**: Each custom element has a hidden `<div>` that becomes the React render target
- **Root Management**: Uses React 18 `createRoot()` for efficient rendering
- **Attribute Observation**: MutationObserver detects attribute changes and re-renders
- **Cleanup**: `disconnectedCallback()` unmounts React components to prevent memory leaks

### Attribute Parsing

The `syncAttributesToProps()` method:

1. **Reads all HTML attributes** from the element
2. **Converts kebab-case to camelCase**: `data-item-id` → `dataItemId`
3. **Parses values**:
   - `"true"` → `true` (boolean)
   - `"123"` → `123` (number)
   - `"{...}"` → parsed object
   - `"[...]"` → parsed array
4. **Handles `on-*` special case**: Creates event dispatcher callbacks

### Event Dispatching

When a component fires an `onClick` callback:

```ts
// Inside wrapped component
<Button onClick={() => onClickProp(...args)} />

// onClickProp is set to:
(...args) => {
  host.dispatchEvent(new CustomEvent('click', {
    detail: args.length === 1 ? args[0] : args,
    bubbles: true,
    composed: true,
  }));
}
```

The `composed: true` flag allows events to escape Shadow DOM if used.

## Adding New Components

All components exported from `@shared/components` are **automatically** available as Web Components.

**Steps to add a Web Component:**

1. **Create/update React component** in `shared/src/components/`
2. **Export from component's index.ts** (already done for existing components)
3. **Component auto-registers** via `registerAllWebComponents()`

Example:

```tsx
// shared/src/components/MyNewComponent/MyNewComponent.tsx
export interface MyNewComponentProps {
  title: string;
  content: ReactNode;
  onSave?: (data: any) => void;
}

export const MyNewComponent: React.FC<MyNewComponentProps> = ({
  title,
  content,
  onSave,
}) => {
  // ... implementation
};

// shared/src/components/MyNewComponent/index.ts
export * from './MyNewComponent';

// shared/src/components/index.ts
export * from './MyNewComponent'; // ← Component is now available!
```

**Usage immediately after:**

```html
<tvs-my-new-component
  title="Hello"
  content="World"
  on-save="handleSave"
></tvs-my-new-component>
```

## Limitations & Workarounds

### 1. React Context Not Available

Web Components don't inherit React Context from parent React apps.

**Workaround:**
```ts
// Inject context dependencies via props
element.props = {
  theme: ctx.theme,
  user: ctx.user,
  ...
};
```

### 2. Styling Encapsulation

Components use MUI styles which may conflict globally.

**Solution:**
- Components render into regular DOM (not Shadow DOM)
- MUI styles are globally scoped by default
- Use CSS specificity to override if needed

### 3. No TypeScript Props in HTML

HTML attributes are always strings.

**Best Practice:**
- Simple props (label, placeholder, count) via attributes
- Complex props (objects, functions) via `.props` in JavaScript
- Events always via `on-*` attributes

### 4. Memory Management

Custom elements created dynamically should be cleaned up.

**Good Practice:**
```ts
const element = document.createElement('tvs-custom-button');
element.props = { label: 'temp' };
document.body.appendChild(element);

// Later...
element.remove(); // Triggers disconnectedCallback cleanup
```

## Performance Considerations

### Rendering Flow

Each prop/attribute change triggers:

```
1. Attribute changes (observed)
   ▼
2. syncAttributesToProps() called
   ▼
3. Component props updated
   ▼
4. React reconciliation
   ▼
5. DOM patched (MUI components re-render)
```

**Optimization:**
- Avoid frequent prop changes on many elements
- Use batch updates: collect multiple changes, then update `.props` once
- Consider virtual scrolling for large lists

### Bundle Size

- **Web Components runtime**: ~2KB gzipped
- **React 18 (already included)**: necessary dependency
- **Per component**: minimal overhead (~200 bytes per wrapped component)

## Testing Web Components

```ts
import { defineReactWebComponent } from '@shared/components';

describe('Web Components', () => {
  it('should create and render custom element', () => {
    // Register component
    defineReactWebComponent('test-comp', TestComponent);

    // Create element
    const el = document.createElement('test-comp');
    el.props = { label: 'Test' };

    // Append to DOM
    document.body.appendChild(el);
    document.body.removeChild(el);
  });

  it('should dispatch events', (done) => {
    const el = document.createElement('test-button');
    el.addEventListener('click', (e: any) => {
      expect(e.detail).toBeDefined();
      done();
    });
    el.click();
  });
});
```

## Future Enhancements

Potential improvements:

1. **Shadow DOM Support**: Encapsulate MUI styles
2. **Slots API**: Support for component structure customization
3. **Server-Side Rendering**: Render web components on server
4. **Framework Adapters**: Auto-generate framework-specific wrappers
5. **Type Definitions**: Generate `.d.ts` for IDE autocomplete

## References

- [Web Components MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Custom Elements Standard](https://html.spec.whatwg.org/multipage/custom-elements.html)
- [React 18 Roots](https://react.dev/reference/react-dom/client/createRoot)
- [CustomEvent API](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)
