const API_URL = "https://shiko-course-rating-provider.azurewebsites.net/api";

export type CourseRatingDistributionItem = {
  stars: 1 | 2 | 3 | 4 | 5;
  percentage: number;
};

export type CourseRatingSummary = {
  courseId: string;
  averageRating: number;
  totalVotes: number;
  distribution: CourseRatingDistributionItem[];
};

export type MyCourseRating = {
  courseId: string;
  ratingValue: number;
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

export const courseRatingService = {
  async getSummary(courseId: string): Promise<CourseRatingSummary> {
    const res = await fetch(`${API_URL}/course-ratings/${courseId}/summary`);

    if (!res.ok) {
      throw new Error("Failed to fetch rating summary.");
    }

    return res.json();
  },

  async getMyRating(courseId: string): Promise<MyCourseRating | null> {
    const res = await fetch(`${API_URL}/course-ratings/${courseId}/me`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      throw new Error("Failed to fetch my rating.");
    }

    return res.json();
  },

  async saveMyRating(courseId: string, ratingValue: number): Promise<MyCourseRating> {
    const res = await fetch(`${API_URL}/course-ratings/${courseId}/me`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ value: ratingValue }),
    });

    if (!res.ok) {
      throw new Error("Failed to save rating.");
    }

    return res.json();
  },

  async deleteMyRating(courseId: string): Promise<void> {
    const res = await fetch(`${API_URL}/course-ratings/${courseId}/me`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!res.ok && res.status !== 404) {
      throw new Error("Failed to delete rating.");
    }
  },
};