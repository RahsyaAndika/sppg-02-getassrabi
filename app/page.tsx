import { HeroSection } from "@/components/menu/HeroSection";
import { MenuTodayCard } from "@/components/menu/MenuTodayCard";
import { NutritionGrid, PortionsPerGroup } from "@/components/menu/PortionSummary";
import { TotalPortionsAndBenefits } from "@/components/menu/TotalPortionsAndBenefits";
import { AnnouncementList } from "@/components/announcement/AnnouncementList";
import { getMenuByDate, getActiveAnnouncements } from "@/lib/supabase/queries";
import { mapToDailyMenu } from "@/lib/utils/menu-mapper";

export default async function HomePage() {
  const today = new Date().toISOString().slice(0, 10);

  const [menuRaw, announcements] = await Promise.all([
    getMenuByDate(today),
    getActiveAnnouncements(),
  ]);

  const menu = menuRaw ? mapToDailyMenu(menuRaw) : null;

  return (
    <>
      <HeroSection menuDate={today} />
      <div className="max-w-[1080px] mx-auto px-[18px] pb-8">
        <div className="pt-5">
          <AnnouncementList announcements={announcements} />
        </div>

        <MenuTodayCard menu={menu} />
        <TotalPortionsAndBenefits
          total={menu?.totalPortions ?? 0}
          benefits={menu?.benefits ?? []}
        />
        <NutritionGrid menu={menu} />
        <PortionsPerGroup menu={menu} />
      </div>
    </>
  );
}