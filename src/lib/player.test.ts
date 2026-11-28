import { describe, expect, it } from "vitest";

import { beat, formatTime, isPlayable, nextPlayable } from "./player.ts";

const intro = { audio: null, intro: true };
const song = { audio: "/audio/a.mp3", intro: false };
const locked = { audio: null, intro: false };

describe("isPlayable", () => {
  it("se toca con audio, o si es la intro aunque no tenga", () => {
    expect(isPlayable(song)).toBe(true);
    expect(isPlayable(intro)).toBe(true);
    expect(isPlayable(locked)).toBe(false);
  });
});

describe("nextPlayable", () => {
  const tracks = [intro, locked, song, locked];

  it("salta las pistas bloqueadas", () => {
    expect(nextPlayable(tracks, 0, 1)).toBe(2);
  });

  it("da la vuelta en los dos sentidos", () => {
    expect(nextPlayable(tracks, 2, 1)).toBe(0);
    expect(nextPlayable(tracks, 0, -1)).toBe(2);
  });

  it("se queda en la misma si no hay otra que se pueda tocar", () => {
    expect(nextPlayable([intro, locked], 0, 1)).toBe(0);
  });
});

describe("formatTime", () => {
  it("formatea minutos y segundos", () => {
    expect(formatTime(185)).toBe("3:05");
    expect(formatTime(0)).toBe("0:00");
  });

  it("sin duración muestra una raya", () => {
    expect(formatTime(null)).toBe("—");
    expect(formatTime(Number.NaN)).toBe("—");
  });
});

describe("beat", () => {
  it("se mueve entre 0 y 1", () => {
    for (let t = 0; t < 3; t += 0.07) {
      expect(beat(t)).toBeGreaterThanOrEqual(0);
      expect(beat(t)).toBeLessThanOrEqual(1);
    }
  });
});
