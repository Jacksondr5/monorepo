import "./global.css";
import { Providers } from "./providers";
import { Header } from "../components/Header";

export const metadata = {
  title: "Welcome to hackathon",
  description: "This app is used to coordinate hackathons",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-1 h-screen">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
