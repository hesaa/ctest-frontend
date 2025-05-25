import { redirect } from "next/navigation";
import AdminPanelLayout from "@/components/dashboard/layout/layout";



export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {

  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}
