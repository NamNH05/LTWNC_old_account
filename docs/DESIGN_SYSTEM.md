# Design System - Sixedi Shop

## Tổng Quan

File này tài liệu hóa các nguyên tắc thiết kế, thành phần UI, và hướng dẫn styling cho dự án Sixedi Shop. Dựa trên trang chủ (Homepage) làm mẫu chuẩn.

---

## 1. Design Principles (Nguyên Tắc Thiết Kế)

### Simplicity (Đơn Giản)
- Thiết kế clean, không quá phức tạp
- Trắng bộ (whitespace) được sử dụng hợp lý
- Ưu tiên content hơn decoration

### Modern Elegance (Thanh Lịch Hiện Đại)
- Sử dụng typography serif cho headings (Playfair Display)
- Sans-serif cho body text (Inter)
- Nhấn mạnh vào chất lượng và tinh tế

### User-Centric (Tập Trung Vào Người Dùng)
- Responsive trên tất cả thiết bị
- Dễ điều hướng và tìm kiếm
- Clear call-to-action (CTA) buttons

---

## 2. Color Palette (Bảng Màu)

### Primary Colors (Màu Chính)
| Tên | Hex Code | Sử Dụng | Ví Dụ |
|-----|----------|--------|-------|
| Deep Blue | `#003380` | Primary buttons, headings, links | Primary CTAs |
| Light Gray | `#f9fafb` | Backgrounds, sections | Hero section background |
| Dark Text | `#111827` | Main text, headings | Tiêu đề, nội dung chính |
| Medium Gray | `#6b7280` | Secondary text | Mô tả, body text |
| Light Border | `#e5e4e7` | Borders, dividers | Phân tách sections |

### Secondary Colors (Màu Phụ)
| Tên | Hex Code | Sử Dụng |
|-----|----------|--------|
| Accent Purple | `#aa3bff` / `#c084fc` (dark mode) | Highlights, hovers |
| White | `#ffffff` | Text trên dark background, cards |
| Transparent variants | `rgba(170, 59, 255, 0.1)` | Subtle backgrounds |

### Dark Mode Support
- Được hỗ trợ qua CSS variables
- Text color: `#9ca3af`
- Background: `#16171d`
- Border: `#2e303a`

---

## 3. Typography (Kiểu Chữ)

### Font Stack

```css
/* Headings - Serif, Elegant */
Font Family: 'Playfair Display', serif
Weight: 800 (bold)
Usage: H1, H2, H3 (các tiêu đề chính)

/* Body Text - Clean, Modern */
Font Family: 'Inter', sans-serif
Usage: Paragraph, description, small text

/* Code/Technical */
Font Family: Consolas, monospace
Usage: Code blocks, technical content
```

### Font Sizes & Line Heights

| Element | Size | Weight | Line Height | Color |
|---------|------|--------|-------------|-------|
| H1 (Hero Title) | 3rem (48px) | 800 | 1 | #111827 |
| H1 Accent Span | 3rem (48px) | 800 | 1 | #003380 |
| Descriptions | 1.125rem (18px) | 400 | 145% | #6b7280 |
| Body Text | 1rem (16px) | 400 | normal | #111827 |
| Small Text | 0.875rem (14px) | 400 | normal | #6b7280 |

### Font Scaling
- Mobile (< 1024px): -2px từ desktop size
- Desktop: default size

---

## 4. Components (Thành Phần)

### 4.1 Hero Section (Phần Quảng Bá Chính)

**Structure:**
```
hero-section (background: #f9fafb)
├── container (max-width: 1280px)
│   └── hero-content (flex, min-height: 70vh)
│       ├── hero-main (flex: 1)
│       │   └── hero-text
│       │       ├── hero-title (2 spans)
│       │       ├── hero-description
│       │       └── hero-buttons
│       └── hero-image (img tag)
```

**Key Styles:**
- `padding-bottom: 2rem`
- `display: flex; align-items: center`
- Hero text: `max-width: 32rem` (single column)
- Hero image: responsive width

### 4.2 Buttons (Nút Bấm)

#### Primary Button (btn-primary)
```css
Background: #003380
Color: white
Padding: 0.75rem 2rem (12px 32px)
Border Radius: 0.5rem (8px)
Transition: all 0.2s
Hover Effect: translateY(-0.125rem) + subtle shadow
```

#### Secondary Button (btn-secondary)
```css
Background: transparent / #f9fafb
Color: #003380
Border: 1px solid #003380
Padding: 0.75rem 2rem
Border Radius: 0.5rem
Hover: background change, text color swap
```

**Button Container (hero-buttons):**
- `display: flex`
- `gap: 1rem` (spacing giữa buttons)
- Responsive: stack on mobile, flex on desktop

### 4.3 Feature Items (Mục Đặc Điểm)

**Structure:**
```
features-section
├── container
│   └── features-grid
│       ├── feature-item
│       │   ├── feature-icon (with Material Icons)
│       │   ├── h3 (title)
│       │   └── p (description)
│       ├── feature-item
│       └── feature-item
```

**Styling:**
- Grid: 4 columns (desktop), responsive breakpoints
- Icon size: ~40px
- Gap: 2rem between items
- Text alignment: center
- Icons used: Material Icons from Google

### 4.4 Product Card (ProductCard Component)

**Expected Structure:**
```
product-card
├── product-image
├── product-info
│   ├── product-name
│   ├── product-price
│   ├── product-rating (if available)
│   └── add-to-cart-btn
```

**Best Practices:**
- Image ratio: 300:400 (portrait)
- Placeholder for missing images
- Hover effect: shadow, scale, or overlay
- Clear price display with currency formatting

### 4.5 Header Component

**Typical Components:**
- Logo/Brand name
- Navigation menu
- Search bar
- User account / Auth buttons
- Shopping cart icon

**Styling:**
- Sticky or fixed position (check Header component)
- Background: white or semi-transparent
- Shadow on scroll: `box-shadow: 0 1px 3px rgba(0,0,0,0.1)`

### 4.6 Footer Component

**Typical Sections:**
- Quick links
- Company info
- Contact information
- Social media links
- Copyright

**Styling:**
- Background: dark (likely #111827 or #1a1a1a)
- Text: light colors
- Link hover: primary color (#003380)

---

## 5. Layout & Spacing (Bố Cục & Khoảng Cách)

### Container
```css
max-width: 1280px
margin: 0 auto
padding: 0 1rem
```

### Spacing Scale

| Size | Value | Usage |
|------|-------|-------|
| xs | 0.25rem (4px) | Micro spacing |
| sm | 0.5rem (8px) | Small gaps |
| md | 1rem (16px) | Standard padding |
| lg | 1.5rem (24px) | Section margins |
| xl | 2rem (32px) | Large sections |
| 2xl | 2.5rem (40px) | Hero sections |

### Section Padding
- Hero section: `padding-bottom: 2.5rem`
- Standard sections: `padding: 3rem 1rem` (top-bottom, left-right)
- Container padding: `padding: 0 1rem` (responsive horizontal)

### Gap/Margin Patterns
- Between buttons: `gap: 1rem`
- Between feature items: `gap: 2rem`
- Between sections: `margin-bottom: 3rem`

---

## 6. Responsive Design (Thiết Kế Đáp Ứng)

### Breakpoints

```css
/* Mobile First Approach */
/* Base: Mobile < 640px */

/* sm: 640px and up */
@media (min-width: 640px) { }

/* md: 768px and up */
@media (min-width: 768px) { }

/* lg: 1024px and up */
@media (min-width: 1024px) { }

/* xl: 1280px and up */
@media (min-width: 1280px) { }

/* 2xl: 1536px and up */
@media (min-width: 1536px) { }
```

### Key Responsive Behaviors

1. **Hero Section**
   - Desktop: flex row (text left, image right)
   - Mobile: stack vertically, image on top
   - Min height: 70vh on desktop, auto on mobile

2. **Buttons**
   - Desktop: inline-flex side by side
   - Tablet/Mobile: stack vertically or reduce padding

3. **Features Grid**
   - Desktop: 4 columns
   - Tablet: 2 columns
   - Mobile: 1 column

4. **Product Grid**
   - Desktop: 6 columns (as per Home.jsx)
   - Tablet: 3 columns
   - Mobile: 2 columns

5. **Typography**
   - Desktop: default sizes
   - Mobile: font-size: 16px (vs 18px desktop)

### Mobile-First Strategy
- Start with mobile CSS
- Use `@media (min-width: ...)` để thêm changes for larger screens
- Avoid max-width media queries khi có thể

---

## 7. Transitions & Animations (Chuyển Động)

### Standard Transition
```css
transition: all 0.2s
/* hoặc cụ thể hơn */
transition: background-color 0.2s, transform 0.2s
```

### Common Effects

| Effect | Usage | Code |
|--------|-------|------|
| Hover lift | Buttons, cards | `transform: translateY(-0.125rem)` |
| Smooth color change | Links, text hover | `transition: color 0.2s` |
| Scale up | Hover effect | `transform: scale(1.05)` |
| Fade in | Page load | `animation: fadeIn 0.3s` |

### Shadow System

| Level | Value | Usage |
|-------|-------|-------|
| None | none | Flat design |
| Subtle | `0 1px 3px rgba(0,0,0,0.1)` | Hover states |
| Medium | `rgba(0,0,0,0.1) 0 10px 15px -3px` | Cards, components |
| Dark | `rgba(0,0,0,0.3) 0 10px 15px -3px` | Elevated components |

---

## 8. Best Practices (Thực Hành Tốt Nhất)

### CSS Organization
```
Structure:
1. Layout classes (.container, .hero-content, etc.)
2. Component classes (.btn, .feature-item, etc.)
3. State classes (.active, .disabled, :hover, etc.)
4. Utility classes (.text-center, .mb-2, etc.)
5. Media queries (from mobile-first approach)
```

### Naming Conventions
- BEM-like approach: `component__element--modifier`
- Examples:
  - `.hero-section` (component)
  - `.hero-content` (element)
  - `.hero-title-primary` (modifier)
  - `.btn-primary` (component variant)

### Accessibility
- Use semantic HTML (h1, h2, p, a, button)
- Sufficient color contrast: WCAG AA minimum
- Focus styles for keyboard navigation
- alt text cho images
- aria-labels khi cần thiết

### Performance
- Minimize repaints/reflows
- Use CSS transforms for animations (hardware accelerated)
- Load fonts efficiently (use Google Fonts or system fonts)
- Optimize images (use modern formats, responsive images)

### Dark Mode Support
- Use CSS variables for colors
- Test thoroughly in dark mode
- Ensure readability in both modes

---

## 9. Implementation Checklist (Danh Sách Kiểm Tra)

Khi tạo page hoặc component mới, đảm bảo:

- [ ] Sử dụng container class cho max-width
- [ ] Spacing: margin-bottom/padding dùng scale trên
- [ ] Typography: heading dùng Playfair Display, body dùng Inter
- [ ] Colors: dùng bảng màu chính (Deep Blue #003380)
- [ ] Buttons: dùng .btn-primary hoặc .btn-secondary
- [ ] Responsive: test trên mobile, tablet, desktop
- [ ] Accessibility: semantic HTML, alt text, color contrast
- [ ] Transitions: smooth 0.2s cho hover/active states
- [ ] Dark mode: test if CSS variables applied correctly
- [ ] Performance: optimize images, lazy loading nếu cần

---

## 10. File Structure (Cấu Trúc File)

```
frontend/src/
├── pages/
│   ├── Home/
│   │   ├── Home.jsx
│   │   └── Home.css
│   ├── ProductPage/
│   ├── ProductDetail/
│   └── ... (other pages)
├── components/
│   ├── ui/
│   │   ├── Header/
│   │   │   ├── Header.jsx
│   │   │   └── Header.css
│   │   ├── Footer/
│   │   ├── ProductCard/
│   │   └── AdminLayout/
│   ├── common/
│   │   └── ModuleDisabledPage.jsx
│   └── features/
│       └── (feature-specific components)
├── styles/
│   ├── index.css (global variables, base styles)
│   └── App.css (app-level styles)
└── (other folders)
```

---

## 11. Próximos Passos (Các Bước Tiếp Theo)

### To Improve UI:
1. **Create component library** - standardize all buttons, inputs, cards
2. **Add loading states** - spinners, skeletons cho content
3. **Improve product cards** - add ratings, reviews, wish list
4. **Better forms** - consistent input styling, validation feedback
5. **Navigation improvements** - breadcrumbs, better menus
6. **Add animations** - subtle page transitions, micro-interactions
7. **Color consistency** - audit all colors used, ensure they match palette
8. **Test accessibility** - WCAG compliance, keyboard navigation

### To Maintain Consistency:
1. Document all new components in this file
2. Create CSS component templates
3. Use CSS variables for theming
4. Regular code reviews for CSS
5. Test responsive on real devices
6. Keep this document updated as design evolves

---

## 12. Reference Links (Tài Liệu Tham Khảo)

- **Playfair Display Font**: https://fonts.google.com/specimen/Playfair+Display
- **Inter Font**: https://fonts.google.com/specimen/Inter
- **Material Icons**: https://fonts.google.com/icons
- **WCAG Accessibility**: https://www.w3.org/WAI/WCAG21/quickref/
- **CSS Custom Properties**: https://developer.mozilla.org/en-US/docs/Web/CSS/--*
- **Responsive Design**: https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design

---

**Last Updated**: May 3, 2026  
**Maintained By**: Development Team  
**Status**: Active

