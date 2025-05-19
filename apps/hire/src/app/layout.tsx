import "../styles/global.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Providers } from "./Providers";
import { OrganizationSwitcher } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "J5 Hire",
  description: "Manage your hiring process",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="bg-slate-1 text-slate-12">
        <Providers>
          <OrganizationSwitcher hidePersonal />
          {children}
        </Providers>
      </body>
    </html>
  );
}
