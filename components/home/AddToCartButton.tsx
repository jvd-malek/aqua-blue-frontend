// components/home/AddToCartButton.tsx

'use client';

import { useState, useCallback } from 'react';
import { ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { notify } from '@/utils/notify';

type AddToCartButtonProps = {
  product: {
    id: string;
    title: string;
    price: number;
    finalPrice: number;
    discountPercent: number;
    showCount: number;
    cover: string;
  };
  variant?: 'icon' | 'full' | 'compact';
  className?: string;
};

export default function AddToCartButton({
  product,
  variant = 'full',
  className = '',
}: AddToCartButtonProps) {
  const { addToCart, getItemCount, updateProductCount, removeFromCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const currentCount = getItemCount(product.id);
  const isOutOfStock = product.showCount <= 0;

  const handleAdd = useCallback(async () => {
    if (isOutOfStock) {
      notify('این محصول موجود نیست', 'error');
      return;
    }

    setIsLoading(true);
    await addToCart({
      productId: product.id,
      title: product.title,
      price: product.price,
      finalPrice: product.finalPrice,
      discountPercent: product.discountPercent,
      showCount: product.showCount,
      cover: product.cover,
    });
    setIsLoading(false);
  }, [addToCart, isOutOfStock, product]);

  const handleIncrement = useCallback(async () => {
    if (currentCount >= product.showCount) {
      notify('تعداد بیشتر از موجودی است', 'error');
      return;
    }
    await updateProductCount(product.id, currentCount + 1);
  }, [currentCount, product.showCount, updateProductCount, product.id]);

  const handleDecrement = useCallback(async () => {
    if (currentCount === 1) {
      await updateProductCount(product.id, 0);
    } else {
      await updateProductCount(product.id, currentCount - 1);
    }
  }, [currentCount, removeFromCart, updateProductCount, product.id]);

  // حالت آیکون فقط
  if (variant === 'icon') {
    return (
      <button
        onClick={handleAdd}
        disabled={isLoading || isOutOfStock}
        className={`p-2 rounded-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        aria-label="افزودن به سبد خرید"
      >
        <ShoppingBag size={18} />
      </button>
    );
  }

  // حالت جمع و جور (compact)
  if (variant === 'compact') {
    if (currentCount > 0) {
      return (
        <div className={`flex items-center gap-1 bg-linear-to-r from-amber-500 to-amber-600 rounded-xl ${className}`}>
          <button
            onClick={handleDecrement}
            className="w-7 h-7 flex items-center justify-center text-white hover:bg-white/20 rounded-r-xl transition-colors"
            aria-label="کاهش تعداد"
          >
            {currentCount === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
          </button>
          <span className="text-white font-bold text-sm min-w-7 text-center">
            {currentCount}
          </span>
          <button
            onClick={handleIncrement}
            disabled={currentCount >= product.showCount}
            className="w-7 h-7 flex items-center justify-center text-white hover:bg-white/20 rounded-l-xl transition-colors disabled:opacity-50"
            aria-label="افزایش تعداد"
          >
            <Plus size={14} />
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={handleAdd}
        disabled={isLoading || isOutOfStock}
        className={`flex items-center justify-center gap-1.5 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        <ShoppingBag size={14} />
        <span>{isLoading ? '...' : 'افزودن'}</span>
      </button>
    );
  }

  // حالت کامل (full) - پیش‌فرض
  if (currentCount > 0) {
    return (
      <div className={`flex items-center justify-between gap-2 px-1 py-0.5 bg-linear-to-r from-amber-500 to-amber-600 rounded-xl ${className}`}>
        <button
          onClick={handleDecrement}
          className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-r-xl transition-colors"
          aria-label="کاهش تعداد"
        >
          {currentCount === 1 ? <Trash2 size={16} /> : <Minus size={16} />}
        </button>
        <span className="text-white font-bold text-sm min-w-8 text-center">
          {currentCount}
        </span>
        <button
          onClick={handleIncrement}
          disabled={currentCount >= product.showCount}
          className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-l-xl transition-colors disabled:opacity-50"
          aria-label="افزایش تعداد"
        >
          <Plus size={16} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleAdd}
      disabled={isLoading || isOutOfStock}
      className={`golden-add-btn flex items-center justify-center gap-2 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <ShoppingBag size={16} />
      <span>{isLoading ? '...' : 'افزودن'}</span>
      {!isOutOfStock && !isLoading && (
        <span className="text-[10px] opacity-80">({product.showCount} عدد)</span>
      )}
    </button>
  );
}