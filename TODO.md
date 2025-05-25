# Hire

- Add more robust error handling to API calls
- Add proper checks for data ownership when making changes
- Ensure DB calls are optimized properly per the Convex way of doing things
- Lint is missing
- Find a way to handle the fact that organization ID is technically nullable. This causes annoying null checks throughout the app.
- Generally add error handling in the UI and show toast notifications when failures occur
- Deal with cascading deletion (e.g. deleting a kanban stage when there are boards using it)

# Component Library

- Add errors to form fields and ensure validation works

# Monorepo

- Nx inferred tasks seem to randomly disappear. Need to make a way to validate the task graph against an expected state
