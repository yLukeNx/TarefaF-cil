import { auth } from "@/auth";
import { redirect } from "next/navigation";
import TaskDashboard from "@/components/TaskDashboard";
export const dynamic = "force-dynamic";
export default async function Page() {
 const session = await auth();
 if (!session?.user?.id) redirect("/login");
 return <TaskDashboard name={session.user.name ?? "Usuário"} />;
}