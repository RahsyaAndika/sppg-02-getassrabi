import { createClient } from "@/lib/supabase/server";

export type SiteSettings = {
  nama_sppg: string;
  deskripsi: string;
  alamat: string;
  kontak: string;
  instagram: string;
  tiktok: string;
  logo_url: string;
  footer_text: string;
  profile_photo_url: string;
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("site_settings")
    .select("nama_sppg, deskripsi, alamat, kontak, instagram, tiktok, logo_url, footer_text, profile_photo_url")
    .eq("id", 1)
    .single();

  return (
    data ?? {
      nama_sppg: "SPPG Getassrabi 02",
      deskripsi: "",
      alamat: "",
      kontak: "",
      instagram: "",
      tiktok: "",
      logo_url: "",
      footer_text: "",
      profile_photo_url: "",
    }
  );
}

// ============================================
// MENU
// ============================================
export type MenuItemRow = { kategori: string; nama: string };

export type MenuPortionRow = {
  group_key: string;
  group_label: string;
  portion_count: number;
  energi_kkal: number;
  protein_g: number;
  lemak_g: number;
  karbohidrat_g: number;
  serat_g: number;
};

export type MenuWithDetails = {
  id: string;
  menu_date: string;
  menu_name: string;
  description: string;
  photo_url: string;
  consumption_limit: string;
  total_portions: number;
  benefits: string[];
  items: MenuItemRow[];
  portions: MenuPortionRow[];
};

export async function getMenuByDate(date: string): Promise<MenuWithDetails | null> {
  const supabase = await createClient();

  const { data: menu } = await supabase
    .from("menus")
    .select("*")
    .eq("menu_date", date)
    .eq("status", "published")
    .maybeSingle();

  if (!menu) return null;

  const [{ data: items }, { data: portions }] = await Promise.all([
    supabase.from("menu_items").select("kategori, nama").eq("menu_id", menu.id),
    supabase.from("menu_portions").select("*").eq("menu_id", menu.id),
  ]);

  return {
    id: menu.id,
    menu_date: menu.menu_date,
    menu_name: menu.menu_name,
    description: menu.description ?? "",
    photo_url: menu.photo_url ?? "",
    consumption_limit: menu.consumption_limit ?? "",
    total_portions: menu.total_portions ?? 0,
    benefits: menu.benefits ?? [],
    items: items ?? [],
    portions: portions ?? [],
  };
}

// ============================================
// ANNOUNCEMENTS
// ============================================
export type Announcement = {
  id: string;
  judul: string;
  isi: string;
  tanggal_publish: string;
};

export async function getActiveAnnouncements(): Promise<Announcement[]> {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data } = await supabase
    .from("announcements")
    .select("id, judul, isi, tanggal_publish")
    .eq("status", "active")
    .lte("tanggal_publish", today)
    .order("tanggal_publish", { ascending: false })
    .limit(5);

  return data ?? [];
}

// ============================================
// MENU HISTORY
// ============================================
export type MenuHistoryItem = {
  id: string;
  menu_date: string;
  menu_name: string;
  photo_url: string;
  total_portions: number;
  category: string;
};

export type HistoryRange = "week" | "month" | "3month" | "6month" | "year";

export function rangeToDays(range: HistoryRange): number {
  switch (range) {
    case "week":
      return 7;
    case "month":
      return 30;
    case "3month":
      return 90;
    case "6month":
      return 180;
    case "year":
      return 365;
    default:
      return 7;
  }
}

export async function getMenuHistory(
  range: HistoryRange,
  search?: string,
  category?: string
): Promise<MenuHistoryItem[]> {
  const supabase = await createClient();
  const days = rangeToDays(range);

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);
  const fromDateStr = fromDate.toISOString().slice(0, 10);

  let query = supabase
    .from("menus")
    .select("id, menu_date, menu_name, photo_url, total_portions, category")
    .eq("status", "published")
    .gte("menu_date", fromDateStr)
    .order("menu_date", { ascending: false });

  if (search && search.trim() !== "") {
    // Pencarian ringan: cocokkan nama menu (case-insensitive).
    // Tanggal juga otomatis bisa dicari karena user bisa ketik format YYYY-MM-DD.
    query = query.ilike("menu_name", `%${search.trim()}%`);
  }

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  const { data } = await query;
  return data ?? [];
}

export async function getMenuCategories(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("menus")
    .select("category")
    .eq("status", "published");

  const unique = Array.from(new Set((data ?? []).map((d) => d.category).filter(Boolean)));
  return unique;
}

// ============================================
// ARTICLES
// ============================================
export type ArticleListItem = {
  id: string;
  judul: string;
  slug: string;
  excerpt: string;
  image_url: string;
  tanggal_publish: string;
};

export type ArticleDetail = ArticleListItem & {
  isi: string;
};

const ARTICLES_PAGE_SIZE = 9;

export async function getArticles(page = 1): Promise<{
  articles: ArticleListItem[];
  totalPages: number;
}> {
  const supabase = await createClient();
  const from = (page - 1) * ARTICLES_PAGE_SIZE;
  const to = from + ARTICLES_PAGE_SIZE - 1;

  const { data, count } = await supabase
    .from("articles")
    .select("id, judul, slug, excerpt, image_url, tanggal_publish", { count: "exact" })
    .eq("status", "published")
    .order("tanggal_publish", { ascending: false })
    .range(from, to);

  return {
    articles: data ?? [],
    totalPages: Math.max(1, Math.ceil((count ?? 0) / ARTICLES_PAGE_SIZE)),
  };
}

export async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("articles")
    .select("id, judul, slug, excerpt, image_url, isi, tanggal_publish")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  return data ?? null;
}