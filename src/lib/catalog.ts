// El catálogo del sello: proyectos y experimentos en una sola lista, con la
// forma común que usan la biblioteca y el inicio. Cada colección sigue
// teniendo su propio schema; esto solo los pone uno al lado del otro.
import type { ImageMetadata } from "astro";
import { getPublishedExperiments, type Experiment } from "./experiments.ts";
import { getPublishedProjects, type Project } from "./projects.ts";
import { pathFor } from "../i18n/routes.ts";
import type { Lang } from "../i18n/index.ts";

export type CatalogKind = "project" | "experiment";

export interface CatalogItem {
  kind: CatalogKind;
  id: string;
  href: string;
  title: string;
  tagline: string;
  date: Date;
  /** Portada cuadrada; null = se dibuja una con el nombre. */
  avatar: ImageMetadata | null;
  avatarAlt: string;
  /** Etiqueta de estado: "live", "building" o "ai". */
  status: "live" | "building" | "ai" | null;
  entry: Project | Experiment;
}

function fromProject(project: Project, lang: Lang): CatalogItem {
  const { data } = project;
  return {
    kind: "project",
    id: project.id,
    href: pathFor("project", lang, project.id),
    title: data.title,
    tagline: data.tagline,
    date: data.date,
    avatar: data.avatar ?? null,
    avatarAlt: data.avatarAlt ?? "",
    status: data.status,
    entry: project,
  };
}

function fromExperiment(experiment: Experiment, lang: Lang): CatalogItem {
  const { data } = experiment;
  return {
    kind: "experiment",
    id: experiment.id,
    href: pathFor("experiment", lang, experiment.id),
    title: data.title,
    tagline: data.tagline,
    date: data.date,
    avatar: data.avatar,
    avatarAlt: data.avatarAlt,
    status: data.ai ? "ai" : null,
    entry: experiment,
  };
}

/** Todo el catálogo, del más nuevo al más viejo. */
export async function getCatalog(lang: Lang): Promise<CatalogItem[]> {
  const [projects, experiments] = await Promise.all([
    getPublishedProjects(),
    getPublishedExperiments(),
  ]);

  return [
    ...projects.map((project) => fromProject(project, lang)),
    ...experiments.map((experiment) => fromExperiment(experiment, lang)),
  ].sort((a, b) => b.date.valueOf() - a.date.valueOf());
}
