// components/category/PaginationBox.tsx

'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = { 
  totalPages: number; 
  currentPage: number;
  basePath?: string;  // ← اضافه شد
};

export default function PaginationBox({ totalPages, currentPage, basePath }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const buildHref = (page: number) => {
    // اگه basePath داده شده، از اون استفاده کن
    if (basePath) {
      const sp = new URLSearchParams(searchParams.toString());
      sp.set('page', String(page));
      return `${basePath}&${sp.toString()}`;
    }
    
    // در غیر این صورت از مسیر فعلی استفاده کن
    const sp = new URLSearchParams(searchParams.toString());
    sp.set('page', String(page));
    return `${pathname}?${sp.toString()}`;
  };

  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <nav aria-label="صفحه‌بندی" className="flex justify-center items-center gap-2 mt-10" dir="ltr">
      {/* دکمه قبلی */}
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-blue-300 transition-all duration-300"
        >
          <ChevronLeft size={18} />
        </Link>
      )}

      {/* صفحات */}
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="text-gray-400 px-1">...</span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            className={`flex items-center justify-center w-9 h-9 rounded-xl text-sm font-medium transition-all duration-300 ${
              p === currentPage
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md'
                : 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-blue-300'
            }`}
          >
            {p.toLocaleString('fa-IR')}
          </Link>
        )
      )}

      {/* دکمه بعدی */}
      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-blue-300 transition-all duration-300"
        >
          <ChevronRight size={18} />
        </Link>
      )}
    </nav>
  );
}