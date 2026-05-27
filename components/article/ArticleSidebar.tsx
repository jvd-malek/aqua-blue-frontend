// components/article/ArticleSidebar.tsx

'use client';

import ContentList from './ContentList';
import ShareURL from '@/components/product/ShareURL';
import RelatedLinks from './RelatedLinks';
import type { Article } from '@/types/article';

type Props = { article: Article };

export default function ArticleSidebar({ article }: Props) {
  const hasSubtitles = article.subtitles && article.subtitles.length > 0;

  return (
    <aside className="hidden lg:block lg:col-span-4 xl:col-span-3">

        {/* بقیه سایدبار استیکی نیستن */}
        <div className="space-y-6">
          <ShareURL title={article.title} />
          <RelatedLinks article={article} />
        </div>

        <div className="sticky top-24 mt-6">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-5">
            <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">فهرست مطالب</h3>
            <ContentList subtitles={article.subtitles} />
          </div>
        </div>

    </aside>
  );
}