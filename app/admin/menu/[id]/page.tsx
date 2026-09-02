import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MenuForm } from "@/components/admin/MenuForm";
import type {
  MenuFormValues,
  MenuItemCategory,
  PortionGroupKey,
} from "@/types/admin-menu";
import { emptyMenuForm } from "@/types/admin-menu";

export default async function EditMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: menu } = await supabase
    .from("menus")
    .select("*")
    .eq("id", id)
    .single();

  if (!menu) {
    notFound();
  }

  const { data: items } = await supabase
    .from("menu_items")
    .select("kategori, nama")
    .eq("menu_id", id);

  const { data: portions } = await supabase
    .from("menu_portions")
    .select("*")
    .eq("menu_id", id);

  const values: MenuFormValues = emptyMenuForm();
  values.menuDate = menu.menu_date;
  values.menuName = menu.menu_name;
  values.description = menu.description ?? "";
  values.consumptionLimit = menu.consumption_limit ?? "";
  values.totalPortions = menu.total_portions ?? 0;
  values.benefits = (menu.benefits ?? []).join(", ");
  values.status = menu.status;
  values.photoUrl = menu.photo_url ?? "";

  (items ?? []).forEach((item) => {
    const cat = item.kategori as MenuItemCategory;
    if (cat in values.items) {
      values.items[cat] = item.nama;
    }
  });

  (portions ?? []).forEach((p) => {
    const key = p.group_key as PortionGroupKey;
    if (key in values.portions) {
      values.portions[key] = {
        count: p.portion_count,
        e: String(p.energi_kkal ?? ""),
        p: String(p.protein_g ?? ""),
        l: String(p.lemak_g ?? ""),
        c: String(p.karbohidrat_g ?? ""),
        s: String(p.serat_g ?? ""),
      };
    }
  });

  return (
    <div>
      <h2 className="text-navy text-[16px] font-bold mb-4">Edit Menu</h2>
      <MenuForm initialValues={values} menuId={id} />
    </div>
  );
}