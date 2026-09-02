"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-[18px] py-10">
      <div className="w-full max-w-[400px]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#B9C6D6] text-[12px] font-medium mb-6 hover:text-white transition-colors"
        >
          ← Kembali ke Beranda
        </Link>

        <div className="card p-[28px]">
          <h1 className="font-display text-navy text-[24px] m-0">Admin SPPG</h1>
          <p className="text-muted text-[12px] mt-1 mb-6">
            Masuk menggunakan email dan password admin.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-navy mb-[6px]">
                Email
              </label>
              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-[11px] border border-line rounded-[10px] outline-none text-sm focus:border-navy"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-navy mb-[6px]">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-[11px] border border-line rounded-[10px] outline-none text-sm focus:border-navy"
              />
            </div>

            {error && (
              <p className="text-danger text-[11px] bg-[#FDECEA] rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy text-white rounded-[10px] py-[12px] font-medium text-sm disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}