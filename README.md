# ACT - Achieve, complete, thrive
https://todo-453ae.web.app/

## Overview
ACT is a comprehensive task and collaboration management application built with React 19, featuring a modern architecture with Zustand for state management and Firebase for authentication and real-time database synchronization. The application provides three main modules: **Todos**, **Notes**, and **Boards** (Kanban-style project management), making it a versatile solution for personal productivity and team collaboration.

## 🚀 Features

### Core Features
- **Multi-Provider Authentication** (Google & GitHub OAuth)
- **Real-time Data Synchronization** with Firebase Firestore
- **Responsive Design** with dark/light theme support
- **Progressive Web App (PWA)** capabilities
- **Drag & Drop** functionality for enhanced UX
- **Persistent State Management** with Zustand

### 📝 Todos Module
- **Daily Task Management** with calendar navigation
- **Priority System** (Low, Medium, High)
- **Due Date Tracking** with overdue notifications
- **Auto-move** functionality for recurring tasks
- **Calendar View** with visual indicators for task completion
- **Day Navigation** with smooth transitions

### 📓 Notes Module
- **Rich Note Taking** with color coding
- **Masonry Layout** for optimal space utilization
- **Character Limit** (400 characters) with real-time counter
- **Inline Editing** with click-outside-to-save
- **Color Customization** (7 predefined colors)
- **Auto-sizing** text areas

### 📋 Boards Module (Kanban)
- **Multi-board Management** with navigation tabs
- **Column-based Organization** (customizable columns)
- **Task Priority System** (6 levels: Backlog to Blocker)
- **Drag & Drop** task movement between columns
- **Board Sharing** with email-based watchers
- **Real-time Collaboration** for shared boards
- **Task Details Modal** with full CRUD operations
- **Board Settings** with watcher management
- **Time Tracking System** with estimation and logged time
- **Progress Visualization** with progress bars and remaining time
- **8-Hour Workday System** (1 day = 8 hours for business calculations)
- **Time Format Support** (days, hours, minutes - e.g., "2d 4h 30m")
- **Over-estimation Tracking** with clear visual indicators

## 🛠️ Technology Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **Zustand 5.0** - Lightweight state management
- **React Router DOM 7.1** - Client-side routing
- **Framer Motion 12.4** - Animation library
- **Day.js 1.11** - Date manipulation
- **React Calendar 5.1** - Calendar component
- **Radix UI Icons** - Icon system

### Backend & Database
- **Firebase 11.1** - Authentication and Firestore database
- **React Firebase Hooks 5.1** - Firebase React integration

### Build Tools & Development
- **Vite 6.0** - Next-generation build tool
- **Sass 1.83** - CSS preprocessor
- **ESLint 9.17** - Code linting
- **Vite PWA Plugin** - Progressive Web App features

### UI/UX Libraries
- **Radix UI** - Headless UI components

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button/
│   ├── Checkbox/
│   ├── Modal/
│   └── ...
├── features/            # Feature-based modules
│   ├── todos/           # Todo management
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   └── utils/
│   ├── notes/           # Note taking
│   │   └── [same structure]
│   └── boards/          # Kanban boards
│       └── [same structure]
├── layout/              # Layout components
├── pages/               # Page-level components
├── store/               # Global state management
└── styles/              # Global styles and variables
```

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn
- Firebase project with Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd todo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_KEY=your_firebase_api_key
   VITE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_PROJECT_ID=your_project_id
   VITE_STORAGE_BUCKET=your_project.appspot.com
   VITE_MESSAGING_SENDER_ID=your_sender_id
   VITE_APP_ID=your_app_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run dev` - Start development server with host access
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run create:component` - Generate new component scaffold

## 🏗️ Architecture

### State Management
The application uses **Zustand** for state management with feature-specific stores:
- `storeAuth.jsx` - Authentication state
- `store.jsx` - Global application state
- Feature stores for todos, notes, and boards

### Firebase Integration
- **Authentication**: Google and GitHub OAuth providers
- **Firestore**: Real-time database with collections for todos, notes, boards, columns, and tasks
- **Security**: User-based data isolation with Firestore security rules

### Component Structure
- **Feature-based organization** with co-located components, hooks, and services
- **Reusable UI components** with consistent styling
- **Custom hooks** for data fetching and business logic
- **Service layer** for Firebase operations

## 🎨 Styling

- **CSS Modules** for component-scoped styling
- **Sass** for advanced CSS features
- **CSS Custom Properties** for theming
- **Responsive design** with mobile-first approach
- **Dark/Light theme** support

## 📱 PWA Features

- **Offline capability** (limited)
- **Install prompt** for native app-like experience
- **Responsive design** for all device sizes
- **Touch-friendly** drag and drop

## 🔒 Security

- **Firebase Authentication** with OAuth providers
- **User-based data isolation** in Firestore
- **Client-side route protection**
- **Input validation** and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

**Built with ❤️ using React 19, Zustand, and Firebase**
