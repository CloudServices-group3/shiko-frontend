"use client";
import { useEffect, useState } from "react";
import { achievementsService, Achievement } from "@/services/achievementsService";

export default function AchievementsSection({ userId }: { userId: string }) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    fetchAchievements();
  }, []);

  async function fetchAchievements() {
    try {
      const data = await achievementsService.getAchievements(userId);
      setAchievements(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteAchievement(id: number) {
    try {
      await achievementsService.deleteAchievement(id);
      fetchAchievements();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3">Achievements</h2>
      <div className="flex flex-wrap gap-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className="flex flex-col items-center gap-1 bg-orange-50 px-4 py-2 rounded-xl text-sm"
          >
            <img src={achievement.iconUrl} alt={achievement.title} className="w-8 h-8" />
            <span className="text-gray-700 text-xs">{achievement.title}</span>
            <button
              onClick={() => deleteAchievement(achievement.id)}
              className="text-gray-400 hover:text-red-500 text-xs"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
// AchievementsSection visar och tar bort achievements för en användare på profilsidan.