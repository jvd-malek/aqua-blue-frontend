import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import HomeHeader from './HomeHeader';
import { ProductsSliderSkeleton } from './HomeSkeleton';

const ProductsSlider = dynamic(
  () => import('./ProductsSlider'),
  { loading: () => <ProductsSliderSkeleton />, ssr: true }
);

type Props = {
  title: string;
  link?: string;
  products: any[];
  page?: boolean
};

export default function ProductSliderSection({ title, link, products, page }: Props) {
  if (products.length === 0) return null;

  return (
    <section className={page ? "relative z-10" : "container mx-auto px-3 relative z-10 mt-16"}>
      <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
        <HomeHeader title={title} link={link} showAll={!page} />
      </div>
      <Suspense fallback={<ProductsSliderSkeleton />}>
        <ProductsSlider products={Array.isArray(products) ? products : []} />
      </Suspense>
    </section>
  );
}