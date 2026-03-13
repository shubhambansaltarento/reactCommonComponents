# Web Components Documentation

Your shared component library now supports **framework-agnostic Web Components**. Use the same components in React, Vue, Angular, Svelte, or vanilla JavaScript!

## 📚 Documentation Files

### Getting Started
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** ⭐ **START HERE**
  - 30-second setup
  - Quick API cheat sheet
  - Common usage patterns
  - FAQ and troubleshooting

### Detailed Guides
- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Framework-specific setup
  - Next.js / React
  - Vue 3
  - Angular
  - Svelte
  - Plain HTML/JS
  - Installation instructions
  - Troubleshooting for each framework

- **[WEB_COMPONENTS_USAGE.md](./USAGE_GUIDE.md)** - Complete API reference
  - API documentation
  - HTML vs JavaScript usage
  - Event handling
  - Prop conversion rules
  - Styling guide
  - Performance tips

### Architecture & Implementation
- **[WEB_COMPONENTS_ARCHITECTURE.md](./WEB_COMPONENTS_ARCHITECTURE.md)** - For developers
  - How the bridge works
  - Core concepts & mechanisms
  - Adding new components
  - Performance considerations
  - Testing strategies

### Examples
- **[WEB_COMPONENTS_DEMO.html](./WEB_COMPONENTS_DEMO.html)** - Interactive demo
  - Works in any browser (no build step needed)
  - Live examples of component usage
  - Event handling demo
  - Props demonstration

- **[VUE3_EXAMPLE.vue](./VUE3_EXAMPLE.vue)** - Vue 3 integration example
- **[ANGULAR_EXAMPLE.ts](./ANGULAR_EXAMPLE.ts)** - Angular integration example
- **React Example in** `shared-components-app/app/web-components-demo.tsx`

## 🚀 Quick Start (2 Step)

### 1. Register in Your App

```ts
import { registerAllWebComponents } from '@shared/components';

registerAllWebComponents({ prefix: 'tvs' });
```

### 2. Use in Your Template

```html
<tvs-custom-button label="Click Me" variant="contained"></tvs-custom-button>
```

Done! ✅

## 📖 Navigation Guide

**I want to...**

| Goal | Read |
|------|------|
| Get started quickly | [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) |
| Set up in my framework | [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) |
| Understand the API | [WEB_COMPONENTS_USAGE.md](./USAGE_GUIDE.md) |
| See code examples | Framework-specific files below |
| Understand how it works | [WEB_COMPONENTS_ARCHITECTURE.md](./WEB_COMPONENTS_ARCHITECTURE.md) |
| Try it now | [WEB_COMPONENTS_DEMO.html](./WEB_COMPONENTS_DEMO.html) |

## 🎯 Framework-Specific Quick Links

### React / Next.js
```tsx
'use client';
import { useEffect } from 'react';
import { registerAllWebComponents } from '@shared/components';

export default function Layout({ children }) {
  useEffect(() => {
    registerAllWebComponents({ prefix: 'tvs' });
  }, []);

  return (
    <html>
      {/* @ts-ignore */}
      <tvs-custom-button label="Save" />
      {children}
    </html>
  );
}
```
→ [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md#nextjs--react)

### Vue 3
```vue
<script setup>
import { registerAllWebComponents } from '@shared/components';
import { onMounted } from 'vue';

onMounted(() => registerAllWebComponents());
</script>

<template>
  <tvs-custom-button label="Save"></tvs-custom-button>
</template>
```
→ [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md#vue-3)

### Angular
```ts
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { registerAllWebComponents } from '@shared/components';

registerAllWebComponents();

@NgModule({ schemas: [CUSTOM_ELEMENTS_SCHEMA] })
export class AppModule {}
```
→ [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md#angular)

### Plain HTML/JS
```html
<script type="module">
  import { registerAllWebComponents } from '@shared/components';
  registerAllWebComponents();
</script>

<tvs-custom-button label="Click"></tvs-custom-button>
```
→ [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md#plain-htmljavascript)

## 🌟 Key Concepts

### Prop Communication

**HTML Attributes** → React Props
```html
<!-- Simple types as attributes -->
<tvs-button label="Save" variant="contained" disabled></tvs-button>

<!-- Complex types via JavaScript -->
<script>
  document.querySelector('tvs-button').props = {
    onClick: (result) => { /* ... */ },
    items: [/* ... */],
  };
</script>
```

### Event Communication

```html
<!-- Declare event binding -->
<tvs-button on-click="buttonClicked"></tvs-button>

<!-- Listen for event -->
<script>
  document.querySelector('tvs-button')
    .addEventListener('buttonClicked', (e) => {
      console.log('Clicked!', e.detail);
    });
</script>
```

### Component Names

```
React: CustomButton
Web Component: tvs-custom-button

React: CommonTable
Web Component: tvs-common-table

Pattern: [prefix]-[component-name-in-kebab-case]
```

## 📦 Installation

```bash
npm install @shared/components
```

## 🔧 Advanced Usage

### Register Only Specific Components

```ts
import { registerWebComponent } from '@shared/components';

registerWebComponent('CustomButton', { prefix: 'tvs' });
registerWebComponent('Input', { prefix: 'tvs' });
```

### Custom Prefix

```ts
registerAllWebComponents({ prefix: 'myapp' });
// → <myapp-custom-button />, <myapp-input />, etc.
```

### Check Registration

```ts
const tags = registerAllWebComponents();
console.log(tags); // All registered custom element tag names
```

## ❓ Need Help?

1. **Is component not appearing?**
   - Check DevTools Console for errors
   - Verify `registerAllWebComponents()` was called
   - Open [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) → Troubleshooting

2. **Events not firing?**
   - Verify event name format: `on-event-name` (kebab-case)
   - Check [WEB_COMPONENTS_USAGE.md](./USAGE_GUIDE.md) → Event Handling

3. **TypeScript errors?**
   - React: Use `@ts-ignore` comment
   - Vue: Add `isCustomElement` config
   - Angular: Use `CUSTOM_ELEMENTS_SCHEMA`
   - See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

4. **Want to understand how it works?**
   - → [WEB_COMPONENTS_ARCHITECTURE.md](./WEB_COMPONENTS_ARCHITECTURE.md)

## 🎓 Learning Path

```
1. QUICK_REFERENCE.md
   ↓
2. INTEGRATION_GUIDE.md (your framework)
   ↓
3. WEB_COMPONENTS_USAGE.md (API details)
   ↓
4. Framework-specific example files
   ↓
5. WEB_COMPONENTS_ARCHITECTURE.md (optional - deep dive)
```

## 🚀 Benefits

✅ **Framework Agnostic** - Use the same components in any JS framework
✅ **Zero React Dependency for Consumers** - Web components are framework-free
✅ **Better Code Reuse** - Single source of truth for all UI components
✅ **Future Proof** - Works with any JavaScript runtime
✅ **Easy Integration** - Just register and use
✅ **Type Safe** - TypeScript support for both React and custom elements

## 📝 File Structure

```
docs/
├── README.md (this file)
├── QUICK_REFERENCE.md (⭐ start here)
├── INTEGRATION_GUIDE.md
├── WEB_COMPONENTS_USAGE.md
├── WEB_COMPONENTS_ARCHITECTURE.md
├── WEB_COMPONENTS_DEMO.html
├── VUE3_EXAMPLE.vue
├── ANGULAR_EXAMPLE.ts
└── (React examples in shared-components-app/)
```

---

**Ready? Start with [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** ⚡
