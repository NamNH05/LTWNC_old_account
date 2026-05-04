# 📖 LTWNC Shop - Tài liệu dự án

Hướng dẫn tìm kiếm tài liệu cho các agent phát triển.

---

## 🎯 Khởi động nhanh

**Bạn là:**

### 👤 Agent mới vào dự án
1. Đọc: [SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md) - 15 phút
2. Đọc: [REBUILD_GUIDE.md](./REBUILD_GUIDE.md) - 30 phút
3. Chạy: `npm install` và `npm run dev`

### 🔧 Muốn setup local environment
→ [REBUILD_GUIDE.md](./REBUILD_GUIDE.md)

### 📝 Muốn viết code mới
→ [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md)

### 🗄️ Muốn làm việc với database
→ [backend/docs/MIGRATION_GUIDELINES.md](./backend/docs/MIGRATION_GUIDELINES.md)

### 🧩 Muốn tạo module mới
→ [backend/docs/MODULES.md](./backend/docs/MODULES.md)

### 🔌 Muốn xem API endpoints
→ [docs/API.md](./docs/API.md)

---

## 📚 Bản đồ tài liệu

### Tài liệu tổng quan
| Tài liệu | Mô tả | Thời gian |
|---------|-------|---------|
| **[SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md)** | Tổng quan toàn hệ thống, kiến trúc, công nghệ | 15-20 min |
| **[REBUILD_GUIDE.md](./REBUILD_GUIDE.md)** | Hướng dẫn setup từ đầu | 30-45 min |
| **[DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md)** | Quy tắc code, structure, best practices | 20-30 min |

### Tài liệu backend
| Tài liệu | Mô tả | Scope |
|---------|-------|-------|
| [backend/docs/MODULES.md](./backend/docs/MODULES.md) | Hệ thống module động | Module system |
| [backend/docs/MIGRATION_GUIDELINES.md](./backend/docs/MIGRATION_GUIDELINES.md) | Quy tắc database migration | Database |
| [backend/docs/MIGRATION_HISTORY.md](./backend/docs/MIGRATION_HISTORY.md) | Lịch sử migrations | Database |
| [backend/docs/MIGRATION_TEMPLATE.md](./backend/docs/MIGRATION_TEMPLATE.md) | Template tạo migration | Database |

### Tài liệu API & Architecture
| Tài liệu | Mô tả | Scope |
|---------|-------|-------|
| [docs/API.md](./docs/API.md) | Danh sách tất cả endpoints | API |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Kiến trúc hệ thống chi tiết | Architecture |
| [docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md) | UI/UX design system | Design |
| [docs/INSTALLATION.md](./docs/INSTALLATION.md) | Hướng dẫn cài đặt | Setup |

### Tài liệu tiến độ & báo cáo
| Tài liệu | Mô tả | Loại |
|---------|-------|------|
| [docs/reports/](./docs/reports/) | Báo cáo tiến độ hàng tuần | Progress |

---

## 🗂️ Cấu trúc thư mục dự án

```
ltwnc-shop/
├── 📄 README.md                           ← Start here!
├── 📄 SYSTEM_OVERVIEW.md                  ← System architecture
├── 📄 REBUILD_GUIDE.md                    ← Setup instructions
├── 📄 DEVELOPMENT_GUIDELINES.md           ← Coding standards
├── 📄 DOCUMENTATION_INDEX.md              ← This file
│
├── backend/                               ← Node.js/TypeScript API
│   ├── src/
│   │   ├── app.ts                         ← Express setup
│   │   ├── index.ts                       ← Server entry
│   │   ├── config/                        ← Configuration
│   │   ├── middlewares/                   ← Express middlewares
│   │   ├── modules/                       ← Feature modules
│   │   ├── repositories/                  ← Data access layer
│   │   ├── services/                      ← Business logic
│   │   ├── types/                         ← TypeScript types
│   │   └── utils/                         ← Utilities
│   ├── prisma/
│   │   ├── schema.prisma                  ← Database schema
│   │   ├── seed.ts                        ← Seed data
│   │   └── migrations/                    ← DB migrations
│   ├── docs/                              ← Backend documentation
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                              ← React/Vite web app
│   ├── src/
│   │   ├── main.jsx                       ← React entry
│   │   ├── App.jsx                        ← Root component
│   │   ├── components/                    ← Reusable components
│   │   ├── pages/                         ← Page components
│   │   ├── routes/                        ← Route definitions
│   │   ├── context/                       ← Global state
│   │   ├── services/                      ← API & utilities
│   │   ├── styles/                        ← Shared styles
│   │   └── utils/                         ← Utility functions
│   ├── public/                            ← Static assets
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
├── infra/                                 ← Docker & deployment
│   └── docker-compose.yml
│
├── docs/                                  ← Project documentation
│   ├── API.md                             ← API endpoints
│   ├── ARCHITECTURE.md                    ← System architecture
│   ├── DESIGN_SYSTEM.md                   ← Design guidelines
│   ├── INSTALLATION.md                    ← Setup guide
│   └── reports/                           ← Progress reports
│
└── Ảnh giao diện/                        ← Screenshots
```

---

## 🎯 Workflows phổ biến

### 1️⃣ Tôi muốn thêm endpoint API mới

**Bước:**
1. Đọc: [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) - Backend section
2. Đọc: [docs/API.md](./docs/API.md) - để xem format hiện có
3. Cách làm:
   - Tạo route trong `backend/src/modules/<module>/`
   - Thêm controller method
   - Thêm service logic nếu cần
   - Mount router trong `src/app.ts`
   - Test endpoint

### 2️⃣ Tôi muốn tạo tính năng mới (module mới)

**Bước:**
1. Đọc: [backend/docs/MODULES.md](./backend/docs/MODULES.md)
2. Đọc: [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) - Backend structure
3. Cách làm:
   - Copy `backend/src/modules/announcement/` → new module
   - Cập nhật manifest
   - Viết controller/service/routes
   - Đăng ký trong `module.registry.ts`
   - Mount router trong `src/app.ts`

### 3️⃣ Tôi muốn thay đổi database schema

**Bước:**
1. Đọc: [backend/docs/MIGRATION_GUIDELINES.md](./backend/docs/MIGRATION_GUIDELINES.md)
2. Cách làm:
   - Cập nhật `backend/prisma/schema.prisma`
   - Tạo migration: `npx prisma migrate dev --name <name>`
   - Test migration: `npx prisma migrate reset`
   - Seed data: `npx prisma db seed`

### 4️⃣ Tôi muốn thêm React component

**Bước:**
1. Đọc: [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) - Frontend section
2. Cách làm:
   - Tạo component trong `frontend/src/components/`
   - Import trong page cần dùng
   - Thêm styles CSS (BEM format)
   - Test component

### 5️⃣ Tôi muốn deploy lên production

**Bước:**
1. Đọc: [REBUILD_GUIDE.md](./REBUILD_GUIDE.md) - Production section
2. Cách làm:
   - Build frontend: `npm run build`
   - Prepare backend: Set production `.env`
   - Run migrations
   - Deploy frontend + backend

---

## ❓ Câu hỏi thường gặp

### Q: Làm sao để chạy dự án locally?
**A:** Xem [REBUILD_GUIDE.md](./REBUILD_GUIDE.md), Bước 1-7

### Q: Database URL là gì?
**A:** `postgresql://shopuser:shoppass@localhost:5432/shopdb` (xem [SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md#database))

### Q: Tôi muốn thêm environment variable
**A:** Thêm vào `.env`, `.env.example`, rồi lấy trong code với `process.env.VAR_NAME` (backend) hoặc `import.meta.env.VITE_*` (frontend)

### Q: Làm sao để test API endpoint?
**A:** Dùng curl, Postman, hoặc REST Client extension. Base URL: `http://localhost:3000/api`

### Q: Module nào là bắt buộc?
**A:** `auth`, `product`, `cart`, `order` là core modules. Xem [SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md#module-system)

### Q: Làm sao để debug API request từ frontend?
**A:** Mở DevTools (F12), xem Network tab, hoặc check `frontend/src/services/api.js` logs

### Q: Port 3000 bị chiếm rồi, làm sao?
**A:** Xem [REBUILD_GUIDE.md](./REBUILD_GUIDE.md) - Troubleshooting section

---

## 📊 Tech Stack Reference

| Layer | Tech | Version | File |
|-------|------|---------|------|
| **Backend** | Node.js + TypeScript | 18+ / 6.0 | backend/package.json |
| **Frontend** | React + Vite | 19 / 8 | frontend/package.json |
| **Database** | PostgreSQL | 16 | infra/docker-compose.yml |
| **ORM** | Prisma | 4.16 | backend/prisma/schema.prisma |
| **Auth** | JWT | - | backend/src/config/env.ts |
| **UI** | Ant Design | 6 | frontend/package.json |
| **HTTP** | Express | 5.2 | backend/package.json |

---

## 🔗 Links ngoài

- [Node.js docs](https://nodejs.org/docs)
- [React docs](https://react.dev)
- [Prisma docs](https://www.prisma.io/docs)
- [Express.js docs](https://expressjs.com)
- [PostgreSQL docs](https://www.postgresql.org/docs)
- [Vite docs](https://vitejs.dev)
- [Ant Design docs](https://ant.design)

---

## 📞 Support & Escalation

Nếu gặp issue:

1. **Kiểm tra logs** - Backend console, Frontend DevTools
2. **Tìm kiếm tài liệu** - Dùng Ctrl+F trong các MD files
3. **Kiểm tra GitHub Issues** - (nếu có)
4. **Reset toàn bộ** - Xem [REBUILD_GUIDE.md](./REBUILD_GUIDE.md) - Troubleshooting

---

## 📝 Cập nhật tài liệu

Khi bạn:
- Thêm tính năng mới → Cập nhật [SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md) & [docs/API.md](./docs/API.md)
- Tạo module mới → Cập nhật [backend/docs/MODULES.md](./backend/docs/MODULES.md)
- Thay đổi schema → Cập nhật [backend/docs/MIGRATION_HISTORY.md](./backend/docs/MIGRATION_HISTORY.md)
- Thay đổi process → Cập nhật [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md)

---

**Tài liệu này được tổ chức để các agent có thể dễ dàng tìm thấy thông tin cần thiết.**

*Cập nhật lần cuối: 2026-05-04*
