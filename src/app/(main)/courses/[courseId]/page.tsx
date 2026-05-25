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
    <div className="mt-6">
      <section>
        <h2 className="font-bold text-gray-900 mb-2">About</h2>
        <p className="text-sm text-gray-600 leading-relaxed">{course.description}</p>
      </section>
      {course.keyPoints?.length > 0 && (
        <section className="mt-6">
          <h2 className="font-bold text-gray-900 mb-3">Key Point</h2>
          <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
            {course.keyPoints.map((point) => (
              <li key={point.id} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{point.text}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}