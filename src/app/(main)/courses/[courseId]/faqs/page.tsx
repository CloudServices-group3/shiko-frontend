import CourseFaqsClient from "@/components/courses/faqs/course-faqs-client";

type PageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function CourseFaqsPage({ params }: PageProps) {
  const { courseId } = await params;

  return (
    <section>
      <div className="mt-8">
        <CourseFaqsClient courseId={courseId} />
      </div>
    </section>
  );
}