import { HeroSection } from "@/app/components/menu/HeroSection";
import { MenuTodayCard } from "@/app/components/menu/MenuTodayCard";
import {
  TotalPortionsCard,
  NutritionGrid,
  PortionsPerGroup,
  BenefitsCard,
} from "@/app/components/menu/PortionSummary";
import { ProfileCard } from "@/app/components/menu/ProfileCard";
import type { DailyMenu } from "@/app/types/menu";

// DUMMY SEMENTARA — akan diganti fetch dari Supabase di Tahap 11.
// Struktur data ini sengaja dibuat identik dengan skema `daily_menu`
// dari website lama supaya migrasi data nanti mulus.
const dummyMenu: DailyMenu = {
  id: "dummy-1",
  menuDate: new Date().toISOString().slice(0, 10),
  menuName: "Nasi, Ayam Bumbu Kuning, Tempe Orek, Sayur Bening, Pisang",
  description:
    "Menu bergizi seimbang untuk mendukung tumbuh kembang anak sekolah.",
  foodMain: "Nasi putih",
  foodAnimal: "Ayam bumbu kuning",
  foodPlant: "Tempe orek",
  foodVegetable: "Sayur bening bayam",
  foodFruit: "Pisang",
  photoUrl: "",
  totalPortions: 480,
  consumptionLimit: "Jam 09.00 WIB",
  benefits: ["Siswa PAUD", "Siswa SD", "Ibu Hamil", "Ibu Menyusui", "Balita"],
  portions: { big: 200, small: 150, toddler: 60, preg: 40, breast: 30 },
  nutrition: {
    big: { e: "650", p: "22", l: "18", c: "85", s: "6" },
    small: { e: "450", p: "16", l: "12", c: "60", s: "4" },
    toddler: { e: "350", p: "12", l: "10", c: "45", s: "3" },
    preg: { e: "700", p: "26", l: "20", c: "90", s: "7" },
    breast: { e: "700", p: "26", l: "20", c: "90", s: "7" },
  },
};

export default function HomePage() {
  const menu = dummyMenu; // TODO Tahap 11: ganti dengan query Supabase

  return (
    <>
      <HeroSection menuDate={menu.menuDate} />
      <div className="max-w-[1080px] mx-auto px-[18px]">
        <MenuTodayCard menu={menu} />
        <TotalPortionsCard total={menu.totalPortions} />
        <NutritionGrid menu={menu} />
        <PortionsPerGroup menu={menu} />
        <BenefitsCard benefits={menu.benefits} />
        <ProfileCard />
      </div>
    </>
  );
}
