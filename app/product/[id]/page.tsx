// app/product/[id]/page.tsx

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/product/Breadcrumb';
import ImageGallery from '@/components/product/ImageGallery';
import ImgBtn from '@/components/product/ImgBtn';
import BuyBtn from '@/components/product/BuyBtn';
import ShareURL from '@/components/product/ShareURL';
import DiscountTimer from '@/components/product/DiscountTimer';
import InfoTable from '@/components/product/InfoTable';
import FAQ from '@/components/product/FAQ';
import SuggestedProducts from '@/components/product/SuggestedProducts';
import CommentComplex from '@/components/product/CommentComplex';
import { serverFetch } from '@/lib/server-fetch';
import { Product } from '@/types';
import ContentWithLinks from '@/components/link/ContentWithLinks';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3815/api';

async function getProduct(id: string) {
  const res = await serverFetch<Product>(`/products/${id}`, { cache: 'no-store' });

  if (!res.success || !res.data) return null;
  return res.data;
}

async function getLatestArticles(limit: number = 3) {
  const res = await serverFetch<{ items: any[] }>(`/articles?limit=${limit}&sortBy=newest`);
  return res.success ? res.data?.items || [] : [];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: 'محصول | Aqua Blue' };

  return {
    title: `${product.title} | Aqua Blue`,
    description: product.desc?.slice(0, 160),
    openGraph: {
      title: `${product.title} | Aqua Blue`,
      description: product.desc?.slice(0, 160),
      images: product.cover ? [`${API_URL.replace('/api', '')}/uploads/${product.cover}`] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const currentTime = new Date();
  const hasDiscount = product.discountPercent > 0 && (!product.discountExpireAt || new Date(product.discountExpireAt) > currentTime);
  const finalPrice = hasDiscount ? Math.round(product.price * (100 - product.discountPercent) / 100) : product.price;

  const latestArticles = await getLatestArticles(3);

  return (
    <>
      <Header />

      <main className="container mx-auto px-3 py-6 relative z-10">

        {/* Fixed buy button for mobile */}
        <div className="fixed bottom-0 left-0 right-0 z-50 block sm:hidden">
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 p-3">
            <BuyBtn
              productId={id}
              showCount={product.showCount}
              state={product.state}
              finalPrice={finalPrice}
              title={product.title}
              price={product.price}
              discountPercent={product.discountPercent}
              cover={product.cover}
            />
          </div>
        </div>

        {/* Breadcrumb */}
        <Breadcrumb majorCat={product.majorCat} minorCat={product.minorCat} title={product.title} />

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">

          {/* Left Column - Images */}
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-4">
            <ImageGallery images={product.images || []} cover={product.cover} title={product.title} />
            <ImgBtn productId={product.id} isLoggedIn={false} isFav={false} />
            {hasDiscount && product.discountExpireAt && (
              <div className="absolute top-4 left-4 z-10">
                <DiscountTimer endDate={new Date(product.discountExpireAt).getTime()} />
              </div>
            )}
            <div className="mt-4">
              <ShareURL title={product.title} />
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="bg-white flex flex-col justify-between dark:bg-gray-900 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{product.title}</h1>

              {/* Description */}
              <div className="mt-4 text-lg text-gray-600 dark:text-gray-400 leading-7">
                <ContentWithLinks content={product?.desc || ''} />
              </div>

              {/* Price & Stock */}
              <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">تعداد فروش:</span>
                  <span className="font-bold">{product.totalSell?.toLocaleString('fa-IR') || 0} عدد</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">موجودی:</span>
                  <span className={`font-bold ${product.showCount === 0 ? 'text-red-500' : ''}`}>
                    {product.showCount > 0 ? `${product.showCount.toLocaleString('fa-IR')} عدد` : 'ناموجود'}
                  </span>
                </div>
                {product.condition && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">وضعیت:</span>
                    <span className="font-bold">{product.condition}</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-2">
                  <span className="text-gray-500">قیمت:</span>
                  <div className="text-left">
                    {hasDiscount && (
                      <p className="text-xs text-gray-400 line-through">{product.price.toLocaleString('fa-IR')} تومان</p>
                    )}
                    <p className={`font-bold ${hasDiscount ? 'text-red-500 text-lg' : ''}`}>
                      {finalPrice.toLocaleString('fa-IR')} تومان
                    </p>
                  </div>
                </div>
              </div>

              {/* Buy Button */}
              <BuyBtn
                productId={id}
                showCount={product.showCount}
                state={product.state}
                finalPrice={finalPrice}
                title={product.title}
                price={product.price}
                discountPercent={product.discountPercent}
                cover={product.cover}
              />
            </div>

            {/* Help Section */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">نیاز به راهنمایی دارید؟</p>
              <div className="flex gap-3">
                <a href="#faq" className="flex items-center gap-1.5 text-xs bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 transition-colors">
                  ❓ سوالات متداول
                </a>
                <a href="#info" className="flex items-center gap-1.5 text-xs bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 transition-colors">
                  📋 اطلاعات بیشتر
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Products */}
        <div className="mt-12">
          <SuggestedProducts currentId={id} majorCat={product.majorCat} />
        </div>

        {/* Info Table */}
        <div className="mt-8" id="info">
          <InfoTable
            product={product}
            hasDiscount={hasDiscount}
            finalPrice={finalPrice}
          />
        </div>

        {/* FAQ Section */}
        <div className="mt-8" id="faq">
          <Suspense fallback={<div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />}>
            <FAQ productId={id} />
          </Suspense>
        </div>

        {/* Latest Articles */}
        {latestArticles.length > 0 && (
          <div className="mt-8">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">مقالات مرتبط</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {latestArticles.map((article: any) => (
                  <a key={article.id} href={`/blog/${article.id}`} className="group block p-4 rounded-xl bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:scale-105">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{article.desc}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-8" id="comments">
          <Suspense fallback={<div className="h-60 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />}>
            <CommentComplex targetType="Product" targetId={id} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </>
  );
}