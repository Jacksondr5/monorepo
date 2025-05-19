---
trigger: model_decision
description: when using Convex validators and defining database schemas
---

## Description: Guidelines for using Convex validators and defining database schemas.

# Convex guidelines

## Validator guidelines

- `v.bigint()` is deprecated for representing signed 64-bit integers. Use `v.int64()` instead.
- Use `v.record()` for defining a record type. `v.map()` and `v.set()` are not supported.
- Below is an example of an array validator:

  ```typescript
  import { mutation } from "./_generated/server";
  import { v } from "convex/values";

  export default mutation({
    args: {
      simpleArray: v.array(v.union(v.string(), v.number())),
    },
    handler: async (ctx, args) => {
      //...
    },
  });
  ```

- Below is an example of a schema with validators that codify a discriminated union type:

  ```typescript
  import { defineSchema, defineTable } from "convex/server";
  import { v } from "convex/values";

  export default defineSchema({
    results: defineTable(
      v.union(
        v.object({
          kind: v.literal("error"),
          errorMessage: v.string(),
        }),
        v.object({
          kind: v.literal("success"),
          value: v.number(),
        }),
      ),
    ),
  });
  ```

- Always use the `v.null()` validator when returning a null value. Below is an example query that returns a null value:

  ```typescript
  import { query } from "./_generated/server";
  import { v } from "convex/values";

  export const exampleQuery = query({
    args: {},
    returns: v.null(),
    handler: async (ctx, args) => {
      console.log("This query returns a null value");
      return null;
    },
  });
  ```

- Here are the valid Convex types along with their respective validators:
  Convex Type | TS/JS type | Example Usage | Validator for argument validation and schemas | Notes |
  | ----------- | ------------| -----------------------| -----------------------------------------------| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
  | Id | string | `doc._id` | `v.id(tableName)` | |
  | Null | null | `null` | `v.null()` | JavaScript's `undefined` is not a valid Convex value. Functions the return `undefined` or do not return will return `null` when called from a client. Use `null` instead. |
  | Int64 | bigint | `3n` | `v.int64()` | Int64s only support BigInts between -2^63 and 2^63-1. Convex supports `bigint`s in most modern browsers. |
  | Float64 | number | `3.1` | `v.number()` | Convex supports all IEEE-754 double-precision floating point numbers (such as NaNs). Inf and NaN are JSON serialized as strings. |
  | Boolean | boolean | `true` | `v.boolean()` |
  | String | string | `"abc"` | `v.string()` | Strings are stored as UTF-8 and must be valid Unicode sequences. Strings must be smaller than the 1MB total size limit when encoded as UTF-8. |
  | Bytes | ArrayBuffer | `new ArrayBuffer(8)` | `v.bytes()` | Convex supports first class bytestrings, passed in as `ArrayBuffer`s. Bytestrings must be smaller than the 1MB total size limit for Convex types. |
  | Array | Array | `[1, 3.2, "abc"]` | `v.array(values)` | Arrays can have at most 8192 values. |
  | Object | Object | `{a: "abc"}` | `v.object({property: value})` | Convex only supports "plain old JavaScript objects" (objects that do not have a custom prototype). Objects can have at most 1024 entries. Field names must be nonempty and not start with "$" or "_". |
| Record      | Record      | `{"a": "1", "b": "2"}` | `v.record(keys, values)`                       | Records are objects at runtime, but can have dynamic keys. Keys must be only ASCII characters, nonempty, and not start with "$" or "\_". |

## Schema guidelines

- Always define your schema in `convex/schema.ts`.
- Always import the schema definition functions from `convex/server`:

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
```

- System fields are automatically added to all documents and are prefixed with an underscore. The two system fields that are automatically added to all documents are `_creationTime` which has the validator `v.number()` and `_id` which has the validator `v.id(tableName)`.
- Always include all index fields in the index name. For example, if an index is defined as `["field1", "field2"]`, the index name should be "by_field1_and_field2".
- Index fields must be queried in the same order they are defined. If you want to be able to query by "field1" then "field2" and by "field2" then "field1", you must create separate indexes.
