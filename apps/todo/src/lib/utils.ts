import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const partition = <T>(
  array: T[],
  predicate: (item: T) => boolean,
): [T[], T[]] => {
  const pass: T[] = [];
  const fail: T[] = [];
  for (const elem of array) {
    if (predicate(elem)) {
      pass.push(elem);
    } else {
      fail.push(elem);
    }
  }
  return [pass, fail];
};
