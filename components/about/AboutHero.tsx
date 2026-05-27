import { Fish, Waves, Shield, Truck } from 'lucide-react';

export default function AboutHero() {
  return (
    <section className="py-16 md:py-24 text-center relative z-10">


        <h1 className="hero-title mb-6 text-lg" data-text="درباره Aqua Blue">
          درباره
          <span className="pr-2 font-extrabold font-sans text-2xl md:text-3xl lg:text-4xl">
            AQUA BLUE
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-8">
          ما در Aqua Blue عاشق دنیای آبزیان هستیم. از سال ۱۴۰۰ با هدف ارائه بهترین
          محصولات و خدمات در زمینه ماهی‌های زینتی، آکواریوم و لوازم جانبی شروع به کار کردیم.
        </p>

        <div className="flex flex-wrap justify-center gap-8 mt-12">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-linear-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center mb-3">
              <Fish size={32} className="text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-600">+۱۰۰۰</p>
            <p className="text-sm text-gray-500">محصول متنوع</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-linear-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center mb-3">
              <Waves size={32} className="text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-600">+۵۰۰۰</p>
            <p className="text-sm text-gray-500">مشتری راضی</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-linear-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center mb-3">
              <Truck size={32} className="text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-600">+۵۰</p>
            <p className="text-sm text-gray-500">شهر مقصد ارسال</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-linear-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center mb-3">
              <Shield size={32} className="text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-600">۱۰۰٪</p>
            <p className="text-sm text-gray-500">ضمانت اصالت</p>
          </div>
        </div>
    </section>
  );
}