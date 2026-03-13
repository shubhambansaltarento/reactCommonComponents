// shared-components-app/app/web-components-demo.tsx
'use client';

import { useEffect, useState } from 'react';

export default function WebComponentsDemo() {
  useEffect(() => {
    // Register web components when component mounts
    (async () => {
      const { registerAllWebComponents } = await import(
        '@shared/components'
      );
      const registered = registerAllWebComponents({ prefix: 'tvs' });
      console.log('Registered custom elements:', registered);
    })();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>📱 Web Components Demo (in React)</h1>
      <p>Components registered as custom elements, used directly in React JSX:</p>

      <section style={{ marginBottom: '30px' }}>
        <h2>Example 1: Custom Button</h2>
        <p>Using custom button web component:</p>
        {/* @ts-ignore */}
        <tvs-custom-button
          label="Web Component in React"
          variant="contained"
        />
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>Example 2: Event Handling</h2>
        <p>Listen to events from web components:</p>
        {/* @ts-ignore */}
        <tvs-custom-button
          label="Click and Check Console"
          variant="outlined"
          id="event-demo"
        />
        <p style={{ color: '#666', fontSize: '12px' }}>
          Open DevTools console to see event fired
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>Example 3: Dynamic Props</h2>
        <p>Update component props from React state:</p>
        <DynamicComponentDemo />
      </section>

      <section>
        <h2>📚 Key Benefits</h2>
        <ul>
          <li>✅ Same components used in React, Vue, Angular, vanilla JS</li>
          <li>✅ No React dependency for consumers</li>
          <li>✅ Better code reuse across projects</li>
          <li>✅ Framework flexibility</li>
        </ul>
      </section>
    </div>
  );
}

function DynamicComponentDemo() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Increment: {count}
      </button>
      {/* @ts-ignore */}
      <tvs-custom-button
        label={`Count: ${count}`}
        variant="contained"
        style={{ marginLeft: '10px' }}
      />
      <p style={{ color: '#666', fontSize: '12px' }}>
        React state updates the component label
      </p>
    </div>
  );
}
