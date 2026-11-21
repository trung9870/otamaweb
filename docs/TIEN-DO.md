# Tiến độ dự án otamaweb (Brooklinen clone)

> Cập nhật lần cuối: 22/11/2026 — dừng tại commit "feat(pdp): swatch dye-morph + 2.5D bed studio (thử nghiệm)".

## Chạy local

```bash
npm install
npm run check                                   # eslint + tsc + next build --webpack (bắt buộc --webpack)
npm run start -- -H 127.0.0.1 -p 3099           # http://127.0.0.1:3099/?lang=vi
```

- Trang quản trị: `http://127.0.0.1:3099/admin` — tài khoản demo `admin@otamaweb.local` / `otama123456`
- Dữ liệu local: `data/store-db.json` (gitignored — sao lưu trước khi chạy test tự động có ghi dữ liệu).
- Ảnh tải lên local: `data/uploads/` (gitignored).

## Đã hoàn thành

| Commit | Nội dung |
|---|---|
| `fb09186` | Trình sửa **Bố cục Trang chủ** kéo thả trực quan, xem trước bản nháp trực tiếp, quy trình Lưu & Xuất bản |
| `8ac409b` | Chỉnh **màu / cỡ chữ / font** (72 font tiếng Việt tự host), kiểu nút, kéo thả vị trí chữ, chọn link dạng dropdown (danh mục, sản phẩm, trang) |
| `ec41029` | Sửa lỗi mất sản phẩm #1 khi đổi thứ tự băng chuyền; thêm **khối bài viết + ảnh** bên dưới trang sản phẩm (5 bố cục) và thư viện ảnh |
| `3726da9` | **Trình sửa sản phẩm 2 cột** (form bên trái, xem trước trang thật bên phải), bấm vùng trên bản xem trước để mở đúng nhóm, hỗ trợ cả sản phẩm mới chưa lưu |
| `9c4bfeb` | Sửa lỗi nút tải ảnh (Ảnh sản phẩm màu này…) không mở hộp chọn tệp |
| _(commit này)_ | Thử nghiệm hiệu ứng tương tác trên trang **Bộ Ga Giường Classic Percale Core** (xem bên dưới) |

## Đang thử nghiệm (chỉ bật cho `classic-core-sheet-set`)

Xem tại `http://127.0.0.1:3099/products/classic-core-sheet-set?lang=vi`

### 1. Đổi màu "nhuộm loang" trên ảnh gốc — mặc định (nút **Ảnh sản phẩm**)
- File: `src/components/sites/brooklinen/SwatchMorphImage.tsx`
- Rê chuột / bấm ô màu → màu mới loang dần lên vải (theo hướng thứ tự ô màu, nếp tối thấm chậm hơn, có vệt bóng ướt ở mép loang, gối lún nhẹ rồi bật lại). Ngắt giữa chừng vẫn mượt; tôn trọng `prefers-reduced-motion`.
- Màu có **ảnh chụp thật** (7 ảnh: White, Cream, Pebble, Fresh Moss, Tandem Stripe Pebble/Moss/Storm) → chuyển ảnh thật ↔ ảnh thật, nhãn 🟢 "Ảnh chụp thật".
- 20 màu còn lại trong dữ liệu đang **dùng chung ảnh sọc Storm** → được **mô phỏng** từ ảnh gốc, nhãn 🟠 "Mô phỏng màu từ ảnh gốc":
  - Màu trơn: nhuộm lại từ ảnh Fresh Moss (màu tối/vừa) hoặc Pebble (màu sáng), giữ nguyên nếp nhăn & bóng đổ.
  - Màu sọc: chỉ nhuộm sợi sọc của ảnh Tandem Stripe in Storm, màu sọc lấy tự động từ ảnh ô màu nhỏ (`swatchImage`).

### 2. Phòng ngủ 2.5D (nút **✨ Phòng ngủ 2.5D**)
- Files: `BedStudioConfigurator.tsx`, `bedMeshEngine.ts`, ảnh nền `public/sites/brooklinen/configurator/bed-master-{day,night,deluxe,folded}.jpg` (ảnh AI, khóa cùng góc máy 1200×896).
- Co giãn giường Twin → Cal King bằng lưới ảnh 2D + xương rig (tủ đầu giường/đèn không bị méo), đổi 27 màu/sọc, kéo mở chăn, bật/tắt từng đèn ngủ 2700K, thêm 2 gối Euro (+45 USD) và chăn Waffle (+149 USD) — giá & giỏ hàng cập nhật theo.

## Hạn chế đã biết
- Mô phỏng sọc nhiều màu (vd. *Skyline Stripe in Mahogany*) chỉ lấy được 1 màu chủ đạo → khác hàng thật.
- Mép trong đầu gối dưới đôi khi còn vài sọc xám nhạt khi mô phỏng màu sọc.
- Ảnh nhỏ trong dải thumbnail và ảnh trong giỏ hàng vẫn dùng ảnh gốc chung (chưa dùng ảnh mô phỏng).
- Phòng ngủ 2.5D: viền đỉnh gối Euro trên nền tường còn hơi răng cưa ở một số màu.

## Việc tiếp theo (đề xuất)
1. Chốt hướng hiệu ứng nào giữ làm mặc định (đổi màu loang / phòng ngủ 2.5D / cả hai).
2. Bổ sung ảnh chụp thật cho các màu đang mô phỏng (đúng góc chồng gối 600×600, nền `#F2F2F2`) → hệ thống tự chuyển sang "Ảnh chụp thật".
3. Thêm cài đặt bật/tắt hiệu ứng theo sản phẩm trong Admin (thay vì cố định theo slug), mở rộng cho các sản phẩm nhiều màu khác.
4. Đồng bộ ảnh mô phỏng sang thumbnail & giỏ hàng.
5. Kiểm tra hiệu năng trên điện thoại thật (canvas 600×600, ~3–5 ms/khung).
