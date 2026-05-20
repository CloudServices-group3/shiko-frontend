"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type PopularCourse = {
    id: string;
    courseId: string;
    title: string;
    description: string;
    iconUrl?: string;
    clickCount: number;
    lastClickedAt: string;
}

const popularCourses = [
  {
    id: 1,
    title: "Graphic Design",
    subtitle: "Creating Visual Content",
    icon: "/icons/popular-this-week/graphic-design.svg",
  },
  {
    id: 2,
    title: "UI/UX Design",
    subtitle: "Combines User Interface (UI)",
    icon: "/icons/popular-this-week/ui-ux-design.svg",
  },
  {
    id: 3,
    title: "Brand Identity",
    subtitle: "The Collection of Visual",
    icon: "/icons/popular-this-week/brand-identity.svg",
  },
  {
    id: 4,
    title: "Web Design",
    subtitle: "Process of Creating Websites",
    icon: "/icons/popular-this-week/web-design.svg",
  },
];

export default function PopularThisWeek() {
  return (
    <section className="rounded-3xl bg-fff p-6">
      <h2 className="figma-h2 mb-6 text-p1">
        Popular This Week
      </h2>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {popularCourses.map((course) => (
          <article
            key={course.id}
            className="flex items-center justify-between rounded-2xl border border-eee bg-bg p-2.5 transition hover:shadow-md"
          >
        <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-4xl bg-fff">
                <Image
                src={course.icon}
                alt={course.title}
                width={20}
                height={20}
                />
            </div>

            <div>
                <h3 className="figma-b2 text-p1">
                {course.title}
                </h3>

                <p className="mt-1 figma-b3 text-aaa">
                {course.subtitle}
                </p>
            </div>
        </div>

            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-p1 text-fff transition hover:bg-p2 cursor-pointer">
                <Image 
                src="/icons/popular-this-week/arrow-right.svg"
                alt="Arrow Right"
                width={16}
                height={16}
                />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}