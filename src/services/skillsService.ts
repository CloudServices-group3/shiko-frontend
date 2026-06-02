import { apiFetch } from "@/services/api-client";

const BASE_URL =
  "https://skills2-service-dana.azurewebsites.net/api/Skills";

export interface Skill {
  id: number;
  name: string;
}

export const skillsService = {
  async getSkills(userId: string): Promise<Skill[]> {
    const res = await apiFetch(`${BASE_URL}/${userId}`);

    if (!res.ok) {
      throw new Error("Kunde inte hämta skills");
    }

    return res.json();
  },

  async addSkill(userId: string, name: string): Promise<Skill> {
    const res = await apiFetch(`${BASE_URL}/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(name),
    });

    if (!res.ok) {
      throw new Error("Kunde inte lägga till skill");
    }

    return res.json();
  },

  async deleteSkill(userId: string, id: number): Promise<void> {
    const res = await apiFetch(`${BASE_URL}/${userId}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Kunde inte ta bort skill");
    }
  },
};