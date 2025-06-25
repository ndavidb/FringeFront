# Fringe Festival Web Application

## Overview
This Next.js application serves as the official website proposal for the Fringe Festival. It uses React with TypeScript, Mantine UI components, and follows the App Router structure.

**Note:** Access to backend API is found at [Fringe Festival API](

### Overview Cloud Design
![Alt text](./fringe/public/images/demo/ArchitectureCloud.jpg)

### Overview Demo
#### Admin Panel
![Alt text](./fringe/public/images/demo/AdminPanel.png)

#### User/Customer Panel
![Alt text](./fringe/public/images/demo/FringeShows.png)

## Tech Stack
- **Next.js 14+**: React framework with App Router
- **TypeScript**: For type safety
- **Mantine UI**: Component library for styling and UI elements
- **React Query**: Data fetching and state management

## Project Structure
```
fringe/
├── app/               # App Router pages and layouts
│   ├── admin/         # Admin section
│   │   └── page.tsx   # Admin homepage
│   ├── layout.tsx     # Root layout with providers
│   ├── (public)/      # User/Customer section
|   |   ├── page.tsx/  # Main landing page
│   └── provider.tsx   # React query provider (Ignore for now)    
├── components/        # Reusable UI components
├── public/            # Static assets
└── styles/            # Global styles
```

## Getting Started

### Prerequisites
- Node.js 18.17.0 or later
- npm, yarn, pnpm, or bun

### Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
# or yarn install
```

### Development
Run the development server:
```bash
npm run dev
# or yarn dev
```
Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Application Features

### Styling
- Mantine UI components with customized theming

### State Management
- React Query for server state
- Context API for global app state
- Pending to define additional state management for shopping cart.

## Development Guidelines

### Page Creation
Pages follow the App Router convention:
- Create a directory under `app/` for each route
- Add a `page.tsx` file within the directory

### Component Patterns
- Use Mantine components for consistent UI
- Create reusable components in the `components/` directory
- Follow TypeScript best practices for type safety

### Styling Components
Example using Mantine components:
```tsx
import { Text, Button } from "@mantine/core";

export default function MyComponent() {
  return (
    <div>
      <Text c="blue" fw={700}>Custom styled text</Text>
      <Button variant="filled">Action Button</Button>
    </div>
  );
}
```

## Build and Deployment
Build the production application:
```bash
npm run build
# or yarn build
```

The application is optimized for deployment on Vercel.

## Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Mantine UI Documentation](https://mantine.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)