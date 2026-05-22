export type FAQTemplate = {
  id: string
  name: string
  category: string
  faqs: string
  isActive: number
  createdAt: number
  updatedAt: number
}

export type FAQ = {
  question: string
  answer: string
}
