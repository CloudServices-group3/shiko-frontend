import CourseFeedbackPanel from "@/components/courses/reviews/course-feedback-panel";

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  return <CourseFeedbackPanel courseId={courseId} />;
}