const popularCourses = [
  {
    id: 1,
    title: "Graphic Design",
    subtitle: "Creating Visual Content",
  },
  {
    id: 2,
    title: "UI/UX Design",
    subtitle: "Combines User Interface (UI)",
  },
  {
    id: 3,
    title: "Brand Identity",
    subtitle: "The Collection of Visual",
  },
  {
    id: 4,
    title: "Web Design",
    subtitle: "Process of Creating Websites",
  },
];

export default function PopularThisWeek() {
  return (
    <section className="rounded-3xl bg-fff p-6">
      <h2 className="figma-h2 mb-6 text-p1">
        Popular This Week
      </h2>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {popularCourses.map((course) => (
          <article
            key={course.id}
            className="flex items-center justify-between rounded-2xl border border-eee bg-bg p-4 transition hover:shadow-md"
          >
            <div>
              <h3 className="figma-b2 text-p1">
                {course.title}
              </h3>

              <p className="mt-1 figma-b3 text-aaa">
                {course.subtitle}
              </p>
            </div>

            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-p1 text-fff transition hover:bg-p2">
              ↗
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}