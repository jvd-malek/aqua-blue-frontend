// hooks/useFavorites.ts

'use client';

import { useState, useEffect } from 'react';
import { useMutation, useGet } from '@/lib/client-swr';
import { notify } from '@/utils/notify';

export function useFavorites(productId: string) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  // دریافت وضعیت اولیه
  const { data: favoritesData, mutate } = useGet<{ items: any[] }>('/user/favorites');
  
  const { post: addFavorite } = useMutation('/user/favorites');
  const { del: removeFavorite } = useMutation(`/user/favorites/${productId}`);

  useEffect(() => {
    if (favoritesData?.items) {
      setIsFavorite(favoritesData.items.some(item => item.productId === productId));
    }
  }, [favoritesData, productId]);

  const toggleFavorite = async () => {
    if (isFavorite) {
      const result = await removeFavorite();
      if (result?.success) {
        setIsFavorite(false);
        notify('از علاقه‌مندی‌ها حذف شد', 'success');
        mutate();
      }
    } else {
      const result = await addFavorite({ productId });
      if (result?.success) {
        setIsFavorite(true);
        notify('به علاقه‌مندی‌ها اضافه شد', 'success');
        mutate();
      }
    }
  };

  return { isFavorite, toggleFavorite, isLoading: false };
}