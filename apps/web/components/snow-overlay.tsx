"use client";

import { useEffect, useRef } from "react";

type Star = {
  alpha: number;
  alphaDirection: 1 | -1;
  depth: number;
  radius: number;
  twinkleSpeed: number;
  vx: number;
  vy: number;
  x: number;
  y: number;
};

const STAR_DENSITY = 0.00024;
const MIN_STARS = 140;
const MAX_STARS = 360;

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function createStar(width: number, height: number): Star {
  const depth = Math.random();

  return {
    x: Math.random() * width,
    y: Math.random() * height,
    depth,
    radius: randomBetween(1.1, 1.9 + depth * 4.2),
    vx: randomBetween(-0.26, 0.26) * (0.55 + depth),
    vy: randomBetween(-0.22, 0.24) * (0.55 + depth),
    alpha: randomBetween(0.2, 0.95),
    alphaDirection: Math.random() > 0.5 ? 1 : -1,
    twinkleSpeed: randomBetween(0.002, 0.0095),
  };
}

export function SnowOverlay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const canvasEl: HTMLCanvasElement = canvas;
    const ctx: CanvasRenderingContext2D = context;

    let animationFrame = 0;
    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;

    function getStarCount() {
      const count = Math.floor(width * height * STAR_DENSITY);
      return Math.min(MAX_STARS, Math.max(MIN_STARS, count));
    }

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;

      canvasEl.width = Math.floor(width * dpr);
      canvasEl.height = Math.floor(height * dpr);
      canvasEl.style.width = `${width}px`;
      canvasEl.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      stars = Array.from({ length: getStarCount() }, () => createStar(width, height));
    }

    function recycleStar(star: Star) {
      const recycled = createStar(width, height);
      star.depth = recycled.depth;
      star.radius = recycled.radius;
      star.vx = recycled.vx;
      star.vy = recycled.vy;
      star.alpha = recycled.alpha;
      star.alphaDirection = recycled.alphaDirection;
      star.twinkleSpeed = recycled.twinkleSpeed;
      star.x = randomBetween(-20, width + 20);
      star.y = randomBetween(-20, height + 20);
    }

    function drawBackground() {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#020807");
      gradient.addColorStop(0.38, "#051816");
      gradient.addColorStop(0.68, "#093330");
      gradient.addColorStop(1, "#010505");

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const nebulaLeft = ctx.createRadialGradient(
        width * 0.16,
        height * 0.22,
        0,
        width * 0.16,
        height * 0.22,
        width * 0.34,
      );
      nebulaLeft.addColorStop(0, "rgba(2, 156, 193, 0.18)");
      nebulaLeft.addColorStop(0.45, "rgba(2, 156, 193, 0.08)");
      nebulaLeft.addColorStop(1, "rgba(2, 156, 193, 0)");
      ctx.fillStyle = nebulaLeft;
      ctx.fillRect(0, 0, width, height);

      const nebulaRight = ctx.createRadialGradient(
        width * 0.82,
        height * 0.2,
        0,
        width * 0.82,
        height * 0.2,
        width * 0.28,
      );
      nebulaRight.addColorStop(0, "rgba(61, 102, 99, 0.26)");
      nebulaRight.addColorStop(0.48, "rgba(61, 102, 99, 0.12)");
      nebulaRight.addColorStop(1, "rgba(61, 102, 99, 0)");
      ctx.fillStyle = nebulaRight;
      ctx.fillRect(0, 0, width, height);

      const nebulaBottom = ctx.createRadialGradient(
        width * 0.52,
        height * 0.86,
        0,
        width * 0.52,
        height * 0.86,
        width * 0.36,
      );
      nebulaBottom.addColorStop(0, "rgba(2, 156, 193, 0.12)");
      nebulaBottom.addColorStop(0.5, "rgba(2, 156, 193, 0.05)");
      nebulaBottom.addColorStop(1, "rgba(2, 156, 193, 0)");
      ctx.fillStyle = nebulaBottom;
      ctx.fillRect(0, 0, width, height);
    }

    function drawStar(star: Star) {
      star.x += star.vx;
      star.y += star.vy;
      star.alpha += star.twinkleSpeed * star.alphaDirection;

      if (star.alpha >= 1) {
        star.alpha = 1;
        star.alphaDirection = -1;
      } else if (star.alpha <= 0.12) {
        star.alpha = 0.12;
        star.alphaDirection = 1;
      }

      if (star.x < -40 || star.x > width + 40 || star.y < -40 || star.y > height + 40) {
        recycleStar(star);
      }

      const glow = 8 + star.depth * 14;
      const fillAlpha = star.alpha * (0.65 + star.depth * 0.35);

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(236, 248, 255, ${fillAlpha})`;
      ctx.shadowBlur = glow;
      ctx.shadowColor = star.depth > 0.66
        ? "rgba(160, 232, 255, 0.96)"
        : "rgba(122, 196, 214, 0.86)";
      ctx.fill();

      if (star.depth > 0.78) {
        ctx.beginPath();
        ctx.moveTo(star.x - star.radius * 3.1, star.y);
        ctx.lineTo(star.x + star.radius * 3.1, star.y);
        ctx.moveTo(star.x, star.y - star.radius * 3.1);
        ctx.lineTo(star.x, star.y + star.radius * 3.1);
        ctx.strokeStyle = `rgba(236, 248, 255, ${fillAlpha * 0.34})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
    }

    function render() {
      drawBackground();
      stars.forEach(drawStar);
      ctx.shadowBlur = 0;
      animationFrame = window.requestAnimationFrame(render);
    }

    resizeCanvas();
    render();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return <canvas aria-hidden="true" className="snow-overlay-canvas" ref={canvasRef} />;
}
