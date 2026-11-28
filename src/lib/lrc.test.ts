import { describe, expect, it } from "vitest";

import { activeLine, parseLrc, splitWords, wordProgress } from "./lrc.ts";

describe("parseLrc", () => {
  it("lee el tiempo de cada línea en segundos", () => {
    const lines = parseLrc("[00:01.50] Hola.\n[01:02] Soy Abel.");

    expect(lines.map((line) => line.time)).toEqual([1.5, 62]);
    expect(lines[0].words.map((word) => word.text)).toEqual(["Hola."]);
  });

  it("ignora metadatos y líneas sin tiempo", () => {
    const lines = parseLrc("[ar:Los Vecinos]\nsin tiempo\n[00:03.00] sí");

    expect(lines).toHaveLength(1);
    expect(lines[0].time).toBe(3);
  });

  it("repite la línea por cada tiempo y ordena el resultado", () => {
    const lines = parseLrc("[00:20.00][00:05.00] coro\n[00:10.00] verso");

    expect(lines.map((line) => line.time)).toEqual([5, 10, 20]);
    expect(lines[0].words[0].text).toBe("coro");
  });

  it("acepta coma decimal y saltos de línea de Windows", () => {
    expect(parseLrc("[00:02,25] uno\r\n[00:03.00] dos")[0].time).toBe(2.25);
  });
});

describe("splitWords", () => {
  it("marca como acento lo que va entre asteriscos, sin mostrarlos", () => {
    const words = splitWords("entender *cómo funcionan*.");

    expect(words).toEqual([
      { text: "entender", accent: false },
      { text: "cómo", accent: true },
      { text: "funcionan.", accent: true },
    ]);
  });

  it("una sola palabra entre asteriscos también es acento", () => {
    expect(splitWords("junto a *Claude*:")).toEqual([
      { text: "junto", accent: false },
      { text: "a", accent: false },
      { text: "Claude:", accent: true },
    ]);
  });
});

describe("activeLine", () => {
  const lines = parseLrc("[00:01.00] a\n[00:03.00] b\n[00:06.00] c");

  it("devuelve -1 antes de la primera línea", () => {
    expect(activeLine(lines, 0.5)).toBe(-1);
  });

  it("devuelve la última línea que ya empezó", () => {
    expect(activeLine(lines, 1)).toBe(0);
    expect(activeLine(lines, 4.9)).toBe(1);
    expect(activeLine(lines, 99)).toBe(2);
  });
});

describe("wordProgress", () => {
  const lines = parseLrc("[00:00.00] uno dos tres\n[00:10.00] fin");

  it("rellena las palabras en orden, de 0 a 1", () => {
    const progress = wordProgress(lines, 0, 0.5, 20);

    expect(progress[0]).toBe(1);
    expect(progress[2]).toBe(0);
  });

  it("al final de la línea todas están completas", () => {
    expect(wordProgress(lines, 0, 9.9, 20)).toEqual([1, 1, 1]);
  });

  it("no falla con un índice fuera de rango", () => {
    expect(wordProgress(lines, 5, 1, 20)).toEqual([]);
  });
});
