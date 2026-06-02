"use client";

import { useEffect, useState } from "react";
import CourseGrid from "@/components/courses/CourseGrid";
import PopularThisWeek from "@/components/courses/popular-this-week/PopularThisWeek";
import {
  courseRatingService,
  type CourseRatingSummary,
} from "@/services/course-rating-service";
import { courseService } from "@/services/course-service";
import { lessonExerciseService } from "@/services/lesson-exercise-service";

type CourseCardModel = {
  id: string;
  title: string;
  imageUrl: string;
  lessonCount: number;
  duration: string;
  averageRating: number;
  totalVotes: number;
};

function formatDuration(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes} min`;
  }

  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseCardModel[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadCourses() {
      try {
        const baseCourses = await courseService.getCourses();
        const courseIds = baseCourses.map((course) => course.id);

        let ratingSummaries: CourseRatingSummary[] = [];

        try {
          ratingSummaries = await courseRatingService.getSummaries(courseIds);
        } catch (error) {
          console.error("Could not load rating summaries:", error);
        }

        const ratingSummaryByCourseId = new Map(
          ratingSummaries.map((summary) => [summary.courseId, summary])
        );

        const coursesWithDetails = await Promise.all(
          baseCourses.map(async (course) => {
            const ratingSummary = ratingSummaryByCourseId.get(course.id);

            try {
              const lessonInfo = await lessonExerciseService.getMyLessonExercises(
                course.id
              );

              return {
                id: course.id,
                title: course.title,
                imageUrl: course.imageUrl,
                lessonCount: lessonInfo.totalLessons,
                duration: formatDuration(lessonInfo.totalDurationMinutes),
                averageRating: ratingSummary?.averageRating ?? 0,
                totalVotes: ratingSummary?.totalVotes ?? 0,
              };
            } catch (error) {
              console.error(
                `Could not load lesson info for course ${course.id}:`,
                error
              );

              return {
                id: course.id,
                title: course.title,
                imageUrl: course.imageUrl,
                lessonCount: 0,
                duration: "0 min",
                averageRating: ratingSummary?.averageRating ?? 0,
                totalVotes: ratingSummary?.totalVotes ?? 0,
              };
            }
          })
        );

        setCourses(coursesWithDetails);
      } catch (error) {
        console.error("Could not load courses:", error);
      }
    }

    loadCourses();
  }, []);

  const filtered = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PopularThisWeek />

      <input
        type="text"
        placeholder="Search course.."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full rounded-lg border border-ddd bg-fff px-4 py-2 text-p1 placeholder:text-aaa outline-none"
      />

      <h2 className="figma-h2 mb-6 text-p1">All Courses</h2>

      <CourseGrid courses={filtered} />
    </div>
  );
}