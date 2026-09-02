import Link from "next/link";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/menu/HeroSection";
import { MenuTodayCard } from "@/components/menu/MenuTodayCard";
import {
  TotalPortionsCard,
  NutritionGrid,
  PortionsPerGroup,
  BenefitsCard,
} from "@/components/menu/PortionSummary";
import { getMenuByDate } from "@/lib/supabase/queries";
import { mapToDailyMenu } from "@/lib/utils/menu-mapper";

export default async function MenuDetailPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const menuRaw = await getMenuByDate(date);

  if (!menuRaw) {
    notFound();
  }

  const menu = mapToDailyMenu(menuRaw);

  return (
    <>
      <HeroSection menuDate={date} />
      <div className="max-w-[1080px] mx-auto px-[18px]">
        <div className="mt-4">
          <Link href="/menu" className="text-navy text-[12px] font-semibold">
            ← Kembali ke Riwayat Menu
          </Link>
        </div>

        <MenuTodayCard menu={menu} />
        <TotalPortionsCard total={menu.totalPortions} />
        <NutritionGrid menu={menu} />
        <PortionsPerGroup menu={menu} />
        <BenefitsCard benefits={menu.benefits} />
      </div>
    </>
  );
}