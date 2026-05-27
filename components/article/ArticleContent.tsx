// components/article/ArticleContent.tsx

'use client';

import Image from 'next/image';
import { Calendar, User, Eye } from 'lucide-react';
import { formatPersianDate } from '@/utils/dateFormatter';
import ContentWithLinks from '@/components/link/ContentWithLinks';
import type { Article } from '@/types/article';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3815/api';
const UPLOADS_URL = API_URL.replace('/api', '') + '/uploads';

type Props = { 
  article: Article;
  mobileContentList?: React.ReactNode;  // اضافه شد
};

export default function ArticleContent({ article, mobileContentList }: Props) {
  const coverUrl = article.cover ? `${UPLOADS_URL}/${article.cover}` : null;

  return (
    <article className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8">
      {/* عنوان */}
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {article.title}
      </h1>

      {/* اطلاعات نویسنده */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
        <div className="flex items-center gap-1.5">
          <User size={14} />
          <span>{article.authorName}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={14} />
          <span>{formatPersianDate(article.createdAt)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Eye size={14} />
          <span>{article.views.toLocaleString('fa-IR')} بازدید</span>
        </div>
      </div>

      {/* تصویر شاخص */}
      {coverUrl && (
        <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8 bg-gray-100 dark:bg-gray-800">
          <Image src={coverUrl} alt={article.title} fill className="object-cover" priority />
        </div>
      )}

      {/* چکیده */}
      <div className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8 border-r-4 border-blue-500 pr-4 italic">
        <ContentWithLinks content={article.desc} />
      </div>

      {/* فهرست مطالب موبایل (اینجا قرار میگیره) */}
      {mobileContentList}

      {/* محتوای اصلی */}
      <div className="space-y-8 lg:mt-0 mt-6">
        {article.content.map((paragraph, idx) => {
          const subtitle = article.subtitles?.[idx];
          const sectionImage = article.images?.[idx]?.url;
          const imageUrl = sectionImage ? `${UPLOADS_URL}/${sectionImage}` : null;

          return (
            <section key={idx} id={`section-${idx}`} className="scroll-mt-24">
              {subtitle && (
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  {subtitle}
                </h2>
              )}
              {imageUrl && (
                <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden my-6">
                  <Image
                    src={imageUrl}
                    alt={subtitle || `تصویر بخش ${idx + 1}`}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-8">
                <ContentWithLinks content={paragraph} />
              </div>
            </section>
          );
        })}
      </div>
    </article>
  );
}