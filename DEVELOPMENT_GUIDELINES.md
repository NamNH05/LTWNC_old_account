# LTWNC Shop - Development Guidelines

Quy tắc và best practices khi phát triển dự án LTWNC Shop.

---

## 📁 Cấu trúc thư mục chi tiết

### Backend Structure
```
backend/
├── src/
│   ├── app.ts                              # Express app setup với middleware
│   ├── index.ts                            # Server entry point
│   ├── config/
│   │   └── env.ts                          # Environment validation & parsing
│   ├── middlewares/                        # Express middlewares
│   │   ├── auth.middleware.ts              # JWT verification
│   │   ├── rbac.middleware.ts              # Role-based access control
│   │   ├── error.middleware.ts             # Error handling & responses
│   │   ├── module.middleware.ts            # Module enable/disable check
│   │   ├── rate-limit.middleware.ts        # Request rate limiting
│   │   ├── request-context.middleware.ts   # Request context assignment
│   │   ├── request-logger.middleware.ts    # Request logging
│   │   └── detailed-logger.middleware.ts   # Detailed logging with timing
│   ├── modules/
│   │   ├── module.registry.ts              # Module manifest registry
│   │   ├── module.service.ts               # Module management logic
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── product/
│   │   │   ├── product.routes.ts
│   │   │   ├── product.controller.ts
│   │   │   ├── product.service.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── cart/
│   │   │   ├── cart.routes.ts
│   │   │   ├── cart.controller.ts
│   │   │   ├── cart.service.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── order/
│   │   │   ├── order.routes.ts
│   │   │   ├── order.controller.ts
│   │   │   ├── order.service.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── payment/
│   │   │   ├── payment.routes.ts
│   │   │   ├── payment.controller.ts
│   │   │   ├── payment.service.ts
│   │   │   ├── vnpay.service.ts           # VNPAY integration
│   │   │   └── index.ts
│   │   │
│   │   ├── user/
│   │   │   ├── user.routes.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── address/
│   │   │   ├── address.routes.ts
│   │   │   ├── address.controller.ts
│   │   │   ├── address.service.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── admin/
│   │   │   ├── admin.routes.ts
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.service.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── announcement/
│   │   │   ├── announcement.routes.ts
│   │   │   ├── announcement.controller.ts
│   │   │   ├── announcement.service.ts
│   │   │   ├── module.manifest.ts        # Module definition
│   │   │   └── index.ts
│   │   │
│   │   ├── debug/
│   │   │   ├── debug.router.ts
│   │   │   └── index.ts
│   │   │
│   │   └── gateway/
│   │       ├── api-gateway.routes.ts
│   │       └── index.ts
│   │
│   ├── repositories/                      # Data access layer (Prisma wrapper)
│   │   ├── user.repository.ts
│   │   ├── product.repository.ts
│   │   ├── order.repository.ts
│   │   └── ...
│   ├── services/                          # Business logic (reusable)
│   │   └── ...
│   ├── types/                             # TypeScript types & interfaces
│   │   ├── index.ts
│   │   ├── user.types.ts
│   │   ├── product.types.ts
│   │   └── ...
│   ├── utils/                             # Utility functions
│   │   ├── logger.ts                      # Logging utility
│   │   ├── errors.ts                      # Error definitions
│   │   ├── jwt.ts                         # JWT utilities
│   │   ├── validators.ts                  # Input validation
│   │   └── ...
│   └── models/
│       └── prisma.ts                      # Prisma client instance
│
├── prisma/
│   ├── schema.prisma                      # Database schema definition
│   ├── seed.ts                            # Database seeding script
│   ├── migration_lock.toml
│   └── migrations/
│       ├── 0_init/
│       ├── 20260408154500_sync_schema_step1/
│       ├── 20260409160000_soft_delete_support/
│       ├── 20260409173000_order_user_createdat_index/
│       ├── 20260415_add_payment_methods/
│       ├── 20260416_step5_query_optimization/
│       ├── 20260420093000_add_payment_model_fields/
│       └── 20260502082224_add_module_settings/
│
├── docs/
│   ├── MIGRATION_GUIDELINES.md
│   ├── MIGRATION_HISTORY.md
│   ├── MIGRATION_TEMPLATE.md
│   └── MODULES.md
│
├── package.json                           # Dependencies & scripts
├── tsconfig.json                          # TypeScript config
├── .env.example                           # Environment template
└── .gitignore
```

### Frontend Structure
```
frontend/
├── src/
│   ├── main.jsx                           # React entry point
│   ├── App.jsx                            # Root component
│   ├── App.css
│   ├── index.css                          # Global styles
│   │
│   ├── components/                        # Reusable components
│   │   ├── common/
│   │   │   ├── ModuleGuard.jsx            # Module visibility wrapper
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── MainLayout.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   └── ...
│   │   ├── product/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ProductFilter.jsx
│   │   │   └── ...
│   │   ├── cart/
│   │   │   ├── CartItem.jsx
│   │   │   ├── CartSummary.jsx
│   │   │   └── ...
│   │   └── ...
│   │
│   ├── pages/                             # Page components (Route-level)
│   │   ├── Home/
│   │   │   └── Home.jsx
│   │   ├── Login/
│   │   │   └── Login.jsx
│   │   ├── Register/
│   │   │   └── Register.jsx
│   │   ├── Product/
│   │   │   └── ProductDetail.jsx
│   │   ├── CategoryPage/
│   │   │   └── CategoryPage.jsx
│   │   ├── SearchPage/
│   │   │   └── Search.jsx
│   │   ├── Cart/
│   │   │   └── Cart.jsx
│   │   ├── OrderManagement/
│   │   │   └── OrderManagement.jsx
│   │   ├── Profile/
│   │   │   └── Profile.jsx
│   │   ├── Address/
│   │   │   └── AddressPage.jsx
│   │   ├── Payment/
│   │   │   ├── PaymentPage.jsx
│   │   │   ├── PaymentCallback.jsx
│   │   │   └── PaymentSuccess.jsx
│   │   ├── AuthCallback/
│   │   │   └── AuthCallback.jsx
│   │   ├── AdminDashboard/
│   │   │   ├── AdminProductsPage.jsx
│   │   │   ├── OrderManagementPage.jsx
│   │   │   ├── UserManagementPage.jsx
│   │   │   ├── AuditLogsPage.jsx
│   │   │   └── ModuleManagementPage.jsx
│   │   └── ...
│   │
│   ├── routes/
│   │   └── index.jsx                      # Route definitions with React Router
│   │
│   ├── context/                           # Global state management
│   │   ├── AuthContext.jsx                # User & authentication state
│   │   ├── CartContext.jsx                # Shopping cart state
│   │   └── ModuleContext.jsx              # Module visibility state
│   │
│   ├── services/
│   │   ├── api.js                         # API client with auth headers
│   │   └── api-helper.js                  # API utility functions
│   │
│   ├── config/                            # Config constants
│   │   └── index.js
│   │
│   ├── data/                              # Static data
│   │   └── categories.js
│   │
│   ├── styles/                            # Shared styles
│   │   ├── index.css
│   │   ├── variables.css
│   │   └── ...
│   │
│   ├── utils/                             # Utility functions
│   │   ├── logger.js
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── ...
│   │
│   ├── assets/                            # Images, icons, fonts
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│
├── public/                                # Static files (served as-is)
│   └── favicon.ico
│
├── index.html                             # HTML entry point
├── vite.config.js                         # Vite configuration
├── eslint.config.js                       # ESLint rules
├── package.json                           # Dependencies & scripts
└── .env.example                           # Environment template
```

---

## 💻 Quy ước Coding

### Backend (TypeScript)

#### File naming
- Routes: `<module>.routes.ts`
- Controllers: `<module>.controller.ts`
- Services: `<module>.service.ts`
- Repositories: `<module>.repository.ts`
- Types: `<module>.types.ts`
- Manifests: `module.manifest.ts` (cho modules)

#### Code structure
```typescript
// 1. Imports
import { Router } from "express";
import { myController } from "./my.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

// 2. Router instance
export const myRouter = Router();

// 3. Routes
myRouter.get("/", requireAuth, myController.list);
myRouter.post("/", requireAuth, myController.create);

// 4. Export
export default myRouter;
```

#### Naming conventions
- Constants: `UPPER_SNAKE_CASE`
- Functions: `camelCase`
- Classes: `PascalCase`
- Interfaces: `IPascalCase` hoặc `PascalCase`
- Database models: `PascalCase`
- Enum values: `UPPER_SNAKE_CASE`

#### Error handling
```typescript
// Sử dụng custom error classes
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// Trong controller/service
try {
  // Logic
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation error
  }
  throw error;
}
```

### Frontend (React/JavaScript)

#### File naming
- Components: `PascalCase.jsx`
- Pages: `PascalCase/index.jsx` hoặc `PascalCase.jsx`
- Utilities: `camelCase.js`
- Styles: `camelCase.css`
- Constants: `camelCase.js`

#### Component structure
```jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./MyComponent.css";

// 1. Component definition
function MyComponent({ prop1, prop2 }) {
  // 2. Hooks
  const { user } = useAuth();
  const [state, setState] = useState(null);

  // 3. Effects
  useEffect(() => {
    // Setup
    return () => {
      // Cleanup
    };
  }, []);

  // 4. Handlers
  const handleClick = () => {
    // Logic
  };

  // 5. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}

// 6. Export
export default MyComponent;
```

#### Naming conventions
- Components: `PascalCase`
- Hooks: `useFeatureName`
- Functions: `camelCase`
- Constants: `CONSTANT_NAME`
- CSS classes: `component-name__element--modifier` (BEM)

---

## 🔄 Git Workflow

### Branch naming
```
feature/<feature-name>     # Tính năng mới
bugfix/<bug-name>          # Sửa bug
hotfix/<issue>             # Fix nóng
refactor/<module>          # Refactoring
docs/<topic>               # Documentation
```

### Commit message format
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: Tính năng mới
- `fix`: Sửa bug
- `docs`: Thay đổi tài liệu
- `style`: Format code (không thay logic)
- `refactor`: Refactoring code
- `test`: Thêm/sửa tests
- `chore`: Build, dependencies, etc.

Examples:
```
feat(auth): add google oauth login
fix(cart): resolve cart sync issue on login
docs(api): update payment endpoint docs
refactor(product): simplify product service
```

---

## 🧪 Testing

### Backend Testing (Chưa implement)
```bash
npm test                    # Run all tests
npm test -- --watch       # Watch mode
npm test -- --coverage    # Coverage report
```

Test structure:
```typescript
describe("AuthService", () => {
  describe("login()", () => {
    it("should return token for valid credentials", () => {
      // Arrange
      const email = "test@example.com";
      
      // Act
      const result = authService.login(email, "password");
      
      // Assert
      expect(result).toHaveProperty("token");
    });
  });
});
```

### Frontend Testing (Chưa implement)
```bash
npm test                    # Run tests
npm test -- --watch       # Watch mode
npm test -- --coverage    # Coverage report
```

---

## 📊 Performance Guidelines

### Backend
- [ ] Sử dụng indexes trên columns hay query
- [ ] Eager load relations khi cần (Prisma: `include`)
- [ ] Limit kết quả query (pagination)
- [ ] Cache dữ liệu thường xuyên truy cập
- [ ] Monitor slow queries

### Frontend
- [ ] Code splitting (lazy load routes)
- [ ] Optimize images (WebP, AVIF, responsive)
- [ ] Bundle size < 500KB (gzipped)
- [ ] Lighthouse score > 80
- [ ] Core Web Vitals: Good

---

## 🔐 Security Guidelines

### Backend
- [ ] Validate tất cả inputs
- [ ] Sanitize database queries (Prisma safe by default)
- [ ] Hash passwords với bcrypt
- [ ] Rate limiting enabled
- [ ] CORS whitelist production domains
- [ ] Environment secrets secured
- [ ] SQL injection prevention
- [ ] XSS prevention (JSON response)
- [ ] CSRF token (nếu cần)

### Frontend
- [ ] Never store sensitive data (passwords, tokens) in localStorage
- [ ] HTTPS only in production
- [ ] CSP (Content Security Policy) headers
- [ ] Input validation before sending
- [ ] XSS prevention (sanitize HTML)
- [ ] CORS requests only to trusted origins

---

## 📝 Documentation Guidelines

### Code comments
```typescript
// ❌ Không tốt
const x = 5; // Set x to 5

// ✅ Tốt
const retryCount = 5; // Max retry attempts for payment gateway

// ❌ Quá chi tiết
// Increment counter
counter++;

// ✅ Giải thích Why, không What
// Retry increment to handle network timeouts during VNPAY API calls
retryAttempts++;
```

### JSDoc
```typescript
/**
 * Validates email format
 * 
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid, false otherwise
 * @throws {Error} If email is empty
 */
function validateEmail(email: string): boolean {
  // Implementation
}
```

---

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] Code reviewed
- [ ] Environment variables set
- [ ] Database backups
- [ ] Build optimized
- [ ] No console errors/warnings

### Backend deployment
- [ ] Production .env configured
- [ ] Database migrations run
- [ ] API tested in staging
- [ ] Rate limits adjusted
- [ ] Logs configured
- [ ] Error monitoring setup

### Frontend deployment
- [ ] Build output verified
- [ ] Bundle size checked
- [ ] API endpoints updated
- [ ] Feature flags configured
- [ ] Analytics setup

---

## 📚 Tài liệu tham khảo

- [SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md)
- [REBUILD_GUIDE.md](./REBUILD_GUIDE.md)
- [backend/docs/MODULES.md](./backend/docs/MODULES.md)
- [backend/docs/MIGRATION_GUIDELINES.md](./backend/docs/MIGRATION_GUIDELINES.md)
- [docs/API.md](./docs/API.md)

---

*Cập nhật lần cuối: 2026-05-04*
