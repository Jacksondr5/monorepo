import "../styles/global.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Providers } from "./Providers";

export const metadata: Metadata = {
  description:
    "Coordination service for Nx task distribution - prevents duplicate task execution",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  title: "Nx Task Coordinator",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={`${GeistSans.variable}`} lang="en">
      <body className="bg-slate-1 text-slate-12">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
