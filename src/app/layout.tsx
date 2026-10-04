import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
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
          <ClientLayout>{children}</ClientLayout>
        </SmoothScrolling>
      </body>
    </html>
  );
}
