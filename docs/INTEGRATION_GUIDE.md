# Integration Guide: Using Shared Components as Web Components

This guide walks through consuming the shared Web Components in different environments.

## Installation

Install the shared components package:

```bash
npm install @shared/components
# or
yarn add @shared/components
# or
pnpm add @shared/components
```

## Quick Start (2 steps)

### Step 1: Register Components

In your app's **entry point**, register the Web Components:

```ts
import { registerAllWebComponents } from '@shared/components';

registerAllWebComponents({ prefix: 'tvs' });
```

**Where to add this:**
- **Next.js**: `app/layout.tsx` or `pages/_app.tsx`
- **Vue**: `main.ts` or `App.vue` setup
- **Angular**: `main.ts` or `app.component.ts`
- **Vite/Plain JS**: `main.ts` or `index.js`
- **HTML file**: In a `<script type="module">` tag

### Step 2: Use Components

In any HTML/JSX/template:

```html
<tvs-custom-button label="Click Me"></tvs-custom-button>
```

Done! ✅

---

## Framework-Specific Guides

### Next.js / React

**1. Register in root layout:**

```tsx
// app/layout.tsx
'use client';

import { useEffect } from 'react';
import { registerAllWebComponents } from '@shared/components';

export default function RootLayout({ children }) {
  useEffect(() => {
    registerAllWebComponents({ prefix: 'tvs' });
  }, []);

  return <html>{children}</html>;
}
```

**2. Use components:**

```tsx
// app/page.tsx
'use client';

export default function Home() {
  return (
    <div>
      {/* @ts-ignore - Web Component not in React types */}
      <tvs-custom-button
        label="Save"
        variant="contained"
        onClick={(e: any) => console.log(e.detail)}
      />
    </div>
  );
}
```

**3. Fix TypeScript errors (optional):**

```ts
// types/web-components.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    'tvs-custom-button': any;
    'tvs-input': any;
    'tvs-checkbox': any;
    // ... add other components as needed
  }
}
```

---

### Vue 3

**1. Register components globally:**

```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { registerAllWebComponents } from '@shared/components';

registerAllWebComponents({ prefix: 'tvs' });

const app = createApp(App);
app.mount('#app');
```

**2. Configure custom elements schema:**

```ts
// vite.config.ts
import vue from '@vitejs/plugin-vue';

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('tvs-'),
        },
      },
    }),
  ],
};
```

**3. Use components:**

```vue
<template>
  <div>
    <tvs-custom-button
      label="Save"
      variant="contained"
      @click="handleSave"
    ></tvs-custom-button>
  </div>
</template>

<script setup>
const handleSave = () => console.log('Saved!');
</script>
```

---

### Angular

**1. Configure CUSTOM_ELEMENTS_SCHEMA:**

```ts
// app.module.ts
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
```

**2. Register in main or app component:**

```ts
// main.ts
import { registerAllWebComponents } from '@shared/components';

registerAllWebComponents({ prefix: 'tvs' });

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
```

**3. Use in templates:**

```html
<div>
  <tvs-custom-button
    label="Save"
    variant="contained"
    (click)="handleSave()"
  ></tvs-custom-button>

  <tvs-input
    placeholder="Enter value"
    (input)="handleInput($event)"
  ></tvs-input>
</div>
```

---

### Svelte

**1. Register in `+layout.svelte`:**

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { onMount } from 'svelte';
  import { registerAllWebComponents } from '@shared/components';

  onMount(() => {
    registerAllWebComponents({ prefix: 'tvs' });
  });
</script>

<slot />
```

**2. Use components:**

```svelte
<script>
  const handleClick = (e) => console.log(e.detail);
</script>

<tvs-custom-button
  label="Click"
  variant="contained"
  on:click={handleClick}
/>
```

---

### Plain HTML/JavaScript

**1. Register in your HTML:**

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="app"></div>

    <script type="module">
      import { registerAllWebComponents } from '@shared/components';
      registerAllWebComponents({ prefix: 'tvs' });
    </script>
  </body>
</html>
```

**2. Add components:**

```html
<tvs-custom-button
  id="save-btn"
  label="Save"
  variant="contained"
></tvs-custom-button>

<script>
  document.getElementById('save-btn').addEventListener('click', (e) => {
    console.log('Button clicked!', e.detail);
  });
</script>
```

---

## Common Patterns

### Pattern 1: Update Component from JavaScript

```ts
const button = document.querySelector('tvs-custom-button');

// Option A: Update all props at once
button.props = {
  label: 'Updated Label',
  disabled: true,
};

// Option B: Update individual prop
button.setProp('label', 'New Label');
```

### Pattern 2: Listen to Component Events

```ts
const input = document.querySelector('tvs-input');

// If component emits 'onChange' event
input.addEventListener('onChange', (event) => {
  console.log('Input value:', event.detail);
});
```

### Pattern 3: Pass Complex Data

```ts
const table = document.querySelector('tvs-common-table');

table.props = {
  rows: [
    { id: 1, name: 'Row 1', email: 'row1@example.com' },
    { id: 2, name: 'Row 2', email: 'row2@example.com' },
  ],
  columns: [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
  ],
  onRowClick: (row) => {
    console.log('Clicked row:', row);
  },
};
```

### Pattern 4: Selective Registration

```ts
import { registerWebComponent } from '@shared/components';

// Only register components you use
registerWebComponent('CustomButton', { prefix: 'tvs' });
registerWebComponent('Input', { prefix: 'tvs' });

// Now available: <tvs-custom-button /> and <tvs-input />
```

### Pattern 5: Custom Prefix

```ts
registerAllWebComponents({ prefix: 'myapp' });

// Components become: <myapp-custom-button />, <myapp-input />, etc.
```

---

## Troubleshooting

### Issue: Component not appearing

**Check:**
1. Open DevTools Console for errors
2. Verify `registerAllWebComponents()` was called
3. Ensure component name matches exact export name (e.g., `CustomButton`, not `custombutton`)

**Solution:**
```ts
// Check registered components
const tags = registerAllWebComponents();
console.log('Registered:', tags);
```

### Issue: Events not firing

**Check:**
1. Use correct attribute format: `on-event-name` (kebab-case)
2. Listen with correct event name: `addEventListener('eventName', ...)`

**Solution:**
```html
<!-- Wrong: on-onClick -->
<!-- Correct: on-click -->
<tvs-custom-button on-click="myEvent"></tvs-custom-button>

<script>
  document
    .querySelector('tvs-custom-button')
    .addEventListener('myEvent', (e) => {
      console.log('Event fired!', e.detail);
    });
</script>
```

### Issue: Props not updating

**Check:**
1. Are you updating attributes or props?
2. Use `.props` for complex objects

**Solution:**
```ts
const elem = document.querySelector('tvs-component');

// For simple attributes
elem.setAttribute('label', 'New Label');

// For complex props
elem.props = { data: [...], callback: () => {} };
```

### Issue: TypeScript errors in React/Vue/Angular

**For React/TSX:**
```tsx
// Suppress error
{/* @ts-ignore */}
<tvs-custom-button label="Save" />

// Or add to types
declare namespace JSX {
  interface IntrinsicElements {
    'tvs-custom-button': any;
  }
}
```

**For Vue:**
Already fixed by `isCustomElement` config in `vite.config.ts`

**For Angular:**
Already fixed by `CUSTOM_ELEMENTS_SCHEMA`

---

## Best Practices

✅ **DO:**
- Register components once globally at app boot
- Use `.props` for passing functions/objects
- Leverage `on-*` attributes for event binding
- Check browser console for registration info

❌ **DON'T:**
- Register same component multiple times (idempotent, no-op)
- Pass functions via attributes
- Expect React context inside web components
- Assume Shadow DOM for styling

---

## Performance Tips

1. **Register only what you use:**
   ```ts
   registerAllWebComponents({
     include: ['CustomButton', 'Input', 'Select'],
   });
   ```

2. **Batch prop updates:**
   ```ts
   // Bad: Multiple updates
   elem.setProp('a', 1);
   elem.setProp('b', 2);
   elem.setProp('c', 3);

   // Good: Single update
   elem.props = { a: 1, b: 2, c: 3 };
   ```

3. **Lazy register on demand:**
   ```ts
   // Only when needed
   document.addEventListener('DOMContentLoaded', () => {
     if (document.querySelector('tvs-advanced-table')) {
       registerWebComponent('CommonTable');
     }
   });
   ```

---

## Getting Help

- Check [USAGE_GUIDE.md](./WEB_COMPONENTS_USAGE.md) for API reference
- See [WEB_COMPONENTS_ARCHITECTURE.md](./WEB_COMPONENTS_ARCHITECTURE.md) for technical details
- Review framework examples: Vue, Angular, Svelte examples in docs/
