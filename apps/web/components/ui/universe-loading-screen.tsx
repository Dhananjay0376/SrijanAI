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
      <div className="universe-loading-orb" aria-hidden="true">
        <span className="universe-loading-ring universe-loading-ring-one" />
        <span className="universe-loading-ring universe-loading-ring-two" />
        <span className="universe-loading-core" />
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
