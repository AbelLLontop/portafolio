import { beforeEach, describe, expect, it, vi } from "vitest";

const getCollection = vi.hoisted(() => vi.fn());

vi.mock("astro:content", () => ({ getCollection }));

const { getPublishedPosts, getPostNumbers } = await import("./posts.ts");

interface FakePost {
  id: string;
  data: { date: Date; draft?: boolean };
}

function post(id: string, date: string, draft = false): FakePost {
  return { id, data: { date: new Date(date), draft } };
}

/** Imita el filtro que recibe getCollection en el codigo real. */
function collectionOf(posts: FakePost[]) {
  return (_name: string, filter?: (entry: FakePost) => boolean) =>
    Promise.resolve(filter ? posts.filter(filter) : posts);
}

const posts = [
  post("segunda", "2026-02-01"),
  post("primera", "2026-01-01"),
  post("borrador", "2026-03-01", true),
  post("tercera", "2026-03-15"),
];

beforeEach(() => {
  getCollection.mockReset();
  getCollection.mockImplementation(collectionOf(posts));
});

describe("getPublishedPosts", () => {
  it("devuelve las notas de la mas nueva a la mas vieja", async () => {
    const result = await getPublishedPosts();

    expect(result.map((p) => p.id)).toEqual(["tercera", "segunda", "primera"]);
  });

  it("deja fuera los borradores", async () => {
    const result = await getPublishedPosts();

    expect(result.map((p) => p.id)).not.toContain("borrador");
  });
});

describe("getPostNumbers", () => {
  it("numera en orden cronologico ascendente: la mas antigua es la #1", async () => {
    const numbers = await getPostNumbers();

    expect(numbers.get("primera")).toBe(1);
    expect(numbers.get("segunda")).toBe(2);
    expect(numbers.get("tercera")).toBe(3);
  });

  it("no numera los borradores", async () => {
    const numbers = await getPostNumbers();

    expect(numbers.has("borrador")).toBe(false);
  });

  it("publicar una nota nueva no renumera las anteriores", async () => {
    const antes = await getPostNumbers();

    getCollection.mockImplementation(
      collectionOf([...posts, post("cuarta", "2026-04-01")]),
    );
    const despues = await getPostNumbers();

    expect(despues.get("primera")).toBe(antes.get("primera"));
    expect(despues.get("tercera")).toBe(antes.get("tercera"));
    expect(despues.get("cuarta")).toBe(4);
  });

  it("asigna un numero distinto a cada nota", async () => {
    const numbers = await getPostNumbers();
    const asignados = [...numbers.values()];

    expect(new Set(asignados).size).toBe(asignados.length);
  });
});
