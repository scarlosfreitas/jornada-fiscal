import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="ga-app">
      <Sidebar />
      <div className="ga-app-main">
        <Topbar />
        <main className="ga-content">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
