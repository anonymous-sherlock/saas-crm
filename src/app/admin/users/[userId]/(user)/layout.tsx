import AdminUserHeaderSection from "@/components/admin/user/header-section";

interface AdminUserLayoutProps {
  children: React.ReactNode;
  params: {
    userId: string;
  };
}

export default async function AdminUserLayout({ children, params: { userId } }: AdminUserLayoutProps) {
  return (
    <>
      <AdminUserHeaderSection />
      <div className="flex flex-col gap-4">
        <div className="overflow-hidden mt-4">{children}</div>
      </div>
    </>
  );
}
