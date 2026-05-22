// components/product/ShareURL.tsx

'use client';

import Image from 'next/image';
import { Share2, Link2, Send } from 'lucide-react';
import { notify } from '@/utils/notify';

import bale from '@/public/images/logo-Bale.webp';
import eitaa from '@/public/images/logo-Eitaa.webp';

type Props = { title: string };

export default function ShareURL({ title }: Props) {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const text = `Aqua Blue | ${title}`;

  const copyLink = () => {
    navigator.clipboard.writeText(`${url}\n${text}`);
    notify('لینک با موفقیت کپی شد', 'success');
  };

  const shareLinks = [
    {
      title: 'اشتراک گذاری در ایتا',
      href: `https://eitaa.com/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      icon: <Image src={eitaa} className="object-contain" alt="لوگو ایتا" width={20} height={20} />,
    },
    {
      title: 'اشتراک گذاری در بله',
      href: `https://ble.ir/share?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      icon: <Image src={bale} className="object-contain" alt="لوگو بله" width={20} height={20} />,
    },
    {
      title: 'اشتراک گذاری در تلگرام',
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      icon: <Send size={20} className="text-blue-500" />,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 w-full flex justify-between items-center flex-wrap gap-4 border border-gray-200/50 dark:border-gray-700/50">
      
      <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
        <Share2 size={18} />
        <span>اشتراک‌گذاری</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* کپی لینک */}
        <button
          onClick={copyLink}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Link2 size={16} />
          <span className="text-xs">کپی لینک</span>
        </button>

        {/* بله، ایتا، تلگرام */}
        {shareLinks.map((item) => (
          <a
            key={item.title}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={item.title}
          >
            {item.icon}
          </a>
        ))}
      </div>
    </div>
  );
}