import AdminTabs from "@/components/admin/admin-tabs";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className="rounded-[25px] bg-fff p-7.5">
      <div>
        <p className="figma-b2 font-bold text-aaa">ADMIN PANEL</p>
        <p className="figma-b2 mt-3 max-w-160 text-aaa">
          Create course first, then add what you want in the tabs below.
        </p>
      </div>

      <AdminTabs />

      <div className="mt-7.5">{children}</div>
    </section>
  );
}