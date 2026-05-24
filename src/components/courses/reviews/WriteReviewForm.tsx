"use client";

import { FormEvent, useState } from "react";
import RatingStars from "@/components/courses/reviews/RatingStars";

export type CourseReviewSubmitData = {
  courseId: string;
  rating: number | null;
  reviewText: string;
};

type WriteReviewFormProps = {
  courseId: string;
  onSubmit?: (data: CourseReviewSubmitData) => Promise<void> | void;
};

export default function WriteReviewForm({
  courseId,
  onSubmit,
}: WriteReviewFormProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data: CourseReviewSubmitData = {
      courseId,
      rating,
      reviewText: reviewText.trim(),
    };

    setIsSubmitting(true);

    try {
      await onSubmit?.(data);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="w-full">
      <h2 className="figma-title text-000">Write a Reviews</h2>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col">
        <label className="figma-b3 text-aaa">Select your rating</label>

        <div className="mt-6">
          <RatingStars
            value={rating ?? 0}
            onChange={setRating}
            size="md"
            ariaLabel="Select your course rating"
          />
        </div>

        <textarea
          value={reviewText}
          onChange={(event) => setReviewText(event.target.value)}
          placeholder="Enter feedback here..."
          className="mt-6 min-h-36 w-full resize-y rounded-xl border border-eee bg-bg px-5 py-4 figma-b3 text-p1 outline-none placeholder:text-aaa focus:border-p2 focus:ring-2 focus:ring-p2/20"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-8 inline-flex w-fit items-center justify-center rounded-xl bg-p2 px-8 py-2 font-semibold text-fff transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </section>
  );
}