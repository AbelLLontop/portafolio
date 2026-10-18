import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface WordmarkProps {
  size?: "sm" | "lg";
}

const WORD = "abelitolll";
const GLITCH_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*+=-_?/\\|~^".split(
    "",
  );

const GLITCH_DURATION_MS = 450;
const SCRAMBLE_INTERVAL_MS = 55;

// cada ciclo elige un umbral aleatorio (entre 2s y 4.5s) hasta que "llega" el glitch
const MIN_CYCLE_MS = 2000;
const MAX_CYCLE_MS = 4500;

// el gap entre parpadeos individuales se acorta mientras más cerca está el glitch
const FLICKER_MAX_GAP_MS = 750;
const FLICKER_MIN_GAP_MS = 70;
const FLICKER_PULSE_MS = 90;

function randomGlitchChar() {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export default function Wordmark({ size = "sm" }: WordmarkProps) {
  const lCount = WORD.split("").filter((letter) => letter === "l").length;
  const [letterOpacity, setLetterOpacity] = useState<number[]>(
    Array(WORD.length).fill(1),
  );
  const [glitching, setGlitching] = useState(false);
  const [scramble, setScramble] = useState<string[]>(Array(lCount).fill("l"));
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const scrambleIntervalRef = useRef<
    ReturnType<typeof setInterval> | undefined
  >(undefined);

  useEffect(() => {
    const schedule = (fn: () => void, delay: number) => {
      const id = setTimeout(() => {
        timersRef.current.delete(id);
        fn();
      }, delay);
      timersRef.current.add(id);
      return id;
    };

    const flickerRandomLetters = () => {
      const count = Math.random() < 0.7 ? 1 : 2;
      const indices = new Set<number>();
      while (indices.size < count) {
        indices.add(Math.floor(Math.random() * WORD.length));
      }

      setLetterOpacity((prev) => {
        const next = [...prev];
        indices.forEach((i) => (next[i] = randomBetween(0.15, 0.5)));
        return next;
      });

      schedule(() => {
        setLetterOpacity((prev) => {
          const next = [...prev];
          indices.forEach((i) => (next[i] = 1));
          return next;
        });
      }, FLICKER_PULSE_MS);
    };

    const triggerGlitch = (onDone: () => void) => {
      setLetterOpacity(Array(WORD.length).fill(1));
      setGlitching(true);
      scrambleIntervalRef.current = setInterval(() => {
        setScramble(Array.from({ length: lCount }, randomGlitchChar));
      }, SCRAMBLE_INTERVAL_MS);

      schedule(() => {
        clearInterval(scrambleIntervalRef.current);
        setScramble(Array(lCount).fill("l"));
        setGlitching(false);
        onDone();
      }, GLITCH_DURATION_MS);
    };

    const runCycle = () => {
      const threshold = randomBetween(MIN_CYCLE_MS, MAX_CYCLE_MS);
      let elapsed = 0;

      const step = () => {
        if (elapsed >= threshold) {
          triggerGlitch(runCycle);
          return;
        }

        const progress = elapsed / threshold;
        const baseGap =
          FLICKER_MAX_GAP_MS +
          (FLICKER_MIN_GAP_MS - FLICKER_MAX_GAP_MS) * progress;
        const gap = baseGap * randomBetween(0.6, 1.3);

        schedule(() => {
          elapsed += gap;
          flickerRandomLetters();
          step();
        }, gap);
      };

      step();
    };

    runCycle();

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current.clear();
      clearInterval(scrambleIntervalRef.current);
    };
  }, [lCount]);

  const sizeClasses =
    size === "lg"
      ? "text-5xl sm:text-6xl md:text-7xl font-extrabold"
      : "text-lg font-semibold";

  const shift = size === "lg" ? 8 : 2;
  const shake = size === "lg" ? 10 : 3;
  const subtleShift = shift * 0.3;
  const subtleShake = shake * 0.3;

  const glitchKeyframes = (shiftPx: number, shakePx: number) =>
    glitching
      ? {
          x: [0, -shakePx, shakePx, -shakePx * 0.6, shakePx * 0.6, 0],
          textShadow: [
            "0 0 0 rgba(0,0,0,0)",
            `-${shiftPx}px 0 0 #ff3b6b, ${shiftPx}px 0 0 #61dafb`,
            `${shiftPx}px 0 0 #ff3b6b, -${shiftPx}px 0 0 #61dafb`,
            `-${shiftPx}px 0 0 #ff3b6b, ${shiftPx}px 0 0 #61dafb`,
            `${shiftPx}px 0 0 #ff3b6b, -${shiftPx}px 0 0 #61dafb`,
            "0 0 0 rgba(0,0,0,0)",
          ],
        }
      : { x: 0, textShadow: "0 0 0 rgba(0,0,0,0)" };

  const glitchTransition = {
    opacity: { duration: 0.05 },
    x: { duration: GLITCH_DURATION_MS / 1000, ease: "easeInOut" },
    textShadow: { duration: GLITCH_DURATION_MS / 1000, ease: "easeInOut" },
  } as const;

  let lIndex = -1;

  return (
    <span className={`font-mono tracking-tight text-zinc-100 ${sizeClasses}`}>
      {WORD.split("").map((letter, index) => {
        if (letter !== "l") {
          return (
            <motion.span
              key={index}
              data-letter={letter}
              data-index={index}
              className="relative inline-block"
              animate={{
                opacity: letterOpacity[index],
                ...glitchKeyframes(subtleShift, subtleShake),
              }}
              transition={glitchTransition}
            >
              {letter}
            </motion.span>
          );
        }

        lIndex += 1;
        const displayChar = glitching ? scramble[lIndex] : letter;

        return (
          <motion.span
            key={index}
            data-letter={letter}
            data-index={index}
            className="relative inline-block w-[1ch] text-center text-accent"
            animate={{
              opacity: letterOpacity[index],
              ...glitchKeyframes(shift, shake),
            }}
            transition={glitchTransition}
          >
            {displayChar}
          </motion.span>
        );
      })}
    </span>
  );
}
