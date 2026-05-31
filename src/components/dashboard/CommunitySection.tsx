"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type CommunityLink = {
  id: string;
  title: string;
  url: string;
  iconName: string;
  sortOrder: number;
  isActive: boolean;
};

export default function CommunitySection() {
  const [links, setLinks] = useState<CommunityLink[]>([]);

  useEffect(() => {
    async function fetchCommunityLinks() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_COMMUNITY_API_URL}/api/community-links`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch community links");
        }

        const data = await response.json();

        setLinks(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchCommunityLinks();
  }, []);

  function getIconPath(iconName: string) {
    switch (iconName) {
      case "slack":
        return "/icons/community/slack-icon.svg";

      case "discord":
        return "/icons/community/discord-icon.svg";

      default:
        return "/icons/community/slack-icon.svg";
    }
  }

  return (
    <section className="w-full max-w-150 rounded-2xl bg-white p-4">
      <h2 className="mb-3 text-xl font-semibold text-gray-800">
        Community
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-gray-50 p-4 transition-all hover:bg-gray-100 hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">
                <Image
                  src={getIconPath(link.iconName)}
                  alt={link.title}
                  width={28}
                  height={28}
                />
              </div>

              <span className="text-sm font-medium text-gray-700">
                {link.title}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}