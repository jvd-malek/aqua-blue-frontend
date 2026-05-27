// components/product/Breadcrumb.tsx

import Link from 'next/link';
import { ChevronLeft, Home } from 'lucide-react';

type Props = {
  majorCat?: string;
  minorCat?: string;
  title?: string;
  brand?: string;
  isArticle?: boolean;
};

export default function Breadcrumb({ majorCat, minorCat, title, brand, isArticle }: Props) {
  return (
    <nav className="relative z-30 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6 bg-white dark:bg-gray-900 rounded-xl px-4 py-2.5 w-full border border-gray-200/50 dark:border-gray-700/50">
      
      {/* خانه */}
      <Link href="/" className="hover:text-blue-600 transition-colors duration-300">
        <Home size={14} />
      </Link>
      <ChevronLeft size={12} className="text-gray-400" />

      {/* دسته‌بندی اصلی (majorCat) */}
      {majorCat && (
        <>
          <Link 
            href={isArticle ? `/blog?majorCat=${encodeURIComponent(majorCat)}` : `/category/${encodeURIComponent(majorCat)}`}
            className="hover:text-blue-600 transition-colors duration-300"
          >
            {majorCat}
          </Link>
          <ChevronLeft size={12} className="text-gray-400" />
        </>
      )}

      {/* دسته‌بندی فرعی (minorCat) */}
      {minorCat && (
        <>
          <Link 
            href={isArticle 
              ? `/blog?majorCat=${encodeURIComponent(majorCat || '')}&minorCat=${encodeURIComponent(minorCat)}` 
              : `/category/${encodeURIComponent(majorCat || '')}/${encodeURIComponent(minorCat)}`
            }
            className="hover:text-blue-600 transition-colors duration-300"
          >
            {minorCat}
          </Link>
          <ChevronLeft size={12} className="text-gray-400" />
        </>
      )}

      {/* برند (فقط برای محصولات) */}
      {brand && !isArticle && (
        <>
          <Link 
            href={`/category/${encodeURIComponent(majorCat || '')}/${encodeURIComponent(minorCat || '')}?brand=${encodeURIComponent(brand)}`}
            className="hover:text-blue-600 transition-colors duration-300"
          >
            {brand}
          </Link>
          <ChevronLeft size={12} className="text-gray-400" />
        </>
      )}

      {/* عنوان نهایی */}
      {title && (
        <span className="text-gray-900 dark:text-white font-medium truncate">
          {title}
        </span>
      )}
    </nav>
  );
}