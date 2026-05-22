// components/home/HomeHeader.tsx
'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react'

interface BoxHeaderProps {
  title: string;
  link?: string;
  postfix?: string;
  ariaLabel?: string;
  showAll?: boolean;
}

export default function HomeHeader({
  title,
  postfix = "",
  link = "",
  ariaLabel = `مشاهده همه ${title}`,
  showAll = true
}: BoxHeaderProps) {
  return (
    <div className={`flex px-3 justify-between items-center gap-2 group/header`}>
      {!showAll &&
        <div className="flex-3 h-px bg-linear-to-r from-transparent via-blue-300 to-transparent"></div>
      }
      
      <div className="flex flex-col relative mb-1">
        <h2 className="section-title text-xl text-nowrap font-extrabold">
          {title}
          <span className="section-title-accent text-cyan-700 pr-1 sm:text-3xl text-2xl">
            {postfix}
          </span>
        </h2>
        {/* خط تزئینی زیر عنوان */}
        <div className="section-title-line"></div>
      </div>
      
      <div className={`${showAll && "hidden sm:block"} flex-3 h-px bg-linear-to-l from-transparent via-blue-300 to-transparent`}></div>
      
      {showAll &&
        <Link
          href={link}
          className="view-all-link flex items-center text-cyan-700 dark:text-blue-100 gap-1 group/link"
          aria-label={ariaLabel}
          role="button"
          tabIndex={0}
        >
          <span className="text-sm text-nowrap font-bold">مشاهده‌همه</span>
          <ChevronLeft
            fontSize='inherit'
            className="text-sm transform group-hover/link:-translate-x-1 transition-transform duration-500"
            aria-hidden="true"
          />
        </Link>
      }
    </div>
  );
}