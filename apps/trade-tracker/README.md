# Trade Tracker

A personal trading journal and analytics app for tracking stock and crypto trades.

## Local Development Setup

### Prerequisites

- Node.js (see `.nvmrc` in monorepo root)
- pnpm
- A Clerk account (https://clerk.com)
- A Convex account (https://convex.dev)

### 1. Set up Clerk

1. Create an application at https://dashboard.clerk.com
2. Copy your API keys from the Clerk dashboard

### 2. Set up Convex

1. Create a project at https://dashboard.convex.dev
2. Copy your deployment URL
3. Set the `NEXT_PUBLIC_CLERK_FRONTEND_API_URL` environment variable in the Convex dashboard (Settings > Environment Variables)

### 3. Configure Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

- `CONVEX_DEPLOYMENT` - Your Convex deployment name
- `NEXT_PUBLIC_CONVEX_URL` - Your Convex deployment URL
- `NEXT_PUBLIC_CLERK_FRONTEND_API_URL` - Your Clerk frontend API URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key
- `CLERK_SECRET_KEY` - Your Clerk secret key

### 4. Start Development Servers

Start the Convex dev server (in one terminal):

```bash
cd apps/trade-tracker
npx convex dev
```

Start the Next.js dev server (in another terminal):

```bash
pnpm nx dev trade-tracker
```

The app will be available at http://localhost:3000

## Architecture

### Authentication

- **middleware.ts** - Uses `clerkMiddleware()` to protect all routes
- **layout.tsx** - Wraps the app with `<ClerkProvider>` and `<ConvexProviderWithClerk>`
- **Header** - Includes `<UserButton />` for user profile and sign-out

### Backend

- **Convex** - Serverless backend with real-time sync
- **convex/auth.config.ts** - Configures Convex to validate Clerk JWTs
