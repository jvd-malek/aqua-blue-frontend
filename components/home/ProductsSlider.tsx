'use client'

import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import type { ProductCover } from '@/types'
import ProductCard from './ProductCard'

type Props = {
  products: ProductCover[]
}

export default function ProductsSlider({ products }: Props) {
  const [sliderRef] = useKeenSlider({
    rtl: true,
    breakpoints: {
      '(min-width: 320px)': { slides: { perView: 2, spacing: 10 } },
      '(min-width: 640px)': { slides: { perView: 3, spacing: 12 } },
      '(min-width: 854px)': { slides: { perView: 4, spacing: 14 } },
      // '(min-width: 1024px)': { slides: { perView: 5, spacing: 16 } },
    },
  })

  if (!products?.length) return null

  return (
    <div ref={sliderRef} className="keen-slider mt-4">
      {products.map((p) => (
        <div key={p.id} className="keen-slider__slide pb-2">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  )
}
