import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

/** Un valor de fila puede ser texto suelto o un destino al que se puede ir. */
export type RowValue = string | { text: string; href: string; external?: boolean };

/** Una nota del blog, tal como la muestra el listado: numero, titulo y resumen. */
export interface PostEntry {
  number: number;
  title: string;
  summary?: string;
  date: string;
  href: string;
}

/** Un canal de contacto, con su logo de marca. */
export interface Channel {
  label: string;
  display: string;
  href: string;
  external: boolean;
  /** SVG inline, construido en build desde simple-icons. */
  icon: string;
}

export type Block =
  | { kind: "prose"; text: string }
  | { kind: "rows"; rows: [string, RowValue][] }
  | { kind: "entries"; entries: PostEntry[] }
  | { kind: "channels"; channels: Channel[] }
  | { kind: "note"; text: string; tone: "ok" | "warn" | "system" };

export interface Exchange {
  prompt: string;
  blocks: Block[];
}

interface TerminalHeroProps {
  exchanges?: Exchange[];
  /** Respuestas de los comandos; las arma la página desde sus propios datos. */
  commands?: Record<string, Block[]>;
}

interface Job extends Exchange {
  /** El diálogo de apertura se escribe solo; lo que teclea el visitante ya está escrito. */
  typePrompt: boolean;
  thinkingMs: number;
  pauseMs: number;
  endsIntro?: boolean;
}

const DEFAULT_EXCHANGES: Exchange[] = [
  {
    prompt: "¿quién eres?",
    blocks: [
      {
        kind: "prose",
        text: "Soy Abel Llontop, desarrollador de software peruano. Me dedico a construir sistemas, aprender y divertirme en el camino.",
      },
      { kind: "rows", rows: [["stack", "node · go · python · react · aws"]] },
    ],
  },
];

const DEFAULT_COMMANDS: Record<string, Block[]> = {
  whoami: [{ kind: "prose", text: "Soy Abel — desarrollador de software peruano, 3 años." }],
};

const PROMPT_CHAR_MS = 45;
const PROSE_CHAR_MS = 9;
const ROW_MS = 90;
const ENTRY_MS = 140;
const BLOCK_GAP_MS = 220;
const THINKING_INTRO_MS = 700;
const THINKING_COMMAND_MS = 450;
const PAUSE_INTRO_MS = 700;
const PAUSE_COMMAND_MS = 200;

type Phase = "idle" | "typing-prompt" | "thinking" | "streaming" | "pausing";

interface Progress {
  block: number;
  char: number;
  rows: number;
}

const START: Progress = { block: 0, char: 0, rows: 0 };

const NOTE_COLOR: Record<"ok" | "warn" | "system", string> = {
  ok: "var(--go)",
  warn: "#f0a868",
  system: "var(--faint)",
};

/** Recorta los bloques a lo que ya se "escribió" según el progreso actual. */
function visibleBlocks(blocks: Block[], progress: Progress): Block[] {
  return blocks.slice(0, progress.block + 1).map((block, index) => {
    if (index < progress.block) return block;
    if (block.kind === "prose") return { ...block, text: block.text.slice(0, progress.char) };
    if (block.kind === "rows") return { ...block, rows: block.rows.slice(0, progress.rows) };
    if (block.kind === "entries") {
      return { ...block, entries: block.entries.slice(0, progress.rows) };
    }
    if (block.kind === "channels") {
      return { ...block, channels: block.channels.slice(0, progress.rows) };
    }
    return block;
  });
}

function RowValueView({ value }: { value: RowValue }) {
  if (typeof value === "string") {
    return <span className="break-words text-zinc-200">{value}</span>;
  }

  return (
    <a
      href={value.href}
      target={value.external ? "_blank" : undefined}
      rel={value.external ? "noreferrer" : undefined}
      className="break-words text-zinc-100 underline decoration-[color-mix(in_srgb,var(--color-accent)_60%,transparent)] underline-offset-4 transition-colors hover:text-accent"
    >
      {value.text}
    </a>
  );
}

function AnswerBlocks({ blocks, caret }: { blocks: Block[]; caret: boolean }) {
  return (
    <div
      className="my-2 flex flex-col gap-2.5 pl-4"
      style={{ borderLeft: "2px solid color-mix(in srgb, var(--color-accent) 45%, transparent)" }}
    >
      {blocks.map((block, index) => {
        const isLast = index === blocks.length - 1;

        if (block.kind === "prose") {
          return (
            <p key={index} className="max-w-[62ch] text-zinc-300">
              {block.text}
              {caret && isLast && <span className="ml-0.5 animate-pulse text-accent">▌</span>}
            </p>
          );
        }

        if (block.kind === "rows") {
          return (
            <div key={index} className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-1">
              {block.rows.map(([key, value]) => (
                <div key={key} className="contents">
                  <span className="text-accent">{key}</span>
                  <RowValueView value={value} />
                </div>
              ))}
            </div>
          );
        }

        if (block.kind === "channels") {
          return (
            <div key={index} className="grid gap-2 sm:grid-cols-3">
              {block.channels.map((channel) => (
                <a
                  key={channel.href}
                  href={channel.href}
                  target={channel.external ? "_blank" : undefined}
                  rel={channel.external ? "noreferrer" : undefined}
                  className="group flex items-center gap-3 rounded-lg border p-3 transition-colors hover:border-accent"
                  style={{ borderColor: "var(--line)", background: "rgb(255 255 255 / 0.02)" }}
                >
                  <span
                    className="shrink-0 text-zinc-400 transition-colors group-hover:text-accent [&>svg]:h-5 [&>svg]:w-5"
                    dangerouslySetInnerHTML={{ __html: channel.icon }}
                  />
                  <span className="min-w-0">
                    <span className="block text-zinc-100 transition-colors group-hover:text-accent">
                      {channel.label}
                    </span>
                    <span
                      className="block truncate text-[0.7rem]"
                      style={{ color: "var(--faint)" }}
                      title={channel.display}
                    >
                      {channel.display}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          );
        }

        if (block.kind === "entries") {
          return (
            <div key={index} className="flex flex-col">
              {block.entries.map((entry) => (
                <a
                  key={entry.href}
                  href={entry.href}
                  className="group -ml-2 grid grid-cols-[3.1rem_1fr] gap-x-2 rounded-md border-l-2 border-transparent py-2 pl-2 transition-all hover:border-accent hover:bg-[color-mix(in_srgb,var(--color-accent)_6%,transparent)] hover:pl-3"
                >
                  <span className="pt-px transition-colors group-hover:text-accent" style={{ color: "var(--faint)" }}>
                    #{entry.number}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-zinc-100 transition-colors group-hover:text-accent">
                      {entry.title}
                    </span>
                    {entry.summary && (
                      <span
                        className="mt-1 block line-clamp-2 text-[0.78rem] leading-[1.6]"
                        style={{ color: "var(--dim)" }}
                      >
                        {entry.summary}
                      </span>
                    )}
                    <span className="mt-1 block text-[0.7rem]" style={{ color: "var(--faint)" }}>
                      {entry.date}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          );
        }

        return (
          <p key={index} className="max-w-[62ch]" style={{ color: NOTE_COLOR[block.tone] }}>
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

export default function TerminalHero({
  exchanges = DEFAULT_EXCHANGES,
  commands = DEFAULT_COMMANDS,
}: TerminalHeroProps) {
  const [history, setHistory] = useState<Exchange[]>([]);
  const [queue, setQueue] = useState<Job[]>([]);
  const [active, setActive] = useState<Job | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [promptChars, setPromptChars] = useState(0);
  const [progress, setProgress] = useState<Progress>(START);
  const [cycleCount, setCycleCount] = useState(0);
  const [input, setInput] = useState("");
  const [usedConsole, setUsedConsole] = useState(false);
  const [ready, setReady] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const busy = phase !== "idle" || queue.length > 0 || !ready;

  // El diálogo de apertura no es un caso especial: son dos trabajos encolados.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setHistory(exchanges);
      setCycleCount(1);
      setReady(true);
      return;
    }

    setQueue(
      exchanges.map((exchange, index) => ({
        ...exchange,
        typePrompt: true,
        thinkingMs: THINKING_INTRO_MS,
        pauseMs: PAUSE_INTRO_MS,
        endsIntro: index === exchanges.length - 1,
      })),
    );
    setReady(true);
  }, [exchanges]);

  useEffect(() => {
    if (busy || !usedConsole) return;
    inputRef.current?.focus({ preventScroll: true });
  }, [busy, usedConsole]);

  // El cuerpo tiene scroll propio: cada avance arrastra la vista al final.
  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [history, promptChars, progress, phase]);

  // Toma el siguiente trabajo de la cola.
  useEffect(() => {
    if (phase !== "idle" || active || queue.length === 0) return;
    const [next, ...rest] = queue;
    setQueue(rest);
    setActive(next);
    setPromptChars(0);
    setProgress(START);
    setPhase(next.typePrompt ? "typing-prompt" : "thinking");
  }, [phase, active, queue]);

  // Una sola máquina para todo: teclea el prompt, piensa, escribe la respuesta.
  useEffect(() => {
    if (!active) return;
    const wait = (ms: number, fn: () => void) => {
      timerRef.current = setTimeout(fn, ms);
    };

    if (phase === "typing-prompt") {
      if (promptChars < active.prompt.length) {
        wait(PROMPT_CHAR_MS, () => setPromptChars((c) => c + 1));
      } else {
        wait(300, () => setPhase("thinking"));
      }
    } else if (phase === "thinking") {
      wait(active.thinkingMs, () => setPhase("streaming"));
    } else if (phase === "streaming") {
      const block = active.blocks[progress.block];

      if (!block) {
        setPhase("pausing");
      } else if (block.kind === "prose") {
        if (progress.char < block.text.length) {
          wait(PROSE_CHAR_MS, () => setProgress((p) => ({ ...p, char: p.char + 1 })));
        } else {
          wait(BLOCK_GAP_MS, () => setProgress((p) => ({ block: p.block + 1, char: 0, rows: 0 })));
        }
      } else if (
        block.kind === "rows" ||
        block.kind === "entries" ||
        block.kind === "channels"
      ) {
        const total =
          block.kind === "rows"
            ? block.rows.length
            : block.kind === "entries"
              ? block.entries.length
              : block.channels.length;
        if (progress.rows < total) {
          wait(block.kind === "rows" ? ROW_MS : ENTRY_MS, () =>
            setProgress((p) => ({ ...p, rows: p.rows + 1 })),
          );
        } else {
          wait(BLOCK_GAP_MS, () => setProgress((p) => ({ block: p.block + 1, char: 0, rows: 0 })));
        }
      } else {
        wait(BLOCK_GAP_MS, () => setProgress((p) => ({ block: p.block + 1, char: 0, rows: 0 })));
      }
    } else if (phase === "pausing") {
      wait(active.pauseMs, () => {
        setHistory((prev) => [...prev, { prompt: active.prompt, blocks: active.blocks }]);
        if (active.endsIntro) setCycleCount((c) => c + 1);
        setActive(null);
        setPhase("idle");
      });
    }

    return () => clearTimeout(timerRef.current);
  }, [phase, promptChars, progress, active]);

  const commandNames = useCallback(
    () => [...Object.keys(commands), "help", "clear"],
    [commands],
  );

  const enqueue = useCallback((prompt: string, blocks: Block[]) => {
    setQueue((prev) => [
      ...prev,
      {
        prompt,
        blocks,
        typePrompt: false,
        thinkingMs: THINKING_COMMAND_MS,
        pauseMs: PAUSE_COMMAND_MS,
      },
    ]);
  }, []);

  const run = useCallback(
    (raw: string) => {
      const command = raw.trim().toLowerCase();
      if (!command || busy) return;

      setUsedConsole(true);

      if (command === "clear") {
        setHistory([]);
        enqueue(raw.trim(), [
          { kind: "note", tone: "system", text: "consola limpia · escribe help para ver los comandos" },
        ]);
        return;
      }

      if (command === "help") {
        enqueue(raw.trim(), [
          { kind: "prose", text: "Estos son los comandos que entiende esta consola:" },
          {
            kind: "rows",
            rows: [
              ["whoami", "quién soy, en corto"],
              ["stack", "las tecnologías que uso"],
              ["proyectos", "en qué estoy trabajando"],
              ["blog", "mis últimas notas publicadas"],
              ["contacto", "dónde encontrarme"],
              ["clear", "limpia la consola"],
            ],
          },
        ]);
        return;
      }

      const blocks = commands[command];
      if (!blocks) {
        enqueue(raw.trim(), [
          {
            kind: "note",
            tone: "warn",
            text: `No conozco el comando "${command}". Escribe help para ver la lista.`,
          },
        ]);
        return;
      }

      enqueue(raw.trim(), blocks);
    },
    [busy, commands, enqueue],
  );

  const typedPrompt =
    active && phase === "typing-prompt" ? active.prompt.slice(0, promptChars) : active?.prompt;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full"
    >
      <div
        data-cycle-count={cycleCount}
        className="w-full overflow-hidden rounded-xl backdrop-blur-md"
        style={{
          border: "1px solid var(--line)",
          background: "rgb(8 12 19 / 0.82)",
          // la sombra interior de 1px es lo que hace que el panel se lea como
          // una pieza física y no como un div con borde
          boxShadow:
            "0 30px 80px -40px rgb(0 0 0 / 0.95), inset 0 1px 0 rgb(255 255 255 / 0.04)",
        }}
      >
        <div
          className="flex items-center gap-2.5 px-3.5 py-2.5 font-mono text-[0.63rem] uppercase tracking-[0.16em]"
          style={{ borderBottom: "1px solid var(--line)", color: "var(--faint)" }}
        >
          <span
            className="h-2.5 w-2.5 animate-pulse rounded-full"
            style={{ background: "var(--go)" }}
          />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--line)" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--line)" }} />
          <span className="ml-1.5">abel llontop · consola</span>
          <span className="ml-auto hidden sm:inline">{busy ? "escribiendo…" : "en espera"}</span>
        </div>

        <div
          ref={bodyRef}
          aria-live="polite"
          className="h-[22rem] overflow-y-auto px-4 py-4 font-mono text-[0.84rem] leading-[1.75] sm:h-[26rem]"
        >
          {history.map((entry, index) => (
            <div key={index} className="mb-3">
              <p className="break-words">
                <span className="text-accent">&gt;</span>{" "}
                <span className="text-zinc-100">{entry.prompt}</span>
              </p>
              <AnswerBlocks blocks={entry.blocks} caret={false} />
            </div>
          ))}

          {active && (
            <div className="mb-3">
              <p className="break-words">
                <span className="text-accent">&gt;</span>{" "}
                <span className="text-zinc-100">{typedPrompt}</span>
                {phase === "typing-prompt" && (
                  <span className="ml-0.5 inline-block w-[1ch] animate-pulse bg-zinc-300">
                    &nbsp;
                  </span>
                )}
              </p>

              {phase === "thinking" && (
                <p className="mt-1 flex items-center gap-1" style={{ color: "var(--faint)" }}>
                  pensando
                  <span className="inline-flex gap-0.5">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce [animation-delay:150ms]">.</span>
                    <span className="animate-bounce [animation-delay:300ms]">.</span>
                  </span>
                </p>
              )}

              {(phase === "streaming" || phase === "pausing") && (
                <AnswerBlocks
                  blocks={visibleBlocks(active.blocks, progress)}
                  caret={phase === "streaming"}
                />
              )}
            </div>
          )}

          {!busy && !usedConsole && history.length > 0 && (
            <p style={{ color: "var(--go)" }}>
              la consola acepta comandos — escribe help o toca uno de los botones.
            </p>
          )}
        </div>

        <form
          className="flex items-baseline gap-2 px-4 pb-3 pt-2 font-mono"
          onSubmit={(event) => {
            event.preventDefault();
            run(input);
            setInput("");
          }}
        >
          <span className="text-accent">&gt;</span>
          {/* text-base en mobile: por debajo de 16px iOS hace zoom al enfocar */}
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={busy}
            autoComplete="off"
            spellCheck={false}
            aria-label="Consola"
            placeholder={busy ? "escribiendo…" : "escribe un comando…"}
            className="min-w-0 flex-1 bg-transparent p-0 text-base text-zinc-100 caret-accent outline-none transition-opacity placeholder:text-zinc-600 disabled:opacity-40 sm:text-[0.84rem]"
          />
        </form>

        <div className="flex flex-wrap gap-1.5 px-4 pb-3.5">
          {commandNames().map((name) => (
            <button
              key={name}
              type="button"
              disabled={busy}
              onClick={() => {
                run(name);
                inputRef.current?.focus();
              }}
              className="rounded-full border px-2.5 py-1 font-mono text-[0.68rem] tracking-[0.06em] transition-all disabled:cursor-not-allowed disabled:opacity-35 enabled:hover:border-accent enabled:hover:text-accent"
              style={{
                borderColor: "var(--line)",
                color: "var(--dim)",
                background: "rgb(255 255 255 / 0.03)",
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
