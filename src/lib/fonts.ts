import type { FontFamilyId } from "./store-types";

export interface FontOptionMeta {
  id: FontFamilyId;
  label: string;
  hintVi: string;
  cssStack: string | undefined;
  vietnameseSupport: boolean;
  sampleVi: string;
}

export const FONT_OPTIONS: readonly FontOptionMeta[] = [
  {
    id: "default",
    label: "Font mặc định của web",
    hintVi: "Tự động theo giao diện chuẩn",
    cssStack: undefined,
    vietnameseSupport: true,
    sampleVi: "Giảm 25% Toàn Cửa Hàng",
  },
  {
    id: "be-vietnam-pro",
    label: "Be Vietnam Pro",
    hintVi: "Hiện đại, gọn gàng — hợp mô tả & nút bấm",
    cssStack: '"Be Vietnam Pro", ui-sans-serif, system-ui, sans-serif',
    vietnameseSupport: true,
    sampleVi: "Chăn Ga Gối Êm Ái Chuẩn Khách Sạn",
  },
  {
    id: "playfair-display",
    label: "Playfair Display",
    hintVi: "Có chân, sang trọng — hợp tiêu đề lớn",
    cssStack: '"Playfair Display", Georgia, serif',
    vietnameseSupport: true,
    sampleVi: "Ưu Đãi Đặc Biệt Mùa Lễ Hội",
  },
  {
    id: "montserrat",
    label: "Montserrat",
    hintVi: "Hình học, mạnh mẽ — hợp tiêu đề khuyến mãi",
    cssStack: '"Montserrat", "Be Vietnam Pro", ui-sans-serif, sans-serif',
    vietnameseSupport: true,
    sampleVi: "GIẢM 40% COMBO ĐẶC BIỆT",
  },
  {
    id: "lora",
    label: "Lora",
    hintVi: "Có chân, mềm mại — phong cách tạp chí",
    cssStack: '"Lora", Georgia, serif',
    vietnameseSupport: true,
    sampleVi: "Giấc Ngủ Trọn Vẹn Từng Đêm",
  },
  {
    id: "nunito",
    label: "Nunito",
    hintVi: "Bo tròn, thân thiện — hợp mô tả & dải băng",
    cssStack: '"Nunito", "Be Vietnam Pro", ui-sans-serif, sans-serif',
    vietnameseSupport: true,
    sampleVi: "Miễn phí giao hàng cho đơn từ 2.500.000₫",
  },
  {
    id: "oswald",
    label: "Oswald",
    hintVi: "Cao, hẹp, nổi bật — hợp tiêu đề SALE",
    cssStack: '"Oswald", "Be Vietnam Pro", ui-sans-serif, sans-serif',
    vietnameseSupport: true,
    sampleVi: "CHỈ TRONG 48 GIỜ — MUA NGAY",
  },
  {
    id: "merriweather",
    label: "Merriweather",
    hintVi: "Có chân, dễ đọc — hợp đoạn mô tả dài",
    cssStack: '"Merriweather", Georgia, serif',
    vietnameseSupport: true,
    sampleVi: "Chất liệu Cotton sợi dài thoáng mát quanh năm",
  },
  {
    id: "dancing-script",
    label: "Dancing Script",
    hintVi: "Viết tay mềm mại — hợp câu slogan ngắn",
    cssStack: '"Dancing Script", cursive, serif',
    vietnameseSupport: true,
    sampleVi: "Món Quà Yêu Thương Cho Tổ Ấm",
  },
  {
    id: "toledo",
    label: "Toledo Serial (Chỉ Tiếng Anh)",
    hintVi: "Font tiêu đề gốc Brooklinen — không hỗ trợ dấu tiếng Việt",
    cssStack: '"ToledoTS-Bold", "Playfair Display", Georgia, serif',
    vietnameseSupport: false,
    sampleVi: "Best In Bed — Luxury Sheets",
  },
  {
    id: "brandon",
    label: "Brandon Text (Chỉ Tiếng Anh)",
    hintVi: "Font nội dung gốc Brooklinen — không hỗ trợ dấu tiếng Việt",
    cssStack: '"BrandonTextWeb", "Be Vietnam Pro", ui-sans-serif, sans-serif',
    vietnameseSupport: false,
    sampleVi: "Shop Sitewide Holiday Sale",
  },
] as const;

export const ALLOWED_FONT_IDS = new Set<FontFamilyId>(
  FONT_OPTIONS.map((f) => f.id)
);

export function resolveFontStack(id?: FontFamilyId): string | undefined {
  if (!id || id === "default") return undefined;
  return FONT_OPTIONS.find((f) => f.id === id)?.cssStack;
}

export interface BrandColorSwatch {
  hex: string;
  label: string;
}

export const BRAND_COLOR_SWATCHES: readonly BrandColorSwatch[] = [
  { hex: "#FFFFFF", label: "Trắng tinh" },
  { hex: "#FDFAF8", label: "Kem sáng" },
  { hex: "#F9F3ED", label: "Kem cát" },
  { hex: "#283455", label: "Xanh Navy" },
  { hex: "#283C6E", label: "Xanh Lam đậm" },
  { hex: "#740103", label: "Đỏ rượu vang" },
  { hex: "#417823", label: "Xanh lá" },
  { hex: "#1A1A1A", label: "Đen trầm" },
];
