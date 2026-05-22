// components/layout/Footer.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Smartphone } from 'lucide-react'
import Logo from '@/public/images/Logo-removebg.webp'

export default function Footer() {
  return (
    <footer className="w-full mt-12 container mx-auto px-3" id="footer">
      <div className="flex md:flex-row flex-col gap-8 justify-around rounded-xl p-6 md:p-8 mb-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="flex flex-col">
          <h3 className="border-b-2 border-blue-300/50 dark:border-blue-700/50 pb-1 font-bold mb-4 text-gray-800 dark:text-gray-200">لینک‌های مفید</h3>
          <div className="space-y-2 text-sm">
            <Link href="/" className="block text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">صفحه اصلی</Link>
            <Link href="/category/ماهی" className="block text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">ماهی‌ها</Link>
            <Link href="/category/آکواریوم" className="block text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">آکواریوم</Link>
            <Link href="/blog" className="block text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">وبلاگ</Link>
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="border-b-2 border-blue-300/50 dark:border-blue-700/50 pb-1 font-bold mb-4 text-gray-800 dark:text-gray-200">ارتباط با ما</h3>
          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Smartphone size={16} className="text-blue-500" />
              <Link href="tel:09934242315" dir="ltr" className="hover:text-blue-600 transition-colors">0993-424-2315</Link>
            </p>
            <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Phone size={16} className="text-blue-500" />
              <Link href="tel:02133334434" dir="ltr" className="hover:text-blue-600 transition-colors">021-3333-4434</Link>
            </p>
            <Link href="/about-us" className="block text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors mt-2">درباره ما</Link>
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="border-b-2 border-blue-300/50 dark:border-blue-700/50 pb-1 font-bold mb-4 text-gray-800 dark:text-gray-200">مجوزات</h3>
          <div className="flex flex-wrap gap-3 mt-2">
            <Image src={Logo} alt="نماد اعتماد" width={80} height={80} className="rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-white dark:bg-gray-800" />
          </div>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-t-xl border border-gray-200/50 dark:border-gray-700/50 py-4">
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          کلیه حقوق برای{' '}
          <Link href="/" className="text-blue-700 dark:text-blue-400 font-bold hover:text-blue-600 transition-colors">Aqua Blue</Link>
          {' '}محفوظ است
        </p>
      </div>
    </footer>
  )
}