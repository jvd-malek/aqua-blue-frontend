'use client';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import type { ArticleCover } from '@/types/article';
import ArticleCard from './ArticleCard';

type Props = {
  articles: ArticleCover[];
};

export default function ArticlesSlider({ articles }: Props) {
  const [sliderRef] = useKeenSlider({
    rtl: true,
    breakpoints: {
      '(min-width: 320px)': { slides: { perView: 1, spacing: 12 } },
      '(min-width: 640px)': { slides: { perView: 2, spacing: 16 } },
      '(min-width: 854px)': { slides: { perView: 3, spacing: 20 } },
    },
  });

  if (!articles?.length) return null;

  return (
    <div ref={sliderRef} className="keen-slider mt-4">
      {articles.map((article) => (
        <div key={article.id} className="keen-slider__slide pb-2">
          <ArticleCard article={article} />
        </div>
      ))}
    </div>
  );
}