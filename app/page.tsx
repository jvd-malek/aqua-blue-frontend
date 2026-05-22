import dynamic from 'next/dynamic';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import ProductSliderSection from '@/components/home/ProductSliderSection';
import ArticleSliderSection from '@/components/home/ArticleSliderSection';
import { SECTIONS } from '@/constants/home';
import { useHomeData } from '@/hooks/useHomeData';

const WaveBackgroundHome = dynamic(
  () => import('@/components/home/WaveBackgroundHome'),
  { ssr: true, loading: () => null }
);

export default async function HomePage() {
  const { products, articles } = await useHomeData();

  return (
    <>
      <Header />
      <WaveBackgroundHome />

      <div className="relative z-10 space-y-12 pb-12">
        <HeroSection />
        <CategoriesSection />

        {SECTIONS.map((section) => {
          if (section.type === 'product') {
            const productKey = section.key as keyof typeof products;
            const productData = products[productKey];
            return (
              <ProductSliderSection
                key={section.key}
                title={section.title}
                link={section.link}
                products={Array.isArray(productData) ? productData : []}
              />
            );
          }

          return <ArticleSliderSection key={section.key} articles={articles} />;
        })}
      </div>

      <Footer />
    </>
  );
}