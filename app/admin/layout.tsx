import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, role")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/login?error=not-admin");
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-30 bg-white border-b border-line">
        <div className="max-w-[1080px] mx-auto px-[18px]">
          <div className="flex items-center justify-between py-[14px] gap-3">
            <Link href="/admin" className="flex items-center gap-2 min-w-0">
              <div className="w-[36px] h-[36px] rounded-[10px] bg-navy flex items-center justify-center text-white font-display text-[14px] shrink-0">
                S
              </div>
              <div className="min-w-0">
                <div className="font-display text-navy text-[14px] leading-tight truncate">
                  Dashboard Admin
                </div>
                <div className="text-muted text-[10px] truncate">
                  {profile.name} · {profile.role}
                </div>
              </div>
            </Link>

            <AdminNav />
          </div>
        </div>
      </header>

      <div className="max-w-[1080px] mx-auto px-[18px] py-6">{children}</div>
    </div>
  );
}