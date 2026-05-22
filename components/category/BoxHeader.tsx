// components/category/BoxHeader.tsx

'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Filter, ListFilter, ChevronLeft } from 'lucide-react';
import { notify } from '@/utils/notify';
import Link from 'next/link';

type Props = {
  title: string;
  majorCat: string;
  minorCat?: string;
  isSearch?: boolean;
};

const sortOptions = [
  { label: 'جدیدترین‌ها', value: 'newest' },
  { label: 'تخفیفی‌ها', value: 'discount' },
  { label: 'گرانترین‌ها', value: 'price_desc' },
  { label: 'ارزانترین‌ها', value: 'price_asc' },
  { label: 'محبوبیت', value: 'popular' },
];

export default function BoxHeader({ title, majorCat, minorCat, isSearch }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort') || 'newest';
  const currentCount = searchParams.get('count') || '24';
  const hasActiveState = searchParams.get('state') === 'active';

  /**
   * به‌روزرسانی پارامترهای URL
   * @param updates - مقادیر جدید برای تنظیم
   * @param removes - کلیدهایی که باید حذف شوند
   */
  const updateParams = (updates: Record<string, string>, removes: string[] = []) => {
    const sp = new URLSearchParams(searchParams.toString());
    
    // حذف کلیدهای مشخص شده
    removes.forEach(key => sp.delete(key));
    
    // تنظیم مقادیر جدید
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        sp.set(key, value);
      } else {
        sp.delete(key);
      }
    });
    
    router.push(`${pathname}?${sp.toString()}`);
  };

  // تغییر وضعیت "فقط موجود"
  const handleStockToggle = () => {
    if (hasActiveState) {
      // حذف فیلتر موجودی
      updateParams({ page: '1' }, ['state']);
      notify('نمایش همه محصولات', 'success');
    } else {
      // اعمال فیلتر موجودی
      updateParams({ page: '1', state: 'active' });
      notify('نمایش فقط محصولات موجود', 'success');
    }
  };

  // تغییر مرتب‌سازی
  const handleSortChange = (value: string) => {
    updateParams({ sort: value, page: '1' });
    notify('مرتب‌سازی اعمال شد', 'success');
  };

  // تغییر تعداد در صفحه
  const handleCountChange = (value: string) => {
    updateParams({ count: value, page: '1' });
  };

  return (
    <div className="relative z-30 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm mt-6 overflow-hidden">
      
      {/* Header with linear */}
      <div className="px-5 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
        <h1 className="hero-title text-xl sm:text-2xl md:text-3xl font-bold inline-block" data-text={title}>
          {title}
        </h1>
        {minorCat && (
          <Link 
            href={`/category/${encodeURIComponent(majorCat)}`}
            className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1 mt-2 transition-colors"
          >
            <ChevronLeft size={14} />
            <span>نمایش همه {majorCat}</span>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 justify-between items-center px-5 py-4">
        
        {/* Sort Section */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-gray-200/50 dark:border-gray-700/50 px-3 py-2 shadow-sm">
            <Filter size={16} className="text-gray-500" />
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
              aria-label="مرتب‌سازی"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Count & Stock Section */}
        <div className="flex flex-wrap gap-3 items-center">
          
          {/* Items per page */}
          <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-gray-200/50 dark:border-gray-700/50 px-3 py-2 shadow-sm">
            <ListFilter size={16} className="text-gray-500" />
            <select
              value={currentCount}
              onChange={(e) => handleCountChange(e.target.value)}
              className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
              aria-label="تعداد در صفحه"
            >
              {[24, 36, 48].map((n) => (
                <option key={n} value={n}>{n} عدد</option>
              ))}
            </select>
          </div>

          {/* In Stock Toggle */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/70 shadow-sm">
            <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">فقط موجود</span>
            <button
              onClick={handleStockToggle}
              className={`relative w-10 h-5 rounded-full transition-all duration-300 ${
                hasActiveState ? 'bg-linear-to-r from-blue-600 to-blue-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              aria-label={hasActiveState ? 'نمایش همه محصولات' : 'نمایش فقط محصولات موجود'}
            >
              <span 
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${
                  hasActiveState ? 'translate-x-4.25' : 'translate-x-0'
                }`} 
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}