"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/dashboard") || pathname?.startsWith("/login");

  if (isAdminRoute) {
    return <main style={{ minHeight: "100vh" }}>{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh" }}>{children}</main>
      <Footer />
    </>
  );
}
