import { beforeEach, describe, expect, it, vi } from "vitest";

const getCollection = vi.hoisted(() => vi.fn());

vi.mock("astro:content", () => ({ getCollection }));

const { getPublishedExperiments } = await import("./experiments.ts");

interface FakeExperiment {
  id: string;
  data: { date: Date; draft?: boolean };
}

function experiment(id: string, date: string, draft = false): FakeExperiment {
  return { id, data: { date: new Date(date), draft } };
}

describe("getPublishedExperiments", () => {
  beforeEach(() => {
    const items = [
      experiment("vieja", "2026-01-01"),
      experiment("borrador", "2026-06-01", true),
      experiment("nueva", "2026-05-01"),
    ];
    getCollection.mockImplementation(
      (_name: string, filter?: (entry: FakeExperiment) => boolean) =>
        Promise.resolve(filter ? items.filter(filter) : items),
    );
  });

  it("deja afuera los borradores", async () => {
    const ids = (await getPublishedExperiments()).map((item) => item.id);

    expect(ids).not.toContain("borrador");
  });

  it("ordena del mas nuevo al mas viejo", async () => {
    const ids = (await getPublishedExperiments()).map((item) => item.id);

    expect(ids).toEqual(["nueva", "vieja"]);
  });
});
