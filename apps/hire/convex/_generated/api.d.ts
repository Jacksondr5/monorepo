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
import type * as companies from "../companies.js";
import type * as kanbanStages from "../kanbanStages.js";
import type * as roles from "../roles.js";
import type * as seniorities from "../seniorities.js";
import type * as sources from "../sources.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  companies: typeof companies;
  kanbanStages: typeof kanbanStages;
  roles: typeof roles;
  seniorities: typeof seniorities;
  sources: typeof sources;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
