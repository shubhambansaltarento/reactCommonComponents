# Web Components Usage Guide

The shared components library now exposes all React components as browser-native custom elements. This enables their use in any JavaScript framework or vanilla HTML/JS apps.

## Quick Start

### 1. Register Components Globally (in your app entry point)

**Next.js / React:**
```tsx
// app/layout.tsx or _app.tsx
import { registerAllWebComponents } from '@shared/components';

if (typeof window !== 'undefined') {
  registerAllWebComponents({ prefix: 'tvs' });
}

export default function Layout() {
  return <html>...</html>;
}
```

**Vue / Angular / Vanilla JS:**
```js
// main.ts or index.js
import { registerAllWebComponents } from '@shared/components';

registerAllWebComponents({ prefix: 'tvs' });
```

### 2. Use in HTML

**Simple Props (strings, numbers, booleans):**
```html
<tvs-custom-button label="Click Me" variant="contained"></tvs-custom-button>

<tvs-input placeholder="Enter text"></tvs-input>

<tvs-checkbox checked></tvs-checkbox>
```

**Event Handlers with `on-*` attributes:**
```html
<tvs-custom-button label="Save" on-click="handleSave"></tvs-custom-button>

<script>
  document.querySelector('tvs-custom-button').addEventListener('handleSave', (e) => {
    console.log('Button clicked with detail:', e.detail);
  });
</script>
```

**Complex Props (via JavaScript):**
```ts
const table = document.querySelector('tvs-common-table');
table.props = {
  rows: [
    { id: 1, name: 'John', email: 'john@example.com' },
    { id: 2, name: 'Jane', email: 'jane@example.com' },
  ],
  columns: [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name' },
    { field: 'email', headerName: 'Email' },
  ],
  onRowClick: (row) => console.log('Row clicked:', row),
};
```

### 3. Selective Registration

Instead of registering all components, register only what you need:

```ts
import { registerWebComponent } from '@shared/components';

registerWebComponent('CustomButton', { prefix: 'tvs' });
registerWebComponent('CustomInput', { prefix: 'tvs' });
```

### 4. Attribute-to-Property Conversion

HTML attributes are automatically converted to camelCase props:

```html
<!-- Attribute: data-items -->
<tvs-component data-items="[1,2,3]"></tvs-component>

<!-- Becomes: { dataItems: [1, 2, 3] } -->
```

**Special handling:**
- `on-*` attributes → event listeners (not props)
- `data-*` attributes → converted to `data*` props
- Empty attributes → `true`
- `"true"` / `"false"` → boolean
- `"null"` → `null`
- Numeric strings → numbers
- JSON strings → parsed objects

## API Reference

### `registerAllWebComponents(options?)`

Registers all exported React components as custom elements.

**Returns:** `string[]` - array of registered custom element tag names

**Options:**
- `prefix?: string` - Default: `'tvs'` - prefix for tag names
- `include?: string[]` - Only register components with these names
- `exclude?: string[]` - Skip these component names

```ts
const tags = registerAllWebComponents({
  prefix: 'app',
  exclude: ['ToastMessage'], // Don't expose ToastMessage
});
console.log(tags); // ['app-custom-button', 'app-input', ...]
```

### `registerWebComponent(exportName, options?)`

Register a single component.

**Returns:** `string | null` - registered tag name or null if registration failed

```ts
const tag = registerWebComponent('CustomButton', { prefix: 'tvs' });
if (tag) console.log(`Registered as ${tag}`);
```

### `toCustomElementTag(name, prefix?)`

Convert a component name to a valid custom element tag.

```ts
toCustomElementTag('MyComponent', 'tvs'); // 'tvs-my-component'
```

## Framework Examples

### React / Next.js
```tsx
// Using as Web Component inside React
<tvs-custom-button
  label="Save"
  variant="contained"
  onClick={(e: any) => console.log(e.detail)}
/>
```

### Vue 3
```vue
<template>
  <tvs-custom-button
    label="Save"
    variant="contained"
    @handleSave="onSave"
  />
</template>

<script setup>
const onSave = (e) => console.log(e.detail);
</script>
```

### Angular
```typescript
// tsconfig.json - add to compileOptions:
{
  "angularCompilerOptions": {
    "allowUnknownCustomElementSchema": true
  }
}
```

```html
<tvs-custom-button
  label="Save"
  variant="contained"
  (handleSave)="onSave($event)"
>
</tvs-custom-button>
```

### Plain HTML/JS
```html
<!DOCTYPE html>
<html>
  <body>
    <tvs-custom-button id="btn" label="Click Me"></tvs-custom-button>

    <script type="module">
      import { registerAllWebComponents } from '@shared/components';

      registerAllWebComponents();

      document.getElementById('btn').addEventListener('click', (e) => {
        console.log('Clicked!', e.detail);
      });
    </script>
  </body>
</html>
```

## Styling Web Components

Each component renders inside a `<div>` mount point. Use CSS to style them:

```css
tvs-custom-button {
  display: inline-block;
  margin: 8px;
}

tvs-custom-button::part(button) {
  /* Target internal MUI Button via MUI classes */
}
```

Since components use MUI internally, you can style via CSS classes applied to the rendered MUI components.

## Troubleshooting

**Custom element not appearing?**
1. Check browser console for errors
2. Ensure `registerAllWebComponents()` is called before DOM renders
3. Verify component name matches export in `@shared/components`

**Events not firing?**
1. Use `on-event-name` attributes (kebab-case)
2. Listen on the element with `addEventListener()`
3. Check event detail: `console.log(e.detail)`

**Props not updating?**
1. Use `.props` property for complex objects
2. Use `setProp(key, value)` method for individual updates
3. For attributes, update the DOM attribute and it syncs automatically
