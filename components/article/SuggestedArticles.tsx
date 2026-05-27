// components/article/SuggestedArticles.tsx

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Eye } from 'lucide-react';
import { serverFetch } from '@/lib/server-fetch';
import { formatPersianDate } from '@/utils/dateFormatter';
import type { ArticleCover } from '@/types/article';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3815/api';
const UPLOADS_URL = API_URL.replace('/api', '') + '/uploads';

type Props = {
    currentId: string;
    majorCat?: string;
    limit?: number;
};

export default async function SuggestedArticles({ currentId, majorCat, limit = 4 }: Props) {
    const params = new URLSearchParams({
        limit: String(limit + 1),
        sortBy: 'popular',
    });
    if (majorCat) params.set('majorCat', majorCat);

    const res = await serverFetch<{ items: ArticleCover[] }>(`/articles?${params.toString()}`);
    if (!res.success) return null;

    const articles = res.data?.items?.filter((a) => a.id !== currentId).slice(0, limit) || [];
    if (articles.length === 0) return null;

    return (
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-5">
            <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">مقالات مرتبط</h3>
            <div className="space-y-3">
                {articles.map((article) => {
                    return (
                        <Link key={article.id} href={`/article/${article.id}`} className="group block p-4 rounded-xl bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:scale-103">
                            <div className="flex md:flex-row flex-col justify-between items-center">
                                <h4 className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {article.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                                    <div className="flex items-center gap-0.5">
                                        <Calendar size={10} />
                                        <span>{formatPersianDate(article.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-0.5">
                                        <Eye size={10} />
                                        <span>{article.views?.toLocaleString('fa-IR') || 0}</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{article.desc}</p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}