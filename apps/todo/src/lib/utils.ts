import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const partition = <T>(
  array: T[],
  predicate: (item: T) => boolean,
): [T[], T[]] => {
  return array.reduce<[T[], T[]]>(
    ([pass, fail], elem) =>
      predicate(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]],
    [[], []],
  );
};
