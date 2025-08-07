# Council of Sages Frontend Project Memory

## Project Overview

- **React + TypeScript + Vite** application for AI-powered frontend
- **Cross-platform ready**: Web desktop/mobile responsive + React Native migration path
- **Node.js** with modern tooling (Vite, ESLint, Prettier, Husky)
- **Tailwind CSS** for styling, **React Query** for data fetching, **Zustand** for state management
- **Render** deployment ready with optimized build configuration

## Multi-Platform Strategy

- **Primary**: Responsive web application (desktop + mobile web)
- **Secondary**: Easy migration path to React Native for native mobile apps
- **Design System**: Mobile-first responsive design with touch-friendly interactions
- **Shared Logic**: Business logic, hooks, services, and state management designed for reusability

## Development Commands

- `npm run dev` - Start development server with HMR (port 3000)
- `npm run build` - Build for production (TypeScript check + Vite build)
- `npm run test` - Run tests with Vitest
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint checks (max 0 warnings)
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript compiler checks

## Code Structure & Conventions (React Native Migration Ready)

### Current Web Structure (Migration-Friendly)

- **`src/components/ui/`** - Web-specific UI components (buttons, inputs, modals)
- **`src/components/common/`** - Web-specific layout components (navigation, layout)
- **`src/screens/`** - Screen-level components (like pages but mobile-friendly naming)
- **`src/hooks/`** - **SHARED**: Custom React hooks (platform-agnostic)
- **`src/services/`** - **SHARED**: API services and external integrations
- **`src/store/`** - **SHARED**: Zustand state management
- **`src/utils/`** - **SHARED**: Pure utility functions
- **`src/types/`** - **SHARED**: TypeScript type definitions
- **`src/assets/`** - Static assets (images, icons, fonts)

### Future React Native Migration Path

```
src/
├── components/           # Current web components
├── native-components/    # Future: React Native components
├── screens/             # Shared screen logic (current web pages)
├── hooks/               # ✅ SHARED: Custom hooks
├── services/            # ✅ SHARED: API calls, business logic
├── store/               # ✅ SHARED: State management
├── utils/               # ✅ SHARED: Helper functions
├── types/               # ✅ SHARED: TypeScript definitions
└── assets/              # ✅ SHARED: Images, fonts (platform-specific formats)
```

### Migration Strategy Notes

- **Step 1**: Current responsive web app with mobile-friendly design
- **Step 2**: Refactor `src/pages/` → `src/screens/` for consistency
- **Step 3**: When migrating to RN, create `src/native-components/`
- **Step 4**: Swap `components/` imports for `native-components/` equivalents
- **Step 5**: All business logic in `hooks/`, `services/`, `store/`, `utils/` remains unchanged

## Development Principles

- **Mobile-first responsive design** with touch-friendly interfaces
- **Platform-agnostic business logic** - keep hooks, services, store logic separate from UI
- Use functional components with hooks (React Native compatible)
- Apply single responsibility principle for components
- Prefer composition over inheritance
- Use absolute imports with `@/` alias
- Follow TypeScript strict mode requirements
- Implement proper error boundaries (ErrorBoundary pattern works in both web and RN)
- Use React Query for server state management (works in both platforms)
- **Separate UI from logic** - components handle presentation, hooks handle business logic

## Quality Checks & Code Standards

**CRITICAL: Follow ESLint configuration strictly**

### Code Style & Formatting

- **TypeScript strict mode** with proper type annotations
- **Prettier** formatting with Tailwind CSS plugin
- **ESLint** with React hooks and TypeScript rules
- **2 spaces** for indentation, **single quotes** for strings
- **PascalCase** for components, **camelCase** for functions/variables
- **Absolute imports** using `@/` paths (`from '@/components/ui/Button'`)
- Run `npm run format` before committing

### React & TypeScript Requirements

- Use **functional components** with TypeScript
- **Props interfaces** for all component props
- **React.FC** type for functional components (optional but consistent)
- **Custom hooks** for reusable logic
- **Error boundaries** for production reliability
- **React Query** for all API calls and server state
- **Zustand** for client-side state management

### Component Conventions (Cross-Platform Ready)

- **Single file per component** in appropriate directory
- **Named exports** for components, **default export** for main component
- **Props interface** defined above component (compatible with RN)
- **JSX** with proper TypeScript integration
- **Responsive design patterns**:
  - Mobile-first breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
  - Touch-friendly button sizes (min 44px touch targets)
  - Accessible color contrast and typography
- **Tailwind classes** with `clsx` and `tailwind-merge` for conditional styling
- **Separation of concerns**: UI components don't contain business logic
- **Platform-specific styling**: Use CSS-in-JS patterns that translate well to StyleSheet in RN

### API Integration Standards

- **Axios** with interceptors for API calls
- **Environment variables** prefixed with `VITE_`
- **Type-safe API responses** with proper interfaces
- **Error handling** with proper user feedback
- **React Query** for caching and background updates

### Testing Standards

- **Vitest** for unit and integration tests
- **React Testing Library** for component testing
- **User Event** for interaction testing
- **Coverage reports** for critical business logic
- Test files co-located with components or in `tests/` directory

### Build & Deployment

- **Vite** for fast development and optimized builds
- **TypeScript compilation** before build
- **Source maps** enabled for debugging
- **Environment-specific** configuration
- **Render.com** deployment with proper routing setup

### Commands (run these before commits)

- `npm run type-check` - TypeScript compilation check
- `npm run lint` - ESLint validation (0 warnings policy)
- `npm run format` - Prettier code formatting
- `npm run test` - Run test suite
- `npm run build` - Verify production build works

## Tech Stack

### Core Dependencies

- **React 18.3+** with modern hooks and concurrent features
- **TypeScript 5.5+** for type safety
- **Vite 5.4+** for fast development and builds
- **React Router 6.26+** for client-side routing

### UI & Styling

- **Tailwind CSS 3.4+** for utility-first styling
- **Lucide React** for consistent iconography
- **clsx + tailwind-merge** for conditional styling
- **Sonner** for toast notifications

### State Management & Data Fetching

- **React Query 5.51+** for server state management
- **Zustand 4.5+** for client state management
- **Axios 1.7+** for HTTP client with interceptors

### Forms & Validation

- **React Hook Form 7.53+** for form handling
- **Zod 3.23+** for schema validation
- **@hookform/resolvers** for validation integration

### Development Tools

- **ESLint 9.9+** with TypeScript and React plugins
- **Prettier 3.3+** with Tailwind plugin
- **Husky + lint-staged** for pre-commit hooks
- **Vitest 2.0+** with React Testing Library

## Mobile & Cross-Platform Considerations

### Responsive Design Requirements

- **Mobile-first approach**: Design for mobile screens first, then desktop
- **Touch interactions**: All interactive elements ≥ 44px touch targets
- **Performance**: Optimize for slower mobile connections and devices
- **Accessibility**: WCAG 2.1 AA compliance for screen readers and assistive technologies

### Cross-Platform Compatible Patterns

- **Custom hooks**: Keep all business logic in platform-agnostic hooks
- **State management**: Zustand works identically in web and React Native
- **API services**: Axios-based services are easily replaceable with fetch or RN networking
- **Type definitions**: TypeScript interfaces work across platforms
- **Error handling**: ErrorBoundary pattern exists in both React and React Native

### Future React Native Migration Checklist

- ✅ **Business logic separated** from UI components
- ✅ **Custom hooks** for reusable logic
- ✅ **Centralized state management** with Zustand
- ✅ **API service layer** abstracted from components
- ✅ **TypeScript interfaces** for all data structures
- 🔄 **Screen-based architecture** (rename pages → screens when ready)
- 🔄 **Platform-agnostic styling** patterns
- 🚀 **Ready for RN**: Only UI components need replacement

### Mobile Web Optimizations

- **Responsive breakpoints**: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- **Touch gestures**: Support swipe, tap, long-press interactions
- **Viewport meta tag**: Properly configured for mobile browsers
- **PWA ready**: Service worker support for offline functionality (future enhancement)
- **Performance**: Code splitting, lazy loading, optimized images
