import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface AgentExchange {
  prompt: string;
  response: string[];
}

interface TerminalHeroProps {
  exchanges?: AgentExchange[];
}

const DEFAULT_EXCHANGES: AgentExchange[] = [
  {
    prompt: "¿quién eres?",
    response: [
      "abelitolll",
      "├─ rol: frontend developer",
      "├─ ubicación: Lima, Perú",
      "└─ stack: react · astro · typescript",
    ],
  },
  {
    prompt: "¿qué te gusta hacer?",
    response: [
      "cuidar el detalle visual",
      "escribir notas técnicas en el blog",
      "iterar hasta que se sienta bien",
    ],
  },
  {
    prompt: "¿en qué estás trabajando?",
    response: ["este portafolio, en construcción", "próximamente: proyectos reales"],
  },
];

const CHAR_INTERVAL_MS = 45;
const THINKING_MS = 1000;
const LINE_REVEAL_INTERVAL_MS = 320;
const PAUSE_AFTER_ANSWER_MS = 1500;
const PAUSE_AFTER_CYCLE_MS = 900;

type Phase = "typing-prompt" | "thinking" | "answering" | "pausing" | "cycle-done";

export default function TerminalHero({ exchanges = DEFAULT_EXCHANGES }: TerminalHeroProps) {
  const [exchangeIndex, setExchangeIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [responseLineCount, setResponseLineCount] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing-prompt");
  const [cycleCount, setCycleCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const current = exchanges[exchangeIndex];

  useEffect(() => {
    if (phase === "typing-prompt") {
      if (charIndex < current.prompt.length) {
        timerRef.current = setTimeout(() => setCharIndex((c) => c + 1), CHAR_INTERVAL_MS);
      } else {
        timerRef.current = setTimeout(() => setPhase("thinking"), 300);
      }
    } else if (phase === "thinking") {
      timerRef.current = setTimeout(() => setPhase("answering"), THINKING_MS);
    } else if (phase === "answering") {
      if (responseLineCount < current.response.length) {
        timerRef.current = setTimeout(
          () => setResponseLineCount((c) => c + 1),
          LINE_REVEAL_INTERVAL_MS,
        );
      } else {
        timerRef.current = setTimeout(() => setPhase("pausing"), PAUSE_AFTER_ANSWER_MS);
      }
    } else if (phase === "pausing") {
      if (exchangeIndex < exchanges.length - 1) {
        setExchangeIndex((i) => i + 1);
        setCharIndex(0);
        setResponseLineCount(0);
        setPhase("typing-prompt");
      } else {
        setPhase("cycle-done");
      }
    } else {
      setCycleCount((c) => c + 1);
      timerRef.current = setTimeout(() => {
        setExchangeIndex(0);
        setCharIndex(0);
        setResponseLineCount(0);
        setPhase("typing-prompt");
      }, PAUSE_AFTER_CYCLE_MS);
    }

    return () => clearTimeout(timerRef.current);
  }, [phase, charIndex, responseLineCount, exchangeIndex, current, exchanges]);

  const isTypingPrompt = phase === "typing-prompt";
  const isThinking = phase === "thinking";
  const typedPrompt = isTypingPrompt ? current.prompt.slice(0, charIndex) : current.prompt;
  const visibleResponse = current.response.slice(0, responseLineCount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full"
    >
      <div
        data-cycle-count={cycleCount}
        className="w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50"
      >
        <div className="flex items-center gap-1.5 border-b border-zinc-800 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-500/70" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
          <span className="h-3 w-3 rounded-full bg-green-500/70" />
        </div>
        <div className="h-60 space-y-2 overflow-hidden p-4 font-mono text-sm">
          <p>
            <span className="text-accent">&gt;</span>{" "}
            <span className="text-zinc-300">{typedPrompt}</span>
            {isTypingPrompt && (
              <span className="ml-0.5 inline-block w-[1ch] animate-pulse bg-zinc-300">
                &nbsp;
              </span>
            )}
          </p>
          {isThinking && (
            <p className="flex items-center gap-1 text-zinc-500">
              pensando
              <span className="inline-flex gap-0.5">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce [animation-delay:150ms]">.</span>
                <span className="animate-bounce [animation-delay:300ms]">.</span>
              </span>
            </p>
          )}
          {visibleResponse.map((line, index) => (
            <p key={index} className={index === 0 ? "text-zinc-200" : "text-zinc-500"}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
