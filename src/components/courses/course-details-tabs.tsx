"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type CourseDetailsTabsProps = {
  courseId: string;
};

export default function CourseDetailsTabs({ courseId }: CourseDetailsTabsProps) {
  const pathname = usePathname();

  const overviewHref = `/courses/${courseId}`;
  const faqHref = `/courses/${courseId}/faqs`;
  const reviewsHref = `/courses/${courseId}/reviews`;

  const isOverviewActive = pathname === overviewHref;
  const isFaqActive = pathname === faqHref;
  const isReviewsActive = pathname === reviewsHref;

  return (
    <nav className="mt-7.5 flex gap-3.75">
      <Link
        href={overviewHref}
        className={
          isOverviewActive
            ? "figma-b2 rounded-[9px] bg-p1 px-6 py-4 text-fff"
            : "figma-b2 rounded-[9px] bg-bg px-6 py-4 text-aaa"
        }
      >
        Overview
      </Link>

      <Link
        href={faqHref}
        className={
          isFaqActive
            ? "figma-b2 rounded-[9px] bg-p1 px-6 py-4 text-fff"
            : "figma-b2 rounded-[9px] bg-bg px-6 py-4 text-aaa"
        }
      >
        FAQs
    </Link>

      <Link
        href={reviewsHref}
        className={
          isReviewsActive
            ? "figma-b2 rounded-[9px] bg-p1 px-6 py-4 text-fff"
            : "figma-b2 rounded-[9px] bg-bg px-6 py-4 text-aaa"
        }
      >
        Reviews
      </Link>
    </nav>
  );
}