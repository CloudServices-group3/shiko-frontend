import { apiFetch } from "./api-client";

const API_URL =
  process.env.NEXT_PUBLIC_FAQ_API_URL ??
  "https://shiko-group3-faq-api-gtceg8gjdegmhsf6.swedencentral-01.azurewebsites.net";

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