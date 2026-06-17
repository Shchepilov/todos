# ACT — Achieve, Complete, Thrive
https://todo-453ae.web.app/

A productivity application built with React 19 featuring three main modules: **Todos**, **Notes**, and **Boards** (Kanban). Authentication and real-time data synchronization are powered by Firebase, with Zustand for state management.

## Features

- **Todos** — task lists grouped by day
- **Notes** — notes organized into folders
- **Boards** — Kanban boards with columns, tasks, retrospectives, and time tracking (business day = 8 hours, format `2d 4h 30m`)
- Real-time sync and optimistic updates via Firebase Firestore
- Dark/light themes (via the `data-theme` attribute)
- Internationalization (English / Українська) powered by React Intl
- PWA support

## Tech Stack

- **React 19** + **Vite** (rolldown-vite)
- **Zustand** — state management with localStorage persistence
- **Firebase** — Auth + Firestore
- **Radix UI** + CSS Modules (SCSS) — UI and styling
- **React Hook Form** — forms and validation
- **React Router** — navigation
- **React Intl** — internationalization

## Installation

```bash
npm install
```

Create a `.env` file with your Firebase configuration:

```
VITE_API_KEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_project.appspot.com
VITE_MESSAGING_SENDER_ID=your_sender_id
VITE_APP_ID=your_app_id
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server (with network access) |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint code analysis |
| `npm run create:component ComponentName` | Generate a new component from a template |

## Project Structure

```
src/
├── components/     # Reusable UI components
├── features/       # Modules: todos, notes, boards
│   └── {feature}/
│       ├── components/   # Module components
│       ├── hooks/        # Business logic
│       ├── services/     # Firebase queries
│       ├── store/        # Module state
│       ├── utils/        # Constants and helpers
│       └── locales/      # Module translations
├── store/          # Global Zustand store
├── styles/         # Global styles and variables
└── layout/         # Application layout
```

### Path Aliases (Vite)

`@components`, `@features`, `@store`, `@styles`, `@assets`, `@layout`, `@baseUrl`
