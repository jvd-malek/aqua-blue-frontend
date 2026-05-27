// app/blog/page.tsx

import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/product/Breadcrumb';
import BoxHeader from '@/components/category/BoxHeader';
import PaginationBox from '@/components/category/PaginationBox';
import ArticleCard from '@/components/home/ArticleCard';
import { serverFetch } from '@/lib/server-fetch';
import type { ArticleCover } from '@/types/article';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aquablueiran.com';

// دسته‌بندی‌های مقالات
const articleCategories = [
  { major: 'آموزشی', minor: '', label: 'آموزشی' },
  { major: 'بیماری‌ها', minor: '', label: 'بیماری‌ها' },
  { major: 'تجهیزات', minor: '', label: 'تجهیزات' },
  { major: 'ماهی‌ها', minor: '', label: 'معرفی ماهی' },
  { major: 'آکواریوم', minor: '', label: 'آکواریوم' },
];

// ============================================
// متادیتای پویا
// ============================================

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ search?: string; majorCat?: string; sort?: string; page?: string }>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const search = sp?.search || '';
  const majorCat = sp?.majorCat || '';
  const page = parseInt(sp?.page || '1', 10);

  let title = 'مجله تخصصی ماهی و آکواریوم | Aqua Blue';
  let description = 'مطالب آموزشی، راهنمای نگهداری ماهی، بیماری‌ها، طراحی آکواریوم و آخرین اخبار دنیای آبزیان';

  const getKeywordsByCategory = (cat: string): string[] => {
    const keywordsMap: Record<string, string[]> = {
      'آموزشی': ['آموزش نگهداری ماهی', 'راهنمای آکواریوم', 'آموزش تصفیه آب', 'آموزش تغذیه ماهی'],
      'بیماری‌ها': ['بیماری ماهی', 'درمان ماهی', 'لکه سفید ماهی', 'قارچ ماهی', 'بیماری آکواریوم'],
      'تجهیزات': ['تجهیزات آکواریوم', 'فیلتر آکواریوم', 'بخاری آکواریوم', 'نور آکواریوم', 'پمپ آکواریوم'],
      'ماهی‌ها': ['معرفی ماهی', 'ماهی گوپی', 'ماهی نئون', 'ماهی دیسکاس', 'ماهی اسکار', 'ماهی فرشته'],
      'آکواریوم': ['طراحی آکواریوم', 'دکور آکواریوم', 'گیاه آکواریومی', 'آکواریوم پلنت', 'چیدمان آکواریوم'],
    };
    return keywordsMap[cat] || [];
  };

  if (search) {
    title = `نتایج جستجو برای "${search}"`;
    description = `نتایج جستجو برای "${search}" در مجله تخصصی Aqua Blue. مطالب آموزشی و راهنماهای مفید درباره ماهی و آکواریوم.`;
  } else if (majorCat) {
    const categoryLabel = articleCategories.find(c => c.major === majorCat)?.label || majorCat;
    title = `${categoryLabel} | مقالات تخصصی ماهی و آکواریوم`;
    description = `مقالات آموزشی و تخصصی در دسته‌بندی ${categoryLabel}. راهنمای جامع نگهداری، بیماری‌ها و تجهیزات آکواریوم.`;
    if (page > 1) title = `${categoryLabel} - صفحه ${page}`;
  } else if (page > 1) {
    title = `مجله Aqua Blue - صفحه ${page} | مقالات تخصصی ماهی و آکواریوم`;
  }

  const baseKeywords = ['مجله آکواریوم', 'مقالات ماهی', 'راهنمای آکواریوم', 'آموزش نگهداری ماهی', 'وبلاگ تخصصی'];
  const categoryKeywords = majorCat ? getKeywordsByCategory(majorCat) : [];
  const searchKeywords = search ? [search, `جستجوی ${search}`, `مطالب ${search}`] : [];
  const keywords = [...new Set([...baseKeywords, ...categoryKeywords, ...searchKeywords])].filter(Boolean);

  const pageUrl = new URL(`${SITE_URL}/blog`);
  if (search) pageUrl.searchParams.set('search', search);
  if (majorCat) pageUrl.searchParams.set('majorCat', majorCat);
  if (page > 1) pageUrl.searchParams.set('page', String(page));

  return {
    title,
    description,
    keywords,
    robots: { index: true, follow: true },
    openGraph: {
      title: title.split('|')[0].trim(),
      description: description.slice(0, 200),
      url: pageUrl.toString(),
      type: 'website',
      siteName: 'Aqua Blue',
      locale: 'fa_IR',
      images: [{ url: '/og.webp', width: 1200, height: 630, alt: 'مجله تخصصی Aqua Blue' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: title.slice(0, 70),
      description: description.slice(0, 200),
      images: ['/og.webp'],
    },
    alternates: { canonical: pageUrl.toString() },
  };
}

// ============================================
// دریافت مقالات از API
// ============================================

async function getArticles(
  page: number = 1,
  limit: number = 12,
  sort: string = 'newest',
  search?: string,
  majorCat?: string,
  minorCat?: string
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy: sort,
    majorCat: 'مجله'
  });
  if (search) params.set('search', search);
  if (minorCat) params.set('minorCat', minorCat);

  const res = await serverFetch<{ items: ArticleCover[]; pagination: { total: number; totalPages: number } }>(
    `/articles?${params.toString()}`
  );
  if (!res.success) return { articles: [], totalPages: 0, total: 0 };
  return {
    articles: res.data?.items || [],
    totalPages: res.data?.pagination?.totalPages || 0,
    total: res.data?.pagination?.total || 0,
  };
}

// ============================================
// صفحه اصلی بلاگ
// ============================================

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; sort?: string; count?: string; search?: string; majorCat?: string; minorCat?: string }>;
}) {
  const sp = await searchParams;
  const page = parseInt(sp?.page || '1', 10);
  const limit = parseInt(sp?.count || '12', 10);
  const sort = sp?.sort || 'newest';
  const search = sp?.search || '';
  const majorCat = sp?.majorCat || '';
  const minorCat = sp?.minorCat || '';

  const { articles, totalPages, total } = await getArticles(page, limit, sort, search, majorCat, minorCat);

  let boxTitle = 'مجله Aqua Blue';
  if (search) boxTitle = `نتایج جستجو: "${search}"`;
  else if (majorCat) boxTitle = articleCategories.find(c => c.major === majorCat)?.label || majorCat;

  return (
    <>
      <Header />
      <main className="container mx-auto px-3 py-6 relative z-10">
        <Breadcrumb title="مجله Aqua Blue" />

        <div className="mt-6">
          <BoxHeader
            title={boxTitle}
            majorCat="مجله"
          />

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
            {total.toLocaleString('fa-IR')} مقاله یافت شد
          </p>

          {articles.length === 0 ? (
            <div className="text-center py-20 bg-white/80 dark:bg-gray-900/80 rounded-2xl mt-6">
              <p className="text-gray-500">هیچ مقاله‌ای با این شرایط یافت نشد.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>

              {totalPages > 1 && <PaginationBox totalPages={totalPages} currentPage={page} />}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}