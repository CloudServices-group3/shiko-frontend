import RatingStars from "@/components/courses/reviews/RatingStars";

type AverageRatingCardProps = {
  averageRating: number;
  reviewCount: number;
};

export default function AverageRatingCard({
  averageRating,
  reviewCount,
}: AverageRatingCardProps) {
  const normalizedRating = Math.max(0, Math.min(5, averageRating));
  const filledStars = Math.floor(normalizedRating);

  return (
    <article className="flex flex-col items-center justify-center rounded-[15px] bg-bg px-6 py-8">
      <div className="flex items-end gap-1">
        <span className="figma-h1 text-p1">{normalizedRating.toFixed(1)}</span>
        <span className="mb-1 figma-b3 text-aaa">/5</span>
      </div>

      <p className="mt-4 figma-b3 text-aaa">
        Based on {reviewCount} Review
      </p>

      <div className="mt-3">
        <RatingStars
          value={filledStars}
          readonly
          size="md"
          ariaLabel={`Average course rating ${normalizedRating.toFixed(
            1
          )} out of 5`}
        />
      </div>
    </article>
  );
}