// Letras sincronizadas en formato LRC: "[mm:ss.xx] una línea". Puro y sin
// dependencias, así lo usan el build (para pasarle la letra al reproductor)
// y los tests.

export interface LyricWord {
  text: string;
  /** Va en el color de acento (en el .lrc, la palabra entre asteriscos). */
  accent: boolean;
}

export interface LyricLine {
  /** Segundo en que empieza la línea. */
  time: number;
  words: LyricWord[];
}

const STAMP = /\[(\d{1,3}):(\d{1,2}(?:[.,]\d{1,3})?)\]/g;

/**
 * Lee un texto LRC. Ignora las etiquetas de metadatos ([ar:...], [ti:...]) y
 * las líneas sin tiempo; una línea con varios tiempos (un coro que se repite)
 * se agrega una vez por cada uno. El resultado va ordenado por tiempo.
 */
export function parseLrc(source: string): LyricLine[] {
  const lines: LyricLine[] = [];

  for (const raw of source.split(/\r?\n/)) {
    const stamps = [...raw.matchAll(STAMP)];
    if (stamps.length === 0) continue;

    const text = raw.replace(STAMP, "").trim();
    const words = splitWords(text);

    for (const [, min, sec] of stamps) {
      const time = Number(min) * 60 + Number(sec.replace(",", "."));
      lines.push({ time, words });
    }
  }

  return lines.sort((a, b) => a.time - b.time);
}

/**
 * Parte una línea en palabras. Lo que va entre asteriscos queda marcado como
 * acento ("entender *cómo funcionan*"), y los asteriscos no se muestran.
 */
export function splitWords(text: string): LyricWord[] {
  const words: LyricWord[] = [];
  let accent = false;

  for (const token of text.split(/\s+/).filter(Boolean)) {
    const opens = token.startsWith("*");
    const closes = token.endsWith("*") && (token.length > 1 || !opens);
    if (opens) accent = true;
    const clean = token.replace(/\*/g, "");
    if (clean) words.push({ text: clean, accent });
    if (closes) accent = false;
  }

  return words;
}

/** Índice de la línea que suena en el segundo `time` (-1 antes de la primera). */
export function activeLine(lines: LyricLine[], time: number): number {
  let low = 0;
  let high = lines.length - 1;
  let found = -1;

  while (low <= high) {
    const mid = (low + high) >> 1;
    if (lines[mid].time <= time) {
      found = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return found;
}

/**
 * Cuánto de cada palabra de la línea `index` ya se "cantó" (0 a 1), para el
 * relleno del karaoke. Las palabras se reparten el tiempo de la línea, con un
 * tope por palabra para que una línea larga y lenta no se arrastre.
 */
export function wordProgress(
  lines: LyricLine[],
  index: number,
  time: number,
  end: number,
): number[] {
  const line = lines[index];
  if (!line) return [];

  const next = lines[index + 1]?.time ?? end;
  const count = Math.max(line.words.length, 1);
  const per = Math.min(0.42, ((next - line.time) * 0.85) / count);

  return line.words.map((_, i) => {
    const value = (time - line.time - i * per) / per;
    return Math.max(0, Math.min(1, value));
  });
}
