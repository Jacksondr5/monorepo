import "../styles/global.css";

import { type Metadata } from "next";

export const metadata: Metadata = {
  description: "Track your trades and manage your trading campaigns",
  title: "Trade Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-slate-100">{children}</body>
    </html>
  );
}
