# Web Components Quick Reference

## What Are Web Components?

Your shared React components are now also available as **browser-native custom elements** that work in any JavaScript framework or plain HTML/JS apps.

```html
<!-- Before: React only -->
<CustomButton label="Save" />

<!-- Now: Also works as Web Component in Vue, Angular, Plain JS, etc. -->
<tvs-custom-button label="Save"></tvs-custom-button>
```

## Why?

| Before | Now |
|--------|-----|
| ❌ React dependency required | ✅ Works in ANY framework |
| ❌ Locked to React projects | ✅ Reuse in Vue, Angular, Svelte, HTML/JS |
| ❌ No framework interoperability | ✅ True framework-agnostic components |

## 30-Second Setup

```ts
// 1. Import in your app entry point
import { registerAllWebComponents } from '@shared/components';

// 2. Register once
registerAllWebComponents({ prefix: 'tvs' });

// 3. Use in HTML/JSX/Templates
// <tvs-custom-button label="Click Me" />
```

Done! ✅

## API Cheat Sheet

```ts
// Register all components
registerAllWebComponents({ prefix: 'tvs' });

// Register specific components
registerWebComponent('CustomButton', { prefix: 'tvs' });

// Convert component name to tag name
toCustomElementTag('MyComponent', 'tvs'); // 'tvs-my-component'
```

## Usage Examples

### HTML Attributes (Simple Props)

```html
<!-- Strings -->
<tvs-input placeholder="Enter text"></tvs-input>

<!-- Numbers -->
<tvs-stepper step-count="5"></tvs-stepper>

<!-- Booleans -->
<tvs-checkbox checked></tvs-checkbox>

<!-- JSON Objects/Arrays -->
<tvs-table columns='[{"field":"name"}]'></tvs-table>
```

### JavaScript (Complex Props & Events)

```ts
const button = document.querySelector('tvs-custom-button');

// Set complex props
button.props = {
  label: 'Save',
  icon: someReactElement,
  onClick: (result) => console.log(result),
};

// Listen to events
button.addEventListener('click', (e) => {
  console.log('Button clicked:', e.detail);
});
```

### Framework Integration

| Framework | Setup |
|-----------|-------|
| React | `useEffect(() => registerAllWebComponents())` |
| Vue | Register in `main.ts`, add `isCustomElement` config |
| Angular | Add `CUSTOM_ELEMENTS_SCHEMA` to module |
| Svelte | Register in `+layout.svelte` |
| Vanilla JS | Register in `<script type="module">` |

## Component Naming

Component names follow a pattern:

```
React Component       → Custom Element Tag
─────────────────────────────────────────────
CustomButton          →  tvs-custom-button
Input                 →  tvs-input
CommonTable           →  tvs-common-table
PreviewNotification   →  tvs-preview-notification
```

**Convention:** Prefix + kebab-case component name

## Component Communication

### Props (Inputs)

```tsx
<tvs-custom-button
  label="Click"           // String prop
  variant="contained"     // String prop
  disabled               // Boolean prop
  :data-items="items"    // JavaScript (Vue syntax)
></tvs-custom-button>
```

### Events (Outputs)

```html
<!-- HTML Attribute: on-event-name -->
<tvs-custom-button on-click="handleClick"></tvs-custom-button>

<!-- Listen in JavaScript -->
<script>
  document.querySelector('tvs-custom-button')
    .addEventListener('handleClick', (e) => {
      console.log('Fired with detail:', e.detail);
    });
</script>
```

## Common Patterns

**Pattern: Read-only Display**
```html
<tvs-status-card status="completed"></tvs-status-card>
```

**Pattern: Form Input**
```ts
const input = document.querySelector('tvs-input');
input.addEventListener('input', (e) => {
  console.log('User typed:', e.detail);
});
```

**Pattern: Data Table**
```ts
const table = document.querySelector('tvs-common-table');
table.props = {
  rows: dataFromAPI,
  columns: columnConfig,
  onRowClick: handleRowSelection,
};
```

**Pattern: Modal/Dialog**
```ts
const modal = document.querySelector('tvs-popup');
modal.addEventListener('close', () => {
  document.body.removeChild(modal);
});
```

## Attribute Conversion Rules

| Input | Becomes |
|-------|---------|
| `label="text"` | `{ label: "text" }` |
| `count="42"` | `{ count: 42 }` |
| `enabled` | `{ enabled: true }` |
| `data-x="value"` | `{ dataX: "value" }` |
| `on-click="eventName"` | `onClick` callback → dispatches `eventName` event |
| `data='{"a":1}'` | `{ data: { a: 1 } }` |

## Error Handling

```ts
// Check if registration succeeded
const tags = registerAllWebComponents();
console.log('Registered components:', tags);
// Output: ['tvs-custom-button', 'tvs-input', ...]

// Component not appearing? Check:
1. Verify registerAllWebComponents() was called
2. Check DevTools Console for errors
3. Ensure component name exists in @shared/components
4. Verify custom element tag follows the configured prefix
```

## Browser Compatibility

Web Components work in:
- ✅ Chrome 67+
- ✅ Firefox 60+
- ✅ Safari 14+
- ✅ Edge 79+
- ⚠️ IE 11 (with polyfills)

## Performance Notes

- ⚡ Registration is fast (~100ms for all components)
- ⚡ Rendering uses React 18 concurrent features
- ⚡ No memory leaks (automatic cleanup on remove)
- 💡 Tip: Register only used components to reduce overhead

## Styling

Components use **MUI internally**, so:

```css
/* Global MUI CSS is loaded */
/* Style web components via MUI classes */
tvs-custom-button {
  /* This affects the component and its children */
}

/* Or through MUI's sx prop */
```

## Debugging Tips

```ts
// See what got registered
console.log(registerAllWebComponents());

// Inspect element in DevTools
const el = document.querySelector('tvs-custom-button');
console.log(el.props); // Check current props
console.log(el.getAttribute('label')); // Check HTML attributes

// Manually render components
const elem = document.createElement('tvs-custom-button');
elem.props = { label: 'Test' };
document.body.appendChild(elem);
```

## Limitations

| Limitation | Workaround |
|-----------|-----------|
| Can't use React Context inside | Pass needed values via props |
| No TypeScript props in HTML | Use `.props` in JavaScript for complex types |
| HTML only accepts strings | Same - use `.props` for functions/objects |
| Shadow DOM not used | Style with global CSS (MUI already does this) |

## Next Steps

1. **Quick Start**: See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
2. **Full API Docs**: See [WEB_COMPONENTS_USAGE.md](./USAGE_GUIDE.md)
3. **Architecture Details**: See [WEB_COMPONENTS_ARCHITECTURE.md](./WEB_COMPONENTS_ARCHITECTURE.md)
4. **Framework Examples**: See docs/ folder (Vue, Angular, Svelte examples)

## Questions?

- 📖 Read the full usage guide
- 💬 Check framework-specific examples in docs/
- 🐛 Look for errors in browser console
- 🎯 Verify component exports from `@shared/components`
