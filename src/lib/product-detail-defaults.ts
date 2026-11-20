import type {
  CategoryTag,
  ProductDetailBlock,
  ProductDetailBlockLayout,
} from "@/components/sites/brooklinen/catalog";
import type { SwatchItem } from "@/components/sites/brooklinen/data";

const ALLOWED_LAYOUTS = new Set<ProductDetailBlockLayout>([
  "split-left",
  "split-right",
  "full-banner",
  "two-images",
  "text-only",
]);

export function sanitizeGalleryImages(val: unknown): string[] | undefined {
  if (!Array.isArray(val)) return undefined;
  const out = val
    .filter((v): v is string => typeof v === "string")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 20);
  return out;
}

export function sanitizeProductDetailBlocks(
  val: unknown
): ProductDetailBlock[] | undefined {
  if (!Array.isArray(val)) return undefined;
  const out: ProductDetailBlock[] = [];
  for (let i = 0; i < Math.min(val.length, 24); i++) {
    const raw = val[i];
    if (!raw || typeof raw !== "object") continue;
    const obj = raw as Record<string, unknown>;
    const layout = ALLOWED_LAYOUTS.has(obj.layout as ProductDetailBlockLayout)
      ? (obj.layout as ProductDetailBlockLayout)
      : "split-left";

    const eyebrowVi =
      typeof obj.eyebrowVi === "string" ? obj.eyebrowVi.trim() : "";
    const eyebrowEn =
      typeof obj.eyebrowEn === "string" ? obj.eyebrowEn.trim() : "";
    const headingVi =
      typeof obj.headingVi === "string" ? obj.headingVi.trim() : "";
    const headingEn =
      typeof obj.headingEn === "string" ? obj.headingEn.trim() : "";
    const bodyVi = typeof obj.bodyVi === "string" ? obj.bodyVi.trim() : "";
    const bodyEn = typeof obj.bodyEn === "string" ? obj.bodyEn.trim() : "";
    const image = typeof obj.image === "string" ? obj.image.trim() : "";
    const secondaryImage =
      typeof obj.secondaryImage === "string" ? obj.secondaryImage.trim() : "";
    const captionVi =
      typeof obj.captionVi === "string" ? obj.captionVi.trim() : "";
    const captionEn =
      typeof obj.captionEn === "string" ? obj.captionEn.trim() : "";

    // Skip completely empty blocks
    if (
      !headingVi &&
      !headingEn &&
      !bodyVi &&
      !bodyEn &&
      !image &&
      !secondaryImage
    ) {
      continue;
    }

    out.push({
      id:
        typeof obj.id === "string" && obj.id.trim()
          ? obj.id.trim()
          : `blk-${i + 1}`,
      layout,
      eyebrowVi: eyebrowVi || undefined,
      eyebrowEn: eyebrowEn || eyebrowVi || undefined,
      headingVi: headingVi || undefined,
      headingEn: headingEn || headingVi || undefined,
      bodyVi: bodyVi || undefined,
      bodyEn: bodyEn || bodyVi || undefined,
      image: image || undefined,
      secondaryImage: secondaryImage || undefined,
      captionVi: captionVi || undefined,
      captionEn: captionEn || captionVi || undefined,
    });
  }
  return out;
}

interface ProductSeedLike {
  slug: string;
  tags: readonly CategoryTag[];
  mainImage: string;
  hoverImage?: string;
  swatches?: readonly SwatchItem[];
}

export function getDefaultProductDetailBlocks(
  product: ProductSeedLike
): ProductDetailBlock[] {
  const tags = new Set(product.tags);
  const altSwatchImg = product.swatches?.find(
    (s) =>
      s.mainImage &&
      s.mainImage !== product.mainImage &&
      s.mainImage !== product.hoverImage
  )?.mainImage;

  const firstMedia =
    (product.hoverImage && product.hoverImage !== product.mainImage
      ? product.hoverImage
      : altSwatchImg) ||
    "/sites/brooklinen/categories/BKL_25111_UtilityEducation_Scene2Shot2_071x_8x9_-83ce0562.jpg";

  if (tags.has("bath") || tags.has("robes")) {
    return [
      {
        id: `${product.slug}-story-1`,
        layout: "split-left",
        eyebrowVi: "CHẤT LIỆU THỔ NHĨ KỲ THƯỢNG HẠNG",
        eyebrowEn: "100% TURKISH COTTON",
        headingVi: "Dày dặn, thấm hút nhanh và êm mềm như spa tại nhà",
        headingEn: "Plush, ultra-absorbent spa comfort every single day",
        bodyVi:
          "Được dệt từ sợi bông dài Thổ Nhĩ Kỳ tuyển chọn giúp bề mặt bông xốp tự nhiên, ôm nhẹ làn da ngay sau khi tắm mà vẫn nhanh khô thoáng.\n- Định lượng sợi dày dặn, giữ độ phồng êm qua nhiều lần giặt\n- Đường may viền đôi chắc chắn, hạn chế xổ lông\n- Chứng nhận OEKO-TEX® Standard 100 an toàn cho làn da nhạy cảm",
        bodyEn:
          "Woven from long-staple Turkish cotton for cloud-like loft that wraps skin in warmth while drying remarkably fast.\n- Dense, lofty weave that stays plush wash after wash\n- Double-stitched hems built for everyday durability\n- OEKO-TEX® certified free from harmful chemicals",
        image: firstMedia,
      },
      {
        id: `${product.slug}-story-2`,
        layout: "split-right",
        eyebrowVi: "THIẾT KẾ TINH TẾ",
        eyebrowEn: "THOUGHTFUL DETAILS",
        headingVi: "Từng chi tiết nhỏ được chăm chút cho sự thư giãn trọn vẹn",
        headingEn: "Tailored details made for slow mornings and cozy nights",
        bodyVi:
          "Phom dáng rộng rãi thoải mái cùng bảng màu trang nhã dễ dàng đồng bộ với không gian phòng tắm hiện đại. Đây cũng là món quà tặng tinh tế được yêu thích nhất mỗi dịp lễ.",
        bodyEn:
          "Relaxed proportions and calming tones pair effortlessly with modern bath spaces—making it a perennial favorite for gifting and self-care.",
        image:
          "/sites/brooklinen/trending/BKL_26-04_WaffleWorld_Look18_2860x_800x900_WO_46-767127bb.jpg",
      },
    ];
  }

  if (tags.has("duvets") || tags.has("pillows")) {
    return [
      {
        id: `${product.slug}-story-1`,
        layout: "split-left",
        eyebrowVi: "CÔNG NGHỆ ĐỘ PHỒNG ÊM ÁI",
        eyebrowEn: "CLOUD-LOFT ENGINEERED",
        headingVi: "Nâng đỡ êm nhẹ, thoáng khí suốt bốn mùa",
        headingEn: "Weightless warmth and breathable support all night",
        bodyVi:
          "Cấu trúc khoang giữ nhiệt thông minh phân bổ ruột chăn/gối đồng đều, ngăn xô lệch và duy trì độ êm bồng bềnh chuẩn khách sạn 5 sao.\n- Vỏ bọc 100% cotton sợi khít ngăn thoát lông tối ưu\n- Có dây buộc góc cố định vừa vặn với mọi loại vỏ chăn\n- Đạt chuẩn an toàn OEKO-TEX® không gây kích ứng",
        bodyEn:
          "Baffle-box construction keeps fill evenly distributed with zero cold spots, delivering five-star hotel loft night after night.\n- Down-proof 100% cotton sateen shell\n- Corner loops lock seamlessly into any duvet cover\n- Hypoallergenic and OEKO-TEX® certified",
        image: firstMedia,
      },
      {
        id: `${product.slug}-story-2`,
        layout: "split-right",
        eyebrowVi: "DỄ DÀNG PHỐI HỢP",
        eyebrowEn: "EFFORTLESS LAYERING",
        headingVi: "Nền tảng hoàn hảo cho chiếc giường êm như mây",
        headingEn: "The foundation of an effortlessly inviting bed",
        bodyVi:
          "Kết hợp hoàn hảo cùng vỏ chăn Percale thoáng mát cho mùa hè hoặc Sateen mềm mượt vào mùa lạnh để nâng tầm chất lượng giấc ngủ mỗi đêm.",
        bodyEn:
          "Pair with crisp Percale for warm sleepers or buttery Luxe Sateen for year-round, sink-right-in coziness.",
        image:
          "/sites/brooklinen/categories/BKL_25-11_FebNewnessSP2_Shot8_1280x_8x9_Darkened-4f11108b.jpg",
      },
    ];
  }

  // Default: Sheets / Throws / Bundles / Home
  return [
    {
      id: `${product.slug}-story-1`,
      layout: "split-left",
      eyebrowVi: "SỢI BÔNG DÀI TUYỂN CHỌN",
      eyebrowEn: "LONG-STAPLE COTTON CRAFT",
      headingVi: "Càng giặt càng mềm, thoáng mát tự nhiên suốt đêm dài",
      headingEn: "Woven from long-staple fibers that get softer every wash",
      bodyVi:
        "Khác với sợi ngắn thông thường dễ xù lông sau vài tháng, sợi bông dài một lớp giúp bề mặt vải vừa mịn màng, thoáng khí vượt trội vừa bền màu qua nhiều năm sử dụng.\n- Ga chun sâu tới 40cm ôm sát đệm, có nhãn đánh dấu cạnh dài/ngắn tiện lợi\n- Vỏ gối khóa phong bì giữ ruột gối gọn gàng\n- Đạt chứng nhận OEKO-TEX® an toàn tuyệt đối cho da",
      bodyEn:
        "Unlike short-staple fibers that pill over time, single-ply long-staple yarns create a breathable, durable weave that softens beautifully with every wash.\n- Deep 16-inch pockets with 'Long' and 'Short' side labels\n- Envelope pillowcase closures keep pillows neatly tucked\n- OEKO-TEX® certified free of harmful substances",
      image: firstMedia,
    },
    {
      id: `${product.slug}-story-2`,
      layout: "split-right",
      eyebrowVi: "PHỐI MÀU TINH TẾ",
      eyebrowEn: "DESIGNED TO MIX & MATCH",
      headingVi: "Biến phòng ngủ thành không gian nghỉ dưỡng riêng của bạn",
      headingEn: "Turn your bedroom into a five-star retreat",
      bodyVi:
        "Bảng màu trung tính và họa tiết kẻ sọc vượt thời gian giúp bạn dễ dàng phối lớp ga giường, vỏ chăn và chăn phủ theo gu thẩm mỹ riêng mà luôn hài hòa, ấm cúng.",
      bodyEn:
        "Timeless neutrals and curated seasonal stripes let you layer sheets, duvets, and throws effortlessly for a lived-in luxury look.",
      image:
        "/sites/brooklinen/trending/Bedding_Bundles_8x9_22c62d8b-63e5-45ff-a9cd-9099-6967cbda.jpg",
    },
  ];
}
