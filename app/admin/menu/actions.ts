"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { MenuFormValues } from "@/types/admin-menu";
import type { HistoryRange } from "@/lib/supabase/queries";
import { rangeToDays } from "@/lib/supabase/queries";

export async function deleteMenu(menuId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("menus").delete().eq("id", menuId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/menu");
  return { success: true, message: "Menu berhasil dihapus." };
}

async function saveMenuItemsAndPortions(
  supabase: Awaited<ReturnType<typeof createClient>>,
  menuId: string,
  values: MenuFormValues
) {
  // Strategi paling sederhana & stabil: hapus baris lama, insert ulang.
  // Aman karena jumlah baris per menu selalu tetap (5 item + 5 kelompok porsi).
  await supabase.from("menu_items").delete().eq("menu_id", menuId);
  await supabase.from("menu_portions").delete().eq("menu_id", menuId);

  const itemsPayload = Object.entries(values.items)
    .filter(([, nama]) => nama.trim() !== "")
    .map(([kategori, nama]) => ({
      menu_id: menuId,
      kategori,
      nama,
    }));

  if (itemsPayload.length > 0) {
    const { error: itemsError } = await supabase
      .from("menu_items")
      .insert(itemsPayload);
    if (itemsError) throw itemsError;
  }

  const portionsPayload = Object.entries(values.portions).map(
    ([groupKey, p]) => ({
      menu_id: menuId,
      group_key: groupKey,
      group_label:
        { big: "Porsi Besar", small: "Porsi Kecil", toddler: "Balita", preg: "Bumil", breast: "Busui" }[
          groupKey as keyof typeof values.portions
        ],
      portion_count: p.count,
      energi_kkal: p.e === "" ? 0 : Number(p.e),
      protein_g: p.p === "" ? 0 : Number(p.p),
      lemak_g: p.l === "" ? 0 : Number(p.l),
      karbohidrat_g: p.c === "" ? 0 : Number(p.c),
      serat_g: p.s === "" ? 0 : Number(p.s),
    })
  );

  const { error: portionsError } = await supabase
    .from("menu_portions")
    .insert(portionsPayload);
  if (portionsError) throw portionsError;
}

export async function createMenu(values: MenuFormValues) {
  const supabase = await createClient();

  const { data: menu, error } = await supabase
    .from("menus")
    .insert({
      menu_date: values.menuDate,
      menu_name: values.menuName,
      description: values.description,
      consumption_limit: values.consumptionLimit,
      total_portions: values.totalPortions,
      benefits: values.benefits
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean),
      status: values.status,
      photo_url: values.photoUrl,
    })
    .select("id")
    .single();

  if (error || !menu) {
    return { success: false, message: error?.message ?? "Gagal menyimpan menu." };
  }

  try {
    await saveMenuItemsAndPortions(supabase, menu.id, values);
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : "Gagal menyimpan detail menu.",
    };
  }

  revalidatePath("/admin/menu");
  redirect("/admin/menu");
}

export async function updateMenu(menuId: string, values: MenuFormValues) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("menus")
    .update({
      menu_date: values.menuDate,
      menu_name: values.menuName,
      description: values.description,
      consumption_limit: values.consumptionLimit,
      total_portions: values.totalPortions,
      benefits: values.benefits
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean),
      status: values.status,
      photo_url: values.photoUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", menuId);

  if (error) {
    return { success: false, message: error.message };
  }

  try {
    await saveMenuItemsAndPortions(supabase, menuId, values);
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : "Gagal menyimpan detail menu.",
    };
  }

  revalidatePath("/admin/menu");
  redirect("/admin/menu");
}

export type MenuExportItem = {
  menu_date: string;
  menu_name: string;
  description: string;
  category: string;
  status: string;
  total_portions: number;
  consumption_limit: string;
  photo_url: string;
  benefits: string[];
  items: { kategori: string; nama: string }[];
  portions: {
    group_key: string;
    group_label: string;
    portion_count: number;
    energi_kkal: number;
    protein_g: number;
    lemak_g: number;
    karbohidrat_g: number;
    serat_g: number;
  }[];
};

export async function getMenuExportData(range: HistoryRange): Promise<MenuExportItem[]> {
  const supabase = await createClient();
  const days = rangeToDays(range);

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);
  const fromDateStr = fromDate.toISOString().slice(0, 10);

  const { data: menus } = await supabase
    .from("menus")
    .select(
      "id, menu_date, menu_name, description, category, total_portions, status, consumption_limit, photo_url, benefits"
    )
    .gte("menu_date", fromDateStr)
    .order("menu_date", { ascending: false });

  if (!menus || menus.length === 0) return [];

  const menuIds = menus.map((m) => m.id);

  const [{ data: allItems }, { data: allPortions }] = await Promise.all([
    supabase.from("menu_items").select("menu_id, kategori, nama").in("menu_id", menuIds),
    supabase.from("menu_portions").select("*").in("menu_id", menuIds),
  ]);

  return menus.map((m) => ({
    menu_date: m.menu_date,
    menu_name: m.menu_name,
    description: m.description ?? "",
    category: m.category ?? "",
    status: m.status,
    total_portions: m.total_portions ?? 0,
    consumption_limit: m.consumption_limit ?? "",
    photo_url: m.photo_url ?? "",
    benefits: m.benefits ?? [],
    items: (allItems ?? [])
      .filter((i) => i.menu_id === m.id)
      .map((i) => ({ kategori: i.kategori, nama: i.nama })),
    portions: (allPortions ?? []).filter((p) => p.menu_id === m.id),
  }));
}