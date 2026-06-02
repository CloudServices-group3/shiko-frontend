import AdminTabs from "@/components/admin/admin-tabs";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className="rounded-[25px] bg-fff p-7.5">
      <div>
        <p className="figma-b2 font-bold text-aaa">ADMIN PANEL</p>
      </div>

      <AdminTabs />

      <div className="mt-7.5">{children}</div>
    </section>
  );
}