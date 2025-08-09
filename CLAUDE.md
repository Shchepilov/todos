# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ACT (Achieve, Complete, Thrive) is a comprehensive productivity application built with React 19, featuring three main modules: Todos, Notes, and Boards (Kanban). The application uses Firebase for authentication and real-time data synchronization, with Zustand for state management.

## Essential Development Commands

### Core Commands
- `npm run dev` - Start development server with host access
- `npm run build` - Build for production
- `npm run lint` - Run ESLint code analysis
- `npm run preview` - Preview production build
- `npm run create:component` - Generate new component with boilerplate (usage: `npm run create:component ComponentName`)

### Firebase Configuration
Requires `.env` file with Firebase configuration:
```
VITE_API_KEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_project.appspot.com
VITE_MESSAGING_SENDER_ID=your_sender_id
VITE_APP_ID=your_app_id
```

## Architecture & Key Patterns

### State Management with Zustand
- **Global Store**: `src/store/store.jsx` - Combines all feature stores using Zustand with persistence
- **Feature-based Stores**: Each module (todos, notes, boards) has its own store slice
- **Authentication Store**: `src/store/storeAuth.jsx` - Handles user authentication state
- **Persistence**: All stores are persisted to localStorage automatically

### Feature-based Architecture
Each feature follows this consistent structure:
```
src/features/{feature}/
├── components/     # Feature-specific components
├── hooks/         # Custom hooks for business logic
├── services/      # Firebase query operations
├── store/         # Feature state management
├── utils/         # Constants and helper functions
└── locales/       # Feature-specific translations
```

### Component Patterns
- **CSS Modules**: All components use `.module.scss` files for scoped styling
- **Props Pattern**: Components accept `variation`, `size`, `className` props for flexibility
- **Reusable Components**: Located in `src/components/` with consistent API patterns

### Firebase Integration Patterns
- **Query Services**: Each feature has a `*Query.js` file with CRUD operations
- **Real-time Hooks**: Custom hooks use `react-firebase-hooks` for real-time data
- **User-based Data**: All Firestore queries filter by `userId` for data isolation
- **Optimistic Updates**: UI updates immediately, syncs with Firebase in background

### Internationalization
- **React Intl**: Used for all user-facing text
- **Locales**: English (`en`) and Ukrainian (`uk`) supported
- **Message Structure**: Feature-specific locales merged in `src/locale/messages.js`

### Path Aliases (Vite Configuration)
- `@components` → `src/components`
- `@features` → `src/features`  
- `@store` → `src/store`
- `@styles` → `src/styles`
- `@assets` → `src/assets`
- `@layout` → `src/layout`
- `@baseUrl` → `src/`

## Key Development Considerations

### Component Creation
Use the component generator: `npm run create:component ComponentName` which creates:
- Component file with proper imports
- CSS Module file
- Follows established naming conventions

### Firebase Security
- Never commit Firebase configuration to version control
- All Firestore operations include user-based filtering
- Authentication required for all data access

### Styling Conventions
- Use CSS custom properties for theming (`--color-primary`, etc.)
- Dark/light theme support via `data-theme` attribute
- Mobile-first responsive design
- Consistent spacing using CSS variables from `src/styles/_variables.scss`

### State Updates
- Use Zustand actions for all state modifications
- Feature stores are combined in the global store
- Persist important UI state (theme, locale, current day)

### Time Tracking System (Boards Module)
- Business day = 8 hours for estimation calculations
- Time format: "2d 4h 30m" (days, hours, minutes)
- Progress calculations include over-estimation tracking