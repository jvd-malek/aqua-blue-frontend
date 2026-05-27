import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { X, Waves } from 'lucide-react'
import LoginForm from '@/components/login/LoginForm'
import { LOGO } from '@/constants/home'

export const metadata: Metadata = {
  title: 'ورود به حساب کاربری',
  description: 'ورود یا ثبت نام در فروشگاه Aqua Blue',
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://aquablueiran.com/login' },
}

export default async function LoginPage(props: { searchParams?: Promise<Record<string, string>> }) {
  const searchParams = await props.searchParams
  const bas = searchParams?.bas === 'true'
  const homeHref = bas ? '/basket?activeLink=info' : '/'

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-linear-to-br from-blue-50/50 to-white dark:from-gray-900 dark:to-gray-950">
      <main className="container mx-auto px-4 py-8 flex md:flex-row flex-col justify-around items-center gap-8">

        {/* بخش لوگو و توضیحات - شبیه هدر هوم */}
        <div className="flex flex-col justify-center items-start z-10">
          <Link href={homeHref} className="group flex justify-center items-center gap-3 transition-all duration-300 hover:scale-105">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-500/30 transition-all duration-300"></div>
              <Image
                src={LOGO.Logo}
                alt="Aqua Blue"
                width={80}
                height={80}
                className="rounded-2xl object-contain relative z-10 shadow-lg"
                priority
              />
            </div>
            <div className="border-r-2 border-blue-300/50 pr-3">
              <h3 className="hero-title text-lg md:text-xl font-bold whitespace-pre-line" data-text="Aqua Blue">
                {`Aqua Blue`}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                حیوانات خانگی و آکواریوم
              </p>
            </div>
          </Link>

          {/* توضیحات زیر لوگو با آیکون */}
          <div className="px-3 mt-4 space-y-2">
            <p className="hero-subtitle text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              دنیای رنگارنگ آبزیان در دستان شما
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2">
              <Waves size={12} className="text-blue-400" />
              بهترین کیفیت، بهترین قیمت
            </p>
          </div>
        </div>

        {/* فرم لاگین - با استایل کارت‌های هوم */}
        <article className="sm:h-auto pt-12 pb-8 sm:max-w-96 w-[90vw] rounded-2xl relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl transition-all duration-300 hover:shadow-2xl">

          {/* دکمه بستن - شبیه دکمه‌های هوم */}
          <Link
            href={homeHref}
            className="absolute top-3 left-3 z-20 bg-linear-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-1.5 rounded-full shadow-md hover:scale-105 transition-all duration-300 group"
            aria-label="بستن"
          >
            <X size={18} className="text-gray-600 dark:text-gray-300 group-hover:text-red-500 transition-colors" />
          </Link>

          {/* خط تزئینی بالای فرم */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-linear-to-r from-blue-500 via-gold to-blue-500 rounded-b-lg"></div>

          <LoginForm />

          {/* متن اضافی زیر فرم */}
          <div className="text-center mt-6 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {` ورود شما به معنای پذیرش`}
              <Link href="/terms" className="text-blue-500 hover:text-blue-600 mx-1 transition-colors">{` قوانین `}</Link>
              {` سایت است`}
            </p>
          </div>
        </article>
      </main>
    </div>
  )
}