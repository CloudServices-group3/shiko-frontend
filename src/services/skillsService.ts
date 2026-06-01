import { apiFetch } from "@/services/api-client";
const API_URL = "https://shiko-skills-api-dana-cxfud5cwbgdya0b4.swedencentral-01.azurewebsites.net/api/Skills";
export interface Skill {
  id: number;
  name: string;
}
export const skillsService = {
  async getSkills(): Promise<Skill[]> {
    const res = await apiFetch(API_URL);
    if (!res.ok) throw new Error("Kunde inte hämta skills");
    return res.json();
  },
  async addSkill(name: string): Promise<Skill> {
    const res = await apiFetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(name),
    });
    if (!res.ok) throw new Error("Kunde inte lägga till skill");
    return res.json();
  },
  async deleteSkill(id: number): Promise<void> {
    const res = await apiFetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Kunde inte ta bort skill");
  },
};
//getskills, hämtar alla skills för användare. add lägger till. deleteskill tar bort.