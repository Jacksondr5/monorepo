/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as comment from "../comment.js";
import type * as finalizedProjects from "../finalizedProjects.js";
import type * as hackathonEvents from "../hackathonEvents.js";
import type * as model_error from "../model/error.js";
import type * as model_finalizedProjects from "../model/finalizedProjects.js";
import type * as model_hackathonEvents from "../model/hackathonEvents.js";
import type * as model_projects from "../model/projects.js";
import type * as model_users from "../model/users.js";
import type * as projectSubmission from "../projectSubmission.js";
import type * as projectVoting from "../projectVoting.js";
import type * as projects from "../projects.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  comment: typeof comment;
  finalizedProjects: typeof finalizedProjects;
  hackathonEvents: typeof hackathonEvents;
  "model/error": typeof model_error;
  "model/finalizedProjects": typeof model_finalizedProjects;
  "model/hackathonEvents": typeof model_hackathonEvents;
  "model/projects": typeof model_projects;
  "model/users": typeof model_users;
  projectSubmission: typeof projectSubmission;
  projectVoting: typeof projectVoting;
  projects: typeof projects;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
