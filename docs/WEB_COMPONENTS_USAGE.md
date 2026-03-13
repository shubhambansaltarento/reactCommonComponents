# Web Components Usage

This file is the docs-facing usage reference for Web Components.

For the source-package usage guide, see:
- [shared/src/web-components/USAGE_GUIDE.md](../shared/src/web-components/USAGE_GUIDE.md)

## Quick Start

```ts
import { registerAllWebComponents } from '@shared/components';

registerAllWebComponents({ prefix: 'tvs' });
```

Then use any component as a custom element, for example:

```html
<tvs-custom-button label="Save" variant="contained"></tvs-custom-button>
```

## Main APIs

- `registerAllWebComponents(options?)`
- `registerWebComponent(exportName, options?)`
- `toCustomElementTag(name, prefix?)`

## Notes

- Simple props can be passed via attributes.
- Complex props (objects/functions) should be set through `element.props`.
- Event-style props can be mapped with `on-*` attributes and listened via `addEventListener`.

For full examples and framework-specific setup, see:
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
- [AVAILABLE_COMPONENTS.md](./AVAILABLE_COMPONENTS.md)
- [WEB_COMPONENTS_ARCHITECTURE.md](./WEB_COMPONENTS_ARCHITECTURE.md)
