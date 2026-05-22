export type Product = {
  id: string
  title: string
  desc: string
  price: number
  cost: number
  discountPercent: number
  discountExpireAt: Date | null
  count: number
  showCount: number
  totalSell: number
  state: 'active' | 'inactive' | 'outOfStock' | 'comingSoon' | 'callForPrice'
  condition: string
  size: string
  weight: number
  majorCat: string
  minorCat: string
  brand: string
  features: Feature[]
  cover: string
  images?: string[]
  createdAt: number
  updatedAt: number
}

export type ProductImage = {
  id: string
  productId: string
  url: string
  order: number
  createdAt: number
}

export type Feature = {
  key: string
  value: string
}

export type ProductCover = {
  id: string
  title: string
  desc: string
  price: number
  discountPercent: number
  discountExpireAt: Date | null
  cover: string
  showCount: number
  totalSell: number
  state: Product['state']
  majorCat: string
  minorCat: string
  brand: string
  weight: number
  createdAt: number
}

export type ProductListResponse = {
  products: ProductCover[]
  totalPages: number
  currentPage: number
  total: number
}


