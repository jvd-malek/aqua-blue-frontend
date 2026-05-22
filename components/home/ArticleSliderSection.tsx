import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import HomeHeader from './HomeHeader';
import { ProductsSliderSkeleton } from './HomeSkeleton';

const ArticlesSlider = dynamic(
  () => import('./ArticlesSlider'),
  { loading: () => <ProductsSliderSkeleton title="مقالات" />, ssr: true }
);

type Props = {
  articles: any[];
};

export default function ArticleSliderSection({ articles }: Props) {
  if (articles.length === 0) return null;

  return (
    <section className="container mx-auto px-3 relative z-10 mt-16">
      <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
        <HomeHeader title="مقالات" link="/blog" />
      </div>
      <Suspense fallback={<ProductsSliderSkeleton title="مقالات" />}>
        <ArticlesSlider articles={Array.isArray(articles) ? articles : []} />
      </Suspense>
    </section>
  );
}