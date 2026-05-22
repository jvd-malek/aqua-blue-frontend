// components/home/ProductCard.tsx

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Timer, Eye } from 'lucide-react';
import type { ProductCover } from '@/types';
import AddToCartButton from './AddToCartButton';
import { LOGO } from '@/constants/home';

type ProductCardProps = {
  product: ProductCover;
  variant?: 'default' | 'compact' | 'featured';
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3815/api';
const UPLOADS_URL = API_URL.replace('/api', '') + '/uploads';

// ✅ تابع کمکی برای تبدیل تاریخ به عدد (میلی‌ثانیه)
function getExpireTime(expireAt: Date | string | null | undefined): number {
  if (!expireAt) return 0;
  const date = expireAt instanceof Date ? expireAt : new Date(expireAt);
  return isNaN(date.getTime()) ? 0 : date.getTime();
}

export default function ProductCard({ product, variant = 'default' }: ProductCardProps) {

  // ساخت آدرس کامل عکس
  const imageUrl = product.cover ? `${UPLOADS_URL}/${product.cover}` : LOGO.Logo;

  // ✅ اصلاح: تبدیل discountExpireAt به عدد برای مقایسه
  const expireTime = getExpireTime(product.discountExpireAt);
  const now = Date.now();

  // محاسبه وضعیت تخفیف
  const hasDiscount = product.discountPercent > 0 &&
    (!product.discountExpireAt || expireTime > now);

  // قیمت نهایی
  const finalPrice = hasDiscount
    ? Math.round(product.price * (100 - product.discountPercent) / 100)
    : product.price;

  // ✅ اصلاح: روزهای باقی مانده تا پایان تخفیف
  const remainingTime = expireTime > 0 ? Math.max(0, expireTime - now) : 0;
  const remainingDays = remainingTime > 0 ? Math.ceil(remainingTime / (1000 * 60 * 60 * 24)) : 0;

  // وضعیت محصول
  const isOutOfStock = product.showCount <= 0;
  const isComingSoon = product.state === 'comingSoon';
  const isCallForPrice = product.state === 'callForPrice';

  // variant compact (جمع و جور)
  if (variant === 'compact') {
    return (
      <div className="product-card group relative flex items-center gap-3 p-2 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300">
        <Link href={`/product/${product.id}`} className="shrink-0 w-16 h-16 rounded-lg bg-linear-to-br from-blue-50/50 to-cyan-50/50 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
          {product.cover ? (
            <Image
              src={imageUrl}
              alt={product.title}
              width={64}
              height={64}
              className="product-image object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Image src={LOGO.Logo} alt="logo" width={40} height={40} className="opacity-30" />
            </div>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <Link href={`/product/${product.id}`} className="product-title text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1 hover:text-blue-600 transition-colors">
            {product.title}
          </Link>
          <div className="flex items-center justify-between mt-1">
            <div className="flex flex-col">
              {hasDiscount && (
                <span className="old-price text-[10px] text-gray-400 line-through">
                  {product.price.toLocaleString('fa-IR')}
                </span>
              )}
              <span className={`final-price font-bold text-sm ${hasDiscount ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                {finalPrice.toLocaleString('fa-IR')}
                <span className="text-[9px] font-normal text-gray-500 mr-0.5">تومان</span>
              </span>
            </div>
            <AddToCartButton
              product={{
                id: product.id,
                title: product.title,
                price: product.price,
                finalPrice,
                discountPercent: product.discountPercent,
                showCount: product.showCount,
                cover: product.cover,
              }}
              variant="compact"
            />
          </div>
        </div>
      </div>
    );
  }

  // variant featured (برجسته)
  if (variant === 'featured') {
    return (
      <div className="product-card group relative flex flex-col md:flex-row gap-4 p-4 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300">
        <Link href={`/product/${product.id}`} className="relative shrink-0 w-full md:w-48 h-48 rounded-xl bg-linear-to-br from-blue-50/50 to-cyan-50/50 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
          {product.cover ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="product-image object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Image src={LOGO.Logo} alt="logo" width={80} height={80} className="opacity-30" />
            </div>
          )}
          {hasDiscount && (
            <div className="absolute top-2 right-2 discount-badge bg-linear-to-r from-red-500 to-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
              {product.discountPercent}%
            </div>
          )}
        </Link>

        <div className="flex-1 flex flex-col">
          <Link href={`/product/${product.id}`} className="product-title text-lg font-bold text-gray-800 dark:text-gray-200 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.title}
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-2">
            {product.desc?.slice(0, 100)}...
          </p>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex flex-col">
              {hasDiscount && (
                <span className="old-price text-sm text-gray-400 line-through">
                  {product.price.toLocaleString('fa-IR')} تومان
                </span>
              )}
              <span className={`final-price font-bold text-2xl ${hasDiscount ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                {finalPrice.toLocaleString('fa-IR')}
                <span className="text-sm font-normal text-gray-500 mr-0.5">تومان</span>
              </span>
            </div>
            <AddToCartButton
              product={{
                id: product.id,
                title: product.title,
                price: product.price,
                finalPrice,
                discountPercent: product.discountPercent,
                showCount: product.showCount,
                cover: product.cover,
              }}
              variant="full"
              className="px-6 py-2.5"
            />
          </div>
        </div>
      </div>
    );
  }

  // variant default (پیش‌فرض)
  return (
    <div className="product-card group relative flex flex-col max-w-60 min-w-40 mx-auto overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300">

      {/* لینک به صفحه محصول */}
      <Link href={`/product/${product.id}`} className="block relative group/aspect aspect-square bg-linear-to-br from-blue-50/50 to-cyan-50/50 dark:from-gray-800 dark:to-gray-900 overflow-hidden">

        {/* تصویر محصول */}
        {product.cover ? (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="product-image object-cover transition-all duration-500 group-hover/aspect:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image src={LOGO.Logo} alt="logo" width={80} height={80} className="opacity-30" />
          </div>
        )}

        {/* نشان تخفیف */}
        {hasDiscount && (
          <div className="absolute top-2 right-2 z-10">
            <div className="discount-badge bg-linear-to-r from-red-500 to-red-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg flex items-center gap-1">
              <Timer size={10} />
              {product.discountPercent}%
            </div>
            {remainingDays <= 7 && remainingDays > 0 && (
              <div className="text-[10px] text-red-500 dark:text-red-400 text-center mt-1 font-medium">
                {remainingDays} روز مانده
              </div>
            )}
          </div>
        )}

        {/* نشان‌های وضعیت */}
        {isComingSoon && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <span className="text-white text-sm font-bold px-3 py-1 bg-blue-600/80 rounded-full">
              به زودی
            </span>
          </div>
        )}

        {isOutOfStock && !isComingSoon && !isCallForPrice && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <span className="text-white text-sm font-bold px-3 py-1 bg-red-600/80 rounded-full">
              ناموجود
            </span>
          </div>
        )}

        {/* دکمه مشاهده سریع (روی هاور) */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <span className="bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
            <Eye size={14} />
            مشاهده محصول
          </span>
        </div>

        {/* هاله طلایی */}
        <div className="absolute inset-0 bg-linear-to-t from-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Link>

      {/* اطلاعات محصول */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <Link
          href={`/product/${product.id}`}
          className="product-title text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
        >
          {product.title}
        </Link>

        {/* قیمت و دکمه */}
        <div className="mt-auto pt-2 flex flex-col items-center justify-between gap-2 h-24">
          <div className="flex flex-col self-start h-10">
            {hasDiscount && (
              <span className="old-price text-xs text-gray-400 line-through">
                {product.price.toLocaleString('fa-IR')}
              </span>
            )}
            <span className={`final-price font-bold text-lg ${hasDiscount ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
              {finalPrice.toLocaleString('fa-IR')}
              <span className="text-[10px] font-normal text-gray-500 mr-0.5">تومان</span>
            </span>
          </div>

          <AddToCartButton
            product={{
              id: product.id,
              title: product.title,
              price: product.price,
              finalPrice,
              discountPercent: product.discountPercent,
              showCount: product.showCount,
              cover: product.cover,
            }}
            variant="full"
          />
        </div>
      </div>
    </div>
  );
}