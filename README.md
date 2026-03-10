<div align="center">

# convex-unread-tracking

[![Convex Component](https://www.convex.dev/components/badge/convex-unread-tracking)](https://www.convex.dev/components/convex-unread-tracking)
![License](https://img.shields.io/badge/license-MIT-blue)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)

<strong>Unread message tracking for Convex</strong>

Per-user tracking • Real-time counters • Batch operations • Efficient indexing

[View Demo](#-live-demo) • [Documentation](#-setup) • [API Reference](#-api-reference)

</div>

---

A Convex component for tracking unread messages with real-time updates, per-user isolation, and efficient batch operations.

## Features

- **Per-user unread tracking** — isolated unread states for each user
- **Real-time counters** — reactive queries for live unread badges
- **Batch operations** — efficiently mark multiple messages as read
- **Automatic cleanup** — TTL-based pruning of old records
- **Efficient indexing** — optimized queries for performance

## Installation

```bash
npm install convex-unread-tracking
```

## Setup

In your `convex/convex.config.ts`:

```typescript
import { defineApp } from "convex/server";
import unreadTracking from "convex-unread-tracking/convex.config";

const app = defineApp();
app.use(unreadTracking);
export default app;
```

## Usage

```typescript
import { UnreadTracker } from "convex-unread-tracking";
import { components } from "./_generated/api";

const unread = new UnreadTracker(components.unreadTracking);

// Mark message as unread
export const markAsUnread = mutation({
  args: { userId: v.string(), messageId: v.string() },
  handler: async (ctx, args) => {
    return await unread.markAsUnread(ctx, args);
  },
});

// Get unread count
export const getUnreadCount = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await unread.getUnreadCount(ctx, args);
  },
});

// Mark as read
export const markAsRead = mutation({
  args: { userId: v.string(), messageId: v.string() },
  handler: async (ctx, args) => {
    return await unread.markAsRead(ctx, args);
  },
});
```

## 🚀 Live Demo

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit-blue?style=for-the-badge)](https://unread-tracking-demo.vercel.app)

[See the demo in action →](https://unread-tracking-demo.vercel.app)

## License

MIT

---

<div align="center">
Built with ❤️ for Convex | <a href="https://www.convex.dev/">Convex</a> • <a href="https://docs.convex.dev/components">Components</a> • <a href="https://github.com/get-convex">GitHub</a>
</div>

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
