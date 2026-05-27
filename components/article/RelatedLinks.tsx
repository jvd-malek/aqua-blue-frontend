// components/article/RelatedLinks.tsx

'use client';

import Link from 'next/link';
import { FileText, Package, ExternalLink, ChevronLeft } from 'lucide-react';
import type { Article } from '@/types/article';

type LinkItem = {
  text: string;
  url: string;
  type: 'article' | 'product' | 'external';
};

export default function RelatedLinks({ article }: { article: Article }) {
  const extractLinks = (text: string): LinkItem[] => {
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const links: LinkItem[] = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      const [, textContent, url] = match;
      let type: LinkItem['type'] = 'external';
      if (url.startsWith('/article/')) type = 'article';
      else if (url.startsWith('/product/')) type = 'product';
      links.push({ text: textContent, url, type });
    }
    return links;
  };

  const allLinks: LinkItem[] = [];
  allLinks.push(...extractLinks(article.desc));
  article.content.forEach((para) => allLinks.push(...extractLinks(para)));

  // حذف تکراری بر اساس آدرس
  const uniqueLinks = Array.from(new Map(allLinks.map((link) => [link.url, link])).values());

  if (uniqueLinks.length === 0) return null;

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-5">
      <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">لینک‌های مرتبط</h3>
      <div className="space-y-2">
        {uniqueLinks.map((link, idx) => (
          <Link
            key={idx}
            href={link.url}
            target={link.type === 'external' ? '_blank' : undefined}
            rel={link.type === 'external' ? 'noopener noreferrer' : undefined}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
          >
            <div className="shrink-0 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              {link.type === 'article' && <FileText size={14} />}
              {link.type === 'product' && <Package size={14} />}
              {link.type === 'external' && <ExternalLink size={14} />}
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 line-clamp-1 flex-1">
              {link.text}
            </span>
            <ChevronLeft size={14} className="text-gray-400 shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}