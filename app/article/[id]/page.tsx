// app/article/[id]/page.tsx

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/product/Breadcrumb';
import ArticleContent from '@/components/article/ArticleContent';
import ContentList from '@/components/article/ContentList';
import ShareURL from '@/components/product/ShareURL';
import RelatedLinks from '@/components/article/RelatedLinks';
import SuggestedArticles from '@/components/article/SuggestedArticles';
import SuggestedProducts from '@/components/product/SuggestedProducts';
import CommentComplex from '@/components/product/CommentComplex';
import { serverFetch } from '@/lib/server-fetch';
import type { Article } from '@/types/article';
import ArticleSidebar from '@/components/article/ArticleSidebar';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3815/api';
const UPLOADS_URL = API_URL.replace('/api', '') + '/uploads';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aquablueiran.com';

async function getArticle(id: string): Promise<Article | null> {
  const res = await serverFetch<Article & { success: boolean }>(`/articles/${id}`);
  if (!res.success || !res.data) return null;
  return res.data;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) return { title: 'مقاله | Aqua Blue' };

  const imageUrl = article.cover ? `${UPLOADS_URL}/${article.cover}` : `${SITE_URL}/og.webp`;

  return {
    title: `${article.title} | مجله Aqua Blue`,
    description: article.desc.slice(0, 160),
    openGraph: {
      title: article.title,
      description: article.desc.slice(0, 160),
      type: 'article',
      publishedTime: new Date(article.createdAt).toISOString(),
      authors: [article.authorName],
      images: [{ url: imageUrl, width: 800, height: 600, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.desc.slice(0, 160),
      images: [imageUrl],
    },
    keywords: [article.majorCat, article.minorCat, article.authorName],
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) notFound();

  const hasSubtitles = article.subtitles && article.subtitles.length > 0;

  // کامپوننت فهرست مطالب برای موبایل
  const MobileContentList = hasSubtitles ? (
    <div className="lg:hidden mt-8">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-5">
        <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">فهرست مطالب</h3>
        <ContentList subtitles={article.subtitles} />
      </div>
    </div>
  ) : null;

  return (
    <>
      <Header />
      <main className="container mx-auto px-3 py-6 relative z-10">
        <Breadcrumb majorCat={article.majorCat} minorCat={article.minorCat} title={article.title} isArticle />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">

          {/* ستون اصلی محتوا */}
          <div className="lg:col-span-8 xl:col-span-9">
            <Suspense fallback={<div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />}>
              <ArticleContent article={article} mobileContentList={MobileContentList} />
            </Suspense>

            {/* مقالات پیشنهادی */}
            <div className="mt-6">
              <Suspense fallback={<div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />}>
                <SuggestedArticles currentId={id} majorCat={article.majorCat} limit={4} />
              </Suspense>
            </div>

            {/* محصولات پیشنهادی */}
            <div className="mt-6">
              <Suspense fallback={<div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />}>
                <SuggestedProducts currentId={id} majorCat={article.majorCat} />
              </Suspense>
            </div>

            {/* نظرات */}
            <div className="mt-6">
              <Suspense fallback={<div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />}>
                <CommentComplex targetType="Article" targetId={id} />
              </Suspense>
            </div>
          </div>

          {/* سایدبار دسکتاپ (فقط ContentList استیکی باشه) */}
          <ArticleSidebar article={article} />

          {/* سایدبار دسکتاپ بدون فهرست مطالب */}
          {!hasSubtitles && (
            <div className="hidden lg:block lg:col-span-4 xl:col-span-3">
              <div className="space-y-6">
                <ShareURL title={article.title} />
                <RelatedLinks article={article} />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}