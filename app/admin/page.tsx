import { createClient } from "@/lib/supabase/server";

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
    supabase.from("profiles").select("name, role").eq("id", user!.id).single(),
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
    totalMenus: totalMenus ?? 0,
    menuTodayName: menuToday?.menu_name ?? null,
    totalArticles: totalArticles ?? 0,
    activeAnnouncements: activeAnnouncements ?? 0,
  };
}

type GreetingPeriod = "pagi" | "siang" | "sore" | "malam";

function getGreetingPeriod(): GreetingPeriod {
  const hour = new Date().getHours();
  if (hour < 11) return "pagi";
  if (hour < 15) return "siang";
  if (hour < 19) return "sore";
  return "malam";
}

const GREETING_CONFIG: Record<
  GreetingPeriod,
  { label: string; photoSeed: string; overlay: string }
> = {
  pagi: {
    label: "Selamat pagi",
    photoSeed: "sppg-pagi",
    overlay:
      "linear-gradient(120deg, rgba(18,42,76,0.88), rgba(18,42,76,0.55))",
  },
  siang: {
    label: "Selamat siang",
    photoSeed: "sppg-siang",
    overlay:
      "linear-gradient(120deg, rgba(18,42,76,0.85), rgba(22,58,45,0.55))",
  },
  sore: {
    label: "Selamat sore",
    photoSeed: "sppg-sore",
    overlay:
      "linear-gradient(120deg, rgba(18,42,76,0.9), rgba(90,60,20,0.55))",
  },
  malam: {
    label: "Selamat malam",
    photoSeed: "sppg-malam",
    overlay:
      "linear-gradient(120deg, rgba(10,18,32,0.92), rgba(18,42,76,0.7))",
  },
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  editor: "Editor",
  superadmin: "Super Admin",
};

export default async function AdminDashboardPage() {
  const data = await getDashboardData();
  const period = getGreetingPeriod();
  const greeting = GREETING_CONFIG[period];
  const photoUrl = `https://picsum.photos/seed/${greeting.photoSeed}/1200/500`;

  const cards = [
    {
      label: "Total Menu Terdaftar",
      value: data.totalMenus.toLocaleString("id-ID"),
      sub: "Seluruh menu di database",
    },
    {
      label: "Menu Hari Ini",
      value: data.menuTodayName ? "Sudah diisi" : "Belum diisi",
      sub: data.menuTodayName ?? "Admin belum mengisi menu untuk hari ini",
    },
    {
      label: "Jumlah Berita",
      value: data.totalArticles.toLocaleString("id-ID"),
      sub: "Draft + published",
    },
    {
      label: "Pengumuman Aktif",
      value: data.activeAnnouncements.toLocaleString("id-ID"),
      sub: "Tampil di beranda publik",
    },
  ];

  const initial = data.name.trim().charAt(0).toUpperCase() || "A";

  return (
    <div>
      {/* Kartu ucapan selamat datang, latar foto online sesuai waktu */}
      <div
        className="relative overflow-hidden rounded-[18px] mb-6 border border-line"
        style={{
          backgroundImage: `${greeting.overlay}, url(${photoUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative p-6 md:p-8">
          <div className="flex items-center gap-4">
            <div className="w-[52px] h-[52px] rounded-full bg-white/[.14] border border-white/[.22] flex items-center justify-center font-display text-white text-[20px] shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-[#D7E1EC] text-[12px] m-0">{greeting.label},</p>
              <h1 className="font-display text-white text-[24px] md:text-[28px] m-0 truncate">
                {data.name}
              </h1>
              <span className="inline-block mt-[8px] px-[10px] py-[4px] rounded-full bg-white/[.14] text-white text-[10px] font-medium">
                {ROLE_LABELS[data.role] ?? data.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      <h2 className="font-display text-navy text-[18px] mb-4">Ringkasan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="card p-5">
            <p className="text-muted text-[11px] font-medium m-0">{card.label}</p>
            <p className="font-display text-navy text-[28px] mt-2 mb-1">{card.value}</p>
            <p className="text-muted text-[11px] m-0">{card.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}