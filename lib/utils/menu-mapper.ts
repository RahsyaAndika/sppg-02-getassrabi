import type { DailyMenu, PortionGroup } from "@/types/menu";
import type { MenuWithDetails } from "@/lib/supabase/queries";

const ITEM_CATEGORY_MAP: Record<
  string,
  "foodMain" | "foodAnimal" | "foodPlant" | "foodVegetable" | "foodFruit"
> = {
  makanan_pokok: "foodMain",
  protein_hewani: "foodAnimal",
  protein_nabati: "foodPlant",
  sayur: "foodVegetable",
  buah: "foodFruit",
};

export function mapToDailyMenu(menu: MenuWithDetails): DailyMenu {
  const foods = {
    foodMain: "",
    foodAnimal: "",
    foodPlant: "",
    foodVegetable: "",
    foodFruit: "",
  };

  menu.items.forEach((item) => {
    const key = ITEM_CATEGORY_MAP[item.kategori];
    if (key) foods[key] = item.nama;
  });

  const portions = {
    big: 0,
    small: 0,
    toddler: 0,
    preg: 0,
    breast: 0,
  } as Record<PortionGroup, number>;

  const nutrition = {
    big: {},
    small: {},
    toddler: {},
    preg: {},
    breast: {},
  } as DailyMenu["nutrition"];

  menu.portions.forEach((p) => {
    const key = p.group_key as PortionGroup;
    portions[key] = p.portion_count;
    nutrition[key] = {
      e: p.energi_kkal ? String(p.energi_kkal) : undefined,
      p: p.protein_g ? String(p.protein_g) : undefined,
      l: p.lemak_g ? String(p.lemak_g) : undefined,
      c: p.karbohidrat_g ? String(p.karbohidrat_g) : undefined,
      s: p.serat_g ? String(p.serat_g) : undefined,
    };
  });

  return {
    id: menu.id,
    menuDate: menu.menu_date,
    menuName: menu.menu_name,
    description: menu.description,
    ...foods,
    photoUrl: menu.photo_url,
    totalPortions: menu.total_portions,
    consumptionLimit: menu.consumption_limit,
    benefits: menu.benefits,
    portions,
    nutrition,
  };
}