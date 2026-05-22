export type Article = {
  id: string
  authorName: string
  title: string
  desc: string
  content: string
  subtitles: string
  majorCat: string
  minorCat: string
  views: number
  cover: string
  images?: ArticleImage[]
  createdAt: number
  updatedAt: number
}

export type ArticleImage = {
  id: string
  articleId: string
  url: string
  order: number
  createdAt: number
}

export type ArticleCover = {
  id: string
  authorName: string
  title: string
  desc: string
  cover: string
  views: number
  majorCat: string
  minorCat: string
  createdAt: number
}
