import { apiFetch } from "./api-client";

const API_URL = process.env.NEXT_PUBLIC_FAQ_API_URL;

export type FaqItem = {
  id: string;
  courseId: string;
  question: string;
  answer: string;
  sortOrder: number;
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

export const faqService = {
  async getFaqsByCourse(courseId: string): Promise<FaqItem[]> {
    const res = await apiFetch(`${API_URL}/api/faqs/course/${courseId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch FAQs.");
    }

    return res.json();
  },
};