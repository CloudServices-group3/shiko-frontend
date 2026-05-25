import Link from "next/link";

interface KeyPoint {
  id: string;
  text: string;
}

interface CourseDetail {
  id: string;
  title: string;
  imageUrl: string;
  lessonCount: number;
  duration: string;
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

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = await getCourse(courseId);

  return (
    <div className="max-w-2xl mx-auto pb-16">
      <img
        src={course.imageUrl}
        alt={course.title}
        className="w-full h-72 object-cover"
      />
      <div className="px-5 pt-5">
        <h1 className="text-2xl font-bold text-gray-900 mt-3">{course.title}</h1>
        <div className="flex items-center gap-6 mt-3 text-sm text-gray-600">
          <span>{course.lessonCount} Lessons</span>
          <span>{course.duration}</span>
        </div>
        <div className="flex gap-3 mt-5">
          <button className="px-5 py-2 rounded bg-gray-900 text-white text-sm font-medium">
            Overview
          </button>
          <button className="px-5 py-2 rounded bg-orange-500 text-white text-sm font-medium">
            review
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}