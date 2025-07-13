"use client";

import { ConvexReactClient } from "convex/react";
import { env } from "~/env";

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);

export { convex };
