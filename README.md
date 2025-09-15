 
# Shared Components Boilerplate

This repository is now a lightweight monorepo focused on reusable shared React components.

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