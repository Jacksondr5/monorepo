# PRD: Nx Task Coordinator Service

## Introduction

A lightweight coordination service that prevents duplicate execution of Nx tasks when Nx Cloud distributes the same task to multiple CI agents. Tasks will check in with the service before executing, and only the first instance proceeds while others exit successfully.

**Problem:** Nx Cloud sometimes runs multiple instances of the same task (specifically `convex-deploy` and `vercel-build-deploy`) across different CI agents. This causes redundant deployments and race conditions which crash the CI runners.

**Solution:** A central coordination service that tracks task execution by project + task + git SHA. The first task instance to register "wins" and executes; subsequent instances exit with code 0 (success) to let Nx continue.

## Goals

- Prevent duplicate execution of deployment tasks in distributed CI
- Minimize latency impact on CI pipeline (< 100ms for check-in)
- Require no changes to Nx Cloud configuration
- Integrate seamlessly with existing custom Nx executors
- Provide visibility into task coordination decisions via logs
- Provide a dashboard UI to monitor coordination activity and duplicate detection stats

## User Stories

### US-001: Create Next.js app with Convex backend
**Description:** As a developer, I need a Next.js application with Convex backend to host the coordination API and dashboard.

**Acceptance Criteria:**
- [ ] Create new Next.js app in `apps/nx-coordinator/`
- [ ] Initialize Convex backend in `apps/nx-coordinator/convex/`
- [ ] Define `claimAttempts` table with fields:
  - `taskKey` (string, indexed) - format: `{project}:{task}:{gitSha}`
  - `project` (string, indexed) - e.g., "hire"
  - `task` (string, indexed) - e.g., "convex-deploy"
  - `gitSha` (string, indexed) - commit SHA
  - `agentId` (string) - identifier for the CI agent
  - `attemptedAt` (number) - timestamp
  - `wasGranted` (boolean, indexed) - true if this attempt won the lock
- [ ] Typecheck passes

### US-002: Implement lock acquisition mutation
**Description:** As a CI task, I want to attempt to acquire a lock so I know whether to proceed with execution.

**Acceptance Criteria:**
- [ ] Create `claimTask` mutation that accepts `{ project, task, gitSha, agentId }`
- [ ] Build `taskKey` from `{project}:{task}:{gitSha}`
- [ ] Query `claimAttempts` for existing record with matching `taskKey` and `wasGranted: true`
- [ ] If no granted attempt exists: insert record with `wasGranted: true`, return `{ acquired: true }`
- [ ] If granted attempt exists: insert record with `wasGranted: false`, return `{ acquired: false, claimedBy, claimedAt }`
- [ ] Use Convex's built-in transaction guarantees for atomicity
- [ ] Typecheck passes

### US-003: Create API route for task check-in
**Description:** As a CI task, I need an HTTP endpoint to call for coordination so I don't need direct Convex client setup in executors.

**Acceptance Criteria:**
- [ ] Create `POST /api/claim` route in `apps/nx-coordinator/src/app/api/claim/`
- [ ] Accepts JSON body: `{ project, task, gitSha, agentId }`
- [ ] Calls Convex `claimTask` mutation
- [ ] Returns `{ proceed: true }` or `{ proceed: false, message: "Task already claimed by {agentId}" }`
- [ ] Responds in < 100ms under normal conditions
- [ ] Typecheck passes

### US-004: Create shared check-in utility for Nx executors
**Description:** As a developer, I want a reusable utility for task check-in so both convex and vercel executors can use it consistently.

**Acceptance Criteria:**
- [ ] Create `tools/shared/src/taskCoordinator.ts`
- [ ] Export `checkInAndProceed(options: { project, task, gitSha, agentId, coordinatorUrl })` function
- [ ] Function makes HTTP POST to coordinator service
- [ ] Returns `{ shouldProceed: boolean, message?: string }`
- [ ] Logs decision for CI visibility (e.g., "Task hire:convex-deploy - proceeding as first instance" or "Task hire:convex-deploy - skipping, already claimed")
- [ ] Handles network errors (retry with a slight backoff, then fail CI)
- [ ] Typecheck passes

### US-005: Fetch coordinator URL from Doppler
**Description:** As a developer, I need to fetch the coordinator service URL from Doppler so executors know where to check in.

**Acceptance Criteria:**
- [ ] Add `NX_COORDINATOR_URL` key to Doppler project secrets
- [ ] Update `tools/shared/src/doppler.ts` to fetch `NX_COORDINATOR_URL`
- [ ] Update `checkInAndProceed` to accept Doppler secrets and extract the URL
- [ ] Typecheck passes

### US-006: Integrate coordinator into Convex executor
**Description:** As a CI pipeline, I want the convex-deploy task to check in with the coordinator before deploying.

**Acceptance Criteria:**
- [ ] Modify `tools/convex/src/executors/deploy/executor.ts`
- [ ] After getting project info, before deployment: call `checkInAndProceed()`
- [ ] If `shouldProceed: false`, log message and return `{ success: true }` immediately
- [ ] If `shouldProceed: true`, continue with existing deployment logic
- [ ] Generate unique `agentId` from environment (e.g., `NX_CLOUD_AGENT_ID` or hostname + PID)
- [ ] Typecheck passes

### US-007: Integrate coordinator into Vercel executor
**Description:** As a CI pipeline, I want the vercel-build-deploy task to check in with the coordinator before deploying.

**Acceptance Criteria:**
- [ ] Modify `tools/vercel/src/executors/build-deploy/executor.ts`
- [ ] After getting project info, before link step: call `checkInAndProceed()`
- [ ] If `shouldProceed: false`, log message and return `{ success: true }` immediately
- [ ] If `shouldProceed: true`, continue with existing deployment logic
- [ ] Use same `agentId` generation as Convex executor
- [ ] Typecheck passes

### US-008: Create health check endpoint
**Description:** As a CI pipeline, I want to verify the coordinator service is healthy before starting tasks.

**Acceptance Criteria:**
- [ ] Create `GET /api/health` endpoint in `apps/nx-coordinator/src/app/api/health/route.ts`
- [ ] Endpoint pings Convex to verify database connectivity
- [ ] Returns `{ status: "healthy", timestamp: ... }` on success
- [ ] Returns 503 with `{ status: "unhealthy", error: ... }` on failure
- [ ] Responds in < 50ms under normal conditions
- [ ] Typecheck passes

### US-009: Add Clerk authentication to dashboard
**Description:** As a user, I need to sign in to access the dashboard so only authorized team members can view CI coordination data.

**Acceptance Criteria:**
- [ ] Install `@clerk/nextjs` package in `apps/nx-coordinator`
- [ ] Create `apps/nx-coordinator/src/middleware.ts` with Clerk auth middleware:
  - Protect all routes except `/api/claim` and `/api/health` (these are called by CI)
  - Use `clerkMiddleware()` from `@clerk/nextjs/server`
  - Configure public routes: `["/api/claim", "/api/health"]`
- [ ] Create `apps/nx-coordinator/src/app/layout.tsx`:
  - Wrap app with `<ClerkProvider>`
  - Import Clerk's CSS if needed
- [ ] Create `apps/nx-coordinator/src/app/sign-in/[[...sign-in]]/page.tsx`:
  - Render `<SignIn />` component from `@clerk/nextjs`
  - Center on page with `flex items-center justify-center min-h-screen`
- [ ] Create `apps/nx-coordinator/src/app/sign-up/[[...sign-up]]/page.tsx`:
  - Render `<SignUp />` component from `@clerk/nextjs`
  - Center on page with `flex items-center justify-center min-h-screen`
- [ ] Add `<UserButton />` to dashboard header for sign-out functionality
- [ ] Environment variables needed (add to Vercel project settings):
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - from shared Clerk org
  - `CLERK_SECRET_KEY` - from shared Clerk org
  - `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
  - `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- [ ] Typecheck passes

### US-010: Implement Convex queries for dashboard analytics
**Description:** As a developer, I need queries to fetch coordination data for the dashboard UI.

**Acceptance Criteria:**
- [ ] Create `apps/nx-coordinator/convex/queries.ts` with the following queries:
- [ ] `getRecentAttempts` query:
  - Args: `{ limit: v.optional(v.number()), cursor: v.optional(v.string()) }`
  - Returns: `{ attempts: ClaimAttempt[], nextCursor: string | null }`
  - Use index `by_attemptedAt` in descending order
  - Default limit: 50, max limit: 100
- [ ] `getStats` query:
  - Args: none
  - Returns object with:
    - `totalAttempts`: number (all time)
    - `attemptsLast24h`: number
    - `duplicatesBlocked`: number (all time, where `wasGranted: false`)
    - `duplicatesBlockedLast24h`: number
    - `byProject`: `Array<{ project: string, total: number, blocked: number }>`
    - `byTask`: `Array<{ task: string, total: number, blocked: number }>`
  - Calculate 24h threshold as `Date.now() - 24 * 60 * 60 * 1000`
- [ ] `getAttemptsForSha` query:
  - Args: `{ gitSha: v.string() }`
  - Returns: `ClaimAttempt[]` ordered by `attemptedAt` descending
  - Use index `by_taskKey` (since taskKey contains gitSha)
- [ ] All queries must have `returns` validators
- [ ] Typecheck passes

### US-011: Build dashboard page with stats cards
**Description:** As a user, I want a dashboard page showing summary statistics about task coordination.

**Acceptance Criteria:**
- [ ] Create `apps/nx-coordinator/src/app/page.tsx` as the main dashboard
- [ ] Create `apps/nx-coordinator/src/components/StatsCards.tsx` component
- [ ] Use `useQuery` from `convex/react` to subscribe to `getStats` query
- [ ] Display 4 stat cards in a 2x2 grid using Tailwind CSS:
  - Card 1: "Total Claims" - show `totalAttempts` with `attemptsLast24h` as subtitle "(X in last 24h)"
  - Card 2: "Duplicates Blocked" - show `duplicatesBlocked` with `duplicatesBlockedLast24h` as subtitle
  - Card 3: "Block Rate" - calculate `(duplicatesBlocked / totalAttempts * 100).toFixed(1)%`
  - Card 4: "Active Projects" - count of unique projects from `byProject` array
- [ ] Card styling: `bg-slate-800 rounded-lg p-6 border border-slate-700`
- [ ] Title styling: `text-slate-400 text-sm font-medium`
- [ ] Value styling: `text-3xl font-bold text-slate-100 mt-2`
- [ ] Subtitle styling: `text-slate-500 text-sm mt-1`
- [ ] Show loading skeleton while data loads (simple `animate-pulse` divs)
- [ ] Typecheck passes

### US-012: Build recent activity table
**Description:** As a user, I want to see a table of recent claim attempts with real-time updates.

**Acceptance Criteria:**
- [ ] Create `apps/nx-coordinator/src/components/ActivityTable.tsx` component
- [ ] Use `useQuery` from `convex/react` to subscribe to `getRecentAttempts` query
- [ ] Render HTML `<table>` with columns: Time, Project, Task, Git SHA, Agent, Result
- [ ] Table styling: `w-full border-collapse`
- [ ] Header row: `bg-slate-800 text-slate-400 text-left text-sm`
- [ ] Body rows: `border-b border-slate-800 hover:bg-slate-800/50`
- [ ] Cell padding: `px-4 py-3`
- [ ] Time column: Format as relative time (e.g., "2m ago", "1h ago") using `Date.now() - attemptedAt`
  - < 60s: "Xs ago"
  - < 60m: "Xm ago"
  - < 24h: "Xh ago"
  - else: "Xd ago"
- [ ] Git SHA column: Truncate to first 7 characters, use `font-mono text-sm`
- [ ] Result column:
  - If `wasGranted: true`: Green badge with text "Granted" - `bg-green-900/50 text-green-400 px-2 py-1 rounded text-xs`
  - If `wasGranted: false`: Red badge with text "Blocked" - `bg-red-900/50 text-red-400 px-2 py-1 rounded text-xs`
- [ ] Show "No activity yet" message when array is empty
- [ ] Show loading skeleton (5 rows of `animate-pulse` rectangles) while loading
- [ ] Add table to `page.tsx` below the stats cards with heading "Recent Activity"
- [ ] Typecheck passes

### US-013: Build project and task breakdown charts
**Description:** As a user, I want to see breakdowns of claims by project and task type.

**Acceptance Criteria:**
- [ ] Create `apps/nx-coordinator/src/components/BreakdownSection.tsx` component
- [ ] Use the `byProject` and `byTask` arrays from `getStats` query (already subscribed in page)
- [ ] Display two side-by-side sections: "By Project" and "By Task"
- [ ] Each section renders a simple bar list (no chart library needed):
  - For each item, show: label, total count, blocked count, and a progress bar
  - Progress bar shows percentage of blocked vs total
- [ ] Bar list item structure:
  ```
  [Project Name]                    [X blocked / Y total]
  [====blocked====|---granted---]   [XX% blocked]
  ```
- [ ] Styling:
  - Container: `grid grid-cols-2 gap-6`
  - Section title: `text-lg font-semibold text-slate-200 mb-4`
  - Item container: `mb-3`
  - Label row: `flex justify-between text-sm text-slate-400 mb-1`
  - Progress bar container: `h-2 bg-slate-700 rounded-full overflow-hidden`
  - Progress bar fill (blocked portion): `h-full bg-red-500` with width as percentage
- [ ] Sort items by total count descending
- [ ] Add to `page.tsx` below the activity table
- [ ] Typecheck passes

### US-014: Add filtering to activity table
**Description:** As a user, I want to filter the activity table to find specific events.

**Acceptance Criteria:**
- [ ] Create `apps/nx-coordinator/src/components/ActivityFilters.tsx` component
- [ ] Add filter state using `useSearchParams` from `next/navigation` for URL persistence
- [ ] Filter controls in a horizontal row above the activity table:
  - Project dropdown: `<select>` with "All Projects" default + unique projects from data
  - Task dropdown: `<select>` with "All Tasks" default + unique tasks from data
  - Result dropdown: `<select>` with options: "All Results", "Granted", "Blocked"
  - SHA search: `<input type="text" placeholder="Search by SHA...">`
- [ ] Select styling: `bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-200 text-sm`
- [ ] Input styling: `bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-200 text-sm w-48`
- [ ] Filter container: `flex gap-4 mb-4 items-center`
- [ ] Update `getRecentAttempts` query to accept optional filter args:
  - `project: v.optional(v.string())`
  - `task: v.optional(v.string())`
  - `wasGranted: v.optional(v.boolean())`
  - `gitShaPrefix: v.optional(v.string())`
- [ ] Apply filters in query:
  - If `project` provided, filter by exact match
  - If `task` provided, filter by exact match
  - If `wasGranted` provided, filter by exact match
  - If `gitShaPrefix` provided, filter where `gitSha.startsWith(prefix)`
- [ ] Pass filter values from URL params to the query
- [ ] Add "Clear filters" button that resets all params (only show when filters active)
- [ ] Typecheck passes

## Functional Requirements

- FR-1: Task locks are identified by composite key: `{project}:{task}:{gitSha}`
- FR-2: Lock acquisition is atomic - exactly one caller wins when multiple call simultaneously
- FR-3: First task to acquire lock proceeds; all others exit with success (exit code 0)
- FR-4: Network failures to coordinator retry with slight backoff, then fail CI after a few tries
- FR-5: All coordination decisions are logged for debugging
- FR-6: Locks do not expire (a new git SHA creates new lock keys)
- FR-7: All claim attempts (granted and denied) are recorded in a single table for analytics
- FR-8: Dashboard displays real-time data using Convex subscriptions
- FR-9: Health check endpoint verifies database connectivity
- FR-10: Dashboard requires Clerk authentication; API endpoints `/api/claim` and `/api/health` are public

## Non-Goals

- No automatic retry of failed tasks (handled by pushing new commits)
- No lock expiration or cleanup (stale locks are harmless - keyed by SHA)
- No support for arbitrary tasks (only convex-deploy and vercel-build-deploy initially)
- No notification system for duplicate task detection (dashboard is sufficient)

## Technical Considerations

### Architecture
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  CI Agent 1     │     │  CI Agent 2     │     │  CI Agent N     │
│  (convex-deploy)│     │  (convex-deploy)│     │  (convex-deploy)│
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │    POST /api/claim    │                       │
         └───────────┬───────────┴───────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  nx-coordinator       │
         │  (Next.js app)        │
         │  - /api/claim         │
         │  - /api/health        │
         │  - Dashboard UI       │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Convex backend       │
         │  (claimAttempts)      │
         └───────────────────────┘
```

### Convex Schema
```typescript
// apps/nx-coordinator/convex/schema.ts
export default defineSchema({
  claimAttempts: defineTable({
    taskKey: v.string(),      // "hire:convex-deploy:abc123"
    project: v.string(),      // "hire"
    task: v.string(),         // "convex-deploy"
    gitSha: v.string(),       // "abc123def456"
    agentId: v.string(),      // Agent identifier
    attemptedAt: v.number(),  // Date.now()
    wasGranted: v.boolean(),  // true = this agent won the lock
  })
    .index("by_taskKey", ["taskKey"])
    .index("by_taskKey_granted", ["taskKey", "wasGranted"])
    .index("by_project", ["project"])
    .index("by_task", ["task"])
    .index("by_wasGranted", ["wasGranted"])
    .index("by_attemptedAt", ["attemptedAt"]),
});
```

**Lock check query:** To determine if a lock exists, query `claimAttempts` with index `by_taskKey_granted` where `taskKey = X` and `wasGranted = true`.

### API Contract
```typescript
// POST /api/claim
// Request
{
  "project": "hire",
  "task": "convex-deploy",
  "gitSha": "abc123def456",
  "agentId": "agent-1-pid-12345"
}

// Response (acquired)
{ "proceed": true }

// Response (already claimed)
{ "proceed": false, "message": "Already claimed by agent-2-pid-67890 at 2024-01-15T10:30:00Z" }
```

### Agent ID Generation
Use environment-based identifier for debugging:
```typescript
const agentId = process.env.NX_CLOUD_AGENT_ID
  ?? `${os.hostname()}-${process.pid}`;
```

### Dependencies
- Convex SDK (already in monorepo)
- No new dependencies needed for shared utility (uses native fetch)

## Success Metrics

- Zero duplicate deployments when Nx Cloud distributes same task to multiple agents
- < 100ms added latency to task execution from coordination check
- Clear log messages indicating coordination decisions
- Dashboard provides clear visibility into duplicate detection frequency
- Data helps identify patterns in Nx Cloud's task distribution behavior

## Decisions Made

1. **Architecture:** Single Next.js app (`apps/nx-coordinator/`) with Convex backend, deployed to Vercel
2. **Task identification:** `{project}:{task}:{gitSha}` composite key
3. **Failure handling:** If winning task fails, accept it as CI failure (retry via new commit)
4. **Storage:** Single `claimAttempts` table (no separate locks table - use `wasGranted: true` to identify winner)
5. **Configuration:** Coordinator URL fetched from Doppler (not environment variables)
6. **Health check:** Yes, `GET /api/health` endpoint included
7. **Dashboard UI:** Yes, included for monitoring and analytics
8. **Authentication:** Clerk (reuse existing shared org, same as other projects except hire)

## Open Questions

1. What's the best source for `agentId` - is `NX_CLOUD_AGENT_ID` available in Nx Cloud CI? (fallback: hostname + PID)
