"use client";

import { useEffect, useState } from "react";
import AverageRatingCard from "@/components/courses/reviews/AverageRatingCard";
import DetailedRatingBreakdown, {
  type RatingBreakdownItem,
} from "@/components/courses/reviews/DetailedRatingBreakdown";
import WriteReviewForm, {
  type CourseReviewSubmitData,
} from "@/components/courses/reviews/WriteReviewForm";
import { courseRatingService } from "@/services/course-rating-service";
import { courseReviewService } from "@/services/course-review-service";

type CourseReviewsSectionProps = {
  courseId: string;
  averageRating: number;
  reviewCount: number;
  ratingBreakdown: readonly RatingBreakdownItem[];
  onFeedbackSaved?: () => Promise<void> | void;
};

export default function CourseReviewsSection({
  courseId,
  averageRating,
  reviewCount,
  ratingBreakdown,
  onFeedbackSaved,
}: CourseReviewsSectionProps) {
  const [previousReviewText, setPreviousReviewText] = useState<string | null>(
    null
  );
  const [previousRating, setPreviousRating] = useState<number | null>(null);
  const [isLoadingUserFeedback, setIsLoadingUserFeedback] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadUserFeedback() {
      setIsLoadingUserFeedback(true);

      try {
        const [myReview, myRating] = await Promise.all([
          courseReviewService.getMyReview(courseId),
          courseRatingService.getMyRating(courseId),
        ]);

        if (!isActive) {
          return;
        }

        setPreviousReviewText(myReview?.text ?? null);
        setPreviousRating(myRating?.ratingValue ?? null);
      } catch {
        if (!isActive) {
          return;
        }

        setPreviousReviewText(null);
        setPreviousRating(null);
      } finally {
        if (!isActive) {
          return;
        }

        setIsLoadingUserFeedback(false);
      }
    }

    loadUserFeedback();

    return () => {
      isActive = false;
    };
  }, [courseId]);

  async function handleSubmit(data: CourseReviewSubmitData) {
    await courseRatingService.saveMyRating(courseId, data.rating);

    if (!data.reviewWasEdited) {
      await onFeedbackSaved?.();
      return;
    }

    const hasExistingReview = previousReviewText !== null;

    if (data.reviewText.length === 0) {
      if (hasExistingReview) {
        await courseReviewService.deleteMyReview(courseId);
        setPreviousReviewText(null);
      }

      await onFeedbackSaved?.();
      return;
    }

    if (hasExistingReview) {
      const updatedReview = await courseReviewService.updateMyReview(
        courseId,
        data.reviewText
      );

      setPreviousReviewText(updatedReview.text);
    } else {
      const createdReview = await courseReviewService.createReview(
        courseId,
        data.reviewText
      );

      setPreviousReviewText(createdReview.text);
    }

    await onFeedbackSaved?.();
  }

  return (
    <section className="w-full">
      <div className="grid gap-10 lg:grid-cols-[auto_1fr]">
        <section>
          <h2 className="figma-title text-000">Average Rating</h2>

          <div className="mt-5 inline-block">
            <AverageRatingCard
              averageRating={averageRating}
              reviewCount={reviewCount}
            />
          </div>
        </section>

        <DetailedRatingBreakdown items={ratingBreakdown} />
      </div>

      <div className="mt-8">
        {isLoadingUserFeedback ? (
          <section className="w-full">
            <h2 className="figma-title text-000">Write a Reviews</h2>
            <p className="mt-4 figma-b3 text-aaa">Loading your feedback...</p>
          </section>
        ) : (
          <WriteReviewForm
            courseId={courseId}
            previousReviewText={previousReviewText}
            previousRating={previousRating}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </section>
  );
}