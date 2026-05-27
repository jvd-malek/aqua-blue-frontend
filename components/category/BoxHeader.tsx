// components/category/BoxHeader.tsx

'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Filter, ListFilter, ChevronLeft, Search, X } from 'lucide-react';
import { notify } from '@/utils/notify';
import Link from 'next/link';
import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useLinkStore } from '@/stores/LinkStore';

type Props = {
  title: string;
  majorCat: string;
  minorCat?: string;
};

const SORT_OPTIONS = {
  products: [
    { label: 'جدیدترین‌ها', value: 'newest' },
    { label: 'تخفیفی‌ها', value: 'discount' },
    { label: 'گرانترین‌ها', value: 'price_desc' },
    { label: 'ارزانترین‌ها', value: 'price_asc' },
    { label: 'محبوبیت', value: 'popular' },
  ],
  blog: [
    { label: 'جدیدترین', value: 'newest' },
    { label: 'پربازدیدترین', value: 'popular' },
    { label: 'قدیمی‌ترین', value: 'oldest' },
  ],
};

const COUNT_OPTIONS = [24, 36, 48];

// ============================================
// کامپوننت جستجوی مستقل (برای جلوگیری از re-mount)
// ============================================
const SearchInput = memo(({ 
  initialValue, 
  onSearch 
}: { 
  initialValue: string; 
  onSearch: (query: string) => void;
}) => {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="جستجو در مقالات..."
        className="w-full md:w-64 px-4 py-2 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />
      <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2">
        <Search size={18} className="text-gray-400" />
      </button>
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <X size={16} className="text-gray-400" />
        </button>
      )}
    </form>
  );
});

SearchInput.displayName = 'SearchInput';

export default function BoxHeader({ title, majorCat, minorCat }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [categories, setCategories] = useState<{ minor: string; label: string }[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const { links, fetchLinks, getMainLinkByTxt, getSubLinks } = useLinkStore();

  const isBlog = majorCat === 'مجله';
  
  const currentMinor = searchParams.get('minorCat') || '';
  const currentSort = searchParams.get('sort') || (isBlog ? 'newest' : 'newest');
  const currentCount = searchParams.get('count') || '24';
  const hasActiveState = searchParams.get('state') === 'active';
  
  const sortOptions = isBlog ? SORT_OPTIONS.blog : SORT_OPTIONS.products;

  // دریافت دسته‌بندی‌ها از لینک‌ها
  useEffect(() => {
    let isMounted = true;
    setIsLoadingCategories(true);
    
    const loadCategories = async () => {
      await fetchLinks();
      if (!isMounted) return;
      
      if (links.length === 0) {
        setIsLoadingCategories(false);
        return;
      }

      const mainLink = getMainLinkByTxt(majorCat);
      console.log(mainLink);
      console.log(majorCat);
      
      if (!mainLink) {
        setIsLoadingCategories(false);
        return;
      }

      const subLinks = getSubLinks(mainLink.id);
      if (isMounted) {
        setCategories(subLinks.map(sub => ({ minor: sub.txt, label: sub.txt })));
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
    
    return () => { isMounted = false; };
  }, [majorCat, fetchLinks, getMainLinkByTxt, getSubLinks,links]);

  const updateParams = useCallback((updates: Record<string, string>, removes: string[] = []) => {
    const sp = new URLSearchParams(searchParams.toString());
    removes.forEach(key => sp.delete(key));
    Object.entries(updates).forEach(([key, value]) => {
      if (value) sp.set(key, value);
      else sp.delete(key);
    });
    router.push(`${pathname}?${sp.toString()}`);
  }, [pathname, router, searchParams]);

  const handleSortChange = useCallback((value: string) => {
    updateParams({ sort: value, page: '1' });
    notify('مرتب‌سازی اعمال شد', 'success');
  }, [updateParams]);

  const handleCountChange = useCallback((value: string) => {
    updateParams({ count: value, page: '1' });
  }, [updateParams]);

  const handleStockToggle = useCallback(() => {
    updateParams({ state: hasActiveState ? '' : 'active', page: '1' });
  }, [hasActiveState, updateParams]);

  const handleCategoryChange = useCallback((minor: string) => {
    if (minor) {
      updateParams({ minorCat: minor, page: '1' });
    } else {
      updateParams({ page: '1' }, ['minorCat']);
    }
    // بستن موبایل فیلتر بعد از انتخاب
    setShowMobileFilters(false);
  }, [updateParams]);

  const handleSearch = useCallback((query: string) => {
    if (query) {
      updateParams({ search: query, page: '1' });
    } else {
      updateParams({}, ['search']);
    }
    setShowMobileFilters(false);
  }, [updateParams]);

  const closeMobileFilters = useCallback(() => {
    setShowMobileFilters(false);
  }, []);

  // نمایش دسته‌بندی (برای بلاگ همیشه نشون بده، برای محصولات اگه دیتا داشته باشه)
  const showCategoryFilter = isBlog || categories.length > 0;

  // محتوای فیلترها
  const FilterContent = useMemo(() => (
    <div className="space-y-4">
      {/* مرتب‌سازی */}
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">مرتب‌سازی بر اساس</label>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSortChange(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                currentSort === opt.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* دسته‌بندی */}
      {showCategoryFilter && !isLoadingCategories && (
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">دسته‌بندی</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                !currentMinor ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              همه
            </button>
            {categories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => handleCategoryChange(cat.minor)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  currentMinor === cat.minor
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* فقط موجود (فقط محصولات) */}
      {!isBlog && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">فقط محصولات موجود</span>
          <button
            onClick={handleStockToggle}
            className={`relative w-10 h-5 rounded-full transition-all duration-300 ${
              hasActiveState ? 'bg-linear-to-r from-blue-600 to-blue-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${
              hasActiveState ? 'translate-x-4.25' : 'translate-x-0'
            }`} />
          </button>
        </div>
      )}

      {/* تعداد در صفحه */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">تعداد در صفحه</span>
        <select
          value={currentCount}
          onChange={(e) => handleCountChange(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-sm"
        >
          {COUNT_OPTIONS.map((n) => (
            <option key={n} value={n}>{n} عدد</option>
          ))}
        </select>
      </div>
    </div>
  ), [sortOptions, currentSort, showCategoryFilter, isLoadingCategories, categories, currentMinor, isBlog, hasActiveState, currentCount, handleSortChange, handleCategoryChange, handleStockToggle, handleCountChange]);

  const hasActiveFilter = currentSort !== 'newest' || hasActiveState || currentMinor;

  return (
    <div className="relative z-30 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm mt-6 overflow-hidden">
      
      {/* ========== موبایل ========== */}
      <div className="md:hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex-1">
            <h1 className="hero-title text-lg font-bold truncate" data-text={title}>{title}</h1>
            {minorCat && (
              <Link href={`/category/${encodeURIComponent(majorCat)}`} className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1 mt-1">
                <ChevronLeft size={12} />
                <span>نمایش همه {majorCat}</span>
              </Link>
            )}
          </div>
          <button onClick={() => setShowMobileFilters(!showMobileFilters)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium">
            <Filter size={16} />
            <span>فیلتر</span>
            {hasActiveFilter && <span className="w-2 h-2 bg-yellow-400 rounded-full -ml-1" />}
          </button>
        </div>

        {showMobileFilters && (
          <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
            {/* جستجو (فقط بلاگ) */}
            {isBlog && (
              <div className="mb-4">
                <SearchInput 
                  initialValue={searchParams.get('search') || ''} 
                  onSearch={handleSearch} 
                />
              </div>
            )}
            {FilterContent}
            <button onClick={closeMobileFilters} className="w-full mt-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm">
              اعمال فیلترها
            </button>
          </div>
        )}
      </div>

      {/* ========== دسکتاپ ========== */}
      <div className="hidden md:block">
        <div className="px-5 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <h1 className="hero-title text-xl sm:text-2xl md:text-3xl font-bold inline-block" data-text={title}>{title}</h1>
          {minorCat && (
            <Link href={`/category/${encodeURIComponent(majorCat)}`} className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1 mt-2 transition-colors">
              <ChevronLeft size={14} />
              <span>نمایش همه {majorCat}</span>
            </Link>
          )}
        </div>
        <div className="px-5 py-4">
          <div className="flex flex-wrap gap-3 justify-between items-center">
            <div className="flex flex-wrap gap-3 items-center">
              {/* جستجو (فقط بلاگ) */}
              {isBlog && (
                <SearchInput 
                  initialValue={searchParams.get('search') || ''} 
                  onSearch={handleSearch} 
                />
              )}

              {/* مرتب‌سازی */}
              <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-gray-200/50 dark:border-gray-700/50 px-3 py-2 shadow-sm">
                <Filter size={16} className="text-gray-500" />
                <select
                  value={currentSort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* دسته‌بندی */}
              {showCategoryFilter && !isLoadingCategories && (
                <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-gray-200/50 dark:border-gray-700/50 px-3 py-2 shadow-sm">
                  <ListFilter size={16} className="text-gray-500" />
                  <select
                    value={currentMinor}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    <option value="">همه دسته‌ها</option>
                    {categories.map((cat) => (
                      <option key={cat.label} value={cat.minor}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              {/* تعداد در صفحه */}
              <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-gray-200/50 dark:border-gray-700/50 px-3 py-2 shadow-sm">
                <ListFilter size={16} className="text-gray-500" />
                <select
                  value={currentCount}
                  onChange={(e) => handleCountChange(e.target.value)}
                  className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  {COUNT_OPTIONS.map((n) => (
                    <option key={n} value={n}>{n} عدد</option>
                  ))}
                </select>
              </div>

              {/* فقط موجود (فقط محصولات) */}
              {!isBlog && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/70 shadow-sm">
                  <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">فقط موجود</span>
                  <button
                    onClick={handleStockToggle}
                    className={`relative w-10 h-5 rounded-full transition-all duration-300 ${
                      hasActiveState ? 'bg-linear-to-r from-blue-600 to-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${
                      hasActiveState ? 'translate-x-4.25' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}