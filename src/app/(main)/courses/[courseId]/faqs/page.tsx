import FaqAccordion from "@/components/courses/faqs/faq-accordion";

type PageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

type FaqItem = {
  id: string;
  courseId: string;
  question: string;
  answer: string;
  sortOrder: number;
};

export default async function CourseFaqsPage({ params }: PageProps) {
  const { courseId } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_FAQ_API_URL}/api/faqs/course/${courseId}`,
    { cache: "no-store" }
  );

  const faqs: FaqItem[] = response.ok ? await response.json() : [];

  return (
    <section>
      <div className="mt-8">
        <div className="mt-5 space-y-4">
        {faqs.length === 0 ? (
            <p className="figma-b2 text-aaa">
            No FAQs available for this course yet.
            </p>
        ) : (
            <FaqAccordion faqs={faqs} />
        )}
        </div>
      </div>
    </section>
  );
}