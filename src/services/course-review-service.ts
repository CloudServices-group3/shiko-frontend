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

export const courseReviewService = {
  async getCourseReviews(courseId: string): Promise<CourseReview[]> {
    const res = await fetch(`${API_URL}/course-reviews/${courseId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch course reviews.");
    }

    return res.json();
  },

  async getMyReview(courseId: string): Promise<CourseReview | null> {
    const res = await fetch(`${API_URL}/course-reviews/${courseId}/me`, {
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
    const res = await fetch(`${API_URL}/course-reviews/${courseId}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      throw new Error("Failed to create review.");
    }

    return res.json();
  },

  async updateMyReview(courseId: string, text: string): Promise<CourseReview> {
    const res = await fetch(`${API_URL}/course-reviews/${courseId}/me`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      throw new Error("Failed to update review.");
    }

    return res.json();
  },

  async deleteMyReview(courseId: string): Promise<void> {
    const res = await fetch(`${API_URL}/course-reviews/${courseId}/me`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!res.ok && res.status !== 404) {
      throw new Error("Failed to delete review.");
    }
  },
};