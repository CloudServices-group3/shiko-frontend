"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import CourseDetailsTabs from "@/components/courses/course-details-tabs";
import CourseMetaRow from "@/components/courses/course-meta-row";
import LessonExercisePanel from "@/components/courses/lesson-exercise-panel";
import { courseService, type CourseBase } from "@/services/course-service";

type CourseDetailsShellProps = {
  courseId: string;
  children: React.ReactNode;
};

export default function CourseDetailsShell({
  courseId,
  children,
}: CourseDetailsShellProps) {
  const [course, setCourse] = useState<CourseBase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadCourse() {
      try {
        setIsLoading(true);
        setError(null);

        const result = await courseService.getCourseById(courseId);

        if (!isActive) {
          return;
        }

        setCourse(result);
      } catch (error) {
        console.error("Could not load course:", error);

        if (!isActive) {
          return;
        }

        setError("Could not load course.");
        setCourse(null);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadCourse();

    return () => {
      isActive = false;
    };
  }, [courseId]);

  return (
    <div className="pb-7.5">
      <div className="flex w-full max-w-365 gap-7.5">
        <section className="min-w-0 flex-[0_1_820px] rounded-[25px] bg-fff p-7.5">
          {isLoading && (
            <div className="h-90 w-full rounded-[20px] bg-bg" />
          )}

          {!isLoading && error && (
            <div className="rounded-[20px] bg-bg p-7.5">
              <p className="figma-b2 text-p2">{error}</p>
            </div>
          )}

          {!isLoading && course && (
            <>
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

                <CourseMetaRow courseId={courseId} />

                <CourseDetailsTabs courseId={courseId} />

                {children}
              </div>
            </>
          )}
        </section>

        <div className="min-w-0 flex-[0_1_610px]">
          <LessonExercisePanel courseId={courseId} />
        </div>
      </div>
    </div>
  );
}