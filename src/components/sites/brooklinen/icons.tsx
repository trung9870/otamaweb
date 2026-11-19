import type { SVGProps } from "react";

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10.2 10.2L14.2 14.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function AccountIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="20"
      viewBox="0 0 16 18"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <circle
        cx="8"
        cy="5.5"
        r="4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M14.5 17C14.5 14.12 11.5899 11 8 11C4.41015 11 1.5 13.6863 1.5 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function BagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="20"
      viewBox="0 0 14 18"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M1.69452 17.25L0.809908 5.75H13.1901L12.3055 17.25H1.69452Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M10 8V4C10 2.34315 8.65685 1 7 1C5.34315 1 4 2.34315 4 4V8"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function HamburgerTwoBarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="22"
      height="16"
      viewBox="0 0 22 16"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M1 4.5H21M1 11.5H21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ChevronLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M10.5 3L5.5 8L10.5 13"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M5.5 3L10.5 8L5.5 13"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M9.8 1.5L10.7 5.2L14.5 6.1L10.7 7L9.8 10.7L8.9 7L5.1 6.1L8.9 5.2L9.8 1.5Z"
        fill="currentColor"
      />
      <path
        d="M4.2 8.8L4.7 11L6.9 11.5L4.7 12L4.2 14.2L3.7 12L1.5 11.5L3.7 11L4.2 8.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function StarRating({
  rating = 4.8,
  size = 14,
}: {
  rating?: number;
  size?: number;
}) {
  return (
    <span
      className="inline-flex items-center gap-[2px]"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = rating >= n ? 1 : rating >= n - 0.5 ? 0.6 : 0;
        return (
          <svg
            key={n}
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M8 1.3L9.95 5.25L14.3 5.88L11.15 8.95L11.89 13.28L8 11.23L4.11 13.28L4.85 8.95L1.7 5.88L6.05 5.25L8 1.3Z"
              fill={filled === 1 ? "#E2A46C" : "#E5DCD3"}
            />
            {filled > 0 && filled < 1 && (
              <path
                d="M8 1.3L9.95 5.25L10.2 5.29V12.39L8 11.23L4.11 13.28L4.85 8.95L1.7 5.88L6.05 5.25L8 1.3Z"
                fill="#E2A46C"
              />
            )}
          </svg>
        );
      })}
    </span>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10.5 10H8.5V12.5H10.5V20H13.5V12.5H15.8L16.1 10H13.5V8.7C13.5 8 13.8 7.6 14.7 7.6H16.2V5H14C11.7 5 10.5 6.2 10.5 8.4V10Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function XSocialIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M17.6 4.5H20.1L14.6 10.8L21 19.5H16L12 14.3L7.5 19.5H5L10.9 12.7L4.7 4.5H9.8L13.4 9.2L17.6 4.5ZM16.7 18H18.1L9.1 5.9H7.6L16.7 18Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PinterestIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3C7.03 3 3 7.03 3 12C3 15.81 5.37 19.07 8.71 20.38C8.63 19.67 8.56 18.58 8.74 17.81C8.9 17.11 9.81 13.26 9.81 13.26C9.81 13.26 9.54 12.71 9.54 11.9C9.54 10.63 10.28 9.68 11.2 9.68C11.98 9.68 12.36 10.27 12.36 10.97C12.36 11.76 11.86 12.93 11.6 14.02C11.38 14.93 12.06 15.67 12.95 15.67C14.58 15.67 15.83 13.95 15.83 11.48C15.83 9.29 14.26 7.76 12.02 7.76C9.42 7.76 7.89 9.71 7.89 11.73C7.89 12.52 8.19 13.36 8.57 13.82C8.64 13.91 8.66 13.99 8.63 14.09C8.56 14.37 8.41 14.98 8.38 15.1C8.34 15.26 8.25 15.3 8.08 15.22C6.96 14.7 6.26 13.06 6.26 11.74C6.26 8.9 8.32 6.29 12.21 6.29C15.34 6.29 17.77 8.52 17.77 11.5C17.77 14.61 15.81 17.12 13.09 17.12C12.18 17.12 11.32 16.64 11.02 16.08C11.02 16.08 10.57 17.8 10.46 18.22C10.26 19 9.71 19.98 9.34 20.58C10.18 20.85 11.07 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="4.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.8" cy="7.2" r="1.1" fill="currentColor" />
    </svg>
  );
}
