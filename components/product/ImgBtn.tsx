// components/product/ImgBtn.tsx

'use client';

import { useState, useEffect } from 'react';
import { Heart, Bell, Share2, MessageSquare } from 'lucide-react';
import { notify } from '@/utils/notify';
import { useFavorites } from '@/hooks/useFavorites';

type Props = {
  productId: string;
  isLoggedIn?: boolean;
  isFav?: boolean;
};

export default function ImgBtn({ productId, isLoggedIn = false, isFav = false }: Props) {
  const { isFavorite, toggleFavorite, isLoading } = useFavorites(productId);
  const [notifActive, setNotifActive] = useState(false);

  useEffect(() => {
    // می‌تونیم از API ببینیم کاربر اعلان داره یا نه
  }, []);

  const toggleFav = async () => {
    if (!isLoggedIn) {
      notify('لطفا ابتدا وارد شوید', 'error');
      return;
    }
    await toggleFavorite();
  };

  const toggleNotif = () => {
    if (!isLoggedIn) {
      notify('لطفا ابتدا وارد شوید', 'error');
      return;
    }
    setNotifActive(!notifActive);
    notify(notifActive ? 'اعلان غیرفعال شد' : 'اعلان فعال شد', 'success');
  };

  const share = () => {
    navigator.clipboard.writeText(window.location.href);
    notify('لینک کپی شد', 'success');
  };

  const scrollToComments = () => {
    document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' });
  };

  const btnClass = "flex items-center justify-center w-9 h-9 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md hover:bg-white dark:hover:bg-gray-700 transition-all hover:scale-110";

  return (
    <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
      <button onClick={toggleFav} disabled={isLoading} className={btnClass} aria-label="علاقه‌مندی">
        <Heart size={16} className={isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600 dark:text-gray-400'} />
      </button>
      <button onClick={toggleNotif} className={btnClass} aria-label="اعلان">
        <Bell size={16} className={notifActive ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'} />
      </button>
      <button onClick={share} className={btnClass} aria-label="اشتراک">
        <Share2 size={16} className="text-gray-600 dark:text-gray-400" />
      </button>
      <button onClick={scrollToComments} className={btnClass} aria-label="دیدگاه">
        <MessageSquare size={16} className="text-gray-600 dark:text-gray-400" />
      </button>
    </div>
  );
}