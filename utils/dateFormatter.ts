// utils/dateFormatter.ts

interface DateFormatOptions {
    showTime?: boolean;
    showSeconds?: boolean;
    showDay?: boolean;
    showMonth?: boolean;
    showYear?: boolean;
}

/**
 * تبدیل timestamp یا Date به تاریخ شمسی
 * @param input - می‌تواند number (timestamp)، Date، string یا null/undefined باشد
 * @param options - تنظیمات نمایش
 */
export const formatPersianDate = (
    input: number | Date | string | null | undefined,
    options: DateFormatOptions = {}
): string => {
    if (!input) return '';
    
    const {
        showTime = false,
        showSeconds = false,
        showDay = true,
        showMonth = true,
        showYear = true
    } = options;
    
    let date: Date;
    
    // تبدیل انواع مختلف به Date
    if (input instanceof Date) {
        date = input;
    } else if (typeof input === 'number') {
        date = new Date(input);
    } else if (typeof input === 'string') {
        date = new Date(input);
        // اگر string نتوانست به Date تبدیل شود، امتحان کن به عدد تبدیل شود
        if (isNaN(date.getTime())) {
            const num = Number(input);
            if (!isNaN(num)) {
                date = new Date(num);
            }
        }
    } else {
        return '';
    }
    
    // اعتبارسنجی تاریخ
    if (isNaN(date.getTime())) {
        return String(input);
    }
    
    try {
        // فقط تاریخ
        if (!showTime) {
            const dateOptions: Intl.DateTimeFormatOptions = {};
            
            if (showDay) dateOptions.day = 'numeric';
            if (showMonth) dateOptions.month = 'long';
            if (showYear) dateOptions.year = 'numeric';
            
            return new Intl.DateTimeFormat('fa-IR', dateOptions).format(date);
        }
        
        // تاریخ با ساعت
        const dateTimeOptions: Intl.DateTimeFormatOptions = {};
        
        if (showDay) dateTimeOptions.day = 'numeric';
        if (showMonth) dateTimeOptions.month = 'long';
        if (showYear) dateTimeOptions.year = 'numeric';
        
        dateTimeOptions.hour = '2-digit';
        dateTimeOptions.minute = '2-digit';
        
        if (showSeconds) {
            dateTimeOptions.second = '2-digit';
        }
        
        return new Intl.DateTimeFormat('fa-IR', dateTimeOptions).format(date);
    } catch {
        return date.toLocaleString('fa-IR');
    }
};

// توابع کمکی برای موارد پرکاربرد
export const formatDate = (input: Parameters<typeof formatPersianDate>[0]) => 
    formatPersianDate(input);

export const formatDateTime = (input: Parameters<typeof formatPersianDate>[0]) => 
    formatPersianDate(input, { showTime: true });

export const formatDateTimeWithSeconds = (input: Parameters<typeof formatPersianDate>[0]) => 
    formatPersianDate(input, { showTime: true, showSeconds: true });

export const formatMonthYear = (input: Parameters<typeof formatPersianDate>[0]) => 
    formatPersianDate(input, { showDay: false });

export const formatDayMonth = (input: Parameters<typeof formatPersianDate>[0]) => 
    formatPersianDate(input, { showYear: false });

/**
 * تبدیل تاریخ به فرمت ISO (برای ارسال به بک‌اند)
 */
export const toISOString = (date: Date): string => {
    return date.toISOString();
};

/**
 * تبدیل timestamp به Date
 */
export const timestampToDate = (timestamp: number): Date => {
    return new Date(timestamp);
};

/**
 * تبدیل تاریخ بک‌اند (Date object) به timestamp
 */
export const dateToTimestamp = (date: Date): number => {
    return date.getTime();
};

// utils/dateFormatter.ts

export const getDaysLeft = (expireAt: Date | string | number | null | undefined): number | null => {
    if (!expireAt) return null;
    
    // تبدیل به timestamp عددی
    let expireTime: number;
    
    if (expireAt instanceof Date) {
        expireTime = expireAt.getTime();
    } else if (typeof expireAt === 'string') {
        expireTime = new Date(expireAt).getTime();
    } else if (typeof expireAt === 'number') {
        expireTime = expireAt;
    } else {
        return null;
    }
    
    // اگر تاریخ منقضی شده باشه
    if (isNaN(expireTime)) return null;
    
    const now = Date.now();
    const diff = expireTime - now;
    
    if (diff <= 0) return null;
    
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
};