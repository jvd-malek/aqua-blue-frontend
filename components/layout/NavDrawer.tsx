'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User as UserIcon, LogIn, Home, Bell, ChevronLeft, Moon, Sun, ChevronDown } from 'lucide-react';
import { useApp } from '@/app/providers';
import { useCartStore } from '@/stores/CartStore';
import { useGet } from '@/lib/client-swr';
import useSWR from 'swr';
import type { LinkItem, LinksResponse } from '@/types/link';
import SearchBar from './SearchBar';

type Props = {
  open: boolean;
  onClose: () => void;
  focusSearch?: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3815/api';

// لینک‌های ثابت
const accountLinks = [
  { label: 'سفارشات', href: '/account/orders', badge: '' },
  { label: 'پروفایل', href: '/account/profile', badge: '' },
  { label: 'نظرات', href: '/account/comments', badge: '' },
  { label: 'اعلان‌ها', href: '/account/alerts', badge: 'alerts' },
];

const cmsLinks = [
  { label: 'محصولات', href: '/cms/products', badge: '' },
  { label: 'ثبت محصول', href: '/cms/add-product', badge: '' },
  { label: 'مقالات', href: '/cms/articles', badge: '' },
  { label: 'تیکت‌ها', href: '/cms/tickets', badge: 'tickets' },
  { label: 'سفارشات', href: '/cms/orders', badge: 'orders' },
  { label: 'کامنت‌ها', href: '/cms/comments', badge: 'comments' },
  { label: 'کاربران', href: '/cms/users', badge: '' },
  { label: 'تخفیف‌ها', href: '/cms/discounts', badge: '' },
  { label: 'آمار', href: '/cms/analytics', badge: '' },
  { label: 'سفارش آزاد', href: '/cms/free-order', badge: '' },
];

// کامپوننت آیتم آکاردئون
function AccordionItem({
  link,
  subLinks,
  onClose,
  isActive
}: {
  link: { label: string; href: string };
  subLinks: LinkItem[];
  onClose: () => void;
  isActive: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubLinks = subLinks.length > 0;

  return (
    <div>
      {/* آیتم اصلی با دکمه آکاردئون */}
      <div className="flex items-center">
        <Link
          href={link.href}
          onClick={onClose}
          className={`flex-1 flex justify-between items-center px-4 py-2.5 rounded-xl transition-colors ${isActive
            ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-md'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        >
          <span>{link.label}</span>
        </Link>

        {hasSubLinks && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`mr-1 p-2 rounded-lg transition-colors ${isActive ? 'text-white hover:bg-blue-500' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* زیردسته‌ها */}
      {hasSubLinks && isOpen && (
        <div className="mr-4 mt-1 space-y-1 border-r-2 border-blue-200 dark:border-blue-800 pr-2">
          {/* دکمه "همه" برای مشاهده همه محصولات این دسته */}
          <Link
            href={link.href}
            onClick={onClose}
            className="block px-4 py-2 rounded-lg text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 font-medium transition-colors"
          >
            ✨ نمایش همه
          </Link>

          {/* زیردسته‌ها */}
          {subLinks.map((sub) => (
            <Link
              key={sub.id}
              href={sub.path}
              onClick={onClose}
              className="block px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {sub.txt}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NavDrawer({ open, onClose, focusSearch }: Props) {
  const pathname = usePathname();
  const [dark, setDark] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  const { user, unreadCount } = useApp();
  const { totalItems } = useCartStore();

  const isAdminOrOwner = user?.status.includes("owner") || user?.status.includes("admin");
  const isAccountOrCms = pathname.startsWith('/account') || isAdminOrOwner;

  // دریافت لینک‌های داینامیک از بک‌اند (فقط برای کاربر عادی)
const { data: linksData, isLoading: linksLoading } = useGet<LinksResponse>(
  !user || (user?.status !== "owner" && user?.status !== "admin") ? '/links' : null
);

  const allLinks = linksData?.items || [];

  // ساخت درخت لینک‌ها
  const buildLinkTree = useCallback(() => {
    if (allLinks.length === 0) return [];

    const mainLinks = allLinks.filter(link => link.sort?.[0] === 0);

    return mainLinks.map(main => ({
      id: main.id,
      label: main.txt,
      href: main.path,
      subLinks: main.subLinks
        ?.map(subId => allLinks.find(l => l.id === subId))
        .filter(Boolean) as LinkItem[] || [],
    }));
  }, [allLinks]);

  const menuItems = buildLinkTree();

  // لینک‌های ثابت برای حالت ادمین/اکانت
  let links: { label: string; href: string; badge: string }[] = [];

  if (isAdminOrOwner) {
    links = cmsLinks;
  } else if (isAccountOrCms) {
    links = accountLinks;
  }

  // بیج‌های ادمین
  const { data: ordersData } = useSWR(
    isAdminOrOwner ? `${API_URL}/orders/all?status=${encodeURIComponent('پرداخت نشده')}&limit=1` : null,
    (u: string) => fetch(u, { credentials: 'include' }).then(r => r.json()),
    { dedupingInterval: 30000 }
  );

  const { data: ticketsData } = useSWR(
    isAdminOrOwner ? `${API_URL}/tickets/all?status=${encodeURIComponent('در انتظار بررسی')}&limit=1` : null,
    (u: string) => fetch(u, { credentials: 'include' }).then(r => r.json()),
    { dedupingInterval: 30000 }
  );

  const { data: commentsData } = useSWR(
    isAdminOrOwner ? `${API_URL}/admin/comments?status=${encodeURIComponent('در انتظار تایید')}&limit=1` : null,
    (u: string) => fetch(u, { credentials: 'include' }).then(r => r.json()),
    { dedupingInterval: 30000, revalidateOnFocus: true }
  );

  const pendingComments = commentsData?.pagination?.total || 0;
  const pendingTickets = ticketsData?.total || 0;
  const pendingOrders = ordersData?.pagination?.total || 0;

  const toggleDark = () => {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    setDark(next);
  };

  const getBadge = (link: typeof links[0]) => {
    if (link.badge === 'orders' && pendingOrders > 0) return pendingOrders;
    if (link.badge === 'tickets' && pendingTickets > 0) return pendingTickets;
    if (link.badge === 'comments' && pendingComments > 0) return pendingComments;
    if (link.badge === 'alerts' && unreadCount > 0) return unreadCount;
    return 0;
  };

  const isPathActive = (path: string) => {
    return pathname === path.split('?')[0];
  };

  return (
    <>
      {/* اوورلی */}
      {open && <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />}

      {/* منوی کناری */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${open ? 'translate-x-0' : '-translate-x-full'}`}
        dir="rtl"
        role="menu"
      >
        {/* هدر منو - اطلاعات کاربر + آیکون زنگ */}
        <div className="shrink-0 px-5 pt-5 pb-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {user ? (
              <div className="min-w-0">
                <p className="font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400" dir="ltr">{user.phone}</p>
              </div>
            ) : (
              <p className="font-bold text-lg text-blue-600">Aqua Blue</p>
            )}

            {/* آیکون اعلان‌ها */}
            <Link
              href="/account/alerts"
              onClick={onClose}
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Bell size={22} className="text-gray-600 dark:text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-linear-to-r from-red-500 to-red-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 shadow-md">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* بخش اسکرول‌شونده */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* آیکون‌های سریع */}
          <div className="flex justify-center gap-2">
            {[
              { href: '/', icon: Home, badge: 0 },
              { href: '/cart', icon: ShoppingCart, badge: totalItems },
              { href: user ? '/account' : '/login', icon: user ? UserIcon : LogIn, badge: 0 },
            ].map(({ href, icon: Icon, badge }) => (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Icon size={18} className="text-gray-700 dark:text-gray-300" />
                {badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-linear-to-r from-amber-500 to-amber-600 text-white text-[9px] font-bold min-w-[16px] h-[16px] flex items-center justify-center rounded-full">
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </Link>
            ))}
            <button
              onClick={toggleDark}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {dark ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-gray-700 dark:text-gray-300" />}
            </button>
          </div>

          {/* جستجو */}
          <SearchBar focusSearch={focusSearch} />

          {/* لینک‌های ناوبری */}
          <div className="space-y-1.5">
            <p className="text-xs text-gray-400 font-medium pr-1">
              {isAdminOrOwner ? 'مدیریت' : isAccountOrCms ? 'حساب کاربری' : 'دسته‌بندی‌ها'}
            </p>

            {linksLoading && !isAdminOrOwner && !isAccountOrCms ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-11 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : isAdminOrOwner || isAccountOrCms ? (
              links.map((link) => {
                const badge = getBadge(link);
                const isActive = isPathActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className={`flex justify-between items-center px-4 py-2.5 rounded-xl transition-colors ${isActive
                      ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                  >
                    {link.label}
                    <span className="flex items-center gap-1.5">
                      {badge > 0 && (
                        <span className="bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 font-bold">
                          {badge > 99 ? '99+' : badge}
                        </span>
                      )}
                      <ChevronLeft size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
                    </span>
                  </Link>
                );
              })
            ) : (
              // نمایش دسته‌بندی‌ها با آکاردئون
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <AccordionItem
                    key={item.id}
                    link={{ label: item.label, href: item.href }}
                    subLinks={item.subLinks}
                    onClose={onClose}
                    isActive={isPathActive(item.href)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}