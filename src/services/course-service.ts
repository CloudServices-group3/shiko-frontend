import { apiFetch } from "./api-client";

const API_URL = "https://shiko-course-provider.azurewebsites.net/api";

export type CourseBase = {
  id: string;
  title: string;
  imageUrl: string;
};

export const courseService = {
  async getCourses(): Promise<CourseBase[]> {
    const res = await apiFetch(`${API_URL}/courses`);

    if (!res.ok) {
      throw new Error("Failed to fetch courses.");
    }

    return res.json();
  },

  async getCourseById(courseId: string): Promise<CourseBase> {
    const res = await apiFetch(`${API_URL}/courses/${courseId}`);

    if (!res.ok) {
      throw new Error("Failed to fetch course.");
    }

    return res.json();
  },
};