/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as aid from "../aid.js";
import type * as cache from "../cache.js";
import type * as core_aid from "../core/aid.js";
import type * as core_cached from "../core/cached.js";
import type * as core_facts from "../core/facts.js";
import type * as core_fill from "../core/fill.js";
import type * as core_port from "../core/port.js";
import type * as core_ports_index from "../core/ports/index.js";
import type * as core_ports_llm from "../core/ports/llm.js";
import type * as core_ports_stub from "../core/ports/stub.js";
import type * as core_ppvRisk from "../core/ppvRisk.js";
import type * as core_ppvRows from "../core/ppvRows.js";
import type * as core_rulebook from "../core/rulebook.js";
import type * as county from "../county.js";
import type * as data from "../data.js";
import type * as dictation from "../dictation.js";
import type * as fill from "../fill.js";
import type * as lib_overTime from "../lib/overTime.js";
import type * as lib_read from "../lib/read.js";
import type * as lib_repeat from "../lib/repeat.js";
import type * as lib_repeatVector from "../lib/repeatVector.js";
import type * as lib_severity from "../lib/severity.js";
import type * as lib_store from "../lib/store.js";
import type * as model_contract from "../model/contract.js";
import type * as model_dictation from "../model/dictation.js";
import type * as model_embed from "../model/embed.js";
import type * as model_openai from "../model/openai.js";
import type * as model_prompt from "../model/prompt.js";
import type * as model_referralSchema from "../model/referralSchema.js";
import type * as model_triagePrompt from "../model/triagePrompt.js";
import type * as patients from "../patients.js";
import type * as referrals from "../referrals.js";
import type * as seed from "../seed.js";
import type * as staging from "../staging.js";
import type * as templates from "../templates.js";
import type * as validators from "../validators.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  aid: typeof aid;
  cache: typeof cache;
  "core/aid": typeof core_aid;
  "core/cached": typeof core_cached;
  "core/facts": typeof core_facts;
  "core/fill": typeof core_fill;
  "core/port": typeof core_port;
  "core/ports/index": typeof core_ports_index;
  "core/ports/llm": typeof core_ports_llm;
  "core/ports/stub": typeof core_ports_stub;
  "core/ppvRisk": typeof core_ppvRisk;
  "core/ppvRows": typeof core_ppvRows;
  "core/rulebook": typeof core_rulebook;
  county: typeof county;
  data: typeof data;
  dictation: typeof dictation;
  fill: typeof fill;
  "lib/overTime": typeof lib_overTime;
  "lib/read": typeof lib_read;
  "lib/repeat": typeof lib_repeat;
  "lib/repeatVector": typeof lib_repeatVector;
  "lib/severity": typeof lib_severity;
  "lib/store": typeof lib_store;
  "model/contract": typeof model_contract;
  "model/dictation": typeof model_dictation;
  "model/embed": typeof model_embed;
  "model/openai": typeof model_openai;
  "model/prompt": typeof model_prompt;
  "model/referralSchema": typeof model_referralSchema;
  "model/triagePrompt": typeof model_triagePrompt;
  patients: typeof patients;
  referrals: typeof referrals;
  seed: typeof seed;
  staging: typeof staging;
  templates: typeof templates;
  validators: typeof validators;
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
