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

async function getProducts(majorCat: string, minorCat?: string, page = 1, limit = 24, sort = 'newest', state?: string): Promise<ProductsData | null> {
  try {
    const params = new URLSearchParams({ majorCat, page: String(page), limit: String(limit), sortBy: sort })
    if (minorCat) params.set('minorCat', minorCat)
    if (state) params.set('state', state)
    const res = await fetch(`${API_URL}/products?${params}`, { cache: 'no-store' })

    if (!res.ok) return null
    return await res.json()
  } catch (error) {
    console.log(error);
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params
  const major = decodeURIComponent(slug[0])
  const minor = slug[1] ? decodeURIComponent(slug[1]) : null
  return {
    title: minor ? `${minor} | ${major} - Aqua Blue` : `${major} - فروشگاه Aqua Blue`,
    description: minor ? `محصولات ${minor} در دسته‌بندی ${major}` : `همه محصولات ${major}`,
    openGraph: {
      title: minor ? `${minor} | ${major} - Aqua Blue` : `${major} - Aqua Blue`,
      description: minor ? `محصولات ${minor} در گروه ${major}` : `همه محصولات ${major}`,
      url: `https://aquablue.ir/category/${slug.join('/')}`,
      siteName: 'Aqua Blue',
      locale: 'fa_IR',
      type: 'website',
    },
  }
}

export default async function CategoryPage({
  params, searchParams,
}: {
  params: Promise<{ slug: string[] }>
  searchParams?: Promise<{ page?: string; sort?: string; count?: string; state?: string }>
}) {
  const { slug } = await params
  const sp = await searchParams
  const majorCat = decodeURIComponent(slug[0])
  const minorCat = slug[1] ? decodeURIComponent(slug[1]) : null
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

        {/* Breadcrumb */}
        <Breadcrumb majorCat={minorCat ? majorCat : undefined} title={pageTitle} />

        {/* BoxHeader: title, sort, filter, count, in-stock */}
        <BoxHeader
          title={pageTitle}
          majorCat={majorCat}
          minorCat={minorCat || undefined}
        />

        {/* Products grid */}
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
