// components/product/InfoTable.tsx

'use client';

import { useState } from 'react';
import { ChevronDown, Info, Tag, Package, BarChart3, Phone, ShoppingCart, MessageCircleMore, ShoppingBagIcon } from 'lucide-react';
import ProductFeatures from './ProductFeatures';
import type { Product } from '@/types';
import { formatPersianDate, getDaysLeft } from '@/utils';

type Props = {
  product: Product;
  hasDiscount: boolean;
  finalPrice: number;
};

function AccordionItem({ title, icon, defaultOpen, children }: { title: string; icon: React.ReactNode; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full p-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-right"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-gray-800 dark:text-gray-200">{title}</span>
        </div>
        <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="p-4 border-t border-gray-200 dark:border-gray-700">{children}</div>}
    </div>
  );
}

export default function InfoTable({ product, finalPrice, hasDiscount }: Props) {
  const stockClass = product.showCount > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';

  const daysLeft = hasDiscount && product?.discountExpireAt
    ? getDaysLeft(product?.discountExpireAt)
    : null;

  const formattedDate = (hasDiscount && product?.discountExpireAt) ? formatPersianDate(product?.discountExpireAt) : null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">اطلاعات محصول</h3>
      <div className="space-y-3">

        {/* Basic Info */}
        <AccordionItem title="اطلاعات پایه" icon={<Info size={18} className="text-blue-500" />} defaultOpen>
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 dark:text-white">{product.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-7">{product.desc}</p>
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <span className="text-blue-600">{product.majorCat}</span>
              {product.minorCat && <><span className="text-gray-400">/</span><span className="text-blue-600">{product.minorCat}</span></>}
              {product.brand && <><span className="text-gray-400">/</span><span className="text-blue-600">{product.brand}</span></>}
            </div>
          </div>
        </AccordionItem>

        {/* Price & Stock */}
        <AccordionItem title="قیمت و موجودی" icon={<Tag size={18} className="text-red-500" />} defaultOpen>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">قیمت اصلی:</span>
              <span className="font-medium">{product.price.toLocaleString('fa-IR')} تومان</span>
            </div>
            {hasDiscount && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">تخفیف:</span>
                  <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">{product.discountPercent}%</span>
                </div>
                {product.discountExpireAt && (
                  <div className="bg-red-50 flex justify-between gap-6 items-center dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2 text-xs text-red-700 dark:text-red-300">
                    <p>⏰ مهلت تخفیف تا {formattedDate}</p>
                    <p>{daysLeft} روز مانده</p>
                  </div>
                )}
                <div className="flex justify-between text-sm border-t border-gray-200 dark:border-gray-700 pt-2">
                  <span className="font-bold text-gray-800 dark:text-gray-200">قیمت نهایی:</span>
                  <span className="text-red-600 font-bold">{finalPrice.toLocaleString('fa-IR')} تومان</span>
                </div>
              </>
            )}
            <div className="flex items-center gap-2 pt-2">
              <Package size={16} className={product.showCount > 0 ? 'text-green-500' : 'text-red-500'} />
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stockClass}`}>
                {product.showCount > 0 ? `موجود (${product.showCount.toLocaleString('fa-IR')} عدد)` : 'ناموجود'}
              </span>
            </div>

            {/* اگر موجودی دارد */}
            <>
              <div className={product.showCount > 0 ? "bg-blue-50 border border-blue-200 rounded-lg p-3 dark:bg-slate-800 dark:border-slate-700" : "bg-red-50 border border-red-200 rounded-lg p-3 dark:bg-slate-800 dark:border-slate-700"}>
                {product.showCount > 0 ?
                  <p className="text-blue-800 text-xs leading-6 dark:text-white">
                    به دلیل محدودیت‌ها تعداد قابل خرید از سایت
                    <span className="font-bold mx-1">{product.showCount}</span>
                    عدد می‌باشد. اگر بیشتر نیاز دارین با ما هماهنگ کنین:
                  </p> :
                  <p className="text-red-800 text-sm leading-6 dark:text-white">
                    متاسفانه این محصول در حال حاضر موجود نیست. برای اطلاع از موجودی و ثبت سفارش با ما در ارتباط باشید:
                  </p>
                }

                <div className="flex items-center gap-3 mt-3">
                  {/* دکمه بله */}
                  <a
                    href="https://ble.ir/aquabluesupport"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                  >
                    <MessageCircleMore size={18} />
                    پشتیبانی بله
                  </a>

                  {/* دکمه تماس */}
                  <a
                    href="tel:09193919019"
                    className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                  >
                    <Phone size={18} />
                    تماس با ما
                  </a>
                </div>
              </div>
            </>
            {/* محبوبیت */}
            <div className="flex items-center gap-2">
              <p className="text-gray-600 text-sm">میزان فروش:</p>
              <ShoppingBagIcon
                size={18}
              />
              <p className="text-gray-500 text-xs">
                ({product.totalSell})
              </p>
            </div>
          </div>
        </AccordionItem>

        {/* Features */}
        <AccordionItem title="ویژگی‌ها" icon={<BarChart3 size={18} className="text-purple-500" />}>
          <ProductFeatures
            features={product.features || []}
            size={product.size}
            weight={product.weight}
            brand={product.brand}
            condition={product.condition}
            price={product.price}
            finalPrice={hasDiscount ? finalPrice : undefined}
            discountPercent={hasDiscount ? product.discountPercent : undefined}
            discountAmount={hasDiscount ? product.price * product.discountPercent / 100 : undefined}
            discountExpireAt={formattedDate ? formattedDate : undefined}
            title={product.title}
            desc={product.desc}
          />
        </AccordionItem>
      </div>


    </div>
  );
}