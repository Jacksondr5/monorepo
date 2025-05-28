# Hackathon Management App: Requirements

This document outlines the requirements for the Hackathon Management App.

## I. Core User Features

- **User Authentication (Clerk):**
  - Users must be able to register for an account using GitHub or Email/Password.
  - Users must be able to log in and log out via Clerk.
- **User Profiles:**
  - User profiles will include first name, last name, and avatar picture (sourced from Clerk).

## II. Idea Solicitation Phase

- **Idea Submission:**
  - Authenticated users can submit new project ideas.
  - An idea should have a title and a detailed description.
  - Users can include links and images in their idea descriptions.
- **Idea Browsing & Viewing:**
  - Authenticated users can view the list of submitted ideas.
  - Users can view the full details of a specific idea.
- **Idea Interaction:**
  - Authenticated users can upvote ideas they like (one upvote per user per idea).
  - Authenticated users can leave comments on ideas.

## III. Project Selection Phase

- **Idea Finalization (Admin Task):**
  - (Details to be defined later - placeholder for admin functionality)
- **Project Selection:**
  - Authenticated users can select up to 3 finalized projects they are interested in working on.
  - Users should be able to see which projects they have selected.
  - Users should be able to change their selections before a deadline.
- **Viewing Selections (Admin Task):**
  - (Details to be defined later - placeholder for admin functionality)

## IV. Team Formation (Admin Task)

- (Details to be defined later - Admins will facilitate team formation within the app)

## V. Hackathon Lifecycle Management

The app will support the following distinct phases of a hackathon:

1.  **Idea Submission:** Users can submit and discuss ideas.
2.  **Project Preference Voting:** Users can vote for their preferred finalized projects.
3.  **Hackathon Event:** (The app's role during the active event itself, if any, can be defined later - e.g., displaying teams, project links).

## VI. General & Non-Functional Requirements

- **User Interface (UI):**
  - The app should be intuitive and easy to use.
  - Responsive design (works well on desktop and mobile).
  - Adherence to the J5 design system (see `docs/design-system`) and utilize components from `libs/component-library`.
- **Admin Interface:**
  - (Details to be defined later - placeholder for admin functionality)
- **Data Persistence:**
  - All data (users, ideas, comments, upvotes, selections) will be stored in Convex.
- **Scalability:**
  - The app should comfortably handle approximately 50 users.
- **Security:**
  - Protect user data.
  - Prevent common web vulnerabilities (standard practices with Clerk & Convex).

## VII. Future Considerations (Out of Scope for Initial Version)

- Support for multiple hackathon events.
- Advanced idea sorting and filtering.
- In-app notifications.
- Tags/categories for ideas.

## VIII. Key Decisions & Scope

- **Authentication:** Clerk (GitHub & Email/Password).
- **Database:** Convex.
- **Design:** J5 Design System, `libs/component-library`.
- **User Roles:** "Admin" and "User".
- **Hackathon Scope:** Single event for the initial version.
- **Admin Tasks & Team Formation:** To be detailed further in a subsequent planning phase.
