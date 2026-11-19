import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Quản trị cửa hàng | otamaweb Admin",
  description: "Trang quản trị sản phẩm, danh mục, đơn hàng và cài đặt otamaweb.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
