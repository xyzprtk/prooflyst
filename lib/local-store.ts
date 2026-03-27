import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type LocalSite = {
  id: string;
  slug: string;
  name: string;
  domain: string;
  adminKey: string;
  publicKey: string;
  createdAt: string;
};

type LocalTestimonial = {
  id: string;
  siteId: string;
  author: string;
  content: string;
  rating: number | null;
  status: "pending" | "approved" | "deleted";
  createdAt: string;
  updatedAt: string;
};

type LocalStore = {
  sites: LocalSite[];
  testimonials: LocalTestimonial[];
};

const STORE_DIR = path.join(process.cwd(), ".data");
const STORE_FILE = path.join(STORE_DIR, "local-store.json");

async function readStore(): Promise<LocalStore> {
  try {
    const raw = await readFile(STORE_FILE, "utf8");
    const parsed = JSON.parse(raw) as LocalStore;
    return {
      sites: Array.isArray(parsed.sites) ? parsed.sites : [],
      testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : [],
    };
  } catch {
    return { sites: [], testimonials: [] };
  }
}

async function writeStore(store: LocalStore) {
  await mkdir(STORE_DIR, { recursive: true });
  await writeFile(STORE_FILE, JSON.stringify(store, null, 2), "utf8");
}

export async function getLocalSiteBySlug(slug: string): Promise<LocalSite | undefined> {
  const store = await readStore();
  return store.sites.find((site) => site.slug === slug);
}

export async function getLocalSiteByAdminHash(
  adminHash: string
): Promise<LocalSite | undefined> {
  const store = await readStore();
  return store.sites.find((site) => site.adminKey === adminHash);
}

export async function insertLocalSite(site: LocalSite): Promise<void> {
  const store = await readStore();
  const existing = store.sites.find((item) => item.id === site.id);
  if (existing) return;
  store.sites.push(site);
  await writeStore(store);
}

export async function listLocalTestimonialsBySite(
  siteId: string
): Promise<LocalTestimonial[]> {
  const store = await readStore();
  return store.testimonials
    .filter((item) => item.siteId === siteId)
    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
}

export async function updateLocalTestimonialStatus(
  siteId: string,
  id: string,
  status: "pending" | "approved" | "deleted"
): Promise<void> {
  const store = await readStore();
  const row = store.testimonials.find((item) => item.siteId === siteId && item.id === id);
  if (!row) return;
  row.status = status;
  row.updatedAt = new Date().toISOString();
  await writeStore(store);
}

export async function insertLocalTestimonial(
  testimonial: LocalTestimonial
): Promise<void> {
  const store = await readStore();
  const existing = store.testimonials.find((item) => item.id === testimonial.id);
  if (existing) return;
  store.testimonials.push(testimonial);
  await writeStore(store);
}

export async function getLocalTestimonialsBySiteId(
  siteId: string,
  status?: "pending" | "approved" | "deleted"
): Promise<LocalTestimonial[]> {
  const store = await readStore();
  let items = store.testimonials.filter((item) => item.siteId === siteId);
  if (status) {
    items = items.filter((item) => item.status === status);
  }
  return items.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
}

export async function getLocalTestimonialById(
  siteId: string,
  id: string
): Promise<LocalTestimonial | undefined> {
  const store = await readStore();
  return store.testimonials.find(
    (item) => item.siteId === siteId && item.id === id
  );
}

export async function listLocalSitesByAdminHash(
  adminHash: string
): Promise<LocalSite[]> {
  const store = await readStore();
  return store.sites.filter((site) => site.adminKey === adminHash);
}
