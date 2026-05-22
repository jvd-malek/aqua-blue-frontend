// components/product/BuyBtn.tsx (نسخه ساده)

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { notify } from '@/utils/notify';

type Props = {
  productId: string;
  title: string;
  price: number;
  finalPrice: number;
  discountPercent: number;
  showCount: number;
  cover: string;
  state: string;
};

export default function BuyBtn({ 
  productId, 
  title,
  price,
  finalPrice,
  discountPercent,
  showCount, 
  cover,
  state 
}: Props) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (showCount <= 0) {
      notify('این محصول در حال حاضر موجود نیست', 'error');
      return;
    }
    if (state === 'callForPrice') {
      notify('برای استعلام قیمت تماس بگیرید', 'success');
      return;
    }

    setLoading(true);
    await addToCart({
      productId,
      title,
      price,
      finalPrice,
      discountPercent,
      showCount,
      cover,
    });
    setLoading(false);
  };

  if (state === 'callForPrice') {
    return (
      <a
        href="#footer"
        className="block w-full text-center bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-bold mt-4 transition-all duration-300 hover:scale-[1.02]"
      >
        تماس با ما
      </a>
    );
  }

  if (showCount <= 0) {
    return (
      <button
        disabled
        className="w-full text-center bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 py-3 rounded-xl font-bold mt-4 cursor-not-allowed"
      >
        ناموجود
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      className="flex btn-primary items-center justify-center gap-2 w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-bold mt-4 transition-all duration-300 hover:scale-[1.02] disabled:opacity-70"
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : <ShoppingCart size={18} />}
      {loading ? 'در حال افزودن...' : `افزودن به سبد خرید (${finalPrice.toLocaleString('fa-IR')} تومان)`}
    </button>
  );
}