"use client";

import Link from "next/link";
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
};

const API_URL =
  process.env.NEXT_PUBLIC_POPULAR_COURSES_API_URL ??
  "https://shiko-group3-popular-courses-api-ananebcbe8b5ana3.swedencentral-01.azurewebsites.net";

export default function PopularThisWeek() {
  const [popularCourses, setPopularCourses] = useState<PopularCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPopularCourses() {
      try {
        const response = await fetch(
          `${API_URL}/api/popular-courses`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch popular courses");
        }

        const data = await response.json();
        setPopularCourses(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPopularCourses();
  }, []);

  return (
    <section className="rounded-3xl bg-fff p-6">
      <h2 className="figma-h2 mb-6 text-p1">Popular This Week</h2>

      {isLoading ? (
        <p className="figma-b2 text-aaa">Loading popular courses...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {popularCourses.map((course) => (
            <article
              key={course.id}
              className="flex items-center justify-between rounded-2xl border border-eee bg-bg p-4 transition hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-4xl bg-fff">
                  <Image
                    src={"/icons/popular-this-week/course.svg"}
                    alt={course.title}
                    width={28}
                    height={28}
                  />
                </div>

                <div>
                  <h3 className="figma-b2 text-p1">{course.title}</h3>
                  <p className="mt-1 figma-b3 text-aaa">{course.description}</p>
                </div>
              </div>

              <Link
                href={`/courses/${course.courseId}`}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-p1 text-fff transition hover:bg-p2"
              >
                <Image
                  src="/icons/popular-this-week/arrow-right.svg"
                  alt="Arrow Right"
                  width={16}
                  height={16}
                />
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}