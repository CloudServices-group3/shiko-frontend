export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-bg p-8 text-p1">
      <main>{children}</main>
    </div>
  );
}