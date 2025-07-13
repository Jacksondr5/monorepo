import { describe, it, expect } from "vitest";
import { partition } from "./utils";

describe("partition", () => {
  it("should split array based on predicate", () => {
    const numbers = [1, 2, 3, 4, 5];
    const [evens, odds] = partition(numbers, (n) => n % 2 === 0);

    expect(evens).toEqual([2, 4]);
    expect(odds).toEqual([1, 3, 5]);
  });

  it("should handle empty array", () => {
    const [truthy, falsy] = partition([], () => true);

    expect(truthy).toEqual([]);
    expect(falsy).toEqual([]);
  });

  it("should handle array with all elements passing the predicate", () => {
    const numbers = [2, 4, 6, 8];
    const [evens, odds] = partition(numbers, (n) => n % 2 === 0);

    expect(evens).toEqual(numbers);
    expect(odds).toEqual([]);
  });
});
