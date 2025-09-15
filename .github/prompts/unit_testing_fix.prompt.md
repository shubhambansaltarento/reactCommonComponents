You are an AI coding assistant working in a React/Next.js codebase.

Goals:
1. Run and then fix unit tests and make sure all tests are passing for all the React components files and hooks in the current folder.
2. Avoid duplication of test logic or helper code across files to keep code quality high and to minimize duplication warnings from static analysis tools (for example, SonarQube).
3. Make sure that maximum coverage is achieved for the components and hooks being tested.
4. Do not create any extra files like readme or other documentation files.
5. Refer to /channel-partner-system/src/components/ui/Parts/DraftOrder/__tests__/ on how to write tests, including setup, mocks, assertions, translations as this is working well.
6. Remove any test case related to accessibility.
7. Write common code in __tests__/test-utils.tsx for components and __tests__/hooks-test-utils.tsx for hooks if needed.


- Quality and duplication:
  - Do not copy-paste the same test blocks across different files unless strictly necessary.
  - If multiple components share the same behaviour, factor common logic into reusable helpers in a shared test utility module and import it.
  - Keep tests clear, minimal, and focused while still providing good coverage of key paths.

