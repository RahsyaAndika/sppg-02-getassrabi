export type PortionGroup = "big" | "small" | "toddler" | "preg" | "breast";

export type NutritionValue = {
  e?: string; // energi (kkal)
  p?: string; // protein (g)
  l?: string; // lemak (g)
  c?: string; // karbohidrat (g)
  s?: string; // serat (g)
};

export type DailyMenu = {
  id: string;
  menuDate: string; // format YYYY-MM-DD
  menuName: string;
  description: string;
  foodMain: string;
  foodAnimal: string;
  foodPlant: string;
  foodVegetable: string;
  foodFruit: string;
  photoUrl: string;
  totalPortions: number;
  consumptionLimit: string;
  benefits: string[];
  portions: Record<PortionGroup, number>;
  nutrition: Record<PortionGroup, NutritionValue>;
};

export const PortionGroup: Record<PortionGroup, string> = {
  big: "Porsi Besar",
  small: "Porsi Kecil",
  toddler: "Balita",
  preg: "Bumil",
  breast: "Busui",
};