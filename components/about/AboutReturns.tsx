'use client';

import { useState } from 'react';
import { ChevronDown, RefreshCw, AlertTriangle, Package, Phone, Clock } from 'lucide-react';

const returnItems = [
  {
    id: 'return-1',
    title: 'مهلت تست و بررسی',
    icon: Clock,
    details: `شما پس از دریافت کالا، به مدت ۷۲ ساعت فرصت دارید تا آن را به دقت بررسی و تست نمایید.
در طول این مهلت، در صورت مشاهده هرگونه نقص فنی یا مغایرت با مشخصات ذکر شده در سایت، می‌توانید درخواست مرجوعی کالا را ثبت کنید.`,
  },
  {
    id: 'return-2',
    title: 'شرایط مرجوعی کالا',
    icon: RefreshCw,
    details: `کالاهای معیوب یا آسیب‌دیده: اگر کالا در هنگام تحویل دارای نقص فنی، شکستگی، خراشیدگی یا هرگونه آسیب فیزیکی باشد، می‌توانید آن را مرجوع نمایید.
مغایرت با مشخصات: در صورتی که کالای دریافت شده با مشخصات فنی، ظاهری یا توضیحات ارائه شده در صفحه محصول مغایرت داشته باشد.`,
  },
  {
    id: 'return-3',
    title: 'کالاهای مشمول شرایط مرجوعی نمی‌شوند',
    icon: AlertTriangle,
    details: `کالاهایی که پلمپ آن‌ها باز شده است (مگر در مورد نقص فنی)
کالاهایی که مورد استفاده قرار گرفته‌اند (مگر در مورد نقص فنی)
کالاهای مصرفی پس از باز شدن پلمپ`,
  },
  {
    id: 'return-4',
    title: 'فرآیند ثبت درخواست مرجوعی',
    icon: Phone,
    details: `ابتدا با تیم پشتیبانی ما از طریق بخش ارتباط با ما در انتهای سایت و یا ارسال تیکت در پنل کاربری خود تماس بگیرید.
کارشناسان ما پس از بررسی اولیه، شما را راهنمایی خواهند کرد.
در صورت تأیید درخواست، دستورالعمل‌های لازم برای ارسال کالا به شما داده خواهد شد.`,
  },
];

export default function AboutReturns() {
  const [openId, setOpenId] = useState<string | null>('return-1');

  const toggleOpen = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 md:py-20">
      <div className="text-center mb-12">
        <h2 className="section-title text-2xl md:text-3xl font-bold mb-4">
          شرایط تست و مرجوعی کالا
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          ما رضایت شما را در اولویت قرار می‌دهیم و تلاش می‌کنیم تا محصولاتی با بالاترین کیفیت به دست شما برسانیم
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {returnItems.map((item) => {
          const Icon = item.icon;
          const isOpen = openId === item.id;

          return (
            <div
              key={item.id}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleOpen(item.id)}
                className="flex items-center justify-between w-full p-5 text-right hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Icon size={20} className="text-blue-500" />
                  </div>
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    {item.title}
                  </span>
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
                  <p className="whitespace-pre-line">{item.details}</p>
                </div>
              )}
            </div>
          );
        })}

        {/* نکات مهم */}
        <div className="mt-6 p-5 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl border border-yellow-100 dark:border-yellow-800">
          <div className="flex items-center gap-2 mb-3">
            <Package size={18} className="text-yellow-600" />
            <h4 className="font-bold text-yellow-800 dark:text-yellow-300">نکات مهم</h4>
          </div>
          <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-2">
            <li>• لطفاً قبل از ارسال کالا، حتماً با تیم پشتیبانی هماهنگ فرمایید.</li>
            <li>• کالاهای مرجوعی باید در بسته‌بندی اولیه خود و به همراه تمامی اقلام و فاکتور خرید ارسال شوند.</li>
            <li>• از نوشتن مستقیم بر روی بسته‌بندی اصلی کالا خودداری فرمایید.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}