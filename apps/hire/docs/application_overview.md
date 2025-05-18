# Application Overview: Candidate Management System

## 1. Introduction & Purpose

This document outlines the requirements, architecture, and design for a Jira-like application focused on managing the candidate hiring process. The system is designed for multiple users and multiple companies, allowing users to be part of different hiring organizations, each with its own distinct set of candidates, configurations, and hiring pipelines. The primary goal is to provide a centralized, secure, and collaborative platform for managing the entire recruitment lifecycle within different company contexts.

## 2. Core Functionality

The application will provide the following core features:

- **Multi-Company Architecture:**

  - Users (Profiles) can create or be invited to multiple "Companies".
  - Each Company acts as a distinct workspace, similar to a Jira project, containing its own candidates, hiring stages, roles, sources, interview templates, and members.
  - Users can easily switch between Companies they are a member of via a navigation dropdown.

- \*\*Secure Authentication & User Management (within a Company context):

  - Users will log in using Clerk for master authentication.
  - Within each Company, users can have roles (e.g., "ADMIN", "MEMBER").
  - Company Admins can invite new users to their Company and manage member roles.

- **Company-Scoped Candidate Backlog Management:**

  - A comprehensive list of all candidates belonging to the currently active Company.
  - Ability to add new candidates and edit existing candidate information within the Company context.
  - Robust search and filtering capabilities specific to the Company's candidate pool.

- **Company-Scoped Kanban Style Hiring Board:**
  - A visual representation of the hiring pipeline using a Kanban board, specific to the active Company.
  - Companies can define and order their own custom stages for the Kanban board.
  - Candidates (belonging to the Company) are represented as cards.
  - Users can drag and drop candidate cards between stages.
  - Clicking a candidate card opens a detailed view for editing within the Company context.

## 3. Key Data Entities & Management (Per Company)

Each Company will manage its own set of the following:

- **Candidates:** Each candidate profile will store:
  - **Resume:** PDF/DOCX (via UploadThing), with DOCX to PDF conversion.
  - **Target Team:** User-defined text field.
  - **Next Steps:** Free-text.
  - **Contact Information:** Email, phone, LinkedIn.
  - **Salary Expectations.**
  - **Associated Interviews:** Links to interview records.
  - _(Linkages below are to other company-specific entities)_
- **Roles (Job Titles):**
  - User-defined job titles specific to the company (e.g., "Senior Software Engineer", "Product Manager").
  - Can be created, edited, deleted, and ordered by Company Admins.
  - Candidates are assigned a Role from this company-specific list.
- **Seniority Levels:**
  - User-defined seniority levels specific to the company (e.g., "Intern", "Lead").
  - Can be created, edited, deleted, and ordered by Company Admins.
  - Candidates are assigned a Seniority from this company-specific list.
- **Sources:**
  - User-defined candidate sources specific to the company (e.g., "Company LinkedIn", "Employee Referral Program").
  - Can be created, edited, deleted, and ordered by Company Admins.
  - Candidates are assigned a Source from this company-specific list.
- **Kanban Stages (Statuses):**
  - User-defined stages for the company's hiring pipeline.
  - Can be created, edited, deleted, and ordered by Company Admins.
  - Candidates are assigned a Status representing their current stage.
- **Interview Note Templates:**
  - Structured templates for interview notes, specific to the company.
  - Can be created and managed by Company Admins.
  - Used to guide interview feedback for candidates within that company.
- **Interviews:**
  - Records of each interview conducted for a Company's candidate.
  - Includes interview type, date, interviewers (list of names), assigned template, and filled notes.
  - Lists which user (Profile) recorded the interview notes.

## 4. User Roles within a Company

- **ADMIN:** Can manage all aspects of the Company: invite/remove members, manage member roles, manage company-specific configurations (Roles, Seniority, Sources, Kanban Stages, Interview Templates), and has full CRUD access to candidates and interviews within that Company.
- **MEMBER:** Can view, create, and edit candidates and their associated interviews within the Company. Cannot manage company settings or other users.

## 5. Technology Stack

- **Frontend:** React, Next.js
- **Styling:** Tailwind CSS
- **Backend/Database:** Convex
- **Authentication:** Clerk (for master user identity)
- **File Uploads:** UploadThing (for resumes)
- **End-to-End Testing:** Playwright

## 6. Future Considerations / Nice-to-Haves

- **Granular Permissions within Company Roles.**
- **Reporting and Analytics (per Company, or aggregated if user has access to multiple companies).**
- **Notifications (within a Company context).**
- **Automated Resume Parsing.**
- **Secure external interviewer feedback submission (linked to a Company's interview).**
