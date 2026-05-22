// components/product/ImageGallery.tsx

'use client';

import { useState } from 'react';
import Image from 'next/image';

type Props = {
  images: string[];
  cover: string;
  title: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3815/api';
const UPLOADS_URL = API_URL.replace('/api', '') + '/uploads';

export default function ImageGallery({ images, cover, title }: Props) {
  const [selected, setSelected] = useState(cover);
  // const allImages = [cover, ...images.filter(img => img !== cover)];
  const allImages = [cover, ...images];

  const getImageUrl = (src: string) => (src ? `${UPLOADS_URL}/${src}` : null);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-linear-to-br from-blue-50/30 to-cyan-50/30 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden">
        {getImageUrl(selected) ? (
          <Image
            src={getImageUrl(selected)!}
            alt={title}
            fill
            className="object-contain p-4"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
            🖼️ بدون تصویر
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelected(img)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                selected === img ? 'border-blue-500 shadow-md' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
              }`}
            >
              <Image
                src={getImageUrl(img)!}
                alt={`${title} - ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}