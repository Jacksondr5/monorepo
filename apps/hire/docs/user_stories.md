# User Stories: Candidate Management System

This document outlines the user stories for the Candidate Management System. User personas now include "Company Admin" and "Company Member". All actions are performed within the context of a selected Company.

## Epic: Master Authentication & Profile Management

- **US001:** As a User, I want to log in securely using my Clerk account so that my identity is verified across the application.
- **US002:** As a User, I want the system to ensure that I can only access data from Companies I am a member of, respecting my role within each Company.

## Epic: Company Management

- **USC001:** As a User, I want to create a new Company, making me the initial Company Admin, so that I can set up a new hiring workspace.
- **USC002:** As a User, I want to see a list of all Companies I am a member of so that I can navigate to them.
- **USC003:** As a User, I want to switch between Companies I am a member of (e.g., via a dropdown in the nav bar) so that I can work within different hiring contexts.
- **USC004:** As a Company Admin, I want to invite other registered Users to join my Company so that they can collaborate on hiring.
- **USC005:** As a Company Admin, I want to assign or change a User's role (Admin, Member) within my Company so that I can manage their access permissions.
- **USC006:** As a Company Admin, I want to remove a User from my Company so that I can revoke their access.
- **USC007:** As a Company Admin, I want to edit my Company's basic details (e.g., name) so that I can keep it up-to-date.

## Epic: Candidate Management (Company-Scoped)

_User: Company Admin or Company Member (unless specified)_

- **US003:** As a Company User, I want to add a new candidate to the currently active Company, with all their relevant details, so that I can start tracking them.
- **US004:** As a Company User, I want to view a list or backlog of all candidates belonging to the current Company so that I can get an overview of the talent pool.
- **US005:** As a Company User, I want to edit an existing candidate's information (resume, notes, team, assigned role, seniority, next steps, source, contact info, salary expectations) within the current Company so that their profile is up-to-date.
- **US006:** As a Company User, I want to upload a candidate's resume (PDF/DOCX) to UploadThing, linking it to their profile in the current Company.
- **US007:** As a Company User, I want an option to convert an uploaded DOCX resume to PDF for a candidate in the current Company.
- **US008 (Template Creation):** As a Company Admin, I want to create and manage structured templates for interview notes _for my Company_ so that we can define standardized evaluation criteria.
- **US009 (Template Assignment):** As a Company Admin, I want to assign specific interview note templates (belonging to my Company) to interview types or company-specific roles so that the correct evaluation criteria are consistently applied.
- **US010 (Template Filling):** As a Company User conducting an interview, I want to fill out the assigned structured interview note template for a candidate within the current Company.
- **US011:** As a Company User, I want to add new "Target Team" names (as free text) when creating or editing a candidate profile within the current Company.
- **US012 (Role Management):** As a Company Admin, I want to create, edit, delete, and reorder job "Roles" (e.g., Software Engineer) _for my Company_ so that we have a defined list of positions we hire for.
- **US013 (Seniority Management):** As a Company Admin, I want to create, edit, delete, and reorder "Seniority" levels (e.g., Intern, Lead) _for my Company_ so that we have a clear seniority structure.
- **US014:** As a Company User, I want to add free-text "Next Steps" for a candidate within the current Company.
- **US015 (Source Management):** As a Company Admin, I want to create, edit, delete, and reorder candidate "Sources" (e.g., LinkedIn) _for my Company_ so that we can track where candidates originate.
- **US016:** As a Company User, I want to store essential "Contact Information" (email, phone, LinkedIn) for a candidate within the current Company.
- **US017:** As a Company User, I want to record a candidate's "Salary Expectations" within the current Company.
- **US018:** As a Company User, I want to maintain a list of "Interviewers" for an interview and link their feedback (from structured notes) to a candidate's profile within the current Company, noting who recorded the feedback.

## Epic: Kanban Board (Company-Scoped)

_User: Company Admin or Company Member (unless specified)_

- **US019 (Stage Management):** As a Company Admin, I want to create, edit, delete, and reorder Kanban board "Stages" (Statuses) _for my Company_ so that our hiring pipeline is accurately represented.
- **US020:** As a Company User, I want to drag and drop candidate cards between the Company's custom stages on the Kanban board.
- **US021:** As a Company User, I want to click on a candidate card on the Company's Kanban board to open their detailed view.
- **US022:** As a Company User, I want candidates on the Company's Kanban board to display key summary information.

## Epic: Search & Filtering (Company-Scoped)

_User: Company Admin or Company Member_

- **US023:** As a Company User, I want to search for candidates _within the current Company_ by various criteria.
- **US024:** As a Company User, I want to apply filters to the candidate backlog and Kanban board _within the current Company_.

## Epic: Future Considerations (Nice-to-Haves)

- **USN001 (Granular Permissions):** As a Company Admin, I want more granular permission settings within company roles.
- **USN003 (Reporting):** As a Company User, I want to generate reports on key hiring metrics for the current Company.
- **USN004 (Notifications):** As a Company User, I want to receive notifications for important events within the Companies I am part of.
- **USN005 (Resume Parsing):** As a Company User, I want the system to automatically parse key information from uploaded resumes for candidates in my Company.
- **USN006 (External Feedback):** As a Company User, I want a way for external interviewers to securely add their interview notes directly to a candidate's profile for an interview scheduled by my Company.
