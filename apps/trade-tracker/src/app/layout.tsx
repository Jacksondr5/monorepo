import "../styles/global.css";

import { type Metadata } from "next";
import { Providers } from "./providers";
import { UserButton } from "@clerk/nextjs";

export const metadata: Metadata = {
  description: "Track your trades and manage your trading campaigns",
  title: "Trade Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-slate-100">
        <Providers>
          <header className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
            <h1 className="text-xl font-semibold">Trade Tracker</h1>
            <UserButton />
          </header>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
