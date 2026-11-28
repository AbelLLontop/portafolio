// La barra de reproducción y la vista de letra. Vive en el layout con
// transition:persist, así la música sigue al cambiar de página.
//
// Dos clases de pista:
// - con audio: manda el <audio>, y el tiempo sale de currentTime;
// - la intro sin audio: suena "en silencio", con un reloj propio que hace
//   correr la letra. Es lo que se ve al entrar al sitio.
// Una pista sin audio que no es la intro queda bloqueada.
import { useCallback, useEffect, useRef, useState } from "react";
import { navigate } from "astro:transitions/client";
import Lyrics from "./Lyrics.tsx";
import { publish } from "./bus.ts";
import {
  beat,
  formatTime,
  isPlayable,
  nextPlayable,
} from "../../../lib/player.ts";
import type { RadioTrack } from "../../../lib/radio.ts";

export type PlayerStrings = Record<
  | "player.play"
  | "player.pause"
  | "player.prev"
  | "player.next"
  | "player.lyrics"
  | "player.list"
  | "player.back"
  | "player.mute"
  | "player.unmute"
  | "player.volume"
  | "player.seek"
  | "player.intro"
  | "player.noLyrics",
  string
>;

interface Props {
  tracks: RadioTrack[];
  strings: PlayerStrings;
  /** Ruta de la página de la lista. */
  listPath: string;
}

const BARS = 52;

const Icon = {
  play: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 4l13 8-13 8z" />
    </svg>
  ),
  pause: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  ),
  prev: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 5h2v14H6zM20 5v14L9 12z" />
    </svg>
  ),
  next: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 5h2v14h-2zM4 5l11 7-11 7z" />
    </svg>
  ),
  list: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M4 6h16M4 12h10M4 18h10M18 14v6l4-3z" />
    </svg>
  ),
  mic: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  ),
  vol: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M4 9v6h4l5 4V5L8 9z" />
      <path d="M16 9a4 4 0 0 1 0 6" />
    </svg>
  ),
  muted: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M4 9v6h4l5 4V5L8 9z" />
      <path d="M17 9l5 6M22 9l-5 6" />
    </svg>
  ),
  back: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      aria-hidden="true"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
};

function Cover({ track }: { track: RadioTrack }) {
  return (
    <span className="cov">
      {track.cover ? (
        <img src={track.cover} alt="" />
      ) : (
        <span className="introcov">
          <i />
        </span>
      )}
    </span>
  );
}

export default function Player({ tracks, strings, listPath }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startIndex = Math.max(
    0,
    tracks.findIndex((track) => track.intro),
  );

  const [index, setIndex] = useState(startIndex);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [measured, setMeasured] = useState<Record<string, number>>({});
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [onList, setOnList] = useState(false);

  // Lo que lee el bucle de animación sin esperar a un render.
  const live = useRef({ index, playing, time: 0 });
  live.current.index = index;
  live.current.playing = playing;

  const track = tracks[index];
  const duration = measured[track.id] ?? track.duration ?? 0;

  /** Cambia de pista y, si se pide, arranca a sonar. */
  const load = useCallback(
    (next: number, autoplay: boolean) => {
      const target = tracks[next];
      if (!target || !isPlayable(target)) return;
      const audio = audioRef.current;

      live.current.time = 0;
      setTime(0);
      setIndex(next);

      if (audio) {
        audio.pause();
        if (target.audio) {
          audio.src = target.audio;
          audio.load();
        } else {
          audio.removeAttribute("src");
        }
      }

      if (!autoplay) {
        setPlaying(false);
        return;
      }

      if (target.audio && audio) {
        audio
          .play()
          .then(() => setPlaying(true))
          // El navegador puede negar el sonido sin un clic: queda en pausa.
          .catch(() => setPlaying(false));
      } else {
        setPlaying(true);
      }
    },
    [tracks],
  );

  const toggle = useCallback(() => {
    const current = tracks[live.current.index];
    const audio = audioRef.current;
    if (current.audio && audio) {
      if (audio.paused) {
        audio
          .play()
          .then(() => setPlaying(true))
          .catch(() => setPlaying(false));
      } else {
        audio.pause();
        setPlaying(false);
      }
      return;
    }
    // La intro silenciosa: si ya terminó, vuelve a empezar.
    if (!live.current.playing && live.current.time >= (current.duration ?? 0)) {
      live.current.time = 0;
    }
    setPlaying((value) => !value);
  }, [tracks]);

  const seek = useCallback(
    (to: number) => {
      const current = tracks[live.current.index];
      const audio = audioRef.current;
      if (current.audio && audio) audio.currentTime = to;
      live.current.time = to;
      setTime(to);
    },
    [tracks],
  );

  const step = useCallback(
    (direction: 1 | -1) => {
      const next = nextPlayable(tracks, live.current.index, direction);
      if (next !== live.current.index) load(next, true);
    },
    [tracks, load],
  );

  // Al entrar: la intro sin audio arranca sola (no hace ruido). Con audio,
  // esperaría un clic, porque el navegador no deja sonar sin uno.
  useEffect(() => {
    const intro = tracks[startIndex];
    if (intro?.intro && !intro.audio) setPlaying(true);
  }, [tracks, startIndex]);

  // El reloj: avanza la intro silenciosa, lee el audio y avisa al resto.
  useEffect(() => {
    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const state = live.current;
      const current = tracks[state.index];
      const audio = audioRef.current;
      const delta = (now - last) / 1000;
      last = now;

      if (current.audio && audio) {
        state.time = audio.currentTime;
      } else if (state.playing) {
        state.time += delta;
        const end = current.duration ?? 0;
        if (state.time >= end) {
          state.time = end;
          const next = nextPlayable(tracks, state.index, 1);
          if (next !== state.index) load(next, true);
          else setPlaying(false);
        }
      }

      setTime(state.time);
      publish({
        trackId: current.id,
        playing: state.playing,
        time: state.time,
      });
      document.documentElement.style.setProperty(
        "--beat",
        state.playing ? beat(state.time).toFixed(3) : "0",
      );
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [tracks, load]);

  // Marca en la página la pista que suena (filas de la lista, canciones de un
  // experimento). Las filas son HTML de Astro: se las busca por data-track-id.
  useEffect(() => {
    const sync = () => {
      const root = document.documentElement;
      root.dataset.playing = String(playing);
      root.dataset.track = track.id;
      document
        .querySelectorAll<HTMLElement>("[data-track-id]")
        .forEach((el) =>
          el.setAttribute(
            "aria-current",
            String(el.dataset.trackId === track.id),
          ),
        );
      setOnList(window.location.pathname.replace(/\/$/, "") === listPath);
    };
    sync();
    document.addEventListener("astro:page-load", sync);
    return () => document.removeEventListener("astro:page-load", sync);
  }, [playing, track.id, listPath]);

  // Pedidos de afuera: tocar una pista, pausar.
  useEffect(() => {
    const onPlay = (event: Event) => {
      const { id } = (event as CustomEvent<{ id: string }>).detail;
      const target = tracks.findIndex((t) => t.id === id);
      if (target < 0 || !isPlayable(tracks[target])) return;
      if (target === live.current.index) toggle();
      else load(target, true);
    };
    const onPause = () => {
      audioRef.current?.pause();
      setPlaying(false);
    };
    window.addEventListener("radio:play", onPlay);
    window.addEventListener("radio:pause", onPause);
    return () => {
      window.removeEventListener("radio:play", onPlay);
      window.removeEventListener("radio:pause", onPause);
    };
  }, [tracks, toggle, load]);

  // Teclado: espacio reproduce (si no se está escribiendo), Esc cierra la letra.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const typing = target.closest(
        "input, textarea, button, a, [contenteditable]",
      );
      if (event.code === "Space" && !typing) {
        event.preventDefault();
        toggle();
      }
      if (event.key === "Escape") setLyricsOpen(false);
    };
    const onSwap = () => setLyricsOpen(false);
    window.addEventListener("keydown", onKey);
    document.addEventListener("astro:after-swap", onSwap);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("astro:after-swap", onSwap);
    };
  }, [toggle]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = muted;
  }, [volume, muted]);

  const progress = duration > 0 ? Math.min(1, time / duration) : 0;
  const lit = Math.floor(progress * BARS);

  const openList = (event: React.MouseEvent) => {
    if (!onList) return;
    // Ya en la lista: el mismo botón vuelve a donde se estaba.
    event.preventDefault();
    if (window.history.length > 1) window.history.back();
    else navigate("/");
  };

  const tag = track.intro ? strings["player.intro"] : "";

  return (
    <>
      <audio
        ref={audioRef}
        preload="metadata"
        onLoadedMetadata={(event) => {
          const seconds = event.currentTarget.duration;
          if (Number.isFinite(seconds)) {
            setMeasured((all) => ({ ...all, [track.id]: seconds }));
          }
        }}
        onEnded={() => step(1)}
        // Solo cuentan los eventos de una pista con audio: al pasar a la intro
        // silenciosa, el pause del audio anterior llega tarde y la pararía.
        onPause={() => {
          if (tracks[live.current.index].audio) setPlaying(false);
        }}
        onPlay={() => {
          if (tracks[live.current.index].audio) setPlaying(true);
        }}
      />

      <section
        className={`lyrics-view${lyricsOpen ? " open" : ""}`}
        aria-label={strings["player.lyrics"]}
        aria-hidden={!lyricsOpen}
      >
        <header className="lv-top">
          <Cover track={track} />
          <span className="lv-title">
            <b>{track.title}</b>
            <small>{track.artist}</small>
          </span>
          {tag && <span className="lv-tag">{tag}</span>}
          <button
            type="button"
            className="lv-close"
            onClick={() => setLyricsOpen(false)}
            tabIndex={lyricsOpen ? 0 : -1}
          >
            {Icon.back}
            {strings["player.back"]}
            <kbd>Esc</kbd>
          </button>
        </header>
        <div className="lv-body">
          {track.lines.length > 0 ? (
            <Lyrics
              lines={track.lines}
              time={time}
              end={duration}
              follow={lyricsOpen}
              onSeek={isPlayable(track) ? seek : undefined}
            />
          ) : (
            <p className="lv-empty">{strings["player.noLyrics"]}</p>
          )}
        </div>
      </section>

      <footer className="bar">
        <div className="bar-now">
          <Cover track={track} />
          <span className="bar-title">
            <b>{track.title}</b>
            <small>{track.artist}</small>
          </span>
        </div>

        <div className="bar-center">
          <div className="bar-controls">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={strings["player.prev"]}
            >
              {Icon.prev}
            </button>
            <button
              type="button"
              className="bar-pp"
              onClick={toggle}
              aria-label={
                playing ? strings["player.pause"] : strings["player.play"]
              }
            >
              {playing ? Icon.pause : Icon.play}
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={strings["player.next"]}
            >
              {Icon.next}
            </button>
          </div>
          <div className="bar-scrub">
            <span>{formatTime(time)}</span>
            <button
              type="button"
              className="bar-bars"
              aria-label={strings["player.seek"]}
              onClick={(event) => {
                if (!duration) return;
                const box = event.currentTarget.getBoundingClientRect();
                seek(((event.clientX - box.left) / box.width) * duration);
              }}
            >
              {Array.from({ length: BARS }, (_, bar) => (
                <i
                  key={bar}
                  className={bar <= lit && time > 0 ? "on" : ""}
                  style={{
                    height: `${(28 + Math.abs(Math.sin(bar * 1.9 + index * 3)) * 72).toFixed(1)}%`,
                  }}
                />
              ))}
            </button>
            <span>{formatTime(duration || null)}</span>
          </div>
        </div>

        <div className="bar-right">
          <a
            href={listPath}
            className="bar-icon"
            aria-label={strings["player.list"]}
            aria-pressed={onList}
            title={strings["player.list"]}
            onClick={openList}
          >
            {Icon.list}
          </a>
          <button
            type="button"
            className="bar-icon"
            aria-label={strings["player.lyrics"]}
            aria-pressed={lyricsOpen}
            title={strings["player.lyrics"]}
            onClick={() => setLyricsOpen((open) => !open)}
          >
            {Icon.mic}
          </button>
          <button
            type="button"
            className="bar-icon bar-vol-btn"
            aria-label={
              muted ? strings["player.unmute"] : strings["player.mute"]
            }
            title={muted ? strings["player.unmute"] : strings["player.mute"]}
            onClick={() => setMuted((value) => !value)}
          >
            {muted ? Icon.muted : Icon.vol}
          </button>
          <input
            className="bar-vol"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            aria-label={strings["player.volume"]}
            onChange={(event) => {
              setVolume(Number(event.currentTarget.value));
              setMuted(false);
            }}
          />
        </div>
      </footer>
    </>
  );
}
