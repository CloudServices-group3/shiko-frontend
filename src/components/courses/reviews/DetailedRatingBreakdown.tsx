import RatingStars from "@/components/courses/reviews/RatingStars";

export type RatingBreakdownItem = {
  stars: 1 | 2 | 3 | 4 | 5;
  percentage: number;
};

type DetailedRatingBreakdownProps = {
  items: readonly RatingBreakdownItem[];
};

export default function DetailedRatingBreakdown({
  items,
}: DetailedRatingBreakdownProps) {
  return (
    <section className="w-full">
      <h2 className="figma-title text-000">Detailed Rating</h2>

      <div className="mt-5 flex flex-col gap-3">
        {items.map((item) => {
          const percentage = Math.max(0, Math.min(100, item.percentage));

          return (
            <div
              key={item.stars}
              className="grid grid-cols-[3ch_auto_minmax(0,1fr)] items-center gap-4"
            >
              <span className="figma-b2 text-right tabular-nums text-p1">
                {percentage}%
              </span>

              <RatingStars
                value={item.stars}
                readonly
                size="md"
                ariaLabel={`${item.stars} star rating row`}
              />

              <div
                className="h-1.5 overflow-hidden bg-bg"
                aria-hidden="true"
              >
                <div
                  className="h-full bg-p2"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}