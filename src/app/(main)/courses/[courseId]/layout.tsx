import Image from "next/image";
import LessonExercisePanel from "@/components/courses/lesson-exercise-panel";
import CourseDetailsTabs from "@/components/courses/course-details-tabs";

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
  <div className="pb-7.5">
    <div className="flex w-full max-w-365 gap-7.5">
      <section className="min-w-0 flex-[0_1_820px] rounded-[25px] bg-fff p-7.5">
        <Image
          src={course.imageUrl}
          alt={course.title}
          width={760}
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

          <CourseDetailsTabs courseId={courseId} />

          {children}
        </div>
      </section>

      <div className="min-w-0 flex-[0_1_610px]">
        <LessonExercisePanel courseId={courseId} />
      </div>
    </div>
  </div>
);
}