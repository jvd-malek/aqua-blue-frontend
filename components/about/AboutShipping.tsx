'use client';

import { useState } from 'react';
import { ChevronDown, Package, Truck, Bike, Train, Clock, MapPin } from 'lucide-react';

const shippingMethods = [
  {
    id: 'post',
    title: 'پست پیشتاز',
    icon: Package,
    description: 'ارسال به سراسر کشور با پست پیشتاز',
    details: `پس از پردازش و آماده‌سازی سفارش (که معمولاً ۱ تا ۲ روز کاری زمان می‌برد)، بسته شما به اداره پست تحویل داده می‌شود.
زمان تقریبی تحویل بسته توسط پست پیشتاز، ۱ تا ۳ روز کاری پس از تحویل به پست است.
شما می‌توانید با استفاده از کد رهگیری مرسوله پستی که برایتان ارسال می‌شود، وضعیت بسته‌تان را به صورت آنلاین پیگیری نمایید.`,
  },
  {
    id: 'tipax',
    title: 'تیپاکس',
    icon: Truck,
    description: 'ارسال سریع با تیپاکس به سراسر کشور',
    details: `ارسال با تیپاکس برای شهرهای بزرگ معمولاً ۱ تا ۲ روز کاری زمان می‌برد.
کد رهگیری مرسوله برای پیگیری وضعیت بسته در دسترس خواهد بود.
هزینه ارسال بر اساس وزن و مقصد محاسبه می‌شود.`,
  },
  {
    id: 'courier',
    title: 'ارسال با پیک موتوری (ویژه تهران)',
    icon: Bike,
    description: 'ارسال سریع درب منزل برای مشتریان تهرانی',
    details: `برای مشتریان ساکن در شهر تهران، امکان ارسال سریع با پیک موتوری فراهم است.
سفارشاتی که تا ساعت ۸ شب ثبت و نهایی شوند، در همان روز کاری تحویل پیک خواهند شد.
هزینه ارسال با پیک موتوری بر اساس مسافت محاسبه و در هنگام نهایی کردن سفارش به اطلاع شما خواهد رسید.`,
  },
  {
    id: 'trucking',
    title: 'ارسال با باربری (برای سفارش‌های حجیم)',
    icon: Train,
    description: 'مناسب برای ارسال ماهی زنده و سفارش‌های حجیم',
    details: `در صورتی که سفارش شما شامل اقلام بسیار حجیم، سنگین یا نیازمند شرایط حمل و نقل ویژه‌ای باشد (مانند ماهی زنده)، از طریق شرکت‌های باربری معتبر ارسال می‌گردد.
هزینه و زمان تحویل در این روش، پس از هماهنگی با شما تعیین خواهد شد.`,
  },
];

export default function AboutShipping() {
  const [openId, setOpenId] = useState<string | null>('post');

  const toggleOpen = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="section-title text-2xl md:text-3xl font-bold mb-4">
            شرایط و روش‌های ارسال
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            ما متعهد به ارسال سریع و ایمن محصولات شما هستیم
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {shippingMethods.map((method) => {
            const Icon = method.icon;
            const isOpen = openId === method.id;

            return (
              <div
                key={method.id}
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleOpen(method.id)}
                  className="flex items-center justify-between w-full p-5 text-right hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <Icon size={20} className="text-blue-500" />
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-800 dark:text-gray-200">
                        {method.title}
                      </span>
                      <p className="text-xs text-gray-500 mt-0.5">{method.description}</p>
                    </div>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-gray-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-2 text-gray-600 dark:text-gray-400 leading-7 text-sm border-t border-gray-200 dark:border-gray-700">
                    <p className="whitespace-pre-line">{method.details}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* نکات مهم */}
          <div className="mt-6 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={18} className="text-blue-600" />
              <h4 className="font-bold text-blue-800 dark:text-blue-300">نکات مهم در خصوص ارسال</h4>
            </div>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-2">
              <li className="flex items-start gap-2">
                <Package size={14} className="mt-1 shrink-0" />
                <span>بسته‌بندی: تمامی محصولات با دقت و به بهترین شکل ممکن بسته‌بندی می‌شوند تا در طول مسیر آسیبی به آن‌ها وارد نشود.</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-1 shrink-0" />
                <span>تأیید آدرس: لطفاً در هنگام ثبت سفارش، آدرس دقیق پستی و کد پستی خود را به همراه شماره تماس معتبر وارد نمایید.</span>
              </li>
              <li className="flex items-start gap-2">
                <Truck size={14} className="mt-1 shrink-0" />
                <span>رهگیری سفارش: پس از ارسال، کد رهگیری مرسوله برای شما ارسال خواهد شد.</span>
              </li>
            </ul>
          </div>
        </div>
    </section>
  );
}