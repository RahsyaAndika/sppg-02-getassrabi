import { createClient } from "@/lib/supabase/server";
import { GreetingBanner } from "@/components/admin/GreetingBanner";
import { ClipboardList, UtensilsCrossed, Newspaper, Megaphone } from "lucide-react";

async function getDashboardData() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    { data: profile },
    { count: totalMenus },
    { data: menuToday },
    { count: totalArticles },
    { count: activeAnnouncements },
  ] = await Promise.all([
    supabase.from("profiles").select("name, role, avatar_url").eq("id", user!.id).single(),
    supabase.from("menus").select("*", { count: "exact", head: true }),
    supabase.from("menus").select("id, menu_name").eq("menu_date", today).maybeSingle(),
    supabase.from("articles").select("*", { count: "exact", head: true }),
    supabase
      .from("announcements")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
  ]);

  return {
    name: profile?.name ?? "Admin",
    role: profile?.role ?? "admin",
    avatarUrl: profile?.avatar_url ?? "",
    totalMenus: totalMenus ?? 0,
    menuTodayName: menuToday?.menu_name ?? null,
    totalArticles: totalArticles ?? 0,
    activeAnnouncements: activeAnnouncements ?? 0,
  };
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  editor: "Editor",
  superadmin: "Super Admin",
};

export default async function AdminDashboardPage() {
  const data = await getDashboardData();
  const initial = data.name.trim().charAt(0).toUpperCase() || "A";

  const cards = [
    {
      label: "Total Menu Terdaftar",
      value: data.totalMenus.toLocaleString("id-ID"),
      sub: "Seluruh menu di database",
      icon: ClipboardList,
    },
    {
      label: "Menu Hari Ini",
      value: data.menuTodayName ? "Sudah diisi" : "Belum diisi",
      sub: data.menuTodayName ?? "Admin belum mengisi menu untuk hari ini",
      icon: UtensilsCrossed,
    },
    {
      label: "Jumlah Berita",
      value: data.totalArticles.toLocaleString("id-ID"),
      sub: "Draft + published",
      icon: Newspaper,
    },
    {
      label: "Pengumuman Aktif",
      value: data.activeAnnouncements.toLocaleString("id-ID"),
      sub: "Tampil di beranda publik",
      icon: Megaphone,
    },
  ];

  return (
    <div>
      <GreetingBanner
        name={data.name}
        roleLabel={ROLE_LABELS[data.role] ?? data.role}
        initial={initial}
        avatarUrl={data.avatarUrl}
      />

      <h2 className="font-display text-navy text-[18px] mb-4">Ringkasan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="card p-5">
              <div className="w-[34px] h-[34px] rounded-[10px] bg-[#EEF6EF] text-green flex items-center justify-center mb-3">
                <Icon size={16} />
              </div>
              <p className="text-muted text-[11px] font-medium m-0">{card.label}</p>
              <p className="font-display text-navy text-[26px] mt-1 mb-1">{card.value}</p>
              <p className="text-muted text-[11px] m-0">{card.sub}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}