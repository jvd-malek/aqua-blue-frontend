export type User = {
  id: string
  name: string
  phone: string
  status: 'user' | 'admin' | 'owner' | 'banUser' | 'notifUser'
  baleChatId?: string
  totalBuy: number
  province?: string
  city?: string
  address?: string
  postCode?: number
  createdAt: number
  updatedAt: number
}

export type LoginResponse = {
  token: string
  user: Pick<User, 'id' | 'name' | 'phone' | 'status'>
  success: boolean
}

export type SendCodeResponse = {
  message: string
  code?: string
  success: boolean
}
