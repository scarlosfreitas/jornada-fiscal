import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";

export default async function DashboardLayout({ children }: LayoutProps<"/app">) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

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
