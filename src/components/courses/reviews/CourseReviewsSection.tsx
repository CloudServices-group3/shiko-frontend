"use client";

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
  async function handleSubmit(data: CourseReviewSubmitData) {
    if (!data.rating) {
      throw new Error("Rating is required.");
    }

    await courseRatingService.saveMyRating(courseId, data.rating);

    if (data.reviewText.length > 0) {
      const existingReview = await courseReviewService.getMyReview(courseId);

      if (existingReview) {
        await courseReviewService.updateMyReview(courseId, data.reviewText);
      } else {
        await courseReviewService.createReview(courseId, data.reviewText);
      }
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
        <WriteReviewForm courseId={courseId} onSubmit={handleSubmit} />
      </div>
    </section>
  );
}