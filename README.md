# 🐠 Aqua Blue Frontend

This repository contains the frontend implementation of the **Aqua Blue** project — a pet shop and aquarium online store. It is built with **Next.js + TypeScript + Tailwind**, focusing on performance, clean architecture, and modern UI/UX.

<p align="center">
  <img src="/public/images/Logo.webp" alt="Aqua Blue Logo" width="120" />  
</p>

---

## ✨ Key Features

### 🛒 Cart System
- **Guest cart** stored in localStorage with temporary IDs
- **Logged-in cart** synced with backend API
- **Automatic merge** when guest logs in
- Real-time quantity updates with optimistic UI
- Stock validation before adding to cart

### 🔐 Authentication
- **SMS verification** via ippanel (Faraz SMS)
- **JWT token** stored in HttpOnly cookies
- Role-based access control (user / admin / owner)
- Protected routes and API endpoints

### 🎨 UI/UX
- **Dark/Light mode** toggle with system preference detection
- **Fully responsive** design (mobile, tablet, desktop)
- **Glassmorphism** effects with backdrop-blur
- **Smooth animations** and transitions
- **Persian (RTL)** layout support

### 📦 State Management
- **Zustand** for cart state (persisted to localStorage)
- **SWR** for server-state caching and revalidation
- Optimistic updates for better perceived performance

### 🚀 Performance
- **Dynamic imports** for heavy components
- **Suspense** for lazy loading sections
- **Image optimization** with Next.js Image component
- **Code splitting** and lazy loading routes
- **Preloading** critical assets

### 🧩 Components
- Product cards with discount badges and timers
- Interactive sliders (keen-slider)
- Infinite scroll pagination
- Comment system with replies
- FAQ accordion sections
- Share buttons (Telegram, Bale, Eitaa, WhatsApp)

---

## 🧱 Tech Stack

- [Next.js 16](https://nextjs.org/) — React framework
- [React 19](https://reactjs.org/) — UI library
- [TypeScript 5](https://www.typescriptlang.org/) — Type safety
- [Tailwind CSS 4](https://tailwindcss.com/) — Styling
- [Zustand 5](https://zustand-demo.pmnd.rs/) — State management (cart)
- [SWR 2](https://swr.vercel.app/) — Data fetching & caching
- [Keen Slider](https://keen-slider.io/) — Product sliders
- [Lucide React](https://lucide.dev/) — Icons
- [React Hot Toast](https://react-hot-toast.com/) — Notifications

---

## 🗂️ Project Structure

```
aqua-blue-frontend/
├── src/
│ ├── app/ # Next.js App Router pages
│ │ ├── (auth)/ # Auth pages (login)
│ │ ├── account/ # User dashboard
│ │ ├── article/ # Article pages
│ │ ├── blog/ # Blog listing
│ │ ├── cart/ # Shopping cart page
│ │ ├── category/ # Category pages
│ │ ├── cms/ # Admin panel
│ │ ├── product/ # Product pages
│ │ ├── search/ # Search results
│ │ ├── layout.tsx # Root layout
│ │ └── page.tsx # Homepage
│ ├── components/ # Reusable components
│ │ ├── home/ # Homepage components
│ │ ├── layout/ # Header, Footer, NavDrawer
│ │ ├── product/ # Product-related components
│ │ ├── category/ # Category components
│ │ └── ui/ # Generic UI components
│ ├── hooks/ # Custom React hooks
│ │ ├── useCart.ts
│ │ ├── useAuthCheck.ts
│ │ ├── useAlerts.ts
│ │ ├── useComments.ts
│ │ └── useInitCart.ts
│ ├── stores/ # Zustand stores
│ │ └── CartStore.ts
│ ├── types/ # TypeScript type definitions
│ │ ├── cart.ts
│ │ ├── product.ts
│ │ ├── user.ts
│ │ └── ...
│ ├── utils/ # Utility functions
│ │ ├── dateFormatter.ts
│ │ ├── notify.ts
│ │ └── imageLoader.ts
│ ├── constants/ # App constants
│ │ └── home.ts
│ └── lib/ # Libraries & configs
│   ├── client-swr.ts
│   └── server-fetch.ts
├── public/ # Static assets
│ ├──
│ └── images/
├── .env.local # Environment variables
├── package.json
├── package-lock.json
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── next-env.d.ts
├── next.config.ts
└── tailwind.config.ts
```


---

## 📋 Pages & Routes

### 🌐 Public Pages

| Page | Route | Status |
|------|-------|--------|
| Home | `/` | ✅ Completed |
| Product | `/product/[id]` | ✅ Completed |
| Category | `/category/[...slug]` | ✅ Completed |
| Search | `/search` | ✅ Completed |
| Blog | `/blog` | 🟡 In Development |
| Article | `/article/[id]` | 🟡 In Development |
| About Us | `/about-us` | 🟡 In Development |
| Login | `/login` | ✅ Completed |
| Cart | `/cart` | 🟡 In Development |

### 👤 Account Pages (User Dashboard)

| Page | Route | Status |
|------|-------|--------|
| Dashboard | `/account` | 🟡 In Development |
| Orders | `/account/orders` | 🟡 In Development |
| Profile | `/account/profile` | 🟡 In Development |
| Comments | `/account/comments` | 🟡 In Development |
| Tickets | `/account/tickets` | 🟡 In Development |
| Notifications | `/account/alerts` | 🟡 In Development |

### 🔧 CMS Pages (Admin Panel)

| Page | Route | Status |
|------|-------|--------|
| Dashboard | `/cms` | 🟡 In Development |
| Products | `/cms/products` | 🟡 In Development |
| Add Product | `/cms/add-product` | 🟡 In Development |
| Articles | `/cms/articles` | 🟡 In Development |
| Add Article | `/cms/add-article` | 🟡 In Development |
| Tickets | `/cms/tickets` | 🟡 In Development |
| Comments | `/cms/comments` | 🟡 In Development |
| Orders | `/cms/orders` | 🟡 In Development |
| Users | `/cms/users` | 🟡 In Development |
| Group Discounts | `/cms/group-discounts` | 🟡 In Development |
| Shipping Costs | `/cms/shipping-cost` | 🟡 In Development |
| Out of Stock | `/cms/out-of-stock-products` | 🟡 In Development |
| In Person Orders | `/cms/in-person-orders` | 🟡 In Development |
| Analytics | `/cms/analytics` | 🟡 In Development |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm
- Backend API running (see [aqua-blue-backend](https://github.com/jvd-malek/aqua-blue-backend))

### Installation

```bash
# Clone the repository
git clone https://github.com/jvd-malek/aqua-blue-frontend.git
cd aqua-blue-frontend

# Install dependencies
npm install

# Create environment variables file
cp .env.example .env.local
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3815/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Variable Descriptions

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API endpoint URL. All API requests will be sent to this address. | `http://localhost:3815/api` |
| `NEXT_PUBLIC_SITE_URL` | Frontend application URL. Used for canonical URLs, Open Graph meta tags, and sitemap generation. | `http://localhost:3000` |

> **Note:** Variables with `NEXT_PUBLIC_` prefix are exposed to the browser. Never store sensitive information (like JWT secrets, API keys, database credentials) in these variables. For production deployment on Vercel, add these variables in the **Environment Variables** section of your project settings.

---

## 💻 Development

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Run Linting

```bash
npm run lint
```

### Project Structure Overview

```
src/
├── app/          # Next.js App Router pages
├── components/   # Reusable React components
├── hooks/        # Custom React hooks
├── stores/       # Zustand state stores
├── types/        # TypeScript type definitions
├── utils/        # Utility functions
├── constants/    # App constants
└── lib/          # Libraries & configurations
```

---

## 🏗️ Architecture Notes

### Authentication Flow
1. User enters phone number → `POST /api/auth/send-code`
2. SMS with 5-digit code sent to user
3. User enters code → `POST /api/auth/verify`
4. Server returns JWT token in HttpOnly cookie
5. Frontend fetches user data via `GET /api/user/me`

### Cart System Architecture
- **Guest users:** Cart stored in Zustand + localStorage (items with `temp-*` IDs)
- **Logged-in users:** Cart synced with backend (`/api/user/cart`)
- **On login:** Guest cart automatically merged with server cart
- **Real-time updates:** Optimistic UI updates + background sync

### State Management Strategy
| Data Type | Solution | Persistence |
|-----------|----------|-------------|
| Cart | Zustand | localStorage (guest) |
| User | SWR + Context | Memory (cached) |
| Products | SWR | Memory (cached) |
| Comments | SWR | Memory (cached) |

### Performance Optimizations
- **Dynamic imports:** `WaveBackground`, `ProductsSlider`, `ArticlesSlider`
- **Suspense:** Lazy loading for product sections
- **Image optimization:** Next.js `Image` with custom loader
- **Code splitting:** Per-route chunks via Next.js App Router

### Styling Architecture
- **Tailwind CSS 4** with `@theme` for custom colors
- **Glassmorphism:** `backdrop-blur-sm` + `bg-white/80`
- **Gradients:** Blue to gold for accents
- **Animations:** Custom keyframes for floating fish and shimmer effects
- **Dark mode:** `dark:` variant with system preference detection

---

## 📚 Libraries & Tools

| Category | Library | Version | Purpose |
|----------|---------|---------|---------|
| **Framework** | Next.js | 16.2.6 | React framework with App Router |
| **UI** | React | 19.2.4 | UI library |
| **Language** | TypeScript | 5.0 | Type safety |
| **Styling** | Tailwind CSS | 4 | Utility-first CSS |
| **State Management** | Zustand | 5.0.13 | Cart state management |
| **Data Fetching** | SWR | 2.4.1 | Caching & revalidation |
| **Sliders** | Keen Slider | 6.8.6 | Product sliders |
| **Charts** | Chart.js | 4.5.1 | Analytics charts |
| **Icons** | Lucide React | 1.14.0 | Icon library |
| **Notifications** | React Hot Toast | 2.6.0 | Toast notifications |
| **Testing** | Vitest | 4.1.6 | Unit testing |
| **Testing** | React Testing Library | 16.3.2 | Component testing |

---

## 📄 License

MIT © 2025 | Developed by [javad malekian]

---

## 📬 Contact

For feedback, suggestions or questions:

- 📧 Email: [jvd.malek0079@gmail.com](mailto:jvd.malek0079@gmail.com)
- 🔗 Front-end Repository: [Aqua Blue Frontend](https://github.com/jvd-malek/aqua-blue-frontend)
- 🔗 Back-end Repository: [Aqua Blue Backend](https://github.com/jvd-malek/aqua-blue-backend)