# 🎨 Design Guidelines - DeComP Fashion E-commerce

**Phiên bản:** 1.0  
**Ngày cập nhật:** 08/04/2026  
**Dành cho:** Stitch (Designer)

---

## 🏢 Brand Identity

### Tên Thương Hiệu
**DeComP** - Website bán thời trang cao cấp cho nam, nữ, giày dép

### Brand Personality
- **Modern** - Thiết kế hiện đại, sạch sẽ
- **Elegant** - Trang nhã, chuyên nghiệp
- **Fashion-Forward** - Theo xu hướng thời trang
- **User-Friendly** - Dễ sử dụng, trực quan

---

## 🎨 Color Palette

### Primary Colors

| Tên | Light Mode | Dark Mode | Hex (Light) | Hex (Dark) | Sử dụng |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Accent (Primary)** | Purple | Light Purple | `#aa3bff` | `#c084fc` | Button, Links, CTA |
| **Text Primary** | Dark Gray | Light Gray | `#08060d` | `#f3f4f6` | Tiêu đề, Headings |
| **Text Secondary** | Gray | Gray | `#6b6375` | `#9ca3af` | Body text, Description |
| **Background** | White | Dark | `#fff` | `#16171d` | Page background |

### Secondary Colors

| Tên | Hex (Light) | Hex (Dark) | Sử dụng |
| :--- | :--- | :--- | :--- |
| **Border** | `#e5e4e7` | `#2e303a` | Line, Divider, Form border |
| **Code BG** | `#f4f3ec` | `#1f2028` | Background secondary |
| **Accent BG** | `rgba(170, 59, 255, 0.1)` | `rgba(192, 132, 252, 0.15)` | Accent background |
| **Accent Border** | `rgba(170, 59, 255, 0.5)` | `rgba(192, 132, 252, 0.5)` | Focus state, Hover |
| **Social BG** | `rgba(244, 243, 236, 0.5)` | `rgba(47, 48, 58, 0.5)` | Social icons BG |

### Utility Colors (Enhancement)

| Tên | Hex | Sử dụng |
| :--- | :--- | :--- |
| **Success** | `#10b981` | Thành công, Approved |
| **Warning** | `#f59e0b` | Cảnh báo, Pending |
| **Danger/Error** | `#ef4444` | Lỗi, Cancel, Delete |
| **Info** | `#3b82f6` | Thông tin, Notice |

---

## 🔤 Typography

### Font Stack
```css
--sans: system-ui, 'Segoe UI', Roboto, sans-serif;
--heading: system-ui, 'Segoe UI', Roboto, sans-serif;
--mono: ui-monospace, Consolas, monospace;
```

### Font Sizes & Weights

| Loại | Size | Weight | Line Height | Sử dụng |
| :--- | :--- | :--- | :--- | :--- |
| **H1 (Heading)** | 32px | 700 | 1.2 | Page title |
| **H2 (Heading)** | 28px | 700 | 1.2 | Section title |
| **H3 (Heading)** | 24px | 600 | 1.3 | Subsection |
| **Body Large** | 18px | 400 | 1.45 | Main content |
| **Body Normal** | 16px | 400 | 1.5 | Default text |
| **Body Small** | 14px | 400 | 1.5 | Secondary text |
| **Caption** | 12px | 400 | 1.5 | Helper text, Labels |

### Letter Spacing
```css
default: 0.18px
headings: 0.2px
```

---

## 🎯 Component Guidelines

### Buttons

**Primary Button**
- Background: `#aa3bff` (Light) / `#c084fc` (Dark)
- Text Color: White
- Padding: 12px 24px
- Border Radius: 8px
- Font Weight: 600

**Secondary Button**
- Background: Transparent
- Border: 2px solid `#aa3bff`
- Text Color: `#aa3bff`
- Padding: 10px 22px

**Disabled State**
- Opacity: 0.5
- Cursor: not-allowed

### Form Elements

**Input Fields**
- Border: 1px solid `#e5e4e7`
- Padding: 12px 16px
- Border Radius: 8px
- Focus: Border color `#aa3bff`, Shadow with accent

**Labels**
- Font Size: 14px
- Font Weight: 600
- Color: `#08060d` (Light) / `#f3f4f6` (Dark)
- Margin Bottom: 8px

### Cards

- Background: White / `#16171d`
- Border: 1px solid `#e5e4e7` / `#2e303a`
- Border Radius: 12px
- Padding: 20px
- Shadow: `0 10px 15px -3px rgba(0, 0, 0, 0.1)`

### Navigation

- Height: 64px (Desktop) / 56px (Mobile)
- Background: White / Dark
- Accent Color: `#aa3bff`

---

## 📐 Spacing & Layout

### Spacing Scale
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px
```

### Grid
- Desktop: 12-column grid
- Tablet: 8-column grid
- Mobile: 4-column grid

### Breakpoints
```
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px
```

---

## 🖼️ Component Mockups

### 1. Header Navigation
```
┌─────────────────────────────────────────────────────┐
│ [Logo] [Search Bar] [Cart] [Profile] [Menu]        │
│  DeComP    [          Search...]   0      👤        │
└─────────────────────────────────────────────────────┘
```

### 2. Product Card
```
┌──────────────────┐
│   [Product Img]  │
│   [250x250px]    │
├──────────────────┤
│ Product Name     │
│ ⭐⭐⭐⭐⭐ (5)    │
│ 299,000 VND      │
│ [Add to Cart]    │
└──────────────────┘
```

### 3. Hero Section
```
┌──────────────────────────────────┐
│                                  │
│    New Collection Spring 2026    │
│    [Large Background Image]      │
│                                  │
│    [Explore Now] Button          │
│                                  │
└──────────────────────────────────┘
```

### 4. Checkout Step
```
Step 1: Shipping Address
┌────────────────────────────────────┐
│ ✓ Step 1: Address                  │
│ ○ Step 2: Payment Method           │
│ ○ Step 3: Confirm Order            │
└────────────────────────────────────┘

[Form Fields for Address]
[Next Button]
```

### 5. Product Detail Page
```
┌─────────────────────────────────────┐
│ [Large Product Image] [Side Images] │
│                                     │
│ Product Name                        │
│ ⭐⭐⭐⭐⭐ (234 reviews)            │
│ 599,000 VND  →  449,000 VND (25%)  │
│                                     │
│ Size: [S] [M] [L] [XL] [XXL]       │
│ Color: [●] [●] [●] [●]             │
│ Quantity: [−] 1 [+]                │
│                                     │
│ [Add to Cart] [❤️ Wishlist]        │
│                                     │
│ Description                         │
│ [Content...]                        │
└─────────────────────────────────────┘
```

### 6. Shopping Cart
```
┌────────────────────────────────────┐
│ Cart (3 items)                     │
├────────────────────────────────────┤
│ ☑ Product 1  [−] 1 [+]  299,000 VND│
│ ☑ Product 2  [−] 2 [+]  598,000 VND│
│ ☑ Product 3  [−] 1 [+]  449,000 VND│
├────────────────────────────────────┤
│ Subtotal:              1,346,000 VND│
│ Shipping:                 100,000 VND│
│ Tax:                      134,600 VND│
│ ────────────────────────────────────│
│ Total:                 1,580,600 VND│
│                                     │
│ [Proceed to Checkout]              │
└────────────────────────────────────┘
```

---

## 📱 Responsive Design

### Desktop (> 1024px)
- Full navigation bar
- 4-column product grid
- Sidebar filters

### Tablet (640px - 1024px)
- Hamburger menu
- 3-column product grid
- Collapsible filters

### Mobile (< 640px)
- Hamburger menu
- 2-column product grid
- Bottom navigation
- Full-width inputs

---

## 🎬 Animations & Transitions

### Default Transitions
```css
transition: 0.3s ease-in-out
```

### Hover Effects
- Button: Scale 1.02, Shadow increase
- Card: Shadow increase, Lift up 2px
- Link: Color change, Underline appear

### Loading
- Skeleton screens for images
- Pulse animation for placeholders

---

## 🌓 Dark Mode

### Implementation
- Use CSS variables with `prefers-color-scheme` media query
- Toggle button on header/settings
- Remember user preference in localStorage

### Dark Mode Adjustments
- Text lighter (Light Gray)
- Background darker (Dark)
- Borders adjusted for contrast
- Purple accent lightened for readability

---

## 📋 Design Files to Create (for Stitch)

### Figma/Adobe XD Artboards
1. **Onboarding** (3 screens)
2. **Authentication** (Login, Register, Forgot Password)
3. **Homepage** (Hero, Featured, Categories)
4. **Product Listing** (Grid, Filters, Sort)
5. **Product Detail** (Images, Info, Reviews)
6. **Shopping Cart** (Items, Checkout)
7. **Checkout** (3 steps: Address, Payment, Confirm)
8. **Order Confirmation**
9. **User Profile** (Profile, Addresses, Settings)
10. **Admin Dashboard** (Overview, Products, Orders)

### Deliverables
- [ ] Figma design file (with components library)
- [ ] Design spec document
- [ ] Icon set (SVG)
- [ ] Color palette (Hex codes)
- [ ] Prototype/interactive flow

---

## 🔧 Handoff to Development

### Assets to Provide
1. **UI Components** - Ready-to-use component set
2. **Spacing Guide** - Pixel-perfect measurements
3. **Type Scale** - Font sizes & weights
4. **Icon Pack** - SVG/Font icons
5. **Brand Assets** - Logo variations
6. **Responsive Grid** - Breakpoint specs

### Documentation
- Style guide
- Component library (with variants)
- Accessibility checklist
- Animation specs
- Dark mode guidelines

---

## 📞 Notes for Designer

1. **Primary Color**: Purple `#aa3bff` - Used for CTAs, links, accent elements
2. **Modern & Clean**: Whitespace is important, don't overcrowd
3. **Fashion-forward**: Use high-quality images, good photography
4. **Mobile-first**: Design mobile first, then scale up
5. **Consistent**: Use the component system consistently
6. **Accessibility**: Ensure 4.5:1 contrast ratio for text
7. **Dark Mode**: Test both light and dark themes

---

**Ready to design with Stitch! 🚀**
