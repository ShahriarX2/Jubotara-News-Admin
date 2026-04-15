# Development Guidelines - Jubotara News Admin

This document provides essential information for developers working on the Jubotara News Admin project.

## 1. Build & Configuration Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env.local` file in the root directory if specific backend URLs or API keys are required.
- Current API Endpoint: `https://jubotara-news-api.onrender.com/api/v1/` (See `services/authService.ts`)

### Running the Project
- **Development Mode**: `npm run dev`
- **Build**: `npm run build`
- **Start Production**: `npm run start`

## 2. Testing Information

### Configuration
The project uses **Vitest** for unit and component testing.
- **Framework**: Vitest
- **Environment**: jsdom (for React component testing)
- **Setup File**: `vitest.setup.ts` (includes `@testing-library/jest-dom`)

### Running Tests
- **Run all tests**: `npx vitest run`
- **Watch mode**: `npx vitest`

### Adding New Tests
1. Create a file with `.test.tsx` or `.test.ts` extension (e.g., `components/MyComponent.test.tsx`).
2. Use `@testing-library/react` for component rendering and interactions.
3. Example of a simple component test:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

const SimpleComponent = () => <div>Hello, World!</div>;

describe('Simple Test', () => {
  it('renders correctly', () => {
    render(<SimpleComponent />);
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
  });
});
```

## 3. Additional Development Information

### Next.js Version Note
This project uses **Next.js 16.2.2** (canary/experimental features might be present). Refer to `node_modules/next/dist/docs/` for specific API changes if standard documentation differs.

### Code Style & Conventions
- **React**: Functional components with hooks.
- **Styling**: Tailwind CSS 4.
- **Authentication**: JWT-based, tokens stored in `localStorage` and Cookies (see `services/authService.ts` and `proxy.ts`).
- **Icons**: `lucide-react`.
- **Screenshot/Export**: `modern-screenshot` is used for creating photocards.

### API Recommendations for Dynamic Metrics
The dashboard currently estimates some metrics (like recent post count) from the first page of results. For truly dynamic and accurate metrics, the following API endpoints are recommended:
1. `GET /api/v1/news/stats`: Should return `totalPosts`, `publishedPosts`, `featuredPosts`, `recentPostsCount` (last 7 days), and `postsByCategory` distribution.
2. `GET /api/v1/news?category={name}`: Ensure filtering by category name (as currently implemented) is officially supported and optimized.
3. `GET /api/v1/news`: Ensure the response always includes a `totalDocs` or `totalCount` field for accurate pagination and stats.

### Authentication Proxy
A custom proxy is implemented in `proxy.ts` to handle dashboard redirects based on the presence of an authentication token.
