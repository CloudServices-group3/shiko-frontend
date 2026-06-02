"use client";

import { useEffect, useState } from "react";
import { skillsService, Skill } from "@/services/skillsService";

type SkillsSectionProps = {
  userId: string;
};

export default function SkillsSection({ userId }: SkillsSectionProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (userId) {
      fetchSkills();
    }
  }, [userId]);

  async function fetchSkills() {
    try {
      const data = await skillsService.getSkills(userId);
      setSkills(data);
    } catch (err) {
      console.error("Skills error:", err);
    }
  }

  async function addSkill() {
    if (!newSkill.trim() || !userId) return;

    try {
      await skillsService.addSkill(userId, newSkill);
      setNewSkill("");
      fetchSkills();
    } catch (err) {
      console.error("Add skill error:", err);
    }
  }

  async function deleteSkill(id: number) {
    if (!userId) return;

    try {
      await skillsService.deleteSkill(userId, id);
      fetchSkills();
    } catch (err) {
      console.error("Delete skill error:", err);
    }
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3">Skills</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {skills.map((skill) => (
          <span
            key={skill.id}
            className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
          >
            {skill.name}

            <button
              type="button"
              onClick={() => deleteSkill(skill.id)}
              className="text-gray-400 hover:text-red-500 ml-1"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Lägg till skill..."
          className="border rounded px-3 py-1 text-sm"
        />

        <button
          type="button"
          onClick={addSkill}
          className="bg-orange-500 text-white px-4 py-1 rounded text-sm hover:bg-orange-600"
        >
          Lägg till
        </button>
      </div>
    </div>
  );
}