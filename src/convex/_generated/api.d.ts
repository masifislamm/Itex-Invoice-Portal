/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as analytics from "../analytics.js";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as auth from "../auth.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as invoices from "../invoices.js";
import type * as localChalans from "../localChalans.js";
import type * as localProformas from "../localProformas.js";
import type * as proformaInvoices from "../proformaInvoices.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  analytics: typeof analytics;
  "auth/emailOtp": typeof auth_emailOtp;
  auth: typeof auth;
  files: typeof files;
  http: typeof http;
  invoices: typeof invoices;
  localChalans: typeof localChalans;
  localProformas: typeof localProformas;
  proformaInvoices: typeof proformaInvoices;
  users: typeof users;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
