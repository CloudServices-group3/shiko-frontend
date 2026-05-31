"use client";

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

  return (
    <section className="rounded-2xl bg-white p-4">
      <h2 className="mb-3 text-lg font-semibold text-gray-800">
        Community
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-gray-50 p-4 text-sm font-medium text-gray-700"
          >
            {link.title}
          </a>
        ))}
      </div>
    </section>
  );
}