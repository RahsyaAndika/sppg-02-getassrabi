import { MenuForm } from "@/components/admin/MenuForm";
import { emptyMenuForm } from "@/types/admin-menu";

export default function TambahMenuPage() {
  return (
    <div>
      <h2 className="text-navy text-[16px] font-bold mb-4">Tambah Menu</h2>
      <MenuForm initialValues={emptyMenuForm()} />
    </div>
  );
}