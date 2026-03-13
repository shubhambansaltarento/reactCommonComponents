 
# Shared Components Boilerplate

This repository is now a lightweight monorepo focused on reusable shared React components.

It now also supports framework-agnostic usage through Web Components generated from shared components.

## Workspace Packages

- `shared`: reusable components, hooks, and utilities package
- `shared-components-app`: minimal Next.js app that reads shared component exports and shows them on one page

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the demo app:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000`

## Available Scripts

- `npm run dev` - starts `shared-components-app`
- `npm run build` - builds `shared-components-app`
- `npm run start` - starts production build of `shared-components-app`

## Use Shared Components as Web Components

You can register shared components as browser-native custom elements and consume them in any framework (Angular, Vue, plain HTML/JS, etc.).

```ts
import { registerAllWebComponents } from '@shared/components';

registerAllWebComponents({
   prefix: 'tvs',
});
```

After registration, a component like `CustomButton` is available as:

```html
<tvs-custom-button label="Save" variant="contained"></tvs-custom-button>
```

For event props, use `on-*` attributes. The attribute value is used as event name:

```html
<tvs-custom-button label="Save" on-click="save-clicked"></tvs-custom-button>

<script>
   document
      .querySelector('tvs-custom-button')
      .addEventListener('save-clicked', (event) => {
         console.log('clicked', event.detail);
      });
</script>
```

For complex props (objects/functions), set `props` programmatically:

```ts
const element = document.querySelector('tvs-common-table');
element.props = {
   rows: [{ id: 1, name: 'Row 1' }],
   onRowClick: (row) => console.log(row),
};
```