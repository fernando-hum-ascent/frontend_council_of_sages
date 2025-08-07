# Council of Sages Frontend

A modern React TypeScript application built with Vite, featuring AI-powered workflows and intelligent decision-making capabilities. **Mobile-first responsive design** with **React Native migration path** for cross-platform development.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (recommended: use the latest LTS version)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd council-of-sages-frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration values.

4. **Start development server**:

   ```bash
   npm run dev
   ```

5. **Open your browser** to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
frontend-project/
├── package.json              # Project dependencies and scripts
├── package-lock.json         # Lock file for dependencies
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
├── tsconfig.app.json         # App-specific TypeScript config
├── tsconfig.node.json        # Node-specific TypeScript config
├── eslint.config.js          # ESLint configuration
├── prettier.config.js        # Prettier configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── .gitignore                # Git ignore patterns
├── .env.example              # Environment variables template
├── render.yaml               # Render deployment configuration
├── README.md                 # Project documentation
├── index.html                # Main HTML template
├── .husky/                   # Git hooks
│   └── pre-commit            # Pre-commit hook for linting
├── public/                   # Static assets
├── src/                      # Source code (React Native migration ready)
│   ├── main.tsx              # Application entry point
│   ├── App.tsx               # Root component
│   ├── index.css             # Global styles
│   ├── vite-env.d.ts         # Vite environment types
│   ├── components/           # 📱 Web-specific UI components
│   │   ├── ui/               # Base UI components (buttons, inputs)
│   │   └── common/           # Layout components (navigation, layout)
│   │       ├── Layout.tsx    # Responsive navigation layout
│   │       └── ErrorFallback.tsx # Error boundary fallback
│   ├── screens/              # 📱 Screen components (mobile-friendly naming)
│   │   ├── HomePage.tsx      # Home screen (responsive)
│   │   ├── AboutPage.tsx     # About screen
│   │   └── NotFoundPage.tsx  # 404 screen
│   ├── hooks/                # ✅ SHARED: Custom React hooks (platform-agnostic)
│   ├── services/             # ✅ SHARED: API services and utilities
│   │   └── api.ts            # Axios API service
│   ├── store/                # ✅ SHARED: State management (Zustand)
│   ├── utils/                # ✅ SHARED: Utility functions
│   ├── types/                # ✅ SHARED: TypeScript type definitions
│   └── assets/               # ✅ SHARED: Images, icons, etc.
├── tests/                    # Test files
└── dist/                     # Production build output (generated)
```

## 🛠️ Development Commands

### Primary Commands

```bash
# Development
npm run dev              # Start development server (localhost:3000)
npm run build            # Build for production
npm run preview          # Preview production build locally

# Code Quality
npm run lint             # Run ESLint checks
npm run lint:fix         # Fix ESLint issues automatically
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run type-check       # Run TypeScript compiler checks

# Testing
npm run test             # Run tests with Vitest
npm run test:ui          # Run tests with interactive UI
npm run test:coverage    # Run tests with coverage report
```

### Development Workflow

1. **Start development**: `npm run dev`
2. **Check code quality**: `npm run lint`
3. **Format code**: `npm run format`
4. **Type checking**: `npm run type-check`
5. **Run tests**: `npm run test`
6. **Build for production**: `npm run build`

## 🏗️ Tech Stack

### Core Technologies

- **React 18** - Modern React with concurrent features
- **TypeScript 5.5+** - Type safety and enhanced developer experience
- **Vite 5.4+** - Fast development server and build tool
- **React Router 6** - Client-side routing

### UI & Styling

- **Tailwind CSS 3.4+** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **clsx + tailwind-merge** - Conditional CSS class handling
- **Sonner** - Toast notifications

### State Management & Data Fetching

- **React Query 5** - Server state management and caching
- **Zustand 4** - Lightweight client state management
- **Axios 1.7+** - HTTP client with interceptors

### Forms & Validation

- **React Hook Form 7** - Performant forms with easy validation
- **Zod 3** - TypeScript-first schema validation
- **@hookform/resolvers** - Validation library integration

### Development Tools

- **ESLint 9** - Code linting with TypeScript support
- **Prettier 3** - Code formatting with Tailwind plugin
- **Husky + lint-staged** - Git hooks for code quality
- **Vitest 2** - Fast unit testing framework

## 🌐 Environment Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:5073
VITE_API_TIMEOUT=10000

# Application Settings
VITE_APP_NAME=Council of Sages
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=AI-powered application frontend

# Environment
VITE_NODE_ENV=development
VITE_DEBUG=true

# External Services (optional)
VITE_SENTRY_DSN=
VITE_ANALYTICS_ID=
```

### Configuration Files

- **TypeScript**: Strict mode enabled with path mapping (`@/` alias)
- **ESLint**: React, TypeScript, and accessibility rules
- **Prettier**: Tailwind CSS class sorting and consistent formatting
- **Vite**: Hot Module Replacement, path aliases, and build optimization

## 🚀 Deployment

### Render.com (Recommended)

The project includes a `render.yaml` configuration for easy deployment:

1. **Connect Repository**:
   - Sign up at [render.com](https://render.com)
   - Connect your GitHub repository
   - Choose "Static Site" service

2. **Build Settings** (configured in `render.yaml`):
   - Build Command: `npm ci && npm run build`
   - Publish Directory: `dist`

3. **Environment Variables**:

   ```
   VITE_API_BASE_URL=https://your-api-domain.onrender.com
   VITE_APP_NAME=Council of Sages
   VITE_NODE_ENV=production
   VITE_DEBUG=false
   ```

4. **Deploy**: Automatic deployment on push to main branch

### Other Platforms

The built application in `dist/` folder can be deployed to:

- **Netlify**: Drag & drop deployment
- **Vercel**: Git-based deployment
- **AWS S3 + CloudFront**: Static hosting
- **Any static hosting service**

## 🧪 Testing

### Test Setup

- **Vitest** for unit and integration testing
- **React Testing Library** for component testing
- **@testing-library/user-event** for user interaction testing
- **jsdom** for DOM simulation

### Running Tests

```bash
npm run test              # Run all tests
npm run test:ui           # Interactive test UI
npm run test:coverage     # Coverage report
```

## 🔧 Code Quality & Standards

### Pre-commit Hooks

Husky runs the following checks before each commit:

- **ESLint**: Code linting and error checking
- **Prettier**: Code formatting
- **TypeScript**: Type checking

### Coding Standards

- **TypeScript strict mode** with proper type annotations
- **Functional components** with React hooks
- **Absolute imports** using `@/` path aliases
- **Component composition** over inheritance
- **Responsive design** with Tailwind CSS utilities

### Error Handling

- **Error boundaries** for graceful error handling
- **Axios interceptors** for API error handling
- **Form validation** with Zod schemas
- **Type-safe** environment variables

## 🏛️ Architecture & Patterns

### Component Organization

- **`src/components/ui/`** - Reusable UI primitives (buttons, inputs, etc.)
- **`src/components/common/`** - App-specific shared components (layout, navigation)
- **`src/pages/`** - Route-level page components

### State Management

- **Server state**: React Query for API data, caching, and synchronization
- **Client state**: Zustand for global application state
- **Local state**: React useState/useReducer for component-specific state

### API Integration

- **Type-safe API calls** with TypeScript interfaces
- **Request/response interceptors** for authentication and error handling
- **Environment-based** configuration for different deployment stages

### Performance Optimizations

- **Code splitting** with dynamic imports
- **Tree shaking** and bundle optimization with Vite
- **Image optimization** and lazy loading
- **React Query caching** for efficient data fetching

## 📚 Key Features

### ✅ Implemented (Mobile-First & Cross-Platform Ready)

- **Modern React 18** with TypeScript strict mode
- **Mobile-first responsive design** with Tailwind CSS breakpoints
- **Touch-friendly interactions** (44px+ touch targets, focus states)
- **Client-side routing** with React Router
- **API integration** with Axios (compatible with RN)
- **Toast notifications** with Sonner
- **Error boundaries** for graceful error handling
- **Code quality tools** (ESLint, Prettier, Husky)
- **Production-ready build** configuration
- **Deployment configuration** for Render

### 📱 Mobile & Cross-Platform Features

- **Responsive breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Mobile navigation** with hamburger menu
- **Platform-agnostic architecture** for easy React Native migration
- **WCAG 2.1 AA accessibility** compliance
- **Performance optimized** for mobile devices

### 🚀 React Native Migration Ready

- **✅ Business logic separated** from UI (hooks, services, store, utils)
- **✅ Screen-based architecture** (`src/screens/` instead of `src/pages/`)
- **✅ Cross-platform state management** (Zustand works in RN)
- **✅ Type-safe API layer** (easily replaceable for RN)
- **🔄 Ready for native components** (just swap `components/` for RN equivalents)

### 🔧 Ready for Extension

- Custom React hooks in `src/hooks/` (platform-agnostic)
- State management with Zustand in `src/store/` (RN compatible)
- Utility functions in `src/utils/` (shared across platforms)
- TypeScript types in `src/types/` (platform-independent)
- Test setup with Vitest and React Testing Library
- Form handling with React Hook Form + Zod

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** following the coding standards
4. **Run quality checks**: `npm run lint && npm run type-check && npm run test`
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🛟 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and request features via GitHub Issues
- **Development**: Use the development server with hot reload for the best experience

## 🔄 Future React Native Migration

This project is architected for easy migration to React Native:

### Current Structure (Web)

```
src/
├── components/           # Web-specific UI (HTML/CSS based)
├── screens/             # Business logic + web components
├── hooks/               # ✅ SHARED (platform-agnostic)
├── services/            # ✅ SHARED (API calls)
├── store/               # ✅ SHARED (Zustand state)
├── utils/               # ✅ SHARED (helper functions)
└── types/               # ✅ SHARED (TypeScript)
```

### Future React Native Structure

```
src/
├── components/           # Current web components (kept for reference)
├── native-components/    # NEW: React Native UI components
├── screens/             # Update: Use native-components instead of components
├── hooks/               # ✅ NO CHANGES (already platform-agnostic)
├── services/            # ✅ NO CHANGES (works with RN networking)
├── store/               # ✅ NO CHANGES (Zustand works in RN)
├── utils/               # ✅ NO CHANGES (pure JavaScript)
└── types/               # ✅ NO CHANGES (TypeScript interfaces)
```

### Migration Steps (When Ready)

1. **Create** `src/native-components/` directory
2. **Build** React Native equivalents of current components
3. **Update** screen imports: `@/components/` → `@/native-components/`
4. **Keep** all business logic unchanged (hooks, services, store, utils)
5. **Deploy** as React Native app

### Benefits of This Architecture

- **90% code reuse** between web and mobile
- **Shared business logic** and state management
- **Consistent API layer** and data flow
- **Type safety** across platforms
- **Easy maintenance** of both web and mobile versions

---

**Built with ❤️ using React, TypeScript, and modern web technologies**  
**🚀 Mobile-first • 📱 Cross-platform ready • ⚡ Performance optimized**
