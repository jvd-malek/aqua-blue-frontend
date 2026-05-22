
'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useGet } from '@/lib/client-swr';

type FAQItem = { question: string; answer: string };

type Props = { productId?: string };

export default function FAQ({ productId }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { data, isLoading } = useGet<{ items: any[] }>('/faq');

  const faqTemplates = data?.items || [];
  const faqs: FAQItem[] = [];

  // استخراج سوالات از قالب‌ها
  faqTemplates.forEach(template => {
    try {
      const parsed = template.faqs;
      if (Array.isArray(parsed)) faqs.push(...parsed);
    } catch (e) { console.log(e); }
  });

  if (isLoading) return <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />;
  if (faqs.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle size={20} className="text-blue-500" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">سوالات متداول</h3>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="flex items-center justify-between w-full p-4 text-right bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">{faq.question}</span>
              <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} />
            </button>
            {openIndex === idx && (
              <div className="p-4 text-sm text-gray-600 dark:text-gray-400 leading-7 border-t border-gray-200 dark:border-gray-700">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}