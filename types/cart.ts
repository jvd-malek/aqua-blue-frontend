// types/cart.ts

/**
 * آیتم سبد خرید در سمت کلاینت
 * این تایپ برای استفاده در Zustand store و کامپوننت‌هاست
 */
export type CartItem = {
  /** شناسه رکورد در دیتابیس (برای عملیات DELETE و PUT) */
  cartId: string;
  
  /** شناسه محصول */
  productId: string;
  
  /** عنوان محصول */
  title: string;
  
  /** قیمت اصلی */
  price: number;
  
  /** قیمت نهایی بعد از تخفیف */
  finalPrice: number;
  
  /** درصد تخفیف */
  discountPercent: number;
  
  /** تعداد در سبد خرید */
  count: number;
  
  /** موجودی انبار */
  showCount: number;
  
  /** آدرس تصویر محصول */
  cover: string;
};

/**
 * پارامترهای مورد نیاز برای افزودن به سبد خرید
 */
export type AddToCartPayload = {
  productId: string;
  title: string;
  price: number;
  finalPrice: number;
  discountPercent: number;
  showCount: number;
  cover: string;
  count?: number; // اختیاری، پیش‌فرض 1
};

/**
 * پاسخ سرور برای دریافت سبد خرید
 */
export type CartResponse = {
  items: CartItem[];
  totalPrice: number;
  totalDiscount: number;
  totalWeight: number;
  success: boolean;
};

/**
 * پاسخ سرور برای عملیات افزودن به سبد خرید
 */
export type AddToCartResponse = {
  message: string;
  cartId?: string;
  success: boolean;
};