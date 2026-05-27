// types/article.ts

export type ArticleImage = {
  id: string;
  articleId: string;
  url: string;
  order: number;
  createdAt: number;
};

export type Article = {
  id: string;
  authorName: string;
  title: string;
  desc: string;
  content: string[];        // آرایه‌ای از پاراگراف‌ها
  subtitles: string[];      // زیرعنوان‌ها (هم‌راستا با content)
  majorCat: string;
  minorCat: string;
  views: number;
  cover: string;
  images?: ArticleImage[];
  createdAt: number;
  updatedAt: number;
};

export type ArticleCover = {
  id: string;
  authorName: string;
  title: string;
  desc: string;
  cover: string;
  views: number;
  majorCat: string;
  minorCat: string;
  createdAt: number;
};