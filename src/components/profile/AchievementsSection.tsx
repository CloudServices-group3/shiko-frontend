"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  achievementsService,
  Achievement,
} from "@/services/achievementsService";

export default function AchievementsSection({ userId }: { userId: string }) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (userId) {
      fetchAchievements();
    }
  }, [userId]);

  async function fetchAchievements() {
    try {
      const data = await achievementsService.getAchievements(userId);
      setAchievements(data);
    } catch (err) {
      console.error("Achievements error:", err);
    }
  }

  async function deleteAchievement(id: number) {
    try {
      await achievementsService.deleteAchievement(id);
      fetchAchievements();
    } catch (err) {
      console.error("Delete achievement error:", err);
    }
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3">Achievements</h2>

      <div className="flex flex-wrap gap-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className="relative flex items-center justify-center rounded-full bg-orange-50 p-2"
            title={achievement.title}
          >
            <Image
              src={
                achievement.iconUrl ||
                "/images/profile/achievements/trophy.png"
              }
              alt={achievement.title || "Achievement"}
              width={40}
              height={40}
              className="h-10 w-10"
            />

            <button
              type="button"
              onClick={() => deleteAchievement(achievement.id)}
              className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-100 text-[10px] text-gray-400 hover:text-red-500"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Dana - AchievementsSection visar och tar bort achievements för en användare på profilsidan.