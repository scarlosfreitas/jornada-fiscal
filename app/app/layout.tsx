import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getContribuintesRecentes } from "@/lib/consulta-entidade";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import { ShellSearchProvider } from "@/components/layout/ShellSearchProvider";

export default async function DashboardLayout({ children }: LayoutProps<"/app">) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const recentes = await getContribuintesRecentes(session.user.id);

  return (
    <ShellSearchProvider>
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
    </ShellSearchProvider>
  );
}
