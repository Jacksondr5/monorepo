import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { LoadingSpinner } from "~/components/LoadingSpinner";

export const metadata: Metadata = {
  title: "J5 Todo",
  description: "J5 Todo",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="bg-grass-1 min-h-screen">
        <ClerkProvider>
          <TRPCReactProvider>
            <LoadingSpinner />
            {children}
          </TRPCReactProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
