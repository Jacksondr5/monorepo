# Hire

## MVP

- Basic error handling and toast notifications

## Soon

- Organization switcher
- Backlog
- Automated testing
  - Storybook
  - Playwright
- Invites
- Add resume upload
- Add interview notes

## Later

- Add more robust error handling to API calls
- Add proper checks for data ownership when making changes
- Ensure DB calls are optimized properly per the Convex way of doing things
- Find a way to handle the fact that organization ID is technically nullable. This causes annoying null checks throughout the app.
- Generally add error handling in the UI and show toast notifications when failures occur
- Deal with cascading deletion (e.g. deleting a kanban stage when there are boards using it)

# Hackathon

- Figure out how to transition between hackathon phases. Probably need an admin page.
- Add posthog
- Add better upvote UI, showing who upvoted

# Component Library

- Add errors to form fields and ensure validation works
- Redesign how labels look so they can be stacked and take up less space
- Add loading states to forms
- Generally improve forms, especially around testing

# Monorepo

- Nx inferred tasks seem to randomly disappear. Need to make a way to validate the task graph against an expected state
- Migrate shared nextjs things to a lib (providers, shared convex/zod stuff)
- Figure out how to share config between apps
- Zod 4
