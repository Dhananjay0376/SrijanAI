const flakes = [
  { left: "4%", delay: "0s", duration: "15s", size: "sm" },
  { left: "10%", delay: "-5s", duration: "18s", size: "xs" },
  { left: "18%", delay: "-2s", duration: "17s", size: "md" },
  { left: "24%", delay: "-9s", duration: "20s", size: "sm" },
  { left: "31%", delay: "-4s", duration: "16s", size: "xs" },
  { left: "39%", delay: "-11s", duration: "21s", size: "lg" },
  { left: "46%", delay: "-7s", duration: "19s", size: "sm" },
  { left: "53%", delay: "-1s", duration: "15s", size: "md" },
  { left: "59%", delay: "-13s", duration: "22s", size: "xs" },
  { left: "66%", delay: "-6s", duration: "18s", size: "sm" },
  { left: "73%", delay: "-10s", duration: "20s", size: "md" },
  { left: "79%", delay: "-3s", duration: "17s", size: "xs" },
  { left: "86%", delay: "-14s", duration: "23s", size: "lg" },
  { left: "92%", delay: "-8s", duration: "19s", size: "sm" },
];

export function LandingSnowOverlay() {
  return (
    <div aria-hidden="true" className="landing-snow-overlay">
      {flakes.map((flake, index) => (
        <span
          className={`landing-snowflake landing-snowflake-${flake.size}`}
          key={`${flake.left}-${index}`}
          style={{
            left: flake.left,
            ["--landing-snow-delay" as string]: flake.delay,
            ["--landing-snow-duration" as string]: flake.duration,
          }}
        />
      ))}
    </div>
  );
}
