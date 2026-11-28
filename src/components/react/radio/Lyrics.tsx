// La letra en modo karaoke. La usan la vista de letra (a pantalla completa) y
// el bloque del inicio (tres líneas). El relleno de cada palabra sale de
// `wordProgress` y se pasa como --p, que lee el CSS de global.css (.lyr).
import { useEffect, useRef } from "react";
import { activeLine, wordProgress, type LyricLine } from "../../../lib/lrc.ts";

interface Props {
  lines: LyricLine[];
  time: number;
  /** Fin de la pista, para repartir el tiempo de la última línea. */
  end: number;
  /** Solo la línea anterior, la actual y la siguiente. */
  compact?: boolean;
  /** Lleva la línea activa al centro de su contenedor con scroll. */
  follow?: boolean;
  onSeek?: (time: number) => void;
  className?: string;
}

export default function Lyrics({
  lines,
  time,
  end,
  compact = false,
  follow = false,
  onSeek,
  className = "",
}: Props) {
  const active = activeLine(lines, time);
  const progress = wordProgress(lines, active, time, end);
  const activeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (follow) {
      activeRef.current?.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
  }, [active, follow]);

  return (
    <div className={`lyr ${className}`}>
      {lines.map((line, index) => {
        const near =
          (index >= active - 1 && index <= active + 1) ||
          (active < 0 && index < 3);
        if (compact && !near) return null;

        const state = index === active ? "now" : index < active ? "past" : "";
        const Tag = onSeek ? "button" : "span";

        return (
          <Tag
            key={`${line.time}-${index}`}
            ref={
              index === active
                ? (el: HTMLElement | null) => {
                    activeRef.current = el;
                  }
                : undefined
            }
            type={onSeek ? "button" : undefined}
            className={`line ${state}`}
            onClick={onSeek ? () => onSeek(line.time) : undefined}
          >
            {line.words.map((word, w) => (
              <span key={w}>
                <span
                  className={`w${word.accent ? " acc" : ""}`}
                  style={
                    index === active
                      ? ({
                          "--p": `${(progress[w] ?? 0) * 100}%`,
                        } as React.CSSProperties)
                      : undefined
                  }
                >
                  {word.text}
                </span>
                {w < line.words.length - 1 ? " " : ""}
              </span>
            ))}
          </Tag>
        );
      })}
    </div>
  );
}
