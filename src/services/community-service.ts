import { apiFetch } from "./api-client";

const API_URL =
  process.env.NEXT_PUBLIC_COMMUNITY_API_URL ??
  "https://shiko-group3-community-api-g9dqdwdkgsd2fyg6.swedencentral-01.azurewebsites.net";

export type CommunityLink = {
  id: string;
  title: string;
  url: string;
  iconName: string;
  sortOrder: number;
  isActive: boolean;
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

export const communityService = {
  async getCommunityLinks(): Promise<CommunityLink[]> {
    const res = await apiFetch(
      `${API_URL}/api/community-links`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch community links.");
    }

    return res.json();
  },
};