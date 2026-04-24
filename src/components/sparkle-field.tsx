"use client";

const SPARKLE_COUNT = 18;

export function SparkleField() {
  return (
    <div className="sparkle-field" aria-hidden="true">
      {Array.from({ length: SPARKLE_COUNT }).map((_, i) => (
        <span
          key={i}
          className="sparkle"
          style={{
            left: `${(i * 37 + 11) % 100}%`,
            animationDelay: `${(i * 1.3) % 8}s`,
            animationDuration: `${8 + (i % 5) * 2}s`,
          }}
        />
      ))}
    </div>
  );
}
