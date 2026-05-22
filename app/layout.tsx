import type { Metadata, Viewport } from 'next';
import dynamic from 'next/dynamic';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './providers';
import { Baloo } from './fonts';
import './globals.css';

const WaveBackground = dynamic(
  () => import('@/components/home/WaveBackground'),
  { ssr: true, loading: () => null }
);


// ============================================
// Base Metadata
// ============================================

const SITE_NAME = 'Aqua Blue';
const SITE_DESCRIPTION = 'فروشگاه تخصصی Aqua Blue، مرجع خرید انواع ماهی‌های زینتی، آکواریوم، غذای ماهی و لوازم جانبی با بهترین قیمت و کیفیت. ارسال سریع به سراسر ایران | مشاوره رایگان | آدرس: تهران، خیابان یکم نیروهوایی، پلاک 121'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aquablueiran.com';
const SITE_LOGO = `${SITE_URL}/images/Logo.webp`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} - آکواریوم آبی`,
    absolute: SITE_NAME,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    // Core
    'ماهی',
    'آکواریوم',
    'پت شاپ',
    'ماهی زینتی',
    'تجهیزات آکواریوم',
    'غذای ماهی',
    'فروشگاه ماهی',
    'لوازم آکواریوم',

    // Types of fish
    'ماهی گوپی',
    'ماهی نئون',
    'ماهی دیسکاس',
    'ماهی اسکار',
    'ماهی فرشته',
    'ماهی بتا',
    'ماهی قرمز',
    'ماهی سیکلید',
    'ماهی کوی',

    // Equipment
    'فیلتر آکواریوم',
    'پمپ آکواریوم',
    'نور آکواریوم',
    'هیتر آکواریوم',
    'چوب آکواریوم',
    'سنگ آکواریوم',
    'اسکیمر',

    // Food
    'غذای گرانول',
    'غذای پولکی',
    'کرم خونی',
    'آرتمیا',

    // Brands
    'تترا',
    'سیرا',
    'JBL',
    'فلووال',

    // Care & Disease
    'بیماری ماهی',
    'درمان ماهی',
    'سیکل آکواریوم',
    'نگهداری ماهی',

    // Location
    'فروشگاه آکواریوم تهران',
    'خرید ماهی زینتی تهران',

    // Other
    'دکور آکواریوم',
    'گیاه آکواریومی',
    'آکواریوم آب شور',
    'آکواریوم آب شیرین',
    'مشاوره آکواریوم',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  manifest: '/manifest.json',
  openGraph: {
    title: {
      template: `%s | ${SITE_NAME}`,
      default: `${SITE_NAME} - فروشگاه تخصصی ماهی و آکواریوم`,
    },
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'fa_IR',
    type: 'website',
    images: [
      {
        url: '/og.webp',
        width: 1200,
        height: 630,
        alt: 'Aqua Blue - فروشگاه تخصصی ماهی و آکواریوم',
        type: 'image/webp',
      },
    ],
    emails: ['info@aquablueiran.com'],
    phoneNumbers: ['+989193919019'],
    countryName: 'Iran',
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - فروشگاه تخصصی ماهی و آکواریوم`,
    description: SITE_DESCRIPTION,
    images: ['/og.webp'],
    site: '@aquablueiran',
    creator: '@aquablueiran',
  },

  // لینک‌های متناوب و canonical
  alternates: {
    canonical: SITE_URL,
    languages: {
      'fa-IR': SITE_URL,
      'en-US': `${SITE_URL}/en`,
    },
  },

  // تأیید مالکیت در سرویس‌های مختلف
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
    // yandex: process.env.YANDEX_VERIFICATION_ID,
    // me: ['info@aquablueiran.com'],
    // other: {
    //   'facebook-domain-verification': process.env.FACEBOOK_VERIFICATION_ID,
    // },
  },

  // لینک‌های مرتبط
  // other: {
  //   'enamad': '9617960',
  //   'samandehi': '',
  // },

  // Apple Web App
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: 'black-translucent',
  },

  // فرمت‌های خاص
  formatDetection: {
    telephone: true,
    date: false,
    address: false,
    email: true,
    url: true,
  },

  // کتابخانه مرجع
  referrer: 'origin-when-cross-origin',

  // نویسنده
  authors: [
    { name: 'Aqua Blue Team', url: SITE_URL },
  ],

  // کپی‌رایت
  creator: 'Aqua Blue',
  publisher: 'Aqua Blue',

  // اطلاعات دسترسی
  category: 'pet store',
};

// ============================================
// Viewport Configuration
// ============================================

export const viewport: Viewport = {
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3B82F6' },
    { media: '(prefers-color-scheme: dark)', color: '#1E3A8A' },
  ],
};

// ============================================
// Structured Data (JSON-LD)
// ============================================

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: SITE_NAME,
  url: SITE_URL,
  logo: SITE_LOGO,
  image: `${SITE_URL}/og.webp`,
  description: SITE_DESCRIPTION,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IR',
    addressLocality: 'تهران',
    postalCode: '1737733188',
    streetAddress: 'تهران، خیابان یکم نیروهوایی، پلاک 121',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 35.697761305850456,
    longitude: 51.47974072024225,
  },
  telephone: '+989193919019',
  email: 'info@aquablueiran.com',
  priceRange: '$$',
  currenciesAccepted: 'IRR',
  paymentAccepted: ['نقدی', 'کارت اعتباری', 'کارت به کارت', 'واریز بانکی'],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      opens: '09:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Friday'],
      opens: '09:00',
      closes: '14:00',    // جمعه‌ها کمتر
    },
  ],
  sameAs: [
    'https://instagram.com/aquablue',
    'https://t.me/aquablue',
    'https://wa.me/989193919019',
  ],
};

// ============================================
// Root Layout
// ============================================

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={Baloo.variable}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link rel="preload" href="/images/Logo-removebg.webp" as="image" type="image/webp" />
      </head>

      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col font-[family-name:var(--font-Baloo)]">
        <WaveBackground />
        <AppProvider>
          <main className="flex-1">{children}</main>
        </AppProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}