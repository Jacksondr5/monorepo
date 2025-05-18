# Database Schema: Candidate Management System (Zod Schemas)

This document defines the database schema for the Candidate Management System using Zod. These schemas will guide the structure of our Convex tables.

```typescript
import { z } from "zod";
import { randomUUID } from "crypto"; // Or use a library like `uuid`

// --- Helper Schemas ---
const nonEmptyString = z.string().min(1, { message: "Cannot be empty" });

// --- Enum for Company Roles ---
export const CompanyRoleEnum = z.enum(["ADMIN", "MEMBER"]);

// --- Table Schemas ---

/**
 * Profiles Table
 * Stores a reference to the authenticated user (via Clerk ID).
 * Actual profile information (name, avatar) is fetched from Clerk.
 */
export const ProfileSchema = z.object({
  id: nonEmptyString, // Clerk User ID
});

/**
 * Companies Table
 * Represents an organization or workspace that owns sets of hiring data.
 */
export const CompanySchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => randomUUID()),
  name: nonEmptyString,
  owner_profile_id: nonEmptyString, // Foreign key to ProfileSchema.id (Clerk User ID of the creator/initial owner)
  created_at: z.date().default(() => new Date()),
  avatar_url: z.string().url(), // Uploadthing
  updated_at: z
    .date()
    .default(() => new Date())
    .optional(),
});

/**
 * CompanyMembers Table (Junction Table)
 * Links Profiles to Companies and defines their role within that company.
 */
export const CompanyMemberSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => randomUUID()),
  company_id: z.string().uuid(), // Foreign key to CompanySchema.id
  profile_id: nonEmptyString, // Foreign key to ProfileSchema.id (Clerk User ID)
  role: CompanyRoleEnum,
  created_at: z.date().default(() => new Date()),
});

/**
 * Sources Table
 * Manages the list of candidate sources for a specific company.
 */
export const SourceSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => randomUUID()),
  company_id: z.string().uuid(), // Foreign key to CompanySchema.id
  name: nonEmptyString, // e.g., "LinkedIn", "Referral"
  order: z.number().int().positive().default(1),
  created_at: z.date().default(() => new Date()),
  updated_at: z
    .date()
    .default(() => new Date())
    .optional(),
});

/**
 * Seniorities Table
 * Manages the list of user-defined seniority levels for a specific company.
 */
export const SenioritySchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => randomUUID()),
  company_id: z.string().uuid(), // Foreign key to CompanySchema.id
  name: nonEmptyString, // e.g., "Intern", "Senior Engineer"
  order: z.number().int().positive().default(1),
  created_at: z.date().default(() => new Date()),
  updated_at: z
    .date()
    .default(() => new Date())
    .optional(),
});

/**
 * Statuses Table (Kanban Stages)
 * Manages the list of user-defined hiring stages for a specific company.
 */
export const StatusSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => randomUUID()),
  company_id: z.string().uuid(), // Foreign key to CompanySchema.id
  name: nonEmptyString, // e.g., "Applied", "Technical Interview"
  order: z.number().int().positive().default(1),
  created_at: z.date().default(() => new Date()),
  updated_at: z
    .date()
    .default(() => new Date())
    .optional(),
});

/**
 * Roles Table (Job Titles)
 * Manages the list of user-defined job roles for a specific company.
 */
export const RoleSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => randomUUID()),
  company_id: z.string().uuid(), // Foreign key to CompanySchema.id
  name: nonEmptyString, // e.g., "Software Engineer", "Product Manager"
  order: z.number().int().positive().default(1),
  created_at: z.date().default(() => new Date()),
  updated_at: z
    .date()
    .default(() => new Date())
    .optional(),
});

/**
 * Candidates Table
 * Central table for all candidate information, scoped to a company.
 */
export const CandidateSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => randomUUID()),
  company_id: z.string().uuid(), // Foreign key to CompanySchema.id
  name: nonEmptyString,
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .optional()
    .nullable(),
  phone: z.string().optional().nullable(),
  linkedin_profile: z
    .string()
    .url({ message: "Invalid URL" })
    .optional()
    .nullable(),
  resume_url: z.string().url({ message: "Invalid URL" }).optional().nullable(), // URL from UploadThing (@https://uploadthing.com/)
  target_team: z.string().optional().nullable(),
  role_id: z.string().uuid(), // Foreign key to RoleSchema.id
  seniority_id: z.string().uuid(), // Foreign key to SenioritySchema.id
  status_id: z.string().uuid(), // Foreign key to StatusSchema.id
  salary_expectations: z.string().optional().nullable(),
  next_steps: z.string().optional().nullable(),
  source_id: z.string().uuid().optional().nullable(), // Foreign key to SourceSchema.id
  added_by_profile_id: nonEmptyString, // Clerk User ID of the user who added the candidate
  created_at: z.date().default(() => new Date()),
  updated_at: z
    .date()
    .default(() => new Date())
    .optional(),
});

/**
 * Interview Note Templates Table
 * Stores structured templates for interview notes, scoped to a company.
 */
export const InterviewNoteTemplateSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => randomUUID()),
  company_id: z.string().uuid(), // Foreign key to CompanySchema.id
  name: nonEmptyString, // e.g., "Technical Interview Template"
  template_fields: z.record(z.string(), z.any()).default({}),
  created_at: z.date().default(() => new Date()),
  updated_at: z
    .date()
    .default(() => new Date())
    .optional(),
});

/**
 * Interviews Table
 * Logs specific interview events for candidates.
 * Implicitly scoped to a company via candidate_id.
 */
export const InterviewSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => randomUUID()),
  candidate_id: z.string().uuid(), // Foreign key to CandidateSchema.id
  interview_type: z.string().optional().nullable(),
  interview_date: z.date().optional().nullable(),
  interviewers: z.array(nonEmptyString).default([]),
  assigned_template_id: z.string().uuid().optional().nullable(),
  notes_content: z.record(z.string(), z.any()).optional().nullable(),
  recorded_by_profile_id: nonEmptyString, // Clerk User ID of user who recorded the interview
  created_at: z.date().default(() => new Date()),
  updated_at: z
    .date()
    .default(() => new Date())
    .optional(),
});
```

## Notes:

- **Multi-Tenancy:** The application now supports multiple companies. Most data is scoped using `company_id`.
- **User Identity:** `ProfileSchema` (using Clerk User ID) is the central identity. `CompanyMemberSchema` links Profiles to Companies with specific roles (`ADMIN`, `MEMBER`).
- **Company-Specific Resources:** `Sources`, `Seniorities`, `Statuses` (Kanban stages), `Roles` (job titles), and `InterviewNoteTemplates` are now managed per company.
- **Candidate and Interview Ownership:** `CandidateSchema` now includes `added_by_profile_id` and `InterviewSchema` includes `recorded_by_profile_id` to track which user performed the action.
- **Resume Handling:** `resume_url` in `CandidateSchema` will store the URL from UploadThing.
- **Orderable Lists:** `SourceSchema`, `SenioritySchema`, `StatusSchema`, and `RoleSchema` include an `order` field.
- **Timestamps & UUIDs:** Maintained as before.
- **Interview Templates:** `template_fields` and `notes_content` remain flexible for now.
