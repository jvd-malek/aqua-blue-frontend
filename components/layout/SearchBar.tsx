'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Search, X } from 'lucide-react'
import useSWR from 'swr'
import type { ProductCover } from '@/types'

type Props = {
  focusSearch?: boolean
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3815/api'
const UPLOADS_URL = API_URL.replace('/api', '') + '/uploads';

export default function SearchBar({ focusSearch }: Props) {
  const [query, setQuery] = useState('')
  const router = useRouter()
  const searchRef = useRef<HTMLInputElement>(null)

  const { data, isLoading } = useSWR<{ items: ProductCover[] }>(
    query.trim().length > 1 ? [`${API_URL}/products?search=${encodeURIComponent(query.trim())}&limit=5`] : null,
    (url: string) => fetch(url, { credentials: 'include' }).then((r) => r.json()),
    { dedupingInterval: 500 },
  )

  useEffect(() => {
    if (focusSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [focusSearch]);

  const handleSearch = useCallback(() => {
    const trimmed = query.trim()
    if (trimmed) {
      setQuery('')
      router.push(`/search?q=${encodeURIComponent(trimmed)}`)
    }
  }, [query, router])

  return (
    <div className="relative">
      <div
        className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/70 focus-within:border-blue-400 transition-colors w-full h-10"
      >
        <button
          type="button"
          onClick={handleSearch}
          className="px-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="جستجو"
        >
          <Search size={18} />
        </button>
        <input
          type="text"
          value={query}
          ref={searchRef}
          onChange={(e) => { setQuery(e.target.value) }}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
          placeholder="جستجو..."
          className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 pl-2"
        />
        {query && (
          <button
            onClick={() => { setQuery('') }}
            className="pl-2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {query.trim().length > 1 && (
        <div className="mt-2 max-h-56 overflow-y-auto space-y-1">
          {isLoading ? (
            <p className="text-xs text-gray-400 text-center py-2">در حال جستجو...</p>
          ) : (data && data.items?.length > 0) ? (
            <>
              {data.items?.map((product) => {
                const imageUrl = UPLOADS_URL + "/" + product.cover
                return (
                  <button
                    key={product.id}
                    onClick={() => { setQuery(''); router.push(`/product/${product.id}`); }}
                    className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-right"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0 flex items-center justify-center overflow-hidden">
                      {product.cover ? (
                        <Image
                          src={imageUrl}
                          alt={product.title}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      ) : (
                        <Search size={16} className="text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{product.title}</p>
                      <p className="text-xs text-gray-500">{product.price?.toLocaleString('fa-IR')} تومان</p>
                    </div>
                  </button>
                )
              })}
              <button
                onClick={handleSearch}
                className="w-full py-2 text-center text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg font-medium"
              >
                مشاهده همه نتایج
              </button>
            </>
          ) : (
            <p className="text-xs text-gray-400 text-center py-2">نتیجه‌ای یافت نشد</p>
          )}
        </div>
      )}
    </div>
  )
}

