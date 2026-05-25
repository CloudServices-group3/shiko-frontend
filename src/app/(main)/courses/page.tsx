"use client";
import { useEffect, useState } from "react";
import CourseGrid from "@/components/courses/CourseGrid";

type Course = {
  id: string;
  title: string;
  imageUrl: string;
  lessonCount: number;
  duration: string;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("https://shiko-course-api-dana-awdagkgff6gfgtbp.swedencentral-01.azurewebsites.net/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data));
  }, []);

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <input
        type="text"
        placeholder="Search course.."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-lg px-4 py-2 mb-6"
      />
      <h2 className="text-xl font-semibold mb-6">All Courses</h2>
      <CourseGrid courses={filtered} />
    </div>
  );
}