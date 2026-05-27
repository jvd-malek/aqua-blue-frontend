// app/category/[...slug]/page.tsx

import type { Metadata } from 'next'
import Link from 'next/link'
import ProductCard from '@/components/home/ProductCard'
import BoxHeader from '@/components/category/BoxHeader'
import PaginationBox from '@/components/category/PaginationBox'
import type { ProductCover } from '@/types'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Breadcrumb from '@/components/product/Breadcrumb'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3815/api'

type ProductsData = {
  items: ProductCover[]
  pagination: {
    totalPages: number
    page: number
    total: number
    limit: number
  }
}

async function getProducts(
  majorCat: string, 
  minorCat?: string, 
  page = 1, 
  limit = 24, 
  sort = 'newest', 
  state?: string
): Promise<ProductsData | null> {
  try {
    const params = new URLSearchParams({ 
      majorCat, 
      page: String(page), 
      limit: String(limit), 
      sortBy: sort 
    })
    if (minorCat) params.set('minorCat', minorCat)
    if (state) params.set('state', state)
    
    const res = await fetch(`${API_URL}/products?${params}`, { cache: 'no-store' })
    if (!res.ok) return null
    return await res.json()
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const major = decodeURIComponent(slug[0]);
  const minor = slug[1] ? decodeURIComponent(slug[1]) : null;

  const categoryUrl = `https://aquablueiran.com/category/${slug.join('/')}`;
  const categoryTitle = minor || major;

  // کلمات کلیدی بر اساس دسته‌بندی
  const getKeywords = () => {
    const baseKeywords = ['خرید اینترنتی', 'قیمت', 'ارسال سریع', 'ضمانت کیفیت'];
    const categoryKeywords: Record<string, string[]> = {
      'ماهی': ['ماهی زینتی', 'انواع ماهی', 'ماهی آکواریومی', 'خرید ماهی', 'ماهی گوپی', 'ماهی نئون', 'ماهی دیسکاس', 'ماهی اسکار', 'ماهی فرشته'],
      'آکواریوم': ['تجهیزات آکواریوم', 'خرید آکواریوم', 'فیلتر آکواریوم', 'پمپ آکواریوم', 'نور آکواریوم', 'هیتر آکواریوم', 'آکواریوم شیشه‌ای', 'آکواریوم اکریلیک'],
      'تجهیزات آکواریوم': ['فیلتر', 'بخاری', 'پمپ هوا', 'تجهیزات برقی', 'لوازم جانبی آکواریوم'],
      'تزئینات آکواریوم': ['دکور آکواریوم', 'سنگ آکواریوم', 'چوب آکواریوم', 'گیاه مصنوعی', 'تزیینات'],
      'غذا': ['غذای ماهی', 'گرانول', 'پولکی', 'غذای زنده', 'غذای گیاه خوار', 'غذای گوشت خوار'],
      'گیاهان آبزی': ['گیاه آکواریومی', 'آنوبیاس', 'خزه', 'بوسفلاندرا', 'گیاه طبیعی', 'پلنت'],
      'دارو و افزودنی‌های دیگر': ['داروی ماهی', 'افزودنی آب', 'کلرگیر', 'باکتری زنده', 'درمان بیماری ماهی'],
    };

    const keywords = categoryKeywords[major] || [major, minor].filter(Boolean);
    return [...new Set([...keywords, ...baseKeywords])];
  };

  // توضیحات متا
  const getDescription = () => {
    if (minor) {
      return `خرید ${minor} با بهترین قیمت در دسته‌بندی ${major} از فروشگاه Aqua Blue. انواع ${minor} اصل با کیفیت بالا و ضمانت اصالت کالا. ارسال سریع به سراسر ایران.`;
    }

    const descriptions: Record<string, string> = {
      'ماهی': 'انواع ماهی‌های زینتی شامل ماهی گوپی، نئون، دیسکاس، اسکار، فرشته و ... با بهترین قیمت و کیفیت. خرید آنلاین ماهی با ارسال تخصصی و تضمین سلامت.',
      'آکواریوم': 'خرید انواع آکواریوم شیشه‌ای و اکریلیک در اندازه‌های مختلف. بهترین برندهای تجهیزات آکواریوم با قیمت مناسب و ارسال فوری.',
      'تجهیزات آکواریوم': 'بهترین تجهیزات آکواریوم شامل فیلتر، بخاری، پمپ هوا و ... با قیمت مناسب. خرید آنلاین با ضمانت اصالت کالا.',
      'تزئینات آکواریوم': 'لوازم تزئینی آکواریوم شامل چوب طبیعی، سنگ آکواریوم، گیاه مصنوعی و ... برای زیبایی هرچه بیشتر آکواریوم شما.',
      'غذا': 'بهترین برندهای غذای ماهی خارجی و ایرانی. گرانول، پولکی و غذای زنده برای انواع ماهی‌های آکواریومی.',
      'گیاهان آبزی': 'انواع گیاهان طبیعی آکواریومی شامل آنوبیاس، خزه، بوسفلاندرا و ... با کیفیت عالی و قیمت مناسب.',
      'دارو و افزودنی‌های دیگر': 'داروهای تخصصی ماهی، افزودنی‌های آب، کلرگیر و باکتری زنده برای سلامت آکواریوم شما.',
    };

    return descriptions[major] || `خرید انواع محصولات ${major} با بهترین قیمت و کیفیت از فروشگاه Aqua Blue. ارسال سریع به سراسر ایران.`;
  };

  return {
    title: `${categoryTitle} | خرید ${categoryTitle} با بهترین قیمت`,
    description: getDescription(),
    keywords: getKeywords(),
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${categoryTitle}`,
      description: getDescription(),
      url: categoryUrl,
      type: 'website',
      siteName: 'Aqua Blue',
      locale: 'fa_IR',
      images: [
        {
          url: `/og.webp`,
          width: 1200,
          height: 630,
          alt: `محصولات دسته ${categoryTitle} در Aqua Blue`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryTitle} | Aqua Blue`,
      description: getDescription().slice(0, 200),
      images: [`/og.webp`],
    },
    alternates: {
      canonical: categoryUrl,
    },
  };
}

export default async function CategoryPage({
  params, 
  searchParams,
}: {
  params: Promise<{ slug: string[] }>
  searchParams?: Promise<{ page?: string; sort?: string; count?: string; state?: string; minorCat?: string }>
}) {
  const { slug } = await params
  const sp = await searchParams
  
  // از URL: /category/ماهی/ماهی_گوپی
  const majorCat = decodeURIComponent(slug[0])
  const slugMinor = slug[1] ? decodeURIComponent(slug[1]) : null
  
  // اولویت: searchParams.minorCat > slug[1]
  const minorCat = sp?.minorCat || slugMinor
  
  const page = parseInt(sp?.page || '1')
  const sort = sp?.sort || 'newest'
  const limit = parseInt(sp?.count || '24')
  const state = sp?.state

  const data = await getProducts(majorCat, minorCat || undefined, page, limit, sort, state)

  if (!data) {
    return (
      <div className="container mx-auto px-3 py-20 text-center relative z-10">
        <p className="text-xl text-gray-400">خطا در دریافت اطلاعات</p>
        <Link href="/" className="inline-block mt-4 text-blue-600 hover:underline">بازگشت به صفحه اصلی</Link>
      </div>
    )
  }

  const { items, pagination } = data
  const pageTitle = minorCat || majorCat

  return (
    <>
      <Header />
      <div className="container mx-auto px-3 mt-6 mb-12 relative z-20">
        
        <Breadcrumb majorCat={minorCat ? majorCat : undefined} title={pageTitle} />

        <BoxHeader
          title={pageTitle}
          majorCat={majorCat}
          minorCat={minorCat || undefined}
        />

        {items?.length > 0 ? (
          <section className="mt-8">
            <ul className="flex flex-wrap justify-center sm:gap-6 gap-4">
              {items.map((p) => (
                <li key={p.id} className="sm:w-52 w-40">
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>

            <PaginationBox
              totalPages={pagination.totalPages}
              currentPage={pagination.page}
            />

            <p className="text-center text-sm text-gray-400 mt-4">
              {pagination.total.toLocaleString('fa-IR')} محصول
            </p>
          </section>
        ) : (
          <section className="text-center py-20">
            <p className="text-2xl text-gray-400">محصولی یافت نشد</p>
          </section>
        )}
      </div>
      <Footer />
    </>
  )
}