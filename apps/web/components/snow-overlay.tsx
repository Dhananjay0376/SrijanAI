"use client";

import { useEffect, useRef } from "react";

type Particle = {
  alpha: number;
  alphaDirection: 1 | -1;
  radius: number;
  speedX: number;
  speedY: number;
  twinkleSpeed: number;
  x: number;
  y: number;
};

const PARTICLE_DENSITY = 0.000085;
const MIN_PARTICLES = 36;
const MAX_PARTICLES = 120;

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function createParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    radius: randomBetween(1, 4),
    speedX: randomBetween(-0.18, 0.18),
    speedY: randomBetween(-0.42, -0.08),
    alpha: randomBetween(0.15, 0.9),
    alphaDirection: Math.random() > 0.5 ? 1 : -1,
    twinkleSpeed: randomBetween(0.004, 0.012),
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

    const snowCanvas = canvas;
    const snowContext = context;
    let animationFrame = 0;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;

    function getParticleCount() {
      const count = Math.floor(width * height * PARTICLE_DENSITY);
      return Math.min(MAX_PARTICLES, Math.max(MIN_PARTICLES, count));
    }

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;

      snowCanvas.width = Math.floor(width * dpr);
      snowCanvas.height = Math.floor(height * dpr);
      snowCanvas.style.width = `${width}px`;
      snowCanvas.style.height = `${height}px`;

      snowContext.setTransform(1, 0, 0, 1, 0, 0);
      snowContext.scale(dpr, dpr);

      particles = Array.from({ length: getParticleCount() }, () =>
        createParticle(width, height),
      );
    }

    function recycleParticle(particle: Particle) {
      particle.x = Math.random() * width;
      particle.y = height + randomBetween(8, 48);
      particle.radius = randomBetween(1, 4);
      particle.speedX = randomBetween(-0.18, 0.18);
      particle.speedY = randomBetween(-0.42, -0.08);
      particle.alpha = randomBetween(0.15, 0.9);
      particle.alphaDirection = Math.random() > 0.5 ? 1 : -1;
      particle.twinkleSpeed = randomBetween(0.004, 0.012);
    }

    function drawParticle(particle: Particle) {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.alpha += particle.twinkleSpeed * particle.alphaDirection;

      if (particle.alpha >= 0.95) {
        particle.alpha = 0.95;
        particle.alphaDirection = -1;
      } else if (particle.alpha <= 0.08) {
        particle.alpha = 0.08;
        particle.alphaDirection = 1;
      }

      if (
        particle.y + particle.radius < -12 ||
        particle.x + particle.radius < -12 ||
        particle.x - particle.radius > width + 12
      ) {
        recycleParticle(particle);
      }

      snowContext.beginPath();
      snowContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      snowContext.fillStyle = `rgba(215, 245, 255, ${particle.alpha})`;
      snowContext.shadowBlur = particle.radius * 6;
      snowContext.shadowColor = "rgba(125, 205, 255, 0.9)";
      snowContext.fill();
    }

    function render() {
      const gradient = snowContext.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#03192f");
      gradient.addColorStop(0.55, "#08294a");
      gradient.addColorStop(1, "#04111f");

      snowContext.clearRect(0, 0, width, height);
      snowContext.fillStyle = gradient;
      snowContext.fillRect(0, 0, width, height);

      particles.forEach(drawParticle);
      snowContext.shadowBlur = 0;

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
