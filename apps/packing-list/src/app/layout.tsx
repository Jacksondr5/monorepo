import "../styles/global.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
// import {
//   ClerkProvider,
//   SignInButton,
//   SignUpButton,
//   SignedIn,
//   SignedOut,
//   UserButton,
// } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Packing List App",
  description: "Smart packing lists for your travels",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        {/* <ClerkProvider> */}
        {/* <header className="flex h-16 items-center justify-end gap-4 p-4">
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header> */}
        {children}
        {/* </ClerkProvider> */}
      </body>
    </html>
  );
}
