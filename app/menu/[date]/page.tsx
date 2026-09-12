import Link from "next/link";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/menu/HeroSection";
import { MenuTodayCard } from "@/components/menu/MenuTodayCard";
import { NutritionGrid, PortionsPerGroup } from "@/components/menu/PortionSummary";
import { TotalPortionsAndBenefits } from "@/components/menu/TotalPortionsAndBenefits";
import { getMenuByDate } from "@/lib/supabase/queries";
import { mapToDailyMenu } from "@/lib/utils/menu-mapper";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}): Promise<Metadata> {
  const { date } = await params;
  const menuRaw = await getMenuByDate(date);

  if (!menuRaw) {
    return { title: "Menu tidak ditemukan" };
  }

  const description =
    menuRaw.description || `Menu MBG tanggal ${date} — SPPG Getassrabi 02.`;

  return {
    title: `${menuRaw.menu_name} — Menu MBG`,
    description,
    openGraph: {
      title: `${menuRaw.menu_name} — Menu MBG`,
      description,
      type: "website",
      images: menuRaw.photo_url ? [{ url: menuRaw.photo_url, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${menuRaw.menu_name} — Menu MBG`,
      description,
      images: menuRaw.photo_url ? [menuRaw.photo_url] : [],
    },
  };
}

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
        <TotalPortionsAndBenefits total={menu.totalPortions} benefits={menu.benefits} />
        <NutritionGrid menu={menu} />
        <PortionsPerGroup menu={menu} />
      </div>
    </>
  );
}