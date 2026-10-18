import { useEffect, useRef } from "react";

// Campo de estrellas con profundidad: cada estrella lleva un `z` que escala su
// radio, su brillo y cuánto se desplaza con el puntero y con el scroll. Eso es
// lo que separa un fondo que reacciona de un fondo que solo deriva.
const DENSITY_DIVISOR = 5200; // 1 estrella por cada ~5200px² de viewport
const MAX_STARS = 500;
const ACCENT_RATIO = 0.14;

const POINTER_SHIFT_X = 26;
const POINTER_SHIFT_Y = 18;
const SCROLL_SHIFT = 0.45;

// El warp convierte el scroll rápido en aceleración: por encima del umbral las
// estrellas se dibujan como trazos verticales en vez de puntos.
const WARP_SCROLL_DELTA = 26; // px de scroll por frame que equivalen a warp = 1
const WARP_EASING = 0.12;
const WARP_THRESHOLD = 0.4;
const WARP_LENGTH = 22;

const SHOOTING_STAR_CHANCE = 0.0035;
const SHOOTING_STAR_LENGTH = 90;
const SHOOTING_STAR_LIFE = 220;

interface Star {
  x: number;
  y: number;
  z: number;
  r: number;
  twinkle: number;
  accent: boolean;
}

interface ShootingStar {
  x: number;
  y: number;
  life: number;
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const accentColor =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-accent")
        .trim() || "#61dafb";

    let width = window.innerWidth;
    let height = window.innerHeight;
    let stars: Star[] = [];

    // El campo mide 2x el alto del viewport y se envuelve con módulo, así nunca
    // se agota por más que el paralaje de scroll lo arrastre.
    const makeStars = (): Star[] => {
      const count = Math.min(
        MAX_STARS,
        Math.round((width * height) / DENSITY_DIVISOR),
      );
      return Array.from({ length: count }, () => {
        const z = 0.25 + Math.random() * 0.75;
        return {
          x: Math.random() * width,
          y: Math.random() * height * 2,
          z,
          r: 0.3 + z * 1.5,
          twinkle: Math.random() * Math.PI * 2,
          accent: Math.random() < ACCENT_RATIO,
        };
      });
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = makeStars();
    };

    resize();

    let pointerX = 0.5;
    let pointerY = 0.5;
    let warp = 0;
    let lastScroll = window.scrollY;
    let shootingStar: ShootingStar | null = null;

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      const scrollY = window.scrollY;
      const parallaxX = (pointerX - 0.5) * POINTER_SHIFT_X;
      const parallaxY = (pointerY - 0.5) * POINTER_SHIFT_Y;
      const field = height * 2;

      for (const star of stars) {
        const shifted =
          (star.y - scrollY * star.z * SCROLL_SHIFT - parallaxY * star.z) %
          field;
        const y = shifted < 0 ? shifted + field : shifted;
        if (y > height + 4) continue;

        const x = star.x + parallaxX * star.z;
        const twinkle = prefersReducedMotion
          ? 0.8
          : 0.35 + 0.65 * Math.abs(Math.sin(time * 0.0007 + star.twinkle));

        ctx.globalAlpha = twinkle * (0.35 + star.z * 0.65);
        ctx.fillStyle = star.accent ? accentColor : "#ffffff";

        if (warp > WARP_THRESHOLD) {
          ctx.fillRect(x, y, star.r, star.r + warp * star.z * WARP_LENGTH);
        } else {
          ctx.beginPath();
          ctx.arc(x, y, star.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      if (prefersReducedMotion) return;

      if (!shootingStar && Math.random() < SHOOTING_STAR_CHANCE) {
        shootingStar = {
          x: Math.random() * width,
          y: Math.random() * height * 0.5,
          life: 0,
        };
      }
      if (shootingStar) {
        shootingStar.life += 11;
        shootingStar.x += 9;
        shootingStar.y += 4.5;
        const tail = ctx.createLinearGradient(
          shootingStar.x,
          shootingStar.y,
          shootingStar.x - SHOOTING_STAR_LENGTH,
          shootingStar.y - SHOOTING_STAR_LENGTH / 2,
        );
        tail.addColorStop(0, "rgba(232,238,246,0.9)");
        tail.addColorStop(1, "rgba(232,238,246,0)");
        ctx.strokeStyle = tail;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(
          shootingStar.x - SHOOTING_STAR_LENGTH,
          shootingStar.y - SHOOTING_STAR_LENGTH / 2,
        );
        ctx.stroke();
        if (shootingStar.life > SHOOTING_STAR_LIFE) shootingStar = null;
      }
    };

    if (prefersReducedMotion) {
      draw(0);
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX / window.innerWidth;
      pointerY = event.clientY / window.innerHeight;
    };

    let raf: number;
    let running = true;

    const tick = (time: number) => {
      if (!running) return;
      const scrollY = window.scrollY;
      const target = Math.min(
        1,
        Math.abs(scrollY - lastScroll) / WARP_SCROLL_DELTA,
      );
      warp += (target - warp) * WARP_EASING;
      lastScroll = scrollY;
      draw(time);
      raf = requestAnimationFrame(tick);
    };

    const handleVisibility = () => {
      running = document.visibilityState === "visible";
      if (running) {
        lastScroll = window.scrollY;
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
