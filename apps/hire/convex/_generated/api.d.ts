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
import type * as boards from "../boards.js";
import type * as candidates from "../candidates.js";
import type * as kanbanStages from "../kanbanStages.js";
import type * as model_boards from "../model/boards.js";
import type * as model_candidates from "../model/candidates.js";
import type * as model_companies from "../model/companies.js";
import type * as onboardingSteps from "../onboardingSteps.js";
import type * as roles from "../roles.js";
import type * as seniorities from "../seniorities.js";
import type * as sources from "../sources.js";
import type * as targetTeams from "../targetTeams.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  boards: typeof boards;
  candidates: typeof candidates;
  kanbanStages: typeof kanbanStages;
  "model/boards": typeof model_boards;
  "model/candidates": typeof model_candidates;
  "model/companies": typeof model_companies;
  onboardingSteps: typeof onboardingSteps;
  roles: typeof roles;
  seniorities: typeof seniorities;
  sources: typeof sources;
  targetTeams: typeof targetTeams;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
