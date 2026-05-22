// hooks/useInitCart.ts

'use client';

import { useEffect, useRef } from 'react';
import { useCartStore } from '@/stores/CartStore';

type UseInitCartProps = {
  isLoggedIn: boolean | null;
  isLoading: boolean;
};

export const useInitCart = ({ isLoggedIn, isLoading }: UseInitCartProps) => {
  const { fetchCart, syncLocalCartWithServer, items } = useCartStore();
  const hasSynced = useRef(false);
  const hasFetched = useRef(false);

  // اگر کاربر لاگین است، سبد خرید را از سرور دریافت کن
  useEffect(() => {
    if (!isLoading && isLoggedIn && !hasSynced.current) {
      const initCart = async () => {
        // همگام‌سازی سبد خرید محلی با سرور
        await syncLocalCartWithServer();
        // دریافت سبد خرید از سرور
        if (!hasFetched.current) {
          await fetchCart();
          hasFetched.current = true;
        }
        hasSynced.current = true;
      };
      initCart();
    }
  }, [isLoggedIn, isLoading, fetchCart, syncLocalCartWithServer]);

  // اگر کاربر لاگین نیست، فقط از localStorage استفاده کن
  useEffect(() => {
    if (!isLoading && isLoggedIn === false && !hasSynced.current) {
      hasSynced.current = true;
    }
  }, [isLoggedIn, isLoading]);

  return {
    isReady: !isLoading,
    hasItems: items.length > 0,
    itemCount: items.length,
  };
};