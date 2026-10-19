import { useEffect, useRef } from "react";

// Modelo de "vehículo dirigido": el cohete siempre vuela en la dirección hacia
// donde apunta (heading), con una velocidad de crucero y un radio de giro
// limitado (no puede rotar instantáneamente). Eso da vuelo en arcos suaves,
// como una nave real — no oscilaciones tipo resorte ni saltos directos.
const CHASE_MAX_SPEED = 460; // px/s en modo persecución
const IDLE_MAX_SPEED = 70; // px/s en modo flotando/patrullando
const MAX_ACCEL = 900; // px/s² — qué tan rápido acelera/frena
const MAX_TURN_RATE = 65; // deg/s — giro tipo avión: nunca vira brusco
const ARRIVE_RADIUS = 160; // empieza a frenar dentro de esta distancia al objetivo actual

const ARRIVED_RADIUS = 14; // al entrar en este radio del cursor, pasa a modo "flotando/patrullando"
const RESUME_RADIUS = 280; // en modo flotando, solo retoma la persecución si el cursor se aleja más que esto
const OFFSET_X = 52;
const OFFSET_Y = -40;
const MAX_DT = 0.05; // evita saltos si la pestaña estuvo inactiva

const WANDER_RADIUS = 150; // zona amplia para que las curvas sean largas y suaves
const WANDER_ARRIVE_RADIUS = 24;
const WANDER_CONE = 25; // grados: el próximo punto siempre queda dentro de este cono (angosto)
// hacia adelante respecto a la dirección actual, para que el vuelo en modo
// flotando sea siempre una curva amplia tipo avión, nunca un giro brusco.
const WANDER_STEP = 70; // qué tan lejos (px) coloca el próximo punto desde la posición actual

const FLAME_THRESHOLD = 0.15; // fracción de la velocidad de crucero a partir de la cual aparece el propulsor
const MAX_FLAME_THRESHOLD = 0.88; // a partir de aquí (solo persiguiendo) aparece la llama de máxima potencia

function shortestAngleDelta(from: number, to: number) {
  let delta = (to - from) % 360;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta;
}

function nextWanderTarget(
  currentX: number,
  currentY: number,
  currentHeading: number,
  anchorX: number,
  anchorY: number,
) {
  const toAnchorX = anchorX - currentX;
  const toAnchorY = anchorY - currentY;
  const distFromAnchor = Math.hypot(toAnchorX, toAnchorY);
  const anchorHeading = (Math.atan2(toAnchorY, toAnchorX) * 180) / Math.PI;

  // cuanto más cerca del borde del radio, más se sesga el cono de búsqueda
  // hacia el ancla — así nunca necesita un giro brusco para no salirse,
  // en vez de corregir la posición después (eso era lo que causaba el "tic")
  const pullWeight = Math.min(
    1,
    Math.max(0, (distFromAnchor - WANDER_RADIUS * 0.5) / (WANDER_RADIUS * 0.5)),
  );
  const blendedHeading =
    currentHeading +
    shortestAngleDelta(currentHeading, anchorHeading) * pullWeight;

  const angleDeg = blendedHeading + (Math.random() * 2 - 1) * WANDER_CONE;
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: currentX + Math.cos(angleRad) * WANDER_STEP,
    y: currentY + Math.sin(angleRad) * WANDER_STEP,
  };
}

export default function CursorRocket() {
  const rootRef = useRef<HTMLDivElement>(null);
  const flameRef = useRef<HTMLDivElement>(null);
  const maxFlameRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const flame = flameRef.current;
    const maxFlame = maxFlameRef.current;
    if (!root || !flame || !maxFlame) return;

    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarsePointer) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX + OFFSET_X;
    let y = targetY + OFFSET_Y;
    let heading = -90; // el SVG apunta "hacia arriba" en reposo (0deg === sin rotar)
    let speed = 0;

    const handlePointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
    };
    window.addEventListener("pointermove", handlePointerMove);

    if (prefersReducedMotion) {
      const snap = (event: PointerEvent) => {
        root.style.transform = `translate(${event.clientX + OFFSET_X}px, ${event.clientY + OFFSET_Y}px)`;
      };
      window.addEventListener("pointermove", snap);
      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointermove", snap);
      };
    }

    let raf: number;
    let lastTime: number | null = null;
    let isIdle = false;
    let idleAnchorCursorX = targetX;
    let idleAnchorCursorY = targetY;
    let wanderX = x;
    let wanderY = y;

    const tick = (time: number) => {
      const dt =
        lastTime === null ? 0 : Math.min((time - lastTime) / 1000, MAX_DT);
      lastTime = time;

      const cursorDesiredX = targetX + OFFSET_X;
      const cursorDesiredY = targetY + OFFSET_Y;
      const desiredX = isIdle ? wanderX : cursorDesiredX;
      const desiredY = isIdle ? wanderY : cursorDesiredY;

      const dx = desiredX - x;
      const dy = desiredY - y;
      const dist = Math.hypot(dx, dy);

      let speedFactor = 1;
      if (dist > 0.5) {
        const desiredHeading = (Math.atan2(dy, dx) * 180) / Math.PI;
        const angleDiff = shortestAngleDelta(heading, desiredHeading);
        const maxDelta = MAX_TURN_RATE * dt;
        heading += Math.max(-maxDelta, Math.min(maxDelta, angleDiff));
        // gira MIENTRAS avanza (banca en la curva, como un vehículo real) en
        // vez de frenar a cero y pivotar — nunca deja de moverse hacia adelante
        speedFactor = 0.55 + 0.45 * Math.cos((angleDiff * Math.PI) / 180);
      }

      const cruiseSpeed = isIdle ? IDLE_MAX_SPEED : CHASE_MAX_SPEED;
      const desiredSpeed =
        (dist < ARRIVE_RADIUS
          ? cruiseSpeed * (dist / ARRIVE_RADIUS)
          : cruiseSpeed) * speedFactor;
      const speedDelta = Math.max(
        -MAX_ACCEL * dt,
        Math.min(MAX_ACCEL * dt, desiredSpeed - speed),
      );
      speed = Math.max(0, speed + speedDelta);

      const rad = (heading * Math.PI) / 180;
      x += Math.cos(rad) * speed * dt;
      y += Math.sin(rad) * speed * dt;

      if (isIdle) {
        const rdx = targetX - idleAnchorCursorX;
        const rdy = targetY - idleAnchorCursorY;
        if (Math.hypot(rdx, rdy) > RESUME_RADIUS) {
          isIdle = false;
        } else {
          const wdx = wanderX - x;
          const wdy = wanderY - y;
          if (Math.hypot(wdx, wdy) < WANDER_ARRIVE_RADIUS) {
            const next = nextWanderTarget(
              x,
              y,
              heading,
              idleAnchorCursorX + OFFSET_X,
              idleAnchorCursorY + OFFSET_Y,
            );
            wanderX = next.x;
            wanderY = next.y;
          }
        }
      } else if (dist <= ARRIVED_RADIUS) {
        isIdle = true;
        idleAnchorCursorX = targetX;
        idleAnchorCursorY = targetY;
        const next = nextWanderTarget(
          x,
          y,
          heading,
          cursorDesiredX,
          cursorDesiredY,
        );
        wanderX = next.x;
        wanderY = next.y;
      }

      root.style.transform = `translate(${x}px, ${y}px) rotate(${heading + 90}deg)`;

      const speedRatio = Math.min(1, speed / cruiseSpeed);
      if (speedRatio > FLAME_THRESHOLD) {
        const t = (speedRatio - FLAME_THRESHOLD) / (1 - FLAME_THRESHOLD);
        const flicker =
          1 + Math.sin(time * 0.03) * 0.1 + Math.sin(time * 0.057) * 0.06;
        flame.style.opacity = String(Math.min(1, t * 1.2));
        flame.style.transform = `translate(-50%, -50%) scaleY(${(0.5 + t * 1.3) * flicker}) scaleX(${0.75 + t * 0.35})`;

        if (!isIdle && speedRatio > MAX_FLAME_THRESHOLD) {
          const mt =
            (speedRatio - MAX_FLAME_THRESHOLD) / (1 - MAX_FLAME_THRESHOLD);
          maxFlame.style.opacity = String(Math.min(1, mt * 1.3));
        } else {
          maxFlame.style.opacity = "0";
        }
      } else {
        flame.style.opacity = "0";
        flame.style.transform = "translate(-50%, -50%)";
        maxFlame.style.opacity = "0";
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-40"
      style={{ willChange: "transform" }}
    >
      <div
        ref={flameRef}
        className="absolute left-0 top-0 opacity-0"
        style={{
          transform: "translate(-50%, -50%)",
          transformOrigin: "13px 23px",
          willChange: "transform, opacity",
        }}
      >
        {/* mismo viewBox/tamaño que el cohete (24x24 en 26x26px) para compartir
        el mismo sistema de coordenadas; overflow visible deja dibujar la llama
        más abajo del límite del viewBox sin recortarla */}
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          style={{ overflow: "visible" }}
          className="text-accent"
        >
          {/* propulsor normal — separado del cohete (empieza en y=23, la cola del cohete termina ~y=21) */}
          <path
            d="M12 23c-1.9 2.3-2.5 4.7-1.5 6.8.5 1 1.5 1.7 1.5 1.7s1-.7 1.5-1.7c1-2.1.4-4.5-1.5-6.8Z"
            fill="currentColor"
            fillOpacity="0.45"
          />
          <path
            d="M12 23.8c-1.1 1.7-1.4 3.4-.7 4.8.3.6.7 1 .7 1s.4-.4.7-1c.7-1.4.4-3.1-.7-4.8Z"
            fill="#fff"
            fillOpacity="0.55"
          />

          {/* llama de máxima potencia — solo visible cerca de la velocidad máxima persiguiendo */}
          <g ref={maxFlameRef} opacity="0">
            <path
              d="M12 23c-2.6 3-3.3 6.3-2 9.2.6 1.3 2 2.3 2 2.3s1.4-1 2-2.3c1.3-2.9.6-6.2-2-9.2Z"
              fill="#ef4444"
              fillOpacity="0.7"
            />
            <path
              d="M12 24c-1.9 2.4-2.4 4.9-1.3 7.1.5 1.1 1.3 1.8 1.3 1.8s.8-.7 1.3-1.8c1.1-2.2.6-4.7-1.3-7.1Z"
              fill="#fb923c"
              fillOpacity="0.85"
            />
            <path
              d="M12 25.2c-1 1.6-1.3 3.3-.6 4.7.3.6.6 1.1.6 1.1s.3-.5.6-1.1c.7-1.4.4-3.1-.6-4.7Z"
              fill="#fde047"
              fillOpacity="0.95"
            />
          </g>
        </svg>
      </div>
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        className="-translate-x-1/2 -translate-y-1/2 text-accent drop-shadow-[0_0_6px_rgba(97,218,251,0.5)]"
      >
        <path
          d="M12 2c2.5 2 4 5.5 4 9 0 1.8-.4 3.4-1 4.7l-3-1.2-3 1.2c-.6-1.3-1-2.9-1-4.7 0-3.5 1.5-7 4-9Z"
          fill="currentColor"
          fillOpacity="0.9"
        />
        <circle cx="12" cy="9.5" r="1.6" fill="#09090b" />
        <path
          d="M8 14.5 5.5 17l1 2.8 2.7-2.3"
          fill="currentColor"
          fillOpacity="0.7"
        />
        <path
          d="M16 14.5 18.5 17l-1 2.8-2.7-2.3"
          fill="currentColor"
          fillOpacity="0.7"
        />
        <path d="M10.5 17.5 10 21l2-1.3 2 1.3-.5-3.5" fill="currentColor" />
      </svg>
    </div>
  );
}
