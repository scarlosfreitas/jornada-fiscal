import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getContribuintesRecentes } from "@/lib/mock/contribuintes";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";

export default async function DashboardLayout({ children }: LayoutProps<"/app">) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const recentes = await getContribuintesRecentes();

  return (
    <div className="ga-app">
      <Sidebar />
      <div className="ga-app-main">
        <Topbar
          userName={session.user?.name}
          userCargo={session.user?.cargo}
          recentes={recentes}
        />
        <main className="ga-content">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
