"use client";

import { useEffect, useState } from "react";
import FaqAccordion from "./faq-accordion";
import { faqService, FaqItem } from "@/services/course-faq-service";

type CourseFaqsClientProps = {
  courseId: string;
};

export default function CourseFaqsClient({ courseId }: CourseFaqsClientProps) {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFaqs() {
      try {
        const data = await faqService.getFaqsByCourse(courseId);
        setFaqs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    loadFaqs();
  }, [courseId]);

  if (isLoading) {
    return <p className="figma-b2 text-aaa">Loading FAQs...</p>;
  }

  if (faqs.length === 0) {
    return (
      <p className="figma-b2 text-aaa">
        No FAQs available for this course yet.
      </p>
    );
  }

  return <FaqAccordion faqs={faqs} />;
}