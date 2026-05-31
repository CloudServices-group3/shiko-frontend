import AdminTabs from "@/components/admin/admin-tabs";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className="rounded-[25px] bg-fff p-7.5">
      <div>
        <p className="figma-b2 font-bold text-aaa">ADMIN</p>
        <h1 className="figma-h2 mt-2 text-p1">Admin panel</h1>
        <p className="figma-b2 mt-3 max-w-160 text-aaa">
          Manage course content by provider. Each section uses the course id as
          the shared reference between providers.
        </p>
      </div>

      <AdminTabs />

      <div className="mt-7.5">{children}</div>
    </section>
  );
}