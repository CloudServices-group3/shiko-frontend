interface KeyPoint {
  id: string;
  text: string;
}

interface CourseDetail {
  description: string;
  keyPoints: KeyPoint[];
}

async function getCourse(courseId: string): Promise<CourseDetail> {
  const res = await fetch(
    `https://shiko-course-details-api-dana-facvhgfmeqfxhmcf.swedencentral-01.azurewebsites.net/api/coursedetails/${courseId}`,
    { cache: "force-cache" }
  );

  return res.json();
}

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = await getCourse(courseId);

  return (
    <div className="mt-7.5">
      <section>
        <h2 className="figma-b1 font-bold text-p1 mb-3">About</h2>
        <p className="figma-b3 text-aaa leading-relaxed">
          {course.description}
        </p>
      </section>

      {course.keyPoints?.length > 0 && (
        <section className="mt-7.5">
          <h2 className="figma-b1 font-bold text-p1 mb-4">Key Point</h2>

          <ul className="grid grid-cols-2 gap-y-3 gap-x-7.5">
            {course.keyPoints.map((point) => (
              <li key={point.id} className="figma-b3 flex items-start gap-2 text-aaa">
                <span className="mt-0.5 text-p2">✓</span>
                <span>{point.text}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}