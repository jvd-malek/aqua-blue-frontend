export type Discount = {
  id: string
  userId: string
  code: string
  discount: number
  date: number
  status: 'active' | 'inactive'
  createdAt: number
}

export type GroupDiscount = {
  id: string
  title: string
  majorCat: string
  minorCat?: string
  brand?: string
  discount: number
  startDate: number
  endDate: number
  isActive: number
  createdAt: number
  updatedAt: number
}
