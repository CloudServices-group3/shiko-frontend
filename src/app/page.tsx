
/* Change this page later, maybe redirect to sign-in/dashboard,
 depending on if you are logged in or not. Or create a "Homepage" */

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <section className="text-center">
        <h1 className="text-display font-medium">
          <span className="text-p2">SHIKO</span>{" "}
          <span className="text-p1">LMS</span>
        </h1>

        <p className="mt-6 text-h2 font-semibold text-aaa">
          Learning Management System
        </p>
      </section>
    </main>
  );
}