"use client";

import { useEffect, useState } from "react";
import CourseReviewsSection from "@/components/courses/reviews/CourseReviewsSection";
import {
  CourseRatingSummary,
  courseRatingService,
} from "@/services/course-rating-service";

type CourseFeedbackPanelProps = {
  courseId: string;
};

function buildRatingBreakdown(summary: CourseRatingSummary) {
  return summary.distribution.map((item) => ({
    stars: item.stars,
    percentage: item.percentage,
  }));
}

export default function CourseFeedbackPanel({
  courseId,
}: CourseFeedbackPanelProps) {
  const [summary, setSummary] = useState<CourseRatingSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refreshSummary() {
    const ratingSummary = await courseRatingService.getSummary(courseId);
    setSummary(ratingSummary);
  }

  useEffect(() => {
    let isActive = true;

    courseRatingService
      .getSummary(courseId)
      .then((ratingSummary) => {
        if (!isActive) {
          return;
        }

        setSummary(ratingSummary);
        setError(null);
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        setError("Could not load course feedback.");
      })
      .finally(() => {
        if (!isActive) {
          return;
        }

        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [courseId]);

  if (isLoading) {
    return (
      <section className="mt-7.5">
        <p className="figma-b3 text-aaa">Loading course feedback...</p>
      </section>
    );
  }

  if (!summary) {
    return (
      <section className="mt-7.5">
        <p className="figma-b3 text-p2">
          {error ?? "Course feedback could not be loaded."}
        </p>
      </section>
    );
  }

  return (
    <div className="mt-7.5">
      {error && (
        <p className="figma-b3 mb-5 rounded-[11px] bg-bg px-4 py-3 text-p2">
          {error}
        </p>
      )}

      <CourseReviewsSection
        courseId={courseId}
        averageRating={summary.averageRating}
        reviewCount={summary.totalVotes}
        ratingBreakdown={buildRatingBreakdown(summary)}
        onFeedbackSaved={refreshSummary}
      />
    </div>
  );
}