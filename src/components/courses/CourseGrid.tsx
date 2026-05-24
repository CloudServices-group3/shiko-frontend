"use client";

import CourseCard from "./CourseCard";

type Course = {
  id: number;
  title: string;
  imageUrl: string;
  lessonCount: number;
  duration: string;
};

type CourseGridProps = {
  courses: Course[];
};

export default function CourseGrid({ courses }: CourseGridProps) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          id={course.id}
          title={course.title}
          imageUrl={course.imageUrl}
          lessonCount={course.lessonCount}
          duration={course.duration}
        />
      ))}
    </div>
  );
}