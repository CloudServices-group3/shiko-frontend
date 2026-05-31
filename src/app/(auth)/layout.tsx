export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="min-h-screen bg-bg">
      <div className="mx-auto flex min-h-screen w-full max-w-480 items-center justify-center bg-bg p-7.5">
        {children}
      </div>
    </main>
  );
}