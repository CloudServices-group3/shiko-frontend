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

export type AdminLessonExerciseItem = {
  id: string;
  courseId: string;
  title: string;
  durationMinutes: number;
  orderIndex: number;
  isDeleted: boolean;
  deletedAtUtc: string | null;
};

export type CreateLessonExerciseRequest = {
  title: string;
  durationMinutes: number;
  orderIndex: number;
};

export type UpdateLessonExerciseRequest = {
  title: string;
  durationMinutes: number;
  orderIndex: number;
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
  async getMyLessonExercises(
    courseId: string
  ): Promise<CourseLessonExercisesResponse> {
    const res = await apiFetch(
      `${API_URL}/courses/${courseId}/lesson-exercises/me`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

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

  async getAdminLessonExercises(
    courseId: string
  ): Promise<AdminLessonExerciseItem[]> {
    const res = await apiFetch(
      `${API_URL}/admin/courses/${courseId}/lesson-exercises`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch admin lesson exercises.");
    }

    return res.json();
  },

  async createLessonExercise(
    courseId: string,
    request: CreateLessonExerciseRequest
  ): Promise<AdminLessonExerciseItem> {
    const res = await apiFetch(
      `${API_URL}/admin/courses/${courseId}/lesson-exercises`,
      {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to create lesson exercise.");
    }

    return res.json();
  },

  async updateLessonExercise(
    courseId: string,
    lessonExerciseId: string,
    request: UpdateLessonExerciseRequest
  ): Promise<AdminLessonExerciseItem> {
    const res = await apiFetch(
      `${API_URL}/admin/courses/${courseId}/lesson-exercises/${lessonExerciseId}`,
      {
        method: "PUT",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to update lesson exercise.");
    }

    return res.json();
  },

  async deleteLessonExercise(
    courseId: string,
    lessonExerciseId: string
  ): Promise<void> {
    const res = await apiFetch(
      `${API_URL}/admin/courses/${courseId}/lesson-exercises/${lessonExerciseId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to delete lesson exercise.");
    }
  },
};