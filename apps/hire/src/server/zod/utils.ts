import { z } from "zod";

export const nonEmptyString = z.string().min(1);
export const convexDateOut = z.number().transform((n) => new Date(n));
export const convexDateIn = z.date().transform((d) => d.getTime());
