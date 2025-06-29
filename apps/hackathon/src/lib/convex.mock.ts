import { FunctionReference, getFunctionName } from "convex/server";
import { api } from "../../convex/_generated/api";
import { fn, Mock } from "storybook/test";
import { DeepPartial } from "./deep-partial";

type FunctionGroup = keyof typeof api;

type MockedApi = Record<string, Mock>;

let mockedApi: MockedApi = {};

type GenericFunctionReference = FunctionReference<
  "mutation" | "query",
  "public",
  any,
  any,
  string | undefined
>;

export const mockApi = (ref: GenericFunctionReference, fn: Mock) => {
  const name = getFunctionName(ref);
  mockedApi[name] = fn;
};

export const clearMockedApi = () => {
  mockedApi = {};
};

export const getMockedApi = (ref: GenericFunctionReference) => {
  const name = getFunctionName(ref);
  return mockedApi[name];
};

export const useMutation = fn(
  (
    ref: FunctionReference<"mutation", "public", any, any, string | undefined>,
  ) => {
    const name = getFunctionName(ref);
    return mockedApi[name];
  },
).mockName("useMutation");

export const useQuery = fn(
  (ref: FunctionReference<"query", "public", any, any, string | undefined>) => {
    const name = getFunctionName(ref);
    return mockedApi[name];
  },
).mockName("useQuery");
