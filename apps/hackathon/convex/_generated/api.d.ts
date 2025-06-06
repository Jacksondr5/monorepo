/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as hackathonEvents from "../hackathonEvents.js";
import type * as model_comments from "../model/comments.js";
import type * as model_error from "../model/error.js";
import type * as model_projects from "../model/projects.js";
import type * as model_users from "../model/users.js";
import type * as projects from "../projects.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  hackathonEvents: typeof hackathonEvents;
  "model/comments": typeof model_comments;
  "model/error": typeof model_error;
  "model/projects": typeof model_projects;
  "model/users": typeof model_users;
  projects: typeof projects;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
