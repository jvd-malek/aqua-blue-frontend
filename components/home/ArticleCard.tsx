// components/home/ArticleCard.tsx

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Eye } from 'lucide-react';
import type { ArticleCover } from '@/types/article';
import { formatPersianDate } from '@/utils/dateFormatter';

type Props = {
  article: ArticleCover;
};

const UPLOADS_URL = `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3815'}/uploads`;

export default function ArticleCard({ article }: Props) {
  const imageUrl = article.cover ? `${UPLOADS_URL}/${article.cover}` : null;

  return (
    <Link href={`/article/${article.id}`} className="group block">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300">
        
        {/* تصویر */}
        <div className="relative h-48 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              loading='lazy'
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
              <span className="text-4xl">📄</span>
            </div>
          )}
          
          {/* دسته‌بندی */}
          <div className="absolute top-3 right-3 px-2 py-1 bg-gold/90 backdrop-blur-sm rounded-lg text-xs font-bold text-white">
            {article.minorCat || article.majorCat}
          </div>
        </div>

        {/* محتوا */}
        <div className="p-4">
          <h3 className="font-bold text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {article.title}
          </h3>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-2">
            {article.desc}
          </p>
          
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200/50 dark:border-gray-700/50 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{formatPersianDate(article.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={12} />
              <span>{article.views?.toLocaleString('fa-IR') || 0} بازدید</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}