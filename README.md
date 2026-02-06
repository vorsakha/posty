# CodeLeap

A social media-style post application built with React, TypeScript, and Vite.

## Features

- **User Authentication**: Simple signup flow to join the platform
- **Post Management**: Create, edit, and delete posts with title and content
- **Engagement**: Like posts and view like counts
- **Sorting**: View posts sorted by newest or oldest first
- **Real-time Updates**: Optimistic UI updates using React Query

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool (using rolldown-vite)
- **Tailwind CSS v4** - Styling
- **React Query** - Data fetching and state management
- **React Hook Form + Zod** - Form handling and validation
- **date-fns** - Date formatting
- **Lucide React** - Icons

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # Base UI components (Button, Input, Modal, etc.)
│   ├── DeleteModal.tsx
│   ├── EditModal.tsx
│   ├── Header.tsx
│   ├── PostCard.tsx
│   ├── PostForm.tsx
│   ├── PostListHeader.tsx
│   └── SignupModal.tsx
├── contexts/        # React contexts (Auth)
├── hooks/           # Custom hooks (useAuth, usePosts)
├── lib/             # Utilities (mockApi, reactQuery, validation)
├── types/           # TypeScript type definitions
└── utils/           # Helper functions
```
