// types/link.ts

/**
 * آیتم لینک/دسته‌بندی منو
 * اطلاعات از بک‌اند میاد و sort و subLinks به آرایه تبدیل شدن
 */
export type LinkItem = {
  id: string;
  txt: string;           // متن نمایشی لینک
  path: string;          // آدرس لینک
  sort: number[];        // آرایه اعداد برای ترتیب نمایش (از JSON.parse میاد)
  subLinks: string[];    // آرایه آیدی‌های زیرمنوها (از JSON.parse میاد)
  createdAt: number;
  updatedAt: number;
};

/**
 * پاسخ سرور برای دریافت لیست لینک‌ها
 */
export type LinksResponse = {
  items: LinkItem[];
  success: boolean;
};

/**
 * پارامترهای ساخت لینک جدید (برای ادمین)
 */
export type CreateLinkPayload = {
  txt: string;
  path: string;
  sort?: number[];
  subLinks?: string[];
};

/**
 * پارامترهای ویرایش لینک (برای ادمین)
 */
export type UpdateLinkPayload = Partial<CreateLinkPayload>;