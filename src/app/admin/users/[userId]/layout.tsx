import { FloatingNav } from "@/components/floating-navbar";
import { db } from "@/db";
import { notFound } from "next/navigation";

interface AdminUserLayoutProps {
  children: React.ReactNode;
  params: {
    userId: string;
  };
}

export default async function AdminUserLayout({ children, params: { userId } }: AdminUserLayoutProps) {
  const user = await db.user.findFirst({ where: { id: userId } });
  if (!user) notFound();
  return (
    <div className="relative">
      <FloatingNav
        navItems={[
          { name: "All Leads", link: `/admin/users/${userId}/leads` },
          { name: "All Campaigns", link: `/admin/users/${userId}/campaigns` },
          { name: "All Products", link: `/admin/users/${userId}/products` },
          { name: "User Details", link: `/admin/users/${userId}`, icon: "ImpersonateUserIcon" },
        ]}
        user={user}
      />
      {children}
    </div>
  );
}
