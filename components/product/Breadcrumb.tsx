import Link from 'next/link'
import { ChevronLeft, Home } from 'lucide-react'

type Props = {
  majorCat?: string
  minorCat?: string
  title?: string
  brand?: string
}

export default function Breadcrumb({ majorCat, minorCat, title, brand }: Props) {
  return (
    <nav aria-label="breadcrumb" className="w-full relative z-30 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6 bg-white dark:bg-gray-900 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-gray-200/50 dark:border-gray-700/50">
      <Link href="/" className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-600">
        <Home size={16} />
        <ChevronLeft size={14} className="text-gray-300" />
      </Link>

      {majorCat && (
        <Link href={`/category/${majorCat}`} className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-600">
          <p className="line-clamp-1">
            {majorCat}
          </p>
          <ChevronLeft size={14} className="text-gray-300" />
        </Link>
      )}

      {minorCat && (
        <Link href={`/category/${majorCat}/${minorCat}`} className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-600">
          <p className="line-clamp-1">
            {minorCat}
          </p>
          <ChevronLeft size={14} className="text-gray-300" />
        </Link>
      )}

      {brand && (
        <Link href={`/category/${majorCat}/${minorCat}?brand=${brand}`} className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-600">
          <p className="line-clamp-1">
            {brand}
          </p>
          <ChevronLeft size={14} className="text-gray-300" />
        </Link>
      )}

      {title && <p className="text-gray-900 dark:text-white truncate line-clamp-1">{title}</p>}
    </nav>
  )
}
