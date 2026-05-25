"use client";

type RatingStarsProps = {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  ariaLabel?: string;
};

const STAR_VALUES = [1, 2, 3, 4, 5];

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export default function RatingStars({
  value,
  onChange,
  readonly = false,
  size = "md",
  ariaLabel = "Course rating",
}: RatingStarsProps) {
  const normalizedValue = Math.max(0, Math.min(5, value));
  const isInteractive = !readonly && typeof onChange === "function";

  return (
    <div
      className="flex items-center gap-1"
      role={isInteractive ? "radiogroup" : "img"}
      aria-label={ariaLabel}
    >
      {STAR_VALUES.map((starValue) => {
        const isFilled = starValue <= normalizedValue;

        if (isInteractive) {
          return (
            <button
              key={starValue}
              type="button"
              role="radio"
              aria-checked={value === starValue}
              aria-label={`${starValue} out of 5 stars`}
              onClick={() => onChange(starValue)}
              className="cursor-pointer rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-p2 focus-visible:ring-offset-2"
            >
              <StarIcon className={sizeClasses[size]} filled={isFilled} />
            </button>
          );
        }

        return (
          <StarIcon
            key={starValue}
            className={sizeClasses[size]}
            filled={isFilled}
          />
        );
      })}
    </div>
  );
}

type StarIconProps = {
  filled: boolean;
  className?: string;
};

function StarIcon({ filled, className }: StarIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.3847 8.709C13.1938 8.894 13.1062 9.161 13.1496 9.424L13.8046 13.049C13.8599 13.356 13.7302 13.667 13.4731 13.844C13.2211 14.029 12.8859 14.051 12.611 13.904L9.3478 12.202C9.2343 12.141 9.1083 12.109 8.9794 12.105H8.7797C8.7105 12.115 8.6427 12.137 8.5808 12.171L5.3168 13.881C5.1554 13.962 4.9727 13.991 4.7937 13.962C4.3575 13.88 4.0665 13.464 4.1379 13.026L4.7937 9.401C4.8371 9.136 4.7495 8.867 4.5586 8.679L1.8981 6.101C1.6756 5.885 1.5982 5.561 1.6999 5.268C1.7986 4.976 2.0506 4.763 2.3549 4.715L6.0167 4.184C6.2953 4.156 6.5399 3.986 6.6651 3.736L8.2787 0.427C8.317 0.354 8.3664 0.286 8.4261 0.228L8.4924 0.177C8.527 0.139 8.5668 0.107 8.611 0.081L8.6913 0.052L8.8166 0H9.1267C9.4038 0.029 9.6477 0.195 9.7751 0.442L11.4101 3.736C11.528 3.976 11.7571 4.144 12.0216 4.184L15.6835 4.715C15.9929 4.759 16.2515 4.973 16.354 5.268C16.4505 5.563 16.3672 5.887 16.1403 6.101L13.3847 8.709Z"
        className={filled ? "fill-p2" : "fill-ddd"}
      />
    </svg>
  );
}