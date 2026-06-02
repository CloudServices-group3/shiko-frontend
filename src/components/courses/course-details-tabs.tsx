"use client";
 
import Link from "next/link";
import { usePathname } from "next/navigation";
 
type CourseDetailsTabsProps = {
  courseId: string;
};
 
export default function CourseDetailsTabs({ courseId }: CourseDetailsTabsProps) {
  const pathname = usePathname();
 
  const overviewHref = `/courses/${courseId}`;
  const faqsHref = `/courses/${courseId}/faqs`;
  const reviewsHref = `/courses/${courseId}/reviews`;

  const getTabClassName = (isActive: boolean) =>
    isActive
      ? "figma-b2 inline-flex items-center justify-center rounded-[9px] bg-p1 px-6 py-2.5 text-fff"
      : "figma-b2 inline-flex items-center justify-center rounded-[9px] bg-bg px-6 py-2.5 text-aaa";

  return (
    <nav className="mt-7.5 flex gap-3.75">
      <Link
        href={overviewHref}
        className={getTabClassName(pathname === overviewHref)}
      >
        Overview
      </Link>
 
      <Link
        href={faqsHref}
        className={getTabClassName(pathname === faqsHref)}
      >
        FAQs
      </Link>
 
      <Link
        href={faqsHref}
        className={getTabClassName(pathname === faqsHref)}
      >
        FAQs
      </Link>

      <Link
        href={reviewsHref}
        className={getTabClassName(pathname === reviewsHref)}
      >
        Reviews
      </Link>
    </nav>
  );
}