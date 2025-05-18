import "~/styles/global.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Providers } from "./Providers";

export const metadata: Metadata = {
  title: "Coming Soon",
  description: "This app is still under construction",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
