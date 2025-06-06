# Test Cases for Hackathon App

This document outlines test cases derived from `user_stories.md`. Each test case is categorized for either Playwright (E2E) or Storybook (Component) testing.

## 1. Authentication & User Profile

### US1.1 (Registration - Email)

- **TC1.1.1 (Playwright):** User can successfully register with a new, valid email and password, and the user record is correctly populated in the Convex database.

### US1.2 (Registration - GitHub)

- **TC1.2.1 (Playwright):** User can successfully register and log in using their GitHub account. (Note: Feasibility depends on test GitHub account availability)

### US1.3 (Login)

- **TC1.3.1 (Playwright):** Registered user can successfully log in using their correct email and password.
- **TC1.3.2 (Playwright):** Registered user (via GitHub) can successfully log in using GitHub. (Note: Feasibility depends on test GitHub account availability)

### US1.4 (Logout)

- **TC1.4.1 (Playwright):** Authenticated user can successfully log out and is redirected appropriately (e.g., to login page or homepage).

## 2. Project Solicitation Phase

### US2.1 (Submit Project)

- **TC2.1.1 (Playwright):** Authenticated user can successfully submit a new project idea with a title and detailed description.
- **TC2.1.2 (Storybook):** Project submission form prevents submission if the title is missing and displays an appropriate error.
- **TC2.1.3 (Storybook):** Project submission form prevents submission if the description is missing and displays an appropriate error.
- **TC2.1.4 (Storybook):** Project submission form (title input, description textarea, submit button) renders correctly.

### US2.2 (View Project List)

- **TC2.2.1 (Playwright):** Authenticated user can view a list of all submitted project ideas.
- **TC2.2.2 (Playwright):** The project list displays key information for each project (e.g., title, a snippet of description, author, upvotes).
- **TC2.2.4 (Storybook):** Individual project list item component renders correctly with sample data (various title lengths, description lengths).
- **TC2.2.5 (Storybook):** "No projects" message component renders correctly. (Note: This covers the visual aspect, Playwright test for dynamic empty state removed)

### US2.3 (View Project Details)

- **TC2.3.1 (Playwright):** Authenticated user can click on a project from the list and navigate to view its full details (title, description, links, images, comments, upvotes).
- **TC2.3.2 (Storybook):** Project detail view renders all sections correctly with sample data (e.g., project with/without image, with/without comments).

### US2.4 (Upvote Project)

- **TC2.4.1 (Playwright):** Authenticated user can upvote a project idea.
- **TC2.4.2 (Playwright):** The upvote count for the project updates immediately on the UI after upvoting.
- **TC2.4.3 (Playwright):** A user cannot upvote the same project multiple times (i.e., upvoting again removes the upvote or is disabled).
- **TC2.4.4 (Storybook):** Upvote button renders correctly in its different states (e.g., upvoted, not upvoted, disabled).

### US2.5 (Comment on Project)

- **TC2.5.1 (Playwright):** Authenticated user can successfully post a comment on a project idea.
- **TC2.5.2 (Storybook):** New comment component renders correctly within a list of comments (visual verification of appearance).
- **TC2.5.3 (Playwright):** System prevents posting an empty comment.
- **TC2.5.4 (Storybook):** Comment input field/form renders correctly.
- **TC2.5.5 (Storybook):** Individual comment display (author, text, timestamp) renders correctly.
