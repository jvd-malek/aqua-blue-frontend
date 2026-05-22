// app/not-found.tsx

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { LOGO } from '@/constants/home';

export const metadata: Metadata = {
  title: 'صفحه مورد نظر یافت نشد (۴۰۴) | Aqua Blue',
  description: 'متاسفیم! صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Header />

      <main className="min-h-[calc(100vh-200px)] flex items-center justify-center relative z-20">
        <div className="container mx-auto px-4 py-16 text-center">

          {/* لوگو + عدد ۴۰۴ */}
          <div className="relative mb-6 inline-block">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <Image
                src={LOGO.LogoRemoveBG}
                alt="Aqua Blue"
                width={180}
                height={180}
                className="object-contain"
                loading='eager'
              />
            </div>
            <div className="relative text-[120px] md:text-[160px] font-black leading-none select-none">
              <span className="bg-linear-to-r from-blue-600 via-blue-500 to-gold bg-clip-text text-transparent">
                ۴۰۴
              </span>
            </div>
          </div>

          {/* عنوان و توضیحات */}
          <div className="space-y-4 mb-8">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200">
              صفحه‌ای که دنبالش بودید پیدا نشد!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              متاسفیم! صفحه مورد نظر شما وجود ندارد یا حذف شده است.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex btn-primary items-center gap-2 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 px-5 rounded-xl transition-all duration-300 hover:scale-105 shadow-md"
          >
            <Home size={16} />
            <span>صفحه اصلی</span>
          </Link>

          {/* دسته‌بندی‌های سریع */}
          <div className="mt-10 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              دسته‌بندی‌های پرفروش:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'ماهی‌ها', href: '/category/ماهی', icon: '🐟' },
                { name: 'آکواریوم', href: '/category/آکواریوم', icon: '🐠' },
                { name: 'غذاها', href: '/category/غذا', icon: '🦐' },
                { name: 'لوازم جانبی', href: '/category/لوازم-جانبی', icon: '⚙️' },
              ].map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 rounded-lg border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:scale-105"
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}