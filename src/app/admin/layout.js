import { redirect } from "next/navigation";
import { auth } from "../../auth";
import AdminSidebar from "../../components/admin/AdminSidebar";

export const metadata = {
  title: "Admin | Vari",
};

export default async function AdminLayout({ children }) {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (!session.user.isAdmin) redirect("/");

  return (
    <div className="flex min-h-screen bg-[#f6f8f9]">
      <AdminSidebar />
      <main className="flex-1 px-4 py-8 sm:px-8">{children}</main>
    </div>
  );
}