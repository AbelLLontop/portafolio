// El canal entre el reproductor y el resto del sitio.
//
// El reproductor es una isla que sobrevive a la navegación (transition:persist)
// y otras piezas necesitan saber qué suena: la letra del inicio, las filas de
// la lista. Cada isla se empaqueta por su cuenta, así que el estado vive en
// `window` y no en una variable de módulo: así es uno solo aunque el bundler
// duplique este archivo en dos islas.
//
// Para PEDIRLE algo al reproductor (tocar una pista, pausar) se usan eventos
// de `window`; los puede disparar cualquier script, también uno de Astro.
import { useSyncExternalStore } from "react";

export interface RadioState {
  trackId: string | null;
  playing: boolean;
  /** Segundo actual de la pista. */
  time: number;
}

interface Bus {
  state: RadioState;
  listeners: Set<() => void>;
}

declare global {
  interface Window {
    __abelitolllRadio?: Bus;
  }
}

const INITIAL: RadioState = { trackId: null, playing: false, time: 0 };

function bus(): Bus {
  window.__abelitolllRadio ??= { state: INITIAL, listeners: new Set() };
  return window.__abelitolllRadio;
}

export function publish(patch: Partial<RadioState>): void {
  const current = bus();
  current.state = { ...current.state, ...patch };
  current.listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  const current = bus();
  current.listeners.add(listener);
  return () => current.listeners.delete(listener);
}

/** Lo que suena ahora, para leerlo desde cualquier isla. */
export function useRadio(): RadioState {
  return useSyncExternalStore(
    subscribe,
    () => bus().state,
    () => INITIAL,
  );
}

/** Pide tocar una pista; si ya es la que suena, la pausa o la reanuda. */
export function requestPlay(id: string): void {
  window.dispatchEvent(new CustomEvent("radio:play", { detail: { id } }));
}

/** Pide pausar (por ejemplo, al arrancar un video de YouTube). */
export function requestPause(): void {
  window.dispatchEvent(new Event("radio:pause"));
}
