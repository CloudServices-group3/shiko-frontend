import { apiFetch } from "./api-client";
const API_URL = "https://shiko-lesson-exercise-provider.azurewebsites.net/api";

export type LessonExerciseItem = {
  id: string;
  title: string;
  durationMinutes: number;
  orderIndex: number;
  isCompleted: boolean;
  completedAtUtc: string | null;
};

export type CourseLessonExercisesResponse = {
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  totalDurationMinutes: number;
  lessons: LessonExerciseItem[];
};

function getToken() {
  return sessionStorage.getItem("token");
}

function getAuthHeaders() {
  const token = getToken();

  if (!token) {
    throw new Error("No access token found.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export const lessonExerciseService = {
  async getMyLessonExercises(courseId: string): Promise<CourseLessonExercisesResponse> {
    const res = await apiFetch(`${API_URL}/courses/${courseId}/lesson-exercises/me`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch lesson exercises.");
    }

    return res.json();
  },

  async completeLessonExercise(
    courseId: string,
    lessonExerciseId: string
  ): Promise<CourseLessonExercisesResponse> {
    const res = await apiFetch(
      `${API_URL}/courses/${courseId}/lesson-exercises/${lessonExerciseId}/complete`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to complete lesson exercise.");
    }

    return res.json();
  },
};