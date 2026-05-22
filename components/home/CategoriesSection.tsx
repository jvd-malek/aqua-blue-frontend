import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES } from '@/constants/home';

function CategoryCard({ category }: { category: typeof CATEGORIES[number] }) {
  return (
    <Link href={category.href} className="group relative block">
      <div className="relative w-38 h-38 rounded-full bg-linear-to-br from-blue-500/10 to-blue-600/5 dark:from-blue-500/5 dark:to-blue-600/5 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:scale-105">

        <div className="absolute inset-2 rounded-full overflow-hidden">
          <Image
            src={category.image}
            alt={category.name}
            quality={75}
            fill
            className="object-contain transition-transform duration-700 group-hover:scale-110 p-2"
          />
          <div className={`absolute inset-0 bg-linear-to-br ${category.color} opacity-20 group-hover:opacity-10 transition-opacity`} />
        </div>

        <div className="absolute -inset-1 rounded-full bg-linear-to-r from-gold/0 via-gold/40 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="w-37 absolute left-1/2 -translate-x-1/2 top-[50%] -z-50">
        <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl p-2 shadow-lg border border-gold/20 transition-all duration-300 group-hover:shadow-xl group-hover:border-gold/40 h-54 text-center flex items-end justify-center">
          <div className="relative text-center">
            <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-1">
              {category.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {category.desc}
            </p>
            <div className="inline-block px-2 py-0.5 rounded-full bg-gold/20 text-gold text-xs font-bold">
              {category.badge}
            </div>
            <div className="mt-2 text-xs text-blue-500 font-medium flex items-center justify-center gap-1">
              <span>مشاهده محصولات</span>
              <span className="group-hover:translate-x-1 transition-transform">←</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function CategoriesSection() {
  return (
    <section className="container mx-auto px-3 relative z-10 md:mt-16 mt-30 mb-46">
      <div className="md:text-center mb-8">
        <h2 className="section-title text-2xl md:text-3xl font-bold inline-block">
          دسته‌بندی محصولات
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm">
          آنچه در Aqua Blue می‌یابید
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-x-8 gap-y-40 md:gap-12">
        {CATEGORIES.map((category) => (
          <CategoryCard key={category.name} category={category} />
        ))}
      </div>
    </section>
  );
}