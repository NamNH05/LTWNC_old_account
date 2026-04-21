# LTWNC Project Context (AI Quick Start)

Last Updated: 21/04/2026

## 1. Project Overview

- Name: LTWNC Shop
- Type: E-commerce web app
- Backend: Node.js + Express + TypeScript + Prisma + PostgreSQL
- Frontend: React + Vite
- Infra: Docker Compose (PostgreSQL)
- Current focus: Auth/OAuth flow completed, payment flow integrated (VNPAY), documentation and dev setup refreshed.

## 2. Repository Layout

```text
LTWNC/
├── ltwnc-shop/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── app.ts
│   │   │   ├── index.ts
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── middlewares/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   └── utils/
│   │   ├── prisma/
│   │   └── scripts/
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── context/
│   │   │   ├── pages/
│   │   │   ├── routes/
│   │   │   └── utils/
│   │   └── public/
│   └── infra/
├── docs/
└── README.md
```

## 3. Current Backend Modules

- Auth: register/login/refresh/logout/logout-all/forgot/reset/me/sessions/admin probe + OAuth Google/Facebook.
- Users: profile and admin user management.
- Products: list/detail/categories + admin CRUD.
- Cart: get/add/update/remove/clear.
- Orders: checkout/my orders/detail/cancel + admin list/status update.
- Payments: methods, create payment, VNPAY create-url, VNPAY return/IPN, payment detail, admin list.
- Addresses: user CRUD and set default.
- Admin dashboard APIs: orders/revenue/users/addresses/audit logs.

## 4. Database Snapshot (Prisma)

Important models currently in schema:

- User
- Address
- Category
- Product
- Cart
- CartItem
- Order
- OrderItem
- Payment
- PaymentMethod
- AuditLog

Notes:

- Soft delete is used in several business models via deletedAt.
- Payment and PaymentMethod are already implemented in schema and used by backend routes.

## 5. Authentication and OAuth

Local auth flow:

- JWT access token + refresh token
- Session management for refresh token rotation
- Forgot/reset password flow exists

OAuth flow:

- Backend endpoints:
  - POST /api/auth/oauth/google
  - POST /api/auth/oauth/facebook
- Backend exchanges authorization code with provider, resolves email/profile, and then:
  - finds existing user by email, or
  - auto-creates user if not found
- Returns internal JWT tokens like normal login.

Frontend OAuth flow:

- Login page has Google/Facebook buttons.
- Redirect callback route: /auth/callback
- Callback page sends code to backend OAuth endpoint and stores login state in AuthContext/localStorage.

## 6. Key Route Mounts (from app.ts)

Mounted in backend app:

- /api/auth
- /api/users
- /api/products
- /api/cart
- /api/addresses
- /api/orders
- /api/payments
- /api/admin

Important note:

- routes/api-gateway.routes.ts exists but is currently not mounted in app.ts.
- So /api/gateway/health and /api/gateway/metrics are not active unless mount is added back.

## 7. Environment Variables

Backend important envs:

- DATABASE_URL
- JWT_SECRET
- ACCESS_TOKEN_TTL
- REFRESH_TOKEN_TTL
- RESET_TOKEN_TTL
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- FACEBOOK_CLIENT_ID
- FACEBOOK_CLIENT_SECRET
- OAUTH_REDIRECT_URI
- VNPAY_* configs

Frontend important envs:

- VITE_GOOGLE_CLIENT_ID
- VITE_FACEBOOK_CLIENT_ID

Policy:

- Use .env.example in repo
- Keep real .env local and gitignored

## 8. Build/Validation Status

- Backend TypeScript check has been validated with npx tsc --noEmit.
- Frontend build has been validated with npm run build.

## 9. Current Documentation Pointers

- Daily backend progress: docs/Nguyễn Hoài Nam/Tien_Do_Backend.md
- Latest daily report: docs/reports/REPORT_20260421.md
- New machine setup guide: ltwnc-shop/DEV_SETUP.md
- Team task checklists:
  - docs/Nhiem_vu_tung_phan/Backend_Tasks.md
  - docs/Nhiem_vu_tung_phan/Frontend_Tasks.md
  - docs/Nhiem_vu_tung_phan/Database_Seed_Tasks.md
  - docs/Nhiem_vu_tung_phan/Testing_Guidelines.md

## 10. Quick Start for Next AI Session

When starting new work:

1. Read docs/reports/REPORT_20260421.md for latest implementation context.
2. Read docs/Nguyễn Hoài Nam/Tien_Do_Backend.md for backend timeline.
3. Check backend route files under ltwnc-shop/backend/src/routes for source of truth.
4. Run backend type-check if touching TS logic:
   - npx tsc --noEmit
5. If touching frontend auth pages, retest OAuth callback route and run frontend build.
