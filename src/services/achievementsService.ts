import { apiFetch } from "@/services/api-client";

const API_URL =
  "https://achievements3-api-dana.azurewebsites.net/api/Achievements";

export interface Achievement {
  id: number;
  title: string;
  iconUrl: string;
  earnedAt: string;
}

export const achievementsService = {
  async getAchievements(userId: string): Promise<Achievement[]> {
    const res = await apiFetch(`${API_URL}/${userId}`);
    if (!res.ok) throw new Error("Kunde inte hämta achievements");
    return res.json();
  },

  async addAchievement(
    userId: string,
    title: string,
    iconUrl: string
  ): Promise<Achievement> {
    const res = await apiFetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, title, iconUrl }),
    });

    if (!res.ok) throw new Error("Kunde inte lägga till achievement");
    return res.json();
  },

  async deleteAchievement(id: number): Promise<void> {
    const res = await apiFetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Kunde inte ta bort achievement");
  },
};

// achievementsService hämtar, lägger till och tar bort achievements för en användare.