export type Alert = {
  id: string
  title: string
  body: string
  target: 'all' | 'user'
  targetUserId?: string
  source: string
  status: 'active' | 'inactive'
  createdAt: number
  updatedAt: number
}
