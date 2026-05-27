// components/cart/CartProducts.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import AddToCartButton from '@/components/home/AddToCartButton';
import { useCart } from '@/hooks/useCart';

type Props = {
  items: any[];
  totalPrice: number;
  isLoggedIn: boolean;
  onNext: () => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3815/api';
const UPLOADS_URL = API_URL.replace('/api', '') + '/uploads';

export default function CartProducts({ items, totalPrice, onNext }: Props) {
  const { removeFromCart } = useCart();

  // حذف محصول - چون AddToCartButton خودش حذف رو داره، این تابع شاید دیگه لازم نباشه
  // ولی برای ایمنی نگهش میدارم
  const handleRemove = async (productId: string) => {
    await removeFromCart(productId);
  };

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-4">
      
      {/* لیست محصولات - گرید ریسپانسیو */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => {
          const imageUrl = item.cover ? `${UPLOADS_URL}/${item.cover}` : null;
          const itemTotal = item.finalPrice * item.count;

          return (
            <div key={item.cartId} className="bg-gray-50 dark:bg-gray-800/30 rounded-xl p-3">
              
              {/* ردیف بالا: تصویر + اطلاعات اصلی */}
              <div className="flex gap-3">
                {/* تصویر */}
                <Link href={`/product/${item.productId}`} className="shrink-0 w-20 h-20 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  {imageUrl ? (
                    <Image src={imageUrl} alt={item.title} width={80} height={80} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🐟</div>
                  )}
                </Link>

                {/* اطلاعات اصلی */}
                <div className="flex-1">
                  <Link href={`/product/${item.productId}`} className="font-medium text-gray-800 dark:text-gray-200 hover:text-blue-600 line-clamp-2">
                    {item.title}
                  </Link>
                  
                  {/* قیمت */}
                  <div className="mt-1">
                    {item.discountPercent > 0 && (
                      <span className="text-xs text-gray-400 line-through ml-1">
                        {item.price.toLocaleString('fa-IR')}
                      </span>
                    )}
                    <div>
                      <span className="font-bold text-blue-600 text-lg">
                        {item.finalPrice.toLocaleString('fa-IR')}
                      </span>
                      <span className="text-xs text-gray-500 mr-1">تومان</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ردیف پایین: تعداد + قیمت کل */}
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">تعداد:</span>
                  <AddToCartButton
                    product={{
                      id: item.productId,
                      title: item.title,
                      price: item.price,
                      finalPrice: item.finalPrice,
                      discountPercent: item.discountPercent,
                      showCount: item.showCount,
                      cover: item.cover,
                    }}
                    variant="compact"
                  />
                </div>
                
                <div className="text-left">
                  <p className="text-xs text-gray-500">قیمت کل:</p>
                  <p className="font-bold text-gray-800 dark:text-gray-200">
                    {itemTotal.toLocaleString('fa-IR')}
                    <span className="text-xs text-gray-500 mr-1">تومان</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* جمع کل و دکمه ادامه */}
      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-sm text-gray-500">جمع کل سبد خرید</p>
          <p className="text-2xl font-bold text-blue-600">{totalPrice.toLocaleString('fa-IR')} تومان</p>
        </div>
        
        <button
          onClick={onNext}
          className="bg-linear-to-r btn-primary from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
        >
          ادامه و تکمیل اطلاعات
        </button>
      </div>
    </div>
  );
}

// کامپوننت سبد خرید خالی
function EmptyCart() {
  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 md:p-12 text-center">
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <ShoppingBag size={40} className="text-gray-400" />
      </div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">سبد خرید شما خالی است!</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">برای خرید به فروشگاه مراجعه کنید.</p>
      <Link
        href="/category/ماهی"
        className="inline-block btn-primary bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
      >
        مشاهده محصولات
      </Link>
    </div>
  );
}