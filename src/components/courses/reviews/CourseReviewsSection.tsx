"use client";

import AverageRatingCard from "@/components/courses/reviews/AverageRatingCard";
import DetailedRatingBreakdown, {
  type RatingBreakdownItem,
} from "@/components/courses/reviews/DetailedRatingBreakdown";
import WriteReviewForm, {
  type CourseReviewSubmitData,
} from "@/components/courses/reviews/WriteReviewForm";

type CourseReviewsSectionProps = {
  courseId: string;
  averageRating: number;
  reviewCount: number;
  ratingBreakdown: readonly RatingBreakdownItem[];
};

export default function CourseReviewsSection({
  courseId,
  averageRating,
  reviewCount,
  ratingBreakdown,
}: CourseReviewsSectionProps) {
  async function handleSubmit(data: CourseReviewSubmitData) {
    console.log(data);
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