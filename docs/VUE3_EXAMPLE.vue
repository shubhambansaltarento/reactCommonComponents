// Example: Using Web Components in a Vue 3 app
// Save in your Vue project (e.g., src/components/WebComponentExample.vue)

<template>
  <div class="web-components-demo">
    <h1>Shared Components in Vue 3</h1>
    <p>Using framework-agnostic Web Components in Vue</p>

    <!-- Simple Button Component -->
    <section>
      <h2>Simple Button</h2>
      <tvs-custom-button
        label="Save Changes"
        variant="contained"
        @click="handleSave"
      ></tvs-custom-button>
    </section>

    <!-- Controlled via Vue State -->
    <section>
      <h2>Controlled Component</h2>
      <tvs-custom-button
        :label="`Clicked: ${clickCount}`"
        variant="outlined"
        @click="incrementClick"
      ></tvs-custom-button>
    </section>

    <!-- Event Handling -->
    <section>
      <h2>Events</h2>
      <tvs-custom-button
        label="Trigger Event"
        on-save-complete="saveCompleted"
        @saveCompleted="handleCustomEvent"
      ></tvs-custom-button>
      <p v-if="lastEvent">Last event: {{ lastEvent }}</p>
    </section>

    <!-- Input Component Example -->
    <section>
      <h2>Input Component</h2>
      <tvs-input
        placeholder="Type something..."
        @input="handleInput"
      ></tvs-input>
      <p v-if="inputValue">You typed: {{ inputValue }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { registerAllWebComponents } from '@shared/components';

const clickCount = ref(0);
const lastEvent = ref('');
const inputValue = ref('');

// Register Web Components once when component mounts
onMounted(() => {
  registerAllWebComponents({ prefix: 'tvs' });
});

const incrementClick = () => {
  clickCount.value++;
};

const handleSave = () => {
  console.log('Save triggered from web component');
};

const handleCustomEvent = (event: any) => {
  lastEvent.value = JSON.stringify(event.detail);
};

const handleInput = (event: any) => {
  inputValue.value = event.target.value;
};
</script>

<style scoped>
.web-components-demo {
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

section {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
}

tvs-custom-button {
  margin: 10px 0;
}
</style>

<!-- Global Registration -->
<!-- app.vue or main.ts -->
<script setup>
import { registerAllWebComponents } from '@shared/components';

// Register all components globally in your Vue app
if (typeof window !== 'undefined') {
  registerAllWebComponents({ prefix: 'tvs' });
}
</script>
