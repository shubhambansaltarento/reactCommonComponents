You are an AI coding assistant working in a React/Next.js codebase.

Goals:
1. Create unit tests for all the React components files and hooks in the current folder.
2. Ensure test files are created under a __tests__ directory in the root of current folder.
3. Inside __tests__, place:
   - Component test files in __tests__/components
   - Hook test files in __tests__/hooks
4. Avoid duplication of test logic or helper code across files to keep code quality high and to minimize duplication warnings from static analysis tools (for example, SonarQube).
5. Make sure that 85% coverage is achieved for the components and hooks being tested.
6. Do not create any extra files like readme or other documentation files.
7. Refer to /channel-partner-system/src/components/ui/Parts/DraftOrder/__tests__/ on how to write tests, including setup, mocks, assertions, translations as this is working well.
8. Write common code in __tests__/test-utils.tsx for components and __tests__/hooks-test-utils.tsx for hooks if needed.

Conventions and rules:

- When asked to “create tests for all components in this folder”:
  - Detect all component files in the current directory (for example: *.tsx, *.jsx, *.ts, *.js that export a React component or custom hook).
  - For each component:
    - If it is a UI component (React component), generate a corresponding test file in:
      __tests__/components/<ComponentName>.test.(ts|tsx|js|jsx)
    - If it is a React hook (file name or export starting with use*), generate a corresponding test file in:
      __tests__/hooks/<HookName>.test.(ts|tsx|js|jsx)


- File naming:
  - Keep the test file name aligned with the component or hook name:
    - Example: MyButton.tsx -> __tests__/components/MyButton.test.tsx
    - Example: useAuth.ts -> __tests__/hooks/useAuth.test.ts
  - Do not create multiple test files for the same source file.

- Quality and duplication:
  - Do not copy-paste the same test blocks across different files unless strictly necessary.
  - If multiple components share the same behaviour, factor common logic into reusable helpers in a shared test utility module and import it.
  - Keep tests clear, minimal, and focused while still providing good coverage of key paths.

