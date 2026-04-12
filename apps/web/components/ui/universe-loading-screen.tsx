"use client";

import { useEffect, useState } from "react";

const loadingLines = [
  "Aligning constellations for your creator workflow.",
  "Warming up captions, calendars, and cosmic ideas.",
  "Mapping your content universe one orbit at a time.",
  "Tuning the signals between strategy and storytelling.",
  "Opening the next portal inside SrijanAI.",
];

export function UniverseLoadingScreen() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % loadingLines.length);
    }, 1600);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <main className="universe-loading-shell" aria-live="polite">
      <div className="universe-loading-scene" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, starIndex) => (
          <span
            key={`falling-${starIndex}`}
            className={`universe-falling-star universe-falling-star-${(starIndex % 7) + 1}`}
          />
        ))}
        {Array.from({ length: 10 }).map((_, sparkIndex) => (
          <span
            key={`spark-${sparkIndex}`}
            className={`universe-static-star universe-static-star-${(sparkIndex % 5) + 1}`}
          />
        ))}
        <div className="universe-loading-orb">
          <span className="universe-loading-ring universe-loading-ring-one" />
          <span className="universe-loading-ring universe-loading-ring-two" />
          <span className="universe-loading-ring universe-loading-ring-three" />
          <span className="universe-loading-core" />
          <span className="universe-orbit-dot universe-orbit-dot-one" />
          <span className="universe-orbit-dot universe-orbit-dot-two" />
          <span className="universe-orbit-dot universe-orbit-dot-three" />
        </div>
      </div>

      <div className="universe-loading-copy">
        <p className="section-label">SrijanAI</p>
        <h1>Entering the Universe of Srijan</h1>
        <p className="universe-loading-line" key={index}>
          {loadingLines[index]}
        </p>
      </div>
    </main>
  );
}
