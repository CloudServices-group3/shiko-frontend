"use client";

import { useEffect, useState } from "react";
import {
  CourseLessonExercisesResponse,
  lessonExerciseService,
} from "@/services/lesson-exercise-service";

type LessonExercisePanelProps = {
  courseId: string;
};

function formatDuration(minutes: number) {
  return `${minutes.toString().padStart(2, "0")}:00`;
}

export default function LessonExercisePanel({ courseId }: LessonExercisePanelProps) {
  const [data, setData] = useState<CourseLessonExercisesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completingLessonId, setCompletingLessonId] = useState<string | null>(null);

  useEffect(() => {
    async function loadLessons() {
      try {
        setIsLoading(true);
        setError(null);

        const result = await lessonExerciseService.getMyLessonExercises(courseId);
        setData(result);
      } catch {
        setError("Could not load lesson exercises.");
      } finally {
        setIsLoading(false);
      }
    }

    loadLessons();
  }, [courseId]);

  async function handleCompleteLesson(lessonExerciseId: string) {
    try {
      setCompletingLessonId(lessonExerciseId);
      setError(null);

      const result = await lessonExerciseService.completeLessonExercise(
        courseId,
        lessonExerciseId
      );

      setData(result);
    } catch {
      setError("Could not complete lesson.");
    } finally {
      setCompletingLessonId(null);
    }
  }

  if (isLoading) {
    return ( 
      <aside className="rounded-[25px] bg-fff p-7.5">
        <h2 className="figma-title text-p1">Lesson Exercise</h2>
        <p className="figma-b3 mt-5 text-aaa">Loading lessons...</p>
      </aside>
    );
  }

  if (!data) {
    return (
      <aside className="rounded-[25px] bg-fff p-7.5">
        <h2 className="figma-title text-p1">Lesson Exercise</h2>
        <p className="figma-b3 mt-5 text-p2">
          {error ?? "No lesson exercises found."}
        </p>
      </aside>
    );
  }

  return (
    <aside className="rounded-[25px] bg-fff p-7.5">
      <div className="mb-5">
        <h2 className="figma-title text-p1">Lesson Exercise</h2>
      </div>

      {error && (
        <p className="figma-b3 mb-5 rounded-[11px] bg-bg px-4 py-3 text-p2">
          {error}
        </p>
      )}

      <div className="flex max-h-170 flex-col gap-3 overflow-y-auto pr-1">
        {data.lessons.map((lesson) => {
          const isCompleting = completingLessonId === lesson.id;

          return (
            <button
              key={lesson.id}
              type="button"
              disabled={lesson.isCompleted || isCompleting}
              onClick={() => handleCompleteLesson(lesson.id)}
              className="flex w-full items-center justify-between rounded-[15px] bg-bg px-5 py-4 text-left disabled:cursor-default"
            >
              <span className="min-w-0 flex-1">
                <span className="figma-b2 block truncate text-p1">
                  {lesson.title}
                </span>
                <span className="figma-b3 mt-1 block text-aaa">
                  {formatDuration(lesson.durationMinutes)}
                </span>
              </span>

              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fff text-aaa">
                {lesson.isCompleted ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-p1 text-[10px] font-semibold text-fff">
                    ✓
                  </span>
                ) : isCompleting ? (
                  <span className="figma-b3 text-aaa">...</span>
                ) : (
                  <span className="text-xs text-aaa">▶</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}