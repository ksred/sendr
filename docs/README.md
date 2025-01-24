# Sendr App

A modern trading application with real-time capabilities built with Next.js 14.

## Project Structure

```
/app
  /api          # API routes
  /(routes)     # Frontend routes
  /components   # React components
  /lib          # Shared utilities
  /types        # TypeScript types
  /hooks        # React hooks
  /store        # State management
  /styles       # Global styles
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

## Environment Variables

Create a `.env.local` file with:
```
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://user:password@localhost:5432/sendr
```

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Prisma (ORM)
- Redis (Session/Cache)
- Socket.io (Real-time)
- NextAuth.js (Authentication)
- shadcn/ui (Components)
- Zustand (State Management)
