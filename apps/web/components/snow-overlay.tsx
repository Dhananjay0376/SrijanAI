"use client";

import { useEffect, useRef } from "react";

type Star = {
  alpha: number;
  alphaDirection: 1 | -1;
  radius: number;
  speedX: number;
  speedY: number;
  twinkleSpeed: number;
  x: number;
  y: number;
};

const STAR_DENSITY = 0.00016;
const MIN_STARS = 80;
const MAX_STARS = 220;

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function createStar(width: number, height: number): Star {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    radius: randomBetween(0.8, 2.8),
    speedX: randomBetween(-0.08, 0.08),
    speedY: randomBetween(-0.12, 0.12),
    alpha: randomBetween(0.2, 0.95),
    alphaDirection: Math.random() > 0.5 ? 1 : -1,
    twinkleSpeed: randomBetween(0.0025, 0.009),
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
      star.x = Math.random() * width;
      star.y = Math.random() * height;
      star.radius = randomBetween(0.8, 2.8);
      star.speedX = randomBetween(-0.08, 0.08);
      star.speedY = randomBetween(-0.12, 0.12);
      star.alpha = randomBetween(0.2, 0.95);
      star.alphaDirection = Math.random() > 0.5 ? 1 : -1;
      star.twinkleSpeed = randomBetween(0.0025, 0.009);
    }

    function drawBackground() {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#041817");
      gradient.addColorStop(0.42, "#093330");
      gradient.addColorStop(1, "#020b0b");

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const nebulaLeft = ctx.createRadialGradient(
        width * 0.18,
        height * 0.22,
        0,
        width * 0.18,
        height * 0.22,
        width * 0.28,
      );
      nebulaLeft.addColorStop(0, "rgba(2, 156, 193, 0.14)");
      nebulaLeft.addColorStop(1, "rgba(2, 156, 193, 0)");
      ctx.fillStyle = nebulaLeft;
      ctx.fillRect(0, 0, width, height);

      const nebulaRight = ctx.createRadialGradient(
        width * 0.82,
        height * 0.28,
        0,
        width * 0.82,
        height * 0.28,
        width * 0.24,
      );
      nebulaRight.addColorStop(0, "rgba(61, 102, 99, 0.22)");
      nebulaRight.addColorStop(1, "rgba(61, 102, 99, 0)");
      ctx.fillStyle = nebulaRight;
      ctx.fillRect(0, 0, width, height);

      const nebulaBottom = ctx.createRadialGradient(
        width * 0.5,
        height * 0.86,
        0,
        width * 0.5,
        height * 0.86,
        width * 0.32,
      );
      nebulaBottom.addColorStop(0, "rgba(2, 156, 193, 0.1)");
      nebulaBottom.addColorStop(1, "rgba(2, 156, 193, 0)");
      ctx.fillStyle = nebulaBottom;
      ctx.fillRect(0, 0, width, height);
    }

    function drawStar(star: Star) {
      star.x += star.speedX;
      star.y += star.speedY;
      star.alpha += star.twinkleSpeed * star.alphaDirection;

      if (star.alpha >= 1) {
        star.alpha = 1;
        star.alphaDirection = -1;
      } else if (star.alpha <= 0.14) {
        star.alpha = 0.14;
        star.alphaDirection = 1;
      }

      if (star.x < -8 || star.x > width + 8 || star.y < -8 || star.y > height + 8) {
        recycleStar(star);
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(230, 247, 255, ${star.alpha})`;
      ctx.shadowBlur = star.radius * 7;
      ctx.shadowColor = "rgba(124, 213, 238, 0.88)";
      ctx.fill();

      if (star.radius > 1.8) {
        ctx.beginPath();
        ctx.moveTo(star.x - star.radius * 2.2, star.y);
        ctx.lineTo(star.x + star.radius * 2.2, star.y);
        ctx.moveTo(star.x, star.y - star.radius * 2.2);
        ctx.lineTo(star.x, star.y + star.radius * 2.2);
        ctx.strokeStyle = `rgba(228, 246, 255, ${star.alpha * 0.35})`;
        ctx.lineWidth = 0.6;
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
