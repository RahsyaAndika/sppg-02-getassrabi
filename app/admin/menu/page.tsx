import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MenuTable } from "@/components/admin/MenuTable";
import { ExportMenuButtons } from "@/components/admin/ExportMenuButtons";

const PAGE_SIZE = 10;

export default async function AdminMenuPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1"));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  const { data: menus, count } = await supabase
    .from("menus")
    .select("id, menu_date, menu_name, status, total_portions", { count: "exact" })
    .order("menu_date", { ascending: false })
    .range(from, to);

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-navy text-[19px] m-0">Kelola Menu</h2>
          <p className="text-muted text-[11px] mt-1">
            {count ?? 0} menu terdaftar
          </p>
        </div>
        <Link
          href="/admin/menu/baru"
          className="bg-navy text-white text-[12px] font-medium px-5 py-[11px] rounded-full"
        >
          + Tambah Menu
        </Link>
      </div>

      <ExportMenuButtons />

      <MenuTable menus={menus ?? []} />

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4 text-[12px]">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/menu?page=${p}`}
              className={`px-3 py-1 rounded-lg border ${
                p === page
                  ? "bg-navy text-white border-navy"
                  : "border-line text-navy"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}