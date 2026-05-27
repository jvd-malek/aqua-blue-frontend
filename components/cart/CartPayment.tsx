// components/cart/CartPayment.tsx

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronRight, Copy, Check, CreditCard, ReceiptText, PhoneCall } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { notify } from '@/utils/notify';

type Props = {
  items: any[];
  totalPrice: number;
  isLoggedIn: boolean;
  formData: any;
  onBack: () => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3815/api';
const UPLOADS_URL = API_URL.replace('/api', '') + '/uploads';

export default function CartPayment({ items, totalPrice, isLoggedIn, formData, onBack }: Props) {
  const { clearCart } = useCart();
  const [isCopied, setIsCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCopy = () => {
    const receiptText = generateReceiptText();
    navigator.clipboard.writeText(receiptText);
    setIsCopied(true);
    notify('رسید کپی شد', 'success');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const generateReceiptText = () => {
    const date = new Date().toLocaleDateString('fa-IR');
    let text = `🏷️ رسید خرید Aqua Blue\n`;
    text += `📅 تاریخ: ${date}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `👤 نام: ${formData.fullName}\n`;
    text += `📞 تلفن: ${formData.phone}\n`;
    text += `📍 آدرس: ${formData.province}، ${formData.city}، ${formData.address}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `🛒 محصولات:\n`;
    
    items.forEach((item, idx) => {
      const itemTotal = item.finalPrice * item.count;
      text += `${idx + 1}. ${item.title} × ${item.count} = ${itemTotal.toLocaleString('fa-IR')} تومان\n`;
    });
    
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💰 جمع کل: ${totalPrice.toLocaleString('fa-IR')} تومان\n`;
    text += `🚚 هزینه ارسال: پس از هماهنگی\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💎 مبلغ قابل پرداخت: ${totalPrice.toLocaleString('fa-IR')} تومان (به اضافه هزینه ارسال)\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `✅ Aqua Blue | فروشگاه تخصصی ماهی و آکواریوم\n`;
    text += `🌐 aquablueiran.com\n`;
    
    return text;
  };

  const handlePayment = async () => {
    if (!isLoggedIn) {
      notify('لطفا ابتدا وارد حساب کاربری خود شوید', 'error');
      return;
    }

    setIsProcessing(true);
    
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submition: formData.shippingMethod === 'courier' ? 'پیک' : 
                     formData.shippingMethod === 'trucking' ? 'باربری' : 'پست',
          address: {
            fullName: formData.fullName,
            phone: formData.phone,
            province: formData.province,
            city: formData.city,
            address: formData.address,
            postalCode: formData.postalCode,
          },
        }),
      });

      const data = await res.json();

      if (data.success && data.paymentURL) {
        clearCart();
        window.location.href = data.paymentURL;
      } else {
        notify(data.message || 'خطا در ثبت سفارش', 'error');
      }
    } catch (error) {
      notify('خطا در ارتباط با سرور', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCall = () => {
    window.location.href = 'tel:09934242315';
  };

  return (
    <div className="space-y-6">
      
      {/* رسید خرید */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 md:p-6">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <ReceiptText size={22} />
            رسید خرید
          </h2>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm transition-colors"
          >
            {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            کپی رسید
          </button>
        </div>

        {/* اطلاعات گیرنده */}
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">اطلاعات گیرنده:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <p><span className="text-gray-500">نام:</span> {formData.fullName}</p>
            <p><span className="text-gray-500">تلفن:</span> {formData.phone}</p>
            <p className="sm:col-span-2"><span className="text-gray-500">آدرس:</span> {formData.province}، {formData.city}، {formData.address}</p>
            <p><span className="text-gray-500">کد پستی:</span> {formData.postalCode}</p>
            <p><span className="text-gray-500">روش ارسال:</span> {
              formData.shippingMethod === 'courier' ? 'پیک (اسنپ/تپسی)' :
              formData.shippingMethod === 'trucking' ? 'باربری' :
              formData.shippingMethod === 'post' ? 'پست پیشتاز' : 'تیپاکس'
            }</p>
          </div>
        </div>

        {/* لیست محصولات */}
        <div className="space-y-3 mb-4">
          <p className="font-medium text-gray-800 dark:text-gray-200">محصولات:</p>
          {items.map((item) => {
            const imageUrl = item.cover ? `${UPLOADS_URL}/${item.cover}` : null;
            const itemTotal = item.finalPrice * item.count;
            
            return (
              <div key={item.cartId} className="flex gap-3 p-2 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0">
                  {imageUrl ? (
                    <Image src={imageUrl} alt={item.title} width={48} height={48} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg">🐟</div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.count} × {item.finalPrice.toLocaleString('fa-IR')} تومان</p>
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm">{itemTotal.toLocaleString('fa-IR')} تومان</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* جمع کل */}
        <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">جمع کل محصولات:</span>
            <span>{totalPrice.toLocaleString('fa-IR')} تومان</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">هزینه ارسال:</span>
            <span className="text-yellow-600">پس از هماهنگی</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
            <span>مبلغ قابل پرداخت:</span>
            <span className="text-blue-600">{totalPrice.toLocaleString('fa-IR')} تومان + هزینه ارسال</span>
          </div>
        </div>
      </div>

      {/* دکمه تماس برای هماهنگی ارسال */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-4 border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-center gap-3 mb-3">
          <PhoneCall size={24} className="text-yellow-600" />
          <h3 className="font-bold text-yellow-800 dark:text-yellow-300">هماهنگی ارسال</h3>
        </div>
        <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-3">
          هزینه ارسال بر اساس روش انتخابی و موقعیت مکانی شما محاسبه می‌شود.
          لطفاً برای هماهنگی نهایی ارسال با ما تماس بگیرید.
        </p>
        <button
          onClick={handleCall}
          className="flex items-center justify-center gap-2 w-full py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-all font-medium"
        >
          <PhoneCall size={18} />
          هماهنگی برای ارسال
        </button>
      </div>

      {/* دکمه‌ها */}
      <div className="flex justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
        >
          <ChevronRight size={18} />
          بازگشت
        </button>
        
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold transition-all hover:scale-105 disabled:opacity-70"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              در حال انتقال...
            </>
          ) : (
            <>
              <CreditCard size={18} />
              ثبت سفارش و تماس برای هماهنگی
            </>
          )}
        </button>
      </div>

      {/* نکات امنیتی */}
      <div className="text-center text-xs text-gray-400">
        <p>پرداخت امن از طریق درگاه زرین‌پال</p>
        <p>پس از ثبت سفارش، همکاران ما برای هماهنگی ارسال با شما تماس می‌گیرند</p>
      </div>
    </div>
  );
}