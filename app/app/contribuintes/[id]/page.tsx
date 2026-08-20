import { redirect } from "next/navigation";
import { CONTRIBUINTE_TABS, contribuinteTab } from "@/lib/routes";

export default async function ContribuintePage({
  params,
}: PageProps<"/app/contribuintes/[id]">) {
  const { id } = await params;
  redirect(contribuinteTab(id, CONTRIBUINTE_TABS[0]));
}
