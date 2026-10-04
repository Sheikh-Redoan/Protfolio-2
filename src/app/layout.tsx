import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import SmoothScrolling from "@/components/layout/SmoothScrolling";

export const metadata: Metadata = {
  title: "Full Stack Developer Portfolio",
  description:
    "Portfolio showcasing full stack development projects, skills, and experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SmoothScrolling>
          <Navbar />
          <main style={{ minHeight: "100vh" }}>{children}</main>
          <Footer />
        </SmoothScrolling>
      </body>
    </html>
  );
}
