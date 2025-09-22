import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Providers } from "./providers";
import { getAuthToken } from "./auth";

export const metadata: Metadata = {
  title: "Bravos Research",
  description: "Bravos Research",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const tokenResult = await getAuthToken();
  const token = tokenResult.isOk() ? tokenResult.value : undefined;
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="bg-grass-1 min-h-screen">
        <Providers authToken={token}>{children}</Providers>
      </body>
    </html>
  );
}
