"use client";

import { type SyntheticEvent, useEffect, useState } from "react";
import RatingStars from "@/components/courses/reviews/RatingStars";

export type CourseReviewSubmitData = {
  courseId: string;
  rating: number;
  reviewText: string;
  reviewWasEdited: boolean;
};

type WriteReviewFormProps = {
  courseId: string;
  previousReviewText?: string | null;
  previousRating?: number | null;
  isLoadingUserFeedback?: boolean;
  onSubmit?: (data: CourseReviewSubmitData) => Promise<void> | void;
};

export default function WriteReviewForm({
  courseId,
  previousReviewText,
  previousRating,
  isLoadingUserFeedback = false,
  onSubmit,
}: WriteReviewFormProps) {
  const [rating, setRating] = useState(previousRating ?? 1);
  const [reviewText, setReviewText] = useState("");
  const [reviewWasEdited, setReviewWasEdited] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!submitMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSubmitMessage(null);
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [submitMessage]);

  function handleReviewFocus() {
    if (reviewText.length === 0 && previousReviewText) {
      setReviewText(previousReviewText);
    }
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const data: CourseReviewSubmitData = {
      courseId,
      rating,
      reviewText: reviewText.trim(),
      reviewWasEdited,
    };

    setIsSubmitting(true);
    setSubmitMessage(null);
    setSubmitError(null);

    try {
      await onSubmit?.(data);

      setReviewText("");
      setReviewWasEdited(false);
      setSubmitMessage("Your feedback has been updated.");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Could not save your feedback."
      );
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
            value={rating}
            onChange={setRating}
            size="md"
            ariaLabel="Select your course rating"
          />
        </div>

        <div className="mt-4 flex min-h-11 justify-end">
          {submitError && (
            <p className="rounded-xl bg-bg px-4 py-3 figma-b3 text-p2">
              {submitError}
            </p>
          )}

          {!submitError && submitMessage && (
            <p className="rounded-xl bg-bg px-4 py-3 figma-b3 text-p1">
              {submitMessage}
            </p>
          )}
        </div>

        <textarea
          value={reviewText}
          onFocus={handleReviewFocus}
          onChange={(event) => {
            setReviewText(event.target.value);
            setReviewWasEdited(true);
          }}
          placeholder={
            isLoadingUserFeedback
              ? "Loading your previous feedback..."
              : previousReviewText
                ? `Click to edit your previous feedback below...\n\n${previousReviewText}`
                : "Enter feedback here..."
          }
          className="mt-6 min-h-36 w-full resize-y rounded-xl border border-eee bg-bg px-5 py-4 figma-b3 text-p1 outline-none placeholder:text-aaa focus:border-p2 focus:ring-2 focus:ring-p2/20"
        />

        <button
          type="submit"
          disabled={isSubmitting || isLoadingUserFeedback}
          className="mt-8 inline-flex w-fit cursor-pointer items-center justify-center rounded-xl bg-p2 px-8 py-2 figma-b3 font-semibold text-fff transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Submitting..."
            : isLoadingUserFeedback
              ? "Loading..."
              : "Submit"}
        </button>
      </form>
    </section>
  );
}