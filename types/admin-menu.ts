export type MenuItemCategory =
  | "makanan_pokok"
  | "protein_hewani"
  | "protein_nabati"
  | "sayur"
  | "buah";

export type PortionGroupKey = "big" | "small" | "toddler" | "preg" | "breast";

export const MENU_ITEM_LABELS: Record<MenuItemCategory, string> = {
  makanan_pokok: "Makanan Pokok",
  protein_hewani: "Protein Hewani",
  protein_nabati: "Protein Nabati",
  sayur: "Sayur",
  buah: "Buah",
};

export const PORTION_GROUP_LABELS: Record<PortionGroupKey, string> = {
  big: "Porsi Besar",
  small: "Porsi Kecil",
  toddler: "Balita",
  preg: "Bumil",
  breast: "Busui",
};

export type PortionFormValue = {
  count: number;
  e: string;
  p: string;
  l: string;
  c: string;
  s: string;
};

export type MenuFormValues = {
  menuDate: string;
  menuName: string;
  description: string;
  consumptionLimit: string;
  totalPortions: number;
  benefits: string; // dipisah koma di form, jadi array text[] saat disimpan
  status: "draft" | "published";
  photoUrl: string; // BARU
  items: Record<MenuItemCategory, string>;
  portions: Record<PortionGroupKey, PortionFormValue>;
};

export function emptyMenuForm(): MenuFormValues {
  return {
    menuDate: new Date().toISOString().slice(0, 10),
    menuName: "",
    description: "",
    consumptionLimit: "",
    totalPortions: 0,
    benefits: "",
    status: "published",
    photoUrl: "",
    items: {
      makanan_pokok: "",
      protein_hewani: "",
      protein_nabati: "",
      sayur: "",
      buah: "",
    },
    portions: {
      big: { count: 0, e: "", p: "", l: "", c: "", s: "" },
      small: { count: 0, e: "", p: "", l: "", c: "", s: "" },
      toddler: { count: 0, e: "", p: "", l: "", c: "", s: "" },
      preg: { count: 0, e: "", p: "", l: "", c: "", s: "" },
      breast: { count: 0, e: "", p: "", l: "", c: "", s: "" },
    },
  };
}

