import type { ReactNode } from "react";
import CourseDetailsShell from "@/components/courses/course-details-shell";

export default async function CourseLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  return (
    <CourseDetailsShell courseId={courseId}>
      {children}
    </CourseDetailsShell>
  );
}