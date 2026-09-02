import { createClient } from "@/lib/supabase/client";

const MAX_FILE_SIZE_MB = 3;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export type UploadResult =
  | { success: true; url: string }
  | { success: false; message: string };

export async function uploadImage(
  file: File,
  bucket: "menu-images" | "article-images" | "site-assets",
  path: string
): Promise<UploadResult> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      success: false,
      message: "Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP.",
    };
  }

  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return {
      success: false,
      message: `Ukuran file maksimal ${MAX_FILE_SIZE_MB}MB.`,
    };
  }

  const supabase = createClient();

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { success: true, url: `${data.publicUrl}?t=${Date.now()}` };
}