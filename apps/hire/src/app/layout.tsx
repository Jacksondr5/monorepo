"use client";

import "~/styles/global.css";

import { GeistSans } from "geist/font/sans";
// import { type Metadata } from "next";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { env } from "../env";

// export const metadata: Metadata = {
//   title: "Coming Soon",
//   description: "This app is still under construction",
//   icons: [{ rel: "icon", url: "/favicon.ico" }],
// };

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL as string);

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <ClerkProvider>
          <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </ConvexProviderWithClerk>
        </ClerkProvider>
      </body>
    </html>
  );
}
