<<<<<<< HEAD
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface KeyPoint {
  id: string;
  text: string;
}

interface CourseDetail {
  id: string;
  title: string;
  imageUrl: string;
  lessonCount: number;
  duration: string;
  description: string;
  keyPoints: KeyPoint[];
}

export default function CourseId() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<CourseDetail | null>(null);

  useEffect(() => {
    fetch(`https://shiko-course-details-api-dana-facvhgfmeqfxhmcf.swedencentral-01.azurewebsites.net/api/coursedetails/${courseId}`)
      .then((res) => res.json())
      .then((data) => setCourse(data));
  }, [courseId]);

  if (!course) return <p className="p-8">Laddar...</p>;

  return (
    <div className="max-w-2xl mx-auto pb-16">
      <img
        src={course.imageUrl}
        alt={course.title}
        className="w-full h-72 object-cover"
      />
      <div className="px-5 pt-5">
        <h1 className="text-2xl font-bold text-gray-900 mt-3">{course.title}</h1>
        <div className="flex items-center gap-6 mt-3 text-sm text-gray-600">
          <span>{course.lessonCount} Lessons</span>
          <span>{course.duration}</span>
        </div>
        <div className="flex gap-3 mt-5">
          <button className="px-5 py-2 rounded bg-gray-900 text-white text-sm font-medium">
            Overview
          </button>
          <button className="px-5 py-2 rounded bg-orange-500 text-white text-sm font-medium">
            Sign up
          </button>
        </div>
        <section className="mt-7">
          <h2 className="font-bold text-gray-900 mb-2">About</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{course.description}</p>
        </section>
        {course.keyPoints?.length > 0 && (
          <section className="mt-7">
            <h2 className="font-bold text-gray-900 mb-3">Key Point</h2>
            <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
              {course.keyPoints.map((point) => (
                <li key={point.id} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>{point.text}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
=======
>>>>>>> 741371b03dd3dd280cfb6bd3c493f056ebf0a3f8
