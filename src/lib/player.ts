// Lógica pura del reproductor: lo que se puede probar sin navegador.

interface Playable {
  audio: string | null;
  intro: boolean;
}

/**
 * Una pista se puede tocar si tiene audio. La intro es la excepción: sin
 * audio suena "en silencio", con su letra corriendo sobre un reloj propio.
 */
export function isPlayable(track: Playable): boolean {
  return track.audio !== null || track.intro;
}

/**
 * La siguiente pista que se puede tocar en la dirección `step` (1 o -1),
 * dando la vuelta a la lista. Si ninguna otra se puede, se queda en la misma.
 */
export function nextPlayable(
  tracks: Playable[],
  from: number,
  step: 1 | -1,
): number {
  for (let i = 1; i <= tracks.length; i++) {
    const index = (from + step * i + tracks.length * i) % tracks.length;
    if (isPlayable(tracks[index])) return index;
  }
  return from;
}

/** "3:05"; sin duración conocida, una raya. */
export function formatTime(seconds: number | null | undefined): string {
  if (seconds == null || !Number.isFinite(seconds)) return "—";
  const whole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

/**
 * El "latido" del cuadro rojo (0 a 1): un pulso corto a ~96 por minuto. No es
 * análisis de audio, es decoración que sigue el reloj de la pista.
 */
export function beat(time: number): number {
  return Math.max(0, Math.sin(time * Math.PI * 2 * 1.6)) ** 6;
}
