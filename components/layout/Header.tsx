// components/layout/Header.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ShoppingCart, User as UserIcon, LogIn, MoreVertical } from 'lucide-react';
import { useApp } from '@/app/providers';
import { useCartStore } from '@/stores/CartStore';
import NavDrawer from './NavDrawer';

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [focusSearch, setFocusSearch] = useState(false);
  
  const { user, unreadCount, isHydrated } = useApp();
  const { totalItems } = useCartStore();

  const openDrawer = (focus?: boolean) => {
    setFocusSearch(!!focus);
    setDrawerOpen(true);
  };

  // اسکلتون در حین لود اولیه
  if (!isHydrated) {
    return (
      <header className="sticky top-0 z-50 pt-2 container mx-auto px-3">
        <div className="flex items-center justify-between backdrop-blur-md bg-white/70 dark:bg-gray-900/70 shadow-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl h-16 px-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          </div>
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 pt-2 container mx-auto px-3">
        <div className="flex items-center justify-between backdrop-blur-md bg-white/70 dark:bg-gray-900/70 shadow-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl h-16 px-4">
          
          {/* دکمه‌های سمت راست (منو، جستجو، سبد خرید، کاربر) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* دکمه منو */}
            <button 
              onClick={() => openDrawer()} 
              className="p-2 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors" 
              aria-label="منو"
            >
              <MoreVertical size={22} className="text-gray-700 dark:text-gray-300" />
            </button>
            
            {/* دکمه جستجو */}
            <button 
              onClick={() => openDrawer(true)} 
              className="p-2 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors" 
              aria-label="جستجو"
            >
              <Search size={20} className="text-gray-700 dark:text-gray-300" />
            </button>
            
            {/* سبد خرید با تعداد */}
            <Link 
              href="/cart" 
              className="relative p-2 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors" 
              aria-label="سبد خرید"
            >
              <ShoppingCart size={20} className="text-gray-700 dark:text-gray-300" />
              {totalItems > 0 && (
                <span className="absolute top-0 -right-0.5 bg-linear-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold min-w-4.5 h-4.5 flex items-center justify-center rounded-full px-1 shadow-md">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
            
            {/* دکمه کاربر / ورود */}
            {user ? (
              <Link 
                href="/account" 
                className="p-2 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors" 
                aria-label="حساب کاربری"
              >
                <UserIcon size={20} className="text-gray-700 dark:text-gray-300" />
              </Link>
            ) : (
              <Link 
                href="/login" 
                className="p-2 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors" 
                aria-label="ورود"
              >
                <LogIn size={20} className="text-gray-700 dark:text-gray-300" />
              </Link>
            )}
          </div>
          
          {/* لوگو */}
          <Link href="/" className="shrink-0">
            <Image 
              src="/images/Logo-removebg.webp" 
              alt="Aqua Blue" 
              width={50} 
              height={50} 
              className="object-contain" 
              priority 
            />
          </Link>
        </div>
      </header>

      {/* منوی کناری */}
      <NavDrawer 
        open={drawerOpen} 
        onClose={() => { 
          setDrawerOpen(false); 
          setFocusSearch(false); 
        }} 
        focusSearch={focusSearch} 
      />
    </>
  );
}