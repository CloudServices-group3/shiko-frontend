import Link from "next/link";
import Image from "next/image";
import LessonExercisePanel from "@/components/courses/lesson-exercise-panel";

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
    <div className="pb-16">
      <div className="grid grid-cols-[1fr_370px] gap-7.5">
        <section className="rounded-[25px] bg-fff p-7.5">
        <Image
          src={course.imageUrl}
          alt={course.title}
          width={900}
          height={360}
          priority
          className="h-90 w-full rounded-[20px] object-cover"
        />

          <div className="mt-7.5">
            <h1 className="figma-h1 text-p1">{course.title}</h1>

            <div className="figma-b2 mt-5 flex items-center gap-7.5 text-aaa">
              <span>{course.lessonCount} Lessons</span>
              <span>{course.duration}</span>
            </div>

            <nav className="mt-7.5 flex gap-3.75">
              <Link
                href={`/courses/${courseId}`}
                className="figma-b2 rounded-[9px] bg-p1 px-6 py-4 text-fff"
              >
                Overview
              </Link>

              <Link
                href={`/courses/${courseId}/reviews`}
                className="figma-b2 rounded-[9px] px-6 py-4 text-aaa"
              >
                Reviews
              </Link>
            </nav>

            {children}
          </div>
        </section>

        <LessonExercisePanel courseId={courseId} />
      </div>
    </div>
  );
}