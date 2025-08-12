# 🚀 Council of Sages Frontend - Beginner's Guide

## 📖 Understanding the Project Flow

Welcome! This guide will walk you through how this React application works, starting from the very beginning and showing you how each file connects to create the complete application.

---

## 🏗️ Project Overview

This is a **React application** written in **TypeScript** that creates a modern web interface. Think of it like building blocks:

- **React** = Library for creating user interfaces (the visual parts users see)
- **TypeScript** = JavaScript with extra type safety (helps catch errors)
- **Vite** = Tool that runs and builds the application

---

## 🎯 Entry Point: How the App Starts

### 1. `index.html` - The Foundation

```html
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

**What happens here:**

- This is the basic HTML page that loads in your browser
- It has a empty `<div>` with `id="root"` - this is where React will insert all the content
- It loads the JavaScript file `main.tsx` which starts the React application

### 2. `src/main.tsx` - The React Starter

```tsx
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
```

**What happens here:**

- **Finds the "root" div** from the HTML and connects React to it
- **Wraps the app** in several "providers" (think of them as special containers):
  - `React.StrictMode` = Helps catch bugs during development
  - `QueryClientProvider` = Manages data fetching from APIs
  - `BrowserRouter` = Enables navigation between different pages
  - `Toaster` = Shows popup notifications
- **Loads the main `<App />` component**

### 3. `src/App.tsx` - The Main Application

```tsx
function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  )
}
```

**What happens here:**

- **ErrorBoundary** = Catches any errors and shows a nice error page instead of crashing
- **Layout** = The common parts of every page (navigation bar, footer)
- **Routes** = Defines what page to show based on the URL:
  - `/` (home page) → Shows `HomePage` component
  - `/about` → Shows `AboutPage` component
  - Anything else → Shows `NotFoundPage` component

---

## 🏗️ Project Structure Explained

```
src/
├── main.tsx              # 🚀 Application entry point
├── App.tsx               # 🏠 Main app with routing
├── index.css             # 🎨 Global styles
├── screens/              # 📱 Different pages of the app
│   ├── HomePage.tsx      # Home page content
│   ├── AboutPage.tsx     # About page content
│   └── NotFoundPage.tsx  # 404 error page
├── components/           # 🧩 Reusable UI pieces
│   ├── common/           # Common components used everywhere
│   │   ├── Layout.tsx    # Navigation + footer wrapper
│   │   └── ErrorFallback.tsx # Error display component
│   └── ui/               # Basic UI elements (buttons, inputs, etc.)
├── services/             # 🌐 API calls and external data
│   └── api.ts            # HTTP requests to backend servers
├── hooks/                # 🎣 Custom React hooks (reusable logic)
├── store/                # 🗄️ Global state management (data shared across app)
├── types/                # 📝 TypeScript type definitions
└── utils/                # 🔧 Helper functions
```

---

## 🔄 How Data Flows Through the Application

### 1. User Interaction Flow

```
User clicks button → Component calls function →
Function might call API → Data comes back →
Component updates → User sees new content
```

### 2. Component Hierarchy (Top to Bottom)

```
App
└── ErrorBoundary
    └── Layout (navigation + footer)
        └── Routes
            └── Individual Pages (HomePage, AboutPage, etc.)
                └── UI Components (buttons, cards, etc.)
```

### 3. Data Sources

- **Props** = Data passed from parent component to child component
- **State** = Data that belongs to a specific component
- **Global Store** = Data shared across the entire app (in `store/`)
- **API Data** = Data fetched from external servers (via `services/`)

---

## 🧩 Key Components Breakdown

### Layout Component (`src/components/common/Layout.tsx`)

**Purpose:** Provides the common structure for every page

**What it contains:**

- **Navigation bar** with app logo and menu links
- **Mobile hamburger menu** (for phones/tablets)
- **Main content area** where individual pages are displayed
- **Footer** with copyright information

**Variables it receives:**

- `children` = The content of the current page (HomePage, AboutPage, etc.)

**Variables it creates:**

- `isMenuOpen` = Boolean (true/false) tracking if mobile menu is open
- `location` = Current URL path to highlight active navigation link
- `navigation` = Array of menu items with their paths and names

### HomePage Component (`src/screens/HomePage.tsx`)

**Purpose:** Shows the main landing page content

**What it contains:**

- Welcome message and description
- Feature cards showing app capabilities
- Responsive design that adapts to different screen sizes

**Variables it receives:**

- None (it's a simple display component)

---

## 📦 Key Dependencies Explained

### Core Libraries (in `package.json`)

- **`react`** = The main React library for building user interfaces
- **`react-dom`** = Connects React to the browser's DOM
- **`react-router-dom`** = Enables navigation between different pages
- **`typescript`** = Adds type safety to JavaScript

### Utility Libraries

- **`axios`** = Makes HTTP requests to APIs (fetching data from servers)
- **`@tanstack/react-query`** = Manages server data (caching, loading states)
- **`zustand`** = Simple state management (sharing data between components)
- **`tailwindcss`** = CSS framework for styling (makes things look good)
- **`sonner`** = Shows toast notifications (popup messages)

### Development Tools

- **`vite`** = Fast development server and build tool
- **`eslint`** = Finds and fixes code problems
- **`prettier`** = Automatically formats code to look consistent

---

## 🚀 How to Follow the Code

### Starting Point: When You Visit the Website

1. **Browser loads** `index.html`
2. **Browser runs** `src/main.tsx`
3. **React creates** the App component from `src/App.tsx`
4. **App component** wraps everything in Layout
5. **React Router** looks at the URL and decides which page to show
6. **Layout component** renders the navigation and footer
7. **Selected page** (like HomePage) renders in the middle
8. **User sees** the complete webpage

### When User Clicks a Link

1. **User clicks** a navigation link (like "About")
2. **React Router** changes the URL to `/about`
3. **Routes** sees the new URL and loads `AboutPage` component
4. **Layout stays the same** (navigation and footer don't reload)
5. **Only the main content** changes to show the About page
6. **Page transition** is instant (no page reload)

### When Data is Needed

1. **Component** calls a function from `src/services/api.ts`
2. **API service** makes HTTP request to external server
3. **Server responds** with data (or error)
4. **Component receives** the data and updates what user sees
5. **Loading states** and errors are handled automatically

---

## 🎯 Next Steps for Learning

### To Understand Better:

1. **Open `src/App.tsx`** and follow the component imports
2. **Look at `src/screens/HomePage.tsx`** to see a simple component
3. **Check `src/components/common/Layout.tsx`** to see state management
4. **Explore `src/services/api.ts`** to understand data fetching

### To Make Changes:

1. **Edit content** in screen files (`src/screens/`)
2. **Add new pages** by creating new components and adding routes
3. **Modify styles** using Tailwind CSS classes
4. **Add new features** by creating components in `src/components/`

### Common Patterns You'll See:

- **`import`** statements at the top bring in code from other files
- **`export`** statements at the bottom make code available to other files
- **`function ComponentName()`** defines a React component
- **`return ()`** contains the HTML-like code (JSX) that creates the UI
- **`{variable}`** inside JSX shows JavaScript values in the HTML

---

**Remember:** Every React app follows this same basic pattern - start simple, understand the flow, then gradually explore more complex features! 🚀
