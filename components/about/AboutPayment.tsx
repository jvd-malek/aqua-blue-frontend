'use client';

import { useState } from 'react';
import { ChevronDown, CreditCard, Banknote, Truck, Shield, Lock } from 'lucide-react';

const paymentMethods = [
  {
    id: 'online',
    title: 'پرداخت آنلاین از طریق درگاه بانکی',
    icon: CreditCard,
    description: 'پس از نهایی کردن سفارش، به صفحه امن درگاه بانکی هدایت خواهید شد.',
    details: `با استفاده از کارت بانکی عضو شبکه شتاب و رمز دوم (پویا) خود، می‌توانید هزینه را به صورت کاملاً امن از درگاه زرین‌پال پرداخت کنید.
پس از تکمیل پرداخت، سفارش شما ثبت نهایی شده و به مراحل آماده‌سازی ارسال می‌شود.`,
  },
  {
    id: 'cart-to-cart',
    title: 'پرداخت کارت به کارت',
    icon: Banknote,
    description: 'در صورتی که تمایل به استفاده از روش پرداخت کارت به کارت دارید، می‌توانید مبلغ سفارش را با هماهنگی پشتیبانی انجام دهید.',
    details: `پس از انجام انتقال وجه، لطفاً از طریق بخش ارتباط با ما در انتهای سایت، اطلاعات پرداخت خود (شامل: شماره پیگیری، تاریخ و ساعت تراکنش، و مبلغ واریزی) را به ما اطلاع دهید تا سفارش شما پردازش شود.`,
  },
  {
    id: 'cod',
    title: 'پرداخت در محل (فقط تهران - با هماهنگی قبلی)',
    icon: Truck,
    description: 'این گزینه تنها برای سفارش‌های داخل شهر تهران و پس از هماهنگی قبلی با تیم پشتیبانی مقدور است.',
    details: 'لطفاً قبل از نهایی کردن سفارش، با ما تماس بگیرید تا هماهنگی‌های لازم انجام شود.',
  },
];

export default function AboutPayment() {
  const [openId, setOpenId] = useState<string | null>('online');

  const toggleOpen = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 md:py-20">
      <div className="text-center mb-12">
        <h2 className="section-title text-2xl md:text-3xl font-bold mb-4">
          شرایط و روش‌های پرداخت
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          در فروشگاه ما، تلاش کرده‌ایم تا فرآیند پرداخت را برای شما تا حد امکان آسان و امن کنیم
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {paymentMethods.map((method) => {
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
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    {method.title}
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
                <div className="px-5 pb-5 pt-2 text-gray-600 dark:text-gray-400 leading-7 border-t border-gray-200 dark:border-gray-700">
                  <p className="mb-3">{method.description}</p>
                  <p className="whitespace-pre-line text-sm">{method.details}</p>
                </div>
              )}
            </div>
          );
        })}

        {/* نکات مهم */}
        <div className="mt-6 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={18} className="text-blue-600" />
            <h4 className="font-bold text-blue-800 dark:text-blue-300">نکات مهم در خصوص روش پرداخت</h4>
          </div>
          <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-2">
            <li className="flex items-start gap-2">
              <Lock size={14} className="mt-1 shrink-0" />
              <span>امنیت پرداخت: تمامی تراکنش‌های آنلاین از طریق درگاه‌های امن بانکی (زرین‌پال) انجام می‌شود و اطلاعات کارت شما نزد ما محفوظ خواهد ماند.</span>
            </li>
            <li>• اطمینان از مبلغ: لطفاً پیش از پرداخت، از صحت اطلاعات سفارش و مبلغ نهایی اطمینان حاصل فرمایید.</li>
            <li>• پشتیبانی: در صورت بروز هرگونه مشکل یا نیاز به راهنمایی در فرآیند پرداخت، تیم پشتیبانی ما آماده پاسخگویی به شماست.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}