# 🧪 Testing Guidelines & Tasks

## Quy định Test Chung

### 📋 Nguyên tắc Testing

1. **Test Coverage**: Mục tiêu tối thiểu 70% code coverage
2. **Test Types**: Unit tests, Integration tests, E2E tests
3. **Test Environment**: Separate test database, mocked services
4. **Test Data**: Use fixtures/factories, không dùng dữ liệu production
5. **CI/CD**: Tests chạy tự động trước mỗi commit/PR
6. **Documentation**: Mỗi test phải có description rõ ràng

---

## 🔷 Backend Testing

### Unit Tests
- [ ] Test tất cả service functions
- [ ] Test validation logic
- [ ] Test error handling
- [ ] Test utility functions
- [ ] Cover edge cases

**Tools**: Jest, Vitest
**Coverage Target**: 80%+

### Integration Tests
- [ ] Test API endpoints
- [ ] Test database operations
- [ ] Test authentication flow
- [ ] Test payment integration
- [ ] Test error responses

**Test Cases:**
- Successful operations
- Invalid input handling
- Unauthorized access
- Database transaction rollback
- Concurrent requests

### API Testing
```bash
# Test endpoints
- POST /api/auth/register
- POST /api/auth/login
- GET /api/products
- POST /api/orders
- PUT /api/users/:id
```

**Scenarios:**
- Valid requests → 200 OK
- Invalid data → 400 Bad Request
- Unauthorized → 401 Unauthorized
- Forbidden → 403 Forbidden
- Not found → 404 Not Found
- Conflicts → 409 Conflict
- Server error → 500 Internal Error

### Database Tests
- [ ] Test migrations
- [ ] Test seed data
- [ ] Test data integrity
- [ ] Test constraints
- [ ] Test relationships

### Security Tests
- [ ] SQL injection prevention
- [ ] XSS protection validation
- [ ] CSRF token validation
- [ ] Password hashing verification
- [ ] JWT token validation

**Run Tests:**
```bash
# Unit & Integration tests
npm test

# With coverage
npm test -- --coverage

# Watch mode
npm test -- --watch

# Specific test file
npm test -- users.test.ts
```

---

## 🎨 Frontend Testing

### Unit Tests
- [ ] Test components rendering
- [ ] Test component props
- [ ] Test state changes
- [ ] Test event handlers
- [ ] Test conditional rendering

**Tools**: Vitest, React Testing Library
**Coverage Target**: 70%+

### Component Tests
- [ ] Button components
- [ ] Form components
- [ ] Modal dialogs
- [ ] Navigation components
- [ ] Product cards

**Test Examples:**
```javascript
- Render component with props
- User interactions (click, type, submit)
- Component state updates
- Conditional rendering based on props
- Error state handling
```

### Integration Tests
- [ ] Authentication flow
- [ ] Product search & filtering
- [ ] Cart operations
- [ ] Checkout process
- [ ] User profile updates

### E2E Tests
- [ ] User registration flow
- [ ] Login process
- [ ] Browse products
- [ ] Add to cart
- [ ] Checkout & payment
- [ ] View order history

**Tools**: Cypress, Playwright
**Test Coverage:**
- Happy path (successful flow)
- Error scenarios
- Edge cases
- Different devices (mobile, tablet, desktop)

### Accessibility Tests
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast
- [ ] ARIA labels
- [ ] Form labels

**Run Tests:**
```bash
# Unit & Component tests
npm test

# E2E tests
npm run test:e2e

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

---

## 🗄️ Database & Seed Testing

### Migration Tests
- [ ] Test migration up/down
- [ ] Test data integrity after migration
- [ ] Test rollback capability
- [ ] Test multiple migration sequences

**Test Steps:**
```bash
1. Create test database
2. Run migration
3. Verify schema changes
4. Run rollback
5. Verify schema reverted
```

### Seed Data Tests
- [ ] Verify all seed data inserted
- [ ] Check data relationships
- [ ] Validate data types
- [ ] Test seed idempotency (run multiple times)
- [ ] Performance: seed 10K+ records

**Seed Validation:**
```javascript
- Admin user exists
- Sample categories created (5+)
- Sample products created (20+)
- Test users created
- All foreign keys valid
```

### Data Integrity Tests
- [ ] Foreign key constraints
- [ ] Unique constraints
- [ ] Not null constraints
- [ ] Default values
- [ ] Check constraints

### Query Performance Tests
- [ ] Test slow queries
- [ ] Index effectiveness
- [ ] Join performance
- [ ] Pagination handling
- [ ] Aggregation queries

**Run Database Tests:**
```bash
# Run migrations on test DB
npm run db:migrate:test

# Seed test database
npm run db:seed:test

# Run data integrity checks
npm run db:validate

# Performance benchmarks
npm run db:benchmark
```

---

## ✅ Testing Checklist

### Before Each Commit
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] No console errors/warnings
- [ ] Code coverage maintained
- [ ] No hardcoded values/credentials

### Before Each PR
- [ ] Tests added for new features
- [ ] Tests modified for changed features
- [ ] All tests pass locally
- [ ] Coverage > threshold
- [ ] No skipped tests (`.skip`)

### Before Release
- [ ] All tests pass
- [ ] E2E tests pass
- [ ] Performance tests acceptable
- [ ] Security tests pass
- [ ] Load tests pass

---

## 🔧 Test Setup & Configuration

### Backend Setup
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts'
  ],
  coverageThreshold: {
    global: { lines: 80 }
  }
};
```

### Frontend Setup
```javascript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
})
```

---

## 📊 Testing Metrics

### Coverage Goals
- Backend: 80%+ (Unit + Integration)
- Frontend: 70%+ (Unit + Component)
- Database: 100% (migration validation)

### Performance Baselines
- Unit test execution: < 5s
- Integration tests: < 30s
- E2E tests: < 2m
- Database seed: < 10s

### Quality Gates
- ✅ Tests must pass before merge
- ✅ Coverage must meet threshold
- ✅ No console errors in tests
- ✅ All critical tests required
