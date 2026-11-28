// "Quién soy" en el inicio: tres líneas de la letra cantándose solas, y el
// botón que la toca o la pausa. No tiene reloj propio: lee el del reproductor
// por el bus, así lo que se ve acá y en la vista de letra es lo mismo.
import type { ReactNode } from "react";
import Lyrics from "./Lyrics.tsx";
import { requestPlay, useRadio } from "./bus.ts";
import type { LyricLine } from "../../../lib/lrc.ts";

interface Props {
  trackId: string;
  lines: LyricLine[];
  duration: number;
  labels: { play: string; pause: string };
  /** Lo que va junto al botón (los enlaces de contacto, HTML de Astro). */
  children?: ReactNode;
}

export default function HeroLyrics({
  trackId,
  lines,
  duration,
  labels,
  children,
}: Props) {
  const radio = useRadio();
  const isCurrent = radio.trackId === trackId;
  // Si suena otra canción, la intro se muestra entera, ya cantada.
  const time = isCurrent ? radio.time : radio.trackId ? duration : 0;
  const playing = isCurrent && radio.playing;

  return (
    <>
      <Lyrics
        lines={lines}
        time={time}
        end={duration}
        compact
        className="hero-lyr"
      />
      <div className="hero-acts">
        <button
          type="button"
          className="pbig hero-play"
          aria-label={playing ? labels.pause : labels.play}
          onClick={() => requestPlay(trackId)}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M7 4l13 8-13 8z" />
            </svg>
          )}
        </button>
        {children}
      </div>
    </>
  );
}
