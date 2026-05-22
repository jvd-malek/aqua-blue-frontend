// app/search/page.tsx

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchResults from '@/components/search/SearchResults';
import BoxHeader from '@/components/category/BoxHeader';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3815/api';

type SearchPageProps = {
  searchParams: Promise<{ q?: string; page?: string; sort?: string }>;
};

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q ? decodeURIComponent(q) : '';
  
  return {
    title: query ? `نتایج جستجو برای "${query}" | Aqua Blue` : 'جستجو | Aqua Blue',
    description: query ? `نتایج جستجو برای ${query} در فروشگاه Aqua Blue` : 'جستجوی محصولات و مقالات',
    robots: { index: false, follow: true },
  };
}

async function searchAll(query: string, page: number = 1, limit: number = 20) {
  try {
    const [productsRes, articlesRes] = await Promise.all([
      fetch(`${API_URL}/products?search=${encodeURIComponent(query)}&page=${page}&limit=${limit}`, { cache: 'no-store' }),
      fetch(`${API_URL}/articles?search=${encodeURIComponent(query)}&page=${page}&limit=${limit}`, { cache: 'no-store' }),
    ]);

    const products = productsRes.ok ? await productsRes.json() : { items: [], pagination: { total: 0 } };
    const articles = articlesRes.ok ? await articlesRes.json() : { items: [], pagination: { total: 0 } };

    return { products, articles };
  } catch {
    return { products: { items: [], pagination: { total: 0 } }, articles: { items: [], pagination: { total: 0 } } };
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, page = '1', sort = 'newest' } = await searchParams;
  const query = q ? decodeURIComponent(q) : null;
  const currentPage = parseInt(page);

  if (!query) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-3 py-20 text-center">
          <p className="text-xl text-gray-400">لطفاً عبارت جستجو را وارد کنید</p>
          <Link href="/" className="inline-block mt-4 text-blue-600 hover:underline">بازگشت به صفحه اصلی</Link>
        </div>
        <Footer />
      </>
    );
  }

  const { products, articles } = await searchAll(query, currentPage);
  const totalResults = (+products.pagination?.total || 0) + (+articles.pagination?.total || 0);

  return (
    <>
      <Header />

      <div className="container mx-auto px-3 mt-6 mb-12 relative z-20">
        
        {/* هدر جستجو */}
        <BoxHeader 
          title={`نتایج جستجو برای "${query}"`}
          majorCat="search"
          isSearch
        />
        
        <p className="text-center text-sm text-gray-400 mt-2">
          {totalResults.toLocaleString('fa-IR')} نتیجه یافت شد
        </p>

        {/* نتایج جستجو */}
        <SearchResults 
          products={products.items} 
          articles={articles.items}
          productsPagination={products.pagination}
          articlesPagination={articles.pagination}
          query={query}
          currentPage={currentPage}
        />
      </div>

      <Footer />
    </>
  );
}