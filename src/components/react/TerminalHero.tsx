import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface TerminalLine {
  command: string;
  output: string[];
}

interface TerminalHeroProps {
  lines?: TerminalLine[];
}

const DEFAULT_LINES: TerminalLine[] = [
  { command: "whoami", output: ["abelitolll — frontend developer"] },
  { command: "cat about.md", output: ["Bachiller en Ingeniería de Sistemas · Lima, Perú"] },
  { command: "ls interests/", output: ["react  astro  typescript  ui-details"] },
  { command: "echo $STATUS", output: ["building things, writing notes along the way"] },
];

const CHAR_INTERVAL_MS = 45;
const PAUSE_AFTER_OUTPUT_MS = 1300;
const PAUSE_AFTER_CYCLE_MS = 800;

type Phase = "typing" | "pausing-after-output" | "cycle-done";

export default function TerminalHero({ lines = DEFAULT_LINES }: TerminalHeroProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [cycleCount, setCycleCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const currentLine = lines[lineIndex];

  useEffect(() => {
    if (phase === "typing") {
      if (charIndex < currentLine.command.length) {
        timerRef.current = setTimeout(() => setCharIndex((c) => c + 1), CHAR_INTERVAL_MS);
      } else {
        setPhase("pausing-after-output");
      }
    } else if (phase === "pausing-after-output") {
      timerRef.current = setTimeout(() => {
        if (lineIndex < lines.length - 1) {
          setLineIndex((i) => i + 1);
          setCharIndex(0);
          setPhase("typing");
        } else {
          setPhase("cycle-done");
        }
      }, PAUSE_AFTER_OUTPUT_MS);
    } else {
      setCycleCount((c) => c + 1);
      timerRef.current = setTimeout(() => {
        setLineIndex(0);
        setCharIndex(0);
        setPhase("typing");
      }, PAUSE_AFTER_CYCLE_MS);
    }

    return () => clearTimeout(timerRef.current);
  }, [phase, charIndex, lineIndex, currentLine, lines]);

  const visibleLines = lines.slice(0, lineIndex + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      data-cycle-count={cycleCount}
      className="w-full max-w-md overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50"
    >
      <div className="flex items-center gap-1.5 border-b border-zinc-800 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-500/70" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
        <span className="h-3 w-3 rounded-full bg-green-500/70" />
      </div>
      <div className="h-56 space-y-2 overflow-hidden p-4 font-mono text-sm">
        {visibleLines.map((line, index) => {
          const isCurrent = index === lineIndex;
          const isTyping = isCurrent && phase === "typing";
          const typedCommand = isTyping ? line.command.slice(0, charIndex) : line.command;
          const showOutput = !isTyping;

          return (
            <div key={index}>
              <p>
                <span className="text-accent">$</span>{" "}
                <span className="text-zinc-300">{typedCommand}</span>
                {isTyping && (
                  <span className="ml-0.5 inline-block w-[1ch] animate-pulse bg-zinc-300">
                    &nbsp;
                  </span>
                )}
              </p>
              {showOutput &&
                line.output.map((outputLine, outputIndex) => (
                  <p key={outputIndex} className="text-zinc-400">
                    {outputLine}
                  </p>
                ))}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
