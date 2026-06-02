"use client";

import { useEffect, useState } from "react";
import {
  courseRatingService,
  type CourseRatingSummary,
} from "@/services/course-rating-service";
import {
  lessonExerciseService,
  type CourseLessonExercisesResponse,
} from "@/services/lesson-exercise-service";

type CourseMetaRowProps = {
  courseId: string;
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

export default function CourseMetaRow({ courseId }: CourseMetaRowProps) {
  const [lessonInfo, setLessonInfo] =
    useState<CourseLessonExercisesResponse | null>(null);
  const [ratingSummary, setRatingSummary] =
    useState<CourseRatingSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadCourseMeta() {
      setIsLoading(true);

      const [lessonResult, ratingResult] = await Promise.allSettled([
        lessonExerciseService.getMyLessonExercises(courseId),
        courseRatingService.getSummary(courseId),
      ]);

      if (!isActive) {
        return;
      }

      if (lessonResult.status === "fulfilled") {
        setLessonInfo(lessonResult.value);
      } else {
        console.error("Could not load lesson meta:", lessonResult.reason);
        setLessonInfo(null);
      }

      if (ratingResult.status === "fulfilled") {
        setRatingSummary(ratingResult.value);
      } else {
        console.error("Could not load rating summary:", ratingResult.reason);
        setRatingSummary(null);
      }

      setIsLoading(false);
    }

    loadCourseMeta();

    return () => {
      isActive = false;
    };
  }, [courseId]);

  const lessonText = isLoading
    ? "Loading lessons"
    : lessonInfo
      ? `${lessonInfo.totalLessons} Lessons`
      : "Lessons unavailable";

  const durationText = isLoading
    ? "Loading time"
    : lessonInfo
      ? formatDuration(lessonInfo.totalDurationMinutes)
      : "Time unavailable";

  const ratingText = isLoading
    ? "Loading rating"
    : ratingSummary && ratingSummary.totalVotes > 0
      ? `${ratingSummary.averageRating.toFixed(1)} (${ratingSummary.totalVotes} reviews)`
      : "No rating yet";

  return (
    <div className="figma-b2 mt-5 flex flex-wrap items-center gap-7.5 text-aaa">
      <span className="inline-flex items-center gap-2">
        <span aria-hidden="true">▦</span>
        <span>{lessonText}</span>
      </span>

      <span className="inline-flex items-center gap-2">
        <span aria-hidden="true">◷</span>
        <span>{durationText}</span>
      </span>

      <span className="inline-flex items-center gap-2">
        <span className="text-p2" aria-hidden="true">
          ★
        </span>
        <span>{ratingText}</span>
      </span>
    </div>
  );
}