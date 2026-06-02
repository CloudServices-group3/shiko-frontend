"use client";

import Image from "next/image";
import Link from "next/link";

type CourseCardProps = {
  id: string;
  title: string;
  imageUrl: string;
  lessonCount: number;
  duration: string;
  averageRating: number;
  totalVotes: number;
};

export default function CourseCard({
  id,
  title,
  imageUrl,
  lessonCount,
  duration,
  averageRating,
  totalVotes,
}: CourseCardProps) {
  async function handleViewDetailsClick() {
    const popularCoursesApiUrl = process.env.NEXT_PUBLIC_POPULAR_COURSES_API_URL;

    if (!popularCoursesApiUrl) {
      console.error("NEXT_PUBLIC_POPULAR_COURSES_API_URL is not configured.");
      return;
    }

    try {
      await fetch(`${popularCoursesApiUrl}/api/popular-courses/click`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: id,
          title,
          description: `${lessonCount} Lesson • ${duration}`,
          iconUrl: "/icons/popular-this-week/course.svg",
        }),
      });
    } catch (error) {
      console.error("Failed to track course click:", error);
    }
  }

  return (
    <div className="bg-fff rounded-xl overflow-hidden shadow-sm">
      <div className="relative w-full h-48">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="font-semibold text-p1">{title}</h3>

          <div className="flex items-center gap-1 text-sm font-semibold text-p2 whitespace-nowrap">
            <span>★</span>
            <span>{totalVotes > 0 ? averageRating.toFixed(1) : "no rating yet"}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-aaa">
            <span>{lessonCount} Lesson</span>
            <span>{duration}</span>
          </div>

          <Link
            href={`/courses/${id}`}
            onClick={handleViewDetailsClick}
            className="bg-p2 text-fff text-sm px-4 py-1.5 rounded-lg inline-flex items-center gap-2"
          >
            <span>View Details</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}