import { apiFetch } from "./api-client";
const API_URL = "https://shiko-course-review-provider.azurewebsites.net/api";

export type CourseReview = {
  id: string;
  courseId: string;
  userId: string;
  text: string;
  createdAtUtc: string;
  updatedAtUtc: string | null;
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
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function getErrorMessage(res: Response, fallbackMessage: string) {
  const errorBody = await res.json().catch(() => null);

  if (
    errorBody &&
    typeof errorBody === "object" &&
    "message" in errorBody &&
    typeof errorBody.message === "string"
  ) {
    return errorBody.message;
  }

  return fallbackMessage;
}

export const courseReviewService = {
  async getCourseReviews(courseId: string): Promise<CourseReview[]> {
    const res = await apiFetch(`${API_URL}/course-reviews/${courseId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch course reviews.");
    }

    return res.json();
  },

  async getMyReview(courseId: string): Promise<CourseReview | null> {
    const res = await apiFetch(`${API_URL}/course-reviews/${courseId}/me`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      throw new Error("Failed to fetch my review.");
    }

    return res.json();
  },

  async createReview(courseId: string, text: string): Promise<CourseReview> {
    const res = await apiFetch(`${API_URL}/course-reviews/${courseId}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ text }),
    });

    if (res.status === 409) {
      throw new Error(
        await getErrorMessage(
          res,
          "You need to rate the course before writing a review."
        )
      );
    }

    if (!res.ok) {
      throw new Error(
        await getErrorMessage(res, "Failed to create review.")
      );
    }

    return res.json();
  },

async updateMyReview(courseId: string, text: string): Promise<CourseReview> {
  const res = await apiFetch(`${API_URL}/course-reviews/${courseId}/me`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ text }),
  });

  if (res.status === 409) {
    throw new Error(
      await getErrorMessage(
        res,
        "You need to rate the course before updating your review."
      )
    );
  }

  if (!res.ok) {
    throw new Error(
      await getErrorMessage(res, "Failed to update review.")
    );
  }

  return res.json();
},

  async deleteMyReview(courseId: string): Promise<void> {
    const res = await apiFetch(`${API_URL}/course-reviews/${courseId}/me`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!res.ok && res.status !== 404) {
      throw new Error("Failed to delete review.");
    }
  },
};