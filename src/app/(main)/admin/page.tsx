export default function AdminPage() {
  return (
    <div className="rounded-[20px] bg-bg p-7.5">
      <section className="text-center">
        <h2 className="figma-h1">
          <span className="text-p2">SHIKO</span>{" "}
          <span className="text-p1">ADMIN</span>
        </h2>

        <p className="figma-h2 mt-6 text-aaa">
          Manage course content by provider
        </p>

        <p className="figma-b2 mx-auto mt-4 max-w-160 text-aaa">
          Course content is managed in separate sections. Courses, lessons,
          details and FAQs can each belong to their own provider while sharing
          the same course id.
        </p>
      </section>
    </div>
  );
}