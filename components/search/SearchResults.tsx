// components/search/SearchResults.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, Calendar, ShoppingBag } from 'lucide-react';
import type { ProductCover } from '@/types';
import type { ArticleCover } from '@/types/article';
import ProductCard from '@/components/home/ProductCard';
import ArticleCard from '@/components/home/ArticleCard';
import PaginationBox from '@/components/category/PaginationBox';

type Props = {
  products: ProductCover[];
  articles: ArticleCover[];
  productsPagination: { total: number; totalPages: number; page: number };
  articlesPagination: { total: number; totalPages: number; page: number };
  query: string;
  currentPage: number;
};

export default function SearchResults({ 
  products, 
  articles, 
  productsPagination, 
  articlesPagination,
  query,
  currentPage 
}: Props) {
  const [activeTab, setActiveTab] = useState<'all' | 'products' | 'articles'>('all');

  const showProducts = activeTab === 'all' || activeTab === 'products';
  const showArticles = activeTab === 'all' || activeTab === 'articles';

  return (
    <div className="mt-8">
      
      {/* تب‌ها */}
      <div className="flex justify-center gap-2 mb-8 border-b-2 border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-2 text-sm font-medium transition-all duration-300 ${
            activeTab === 'all'
              ? 'text-blue-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          همه ({+productsPagination.total + +articlesPagination.total})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-6 py-2 text-sm font-medium transition-all duration-300 ${
            activeTab === 'products'
              ? 'text-blue-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          محصولات ({productsPagination.total})
        </button>
        <button
          onClick={() => setActiveTab('articles')}
          className={`px-6 py-2 text-sm font-medium transition-all duration-300 ${
            activeTab === 'articles'
              ? 'text-blue-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          مقالات ({articlesPagination.total})
        </button>
      </div>

      {/* محصولات */}
      {showProducts && (
        <div className="mb-12">
          {activeTab === 'all' && products.length > 0 && (
            <div className="flex justify-between items-center mb-4">
              <h2 className="section-title text-lg font-bold">محصولات</h2>
              {productsPagination.total > products.length && (
                <button 
                  onClick={() => setActiveTab('products')}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  مشاهده همه
                </button>
              )}
            </div>
          )}
          
          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            activeTab === 'products' && (
              <p className="text-center text-gray-400 py-10">محصولی یافت نشد</p>
            )
          )}
          
          {activeTab === 'products' && productsPagination.totalPages > 1 && (
            <PaginationBox 
              totalPages={productsPagination.totalPages} 
              currentPage={currentPage}
              basePath={`/search?q=${encodeURIComponent(query)}`}
            />
          )}
        </div>
      )}

      {/* مقالات */}
      {showArticles && (
        <div>
          {activeTab === 'all' && articles.length > 0 && (
            <div className="flex justify-between items-center mb-4">
              <h2 className="section-title text-lg font-bold">مقالات</h2>
              {articlesPagination.total > articles.length && (
                <button 
                  onClick={() => setActiveTab('articles')}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  مشاهده همه
                </button>
              )}
            </div>
          )}
          
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            activeTab === 'articles' && (
              <p className="text-center text-gray-400 py-10">مقاله‌ای یافت نشد</p>
            )
          )}
          
          {activeTab === 'articles' && articlesPagination.totalPages > 1 && (
            <PaginationBox 
              totalPages={articlesPagination.totalPages} 
              currentPage={currentPage}
              basePath={`/search?q=${encodeURIComponent(query)}`}
            />
          )}
        </div>
      )}
    </div>
  );
}