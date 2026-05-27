// components/article/ContentList.tsx

'use client';

import { ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

type Props = {
  subtitles: string[];
};

export default function ContentList({ subtitles }: Props) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.id.split('-')[1], 10);
            if (!isNaN(index)) setActiveIndex(index);
          }
        });
      },
      { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' }
    );

    const sections = document.querySelectorAll('[id^="section-"]');
    sections.forEach((section) => observer.observe(section));

    // تنظیم activeIndex روی اولین بخش در ابتدا
    if (sections.length > 0) {
      const firstSection = sections[0];
      const firstIndex = parseInt(firstSection.id.split('-')[1], 10);
      if (!isNaN(firstIndex)) setActiveIndex(firstIndex);
    }

    return () => observer.disconnect();
  }, [subtitles]);

  const scrollToSection = (index: number) => {
    const element = document.getElementById(`section-${index}`);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
      setActiveIndex(index);
    }
  };

  if (subtitles.length === 0) return null;

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-5 sticky top-24">
      <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">فهرست مطالب</h3>
      <ul className="space-y-2">
        {subtitles.map((title, idx) => (
          <li key={idx}>
            <button
              onClick={() => scrollToSection(idx)}
              className={`w-full text-right flex items-center justify-between gap-2 p-2 rounded-lg transition-all duration-200 ${
                activeIndex === idx
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="text-sm line-clamp-2 flex-1">{title}</span>
              <ChevronLeft size={14} className={`shrink-0 ${activeIndex === idx ? 'text-white' : 'text-gray-400'}`} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}