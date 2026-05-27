// components/shared/UserAddressForm.tsx

'use client';

import { useState, useEffect } from 'react';
import { PhoneCall, Shield, AlertCircle } from 'lucide-react';
import { Input, handleFormValidator } from '@/components/ui/Input';
import { PROVINCES } from '@/constants/provinces';
import { notify } from '@/utils/notify';
import { useGet } from '@/lib/client-swr';
import type { formType } from '@/types';

type Props = {
    initialData?: {
        fullName?: string;
        phone?: string;
        province?: string;
        city?: string;
        address?: string;
        postalCode?: string;
        shippingMethod?: string;
    };
    isLoggedIn?: boolean;
    userPhone?: string;
    userFullName?: string;
    showShippingMethod?: boolean;
    onSubmit: (data: any) => void;
    submitButtonText?: string;
    onBack?: () => void;
    hasFish?: boolean;
};

// لیست کامل روش‌های ارسال با شرایط دقیق (طبق جدول)
const ALL_SHIPPING_METHODS = [
    {
        id: 'courier',
        name: 'ارسال با پیک (اسنپ/تپسی)',
        description: 'ارسال درب منزل در تهران',
        // تهران: همیشه فعال (چه ماهی داشته باشه چه نداشته باشه)
        isAvailable: (province: string, hasFish: boolean) => province === 'تهران',
    },
    {
        id: 'trucking',
        name: 'ارسال با باربری',
        description: 'مناسب برای ارسال به شهرستان‌ها',
        // شهرستان: همیشه فعال (چه ماهی داشته باشه چه نداشته باشه)
        isAvailable: (province: string, hasFish: boolean) => province !== 'تهران' && province !== '',
    },
    {
        id: 'post',
        name: 'پست پیشتاز',
        description: '۳ تا ۵ روز کاری',
        // فقط زمانی فعال که ماهی نداشته باشه (هم در تهران هم در شهرستان)
        isAvailable: (province: string, hasFish: boolean) => !hasFish,
    },
    {
        id: 'tipax',
        name: 'تیپاکس',
        description: '۲ تا ۳ روز کاری',
        // فقط زمانی فعال که ماهی نداشته باشه (هم در تهران هم در شهرستان)
        isAvailable: (province: string, hasFish: boolean) => !hasFish,
    },
];

export default function UserAddressForm({
    initialData = {},
    isLoggedIn = false,
    userPhone,
    userFullName,
    showShippingMethod = true,
    onSubmit,
    submitButtonText = 'ادامه و پرداخت',
    onBack,
    hasFish = false,
}: Props) {
    // دریافت اطلاعات کاربر از سرور (برای پر کردن خودکار)
    const { data: userData, isLoading: userLoading } = useGet<{ user: any }>('/user/me');
    const user = userData?.user;

    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const [shippingMethod, setShippingMethod] = useState(initialData.shippingMethod || '');
    const [cities, setCities] = useState<string[]>([]);

    // فرم فیلدها با استفاده از formType - مقداردهی اولیه با اولویت
    const getInitialValue = (fieldName: string) => {
        if (initialData[fieldName as keyof typeof initialData]) {
            return initialData[fieldName as keyof typeof initialData] || '';
        }
        if (fieldName === 'fullName' && userFullName) return userFullName;
        if (fieldName === 'phone' && userPhone) return userPhone;
        if (fieldName === 'province' && user?.province) return user.province;
        if (fieldName === 'city' && user?.city) return user.city;
        if (fieldName === 'address' && user?.address) return user.address;
        if (fieldName === 'postalCode' && user?.postalCode) return String(user.postalCode);
        return '';
    };

    const [formData, setFormData] = useState<formType[]>([
        {
            name: "fullName",
            type: "text",
            value: getInitialValue('fullName'),
            validateRule: (val: string) => val.trim().length >= 3,
            error: false,
            errorMessage: "نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد"
        },
        {
            name: "phone",
            type: "tel",
            value: getInitialValue('phone'),
            validateRule: (val: string) => /^09\d{9}$/.test(val),
            error: false,
            errorMessage: "شماره همراه معتبر نیست (۱۱ رقم و با 09 شروع شود)"
        },
        {
            name: "province",
            type: "select",
            value: getInitialValue('province'),
            validateRule: (val: string) => val !== '',
            error: false,
            errorMessage: "لطفاً استان را انتخاب کنید"
        },
        {
            name: "city",
            type: "select",
            value: getInitialValue('city'),
            validateRule: (val: string) => val !== '',
            error: false,
            errorMessage: "لطفاً شهر را انتخاب کنید"
        },
        {
            name: "address",
            type: "textarea",
            value: getInitialValue('address'),
            validateRule: (val: string) => val.trim().length >= 5,
            error: false,
            errorMessage: "آدرس باید حداقل ۵ کاراکتر باشد"
        },
        {
            name: "postalCode",
            type: "text",
            value: getInitialValue('postalCode'),
            validateRule: (val: string) => /^\d{10}$/.test(val),
            error: false,
            errorMessage: "کد پستی معتبر نیست (۱۰ رقم)"
        },
    ]);

    // همگام‌سازی province و city با فرم
    useEffect(() => {
        const provinceField = formData.find(f => f.name === 'province');
        const cityField = formData.find(f => f.name === 'city');
        if (provinceField && provinceField.value !== province) {
            setProvince(provinceField.value as string);
        }
        if (cityField && cityField.value !== city) {
            setCity(cityField.value as string);
        }
    }, [formData, province, city]);

    // به‌روزرسانی شهرها وقتی استان تغییر میکنه
    useEffect(() => {
        if (province) {
            const selectedProvince = PROVINCES.find(p => p.name === province);
            if (selectedProvince) {
                setCities(selectedProvince.cities);
                // اگه شهر فعلی در لیست شهرهای جدید نیست، ریست کن
                if (city && !selectedProvince.cities.includes(city)) {
                    setCity('');
                    setFormData(prev => prev.map(f =>
                        f.name === 'city' ? { ...f, value: '' } : f
                    ));
                }
            } else {
                setCities([]);
            }
        } else {
            setCities([]);
        }
    }, [province]);

    // فیلتر روش‌های ارسال فعال بر اساس شرایط (طبق جدول)
    const availableMethods = ALL_SHIPPING_METHODS.filter(method =>
        method.isAvailable(province, hasFish)
    );

    // بررسی اینکه آیا روش انتخابی فعلی هنوز فعال است
    useEffect(() => {
        if (shippingMethod && !availableMethods.find(m => m.id === shippingMethod)) {
            setShippingMethod('');
        }
    }, [province, hasFish, shippingMethod, availableMethods]);

    const handleSubmit = () => {
        const validatedFormData = formData.map(field => {
            if (field.validateRule && !field.validateRule(field.value)) {
                return { ...field, error: true };
            }
            return { ...field, error: false };
        });

        setFormData(validatedFormData);

        // حالا از handleFormValidator استفاده کن
        if (!handleFormValidator(validatedFormData)) return;

        const fullNameField = formData.find(f => f.name === 'fullName');
        const phoneField = formData.find(f => f.name === 'phone');
        const addressField = formData.find(f => f.name === 'address');
        const postalCodeField = formData.find(f => f.name === 'postalCode');

        if (availableMethods.length > 0 && !shippingMethod) {
            notify('لطفاً روش ارسال را انتخاب کنید', 'error');
            return;
        }

        onSubmit({
            fullName: fullNameField?.value,
            phone: phoneField?.value,
            province,
            city,
            address: addressField?.value,
            postalCode: postalCodeField?.value,
            shippingMethod,
        });
    };

    const handleCall = () => {
        window.location.href = 'tel:09934242315';
    };

    // گزینه‌های استان و شهر
    const provinceOptions = [{ value: "", label: "انتخاب استان" }, ...PROVINCES.map(p => ({ value: p.name, label: p.name }))];
    const cityOptions = [{ value: "", label: "انتخاب شهر" }, ...cities.map(c => ({ value: c, label: c }))];

    // پیدا کردن فیلدهای فرم
    const fullNameField = formData.find(f => f.name === 'fullName')!;
    const phoneField = formData.find(f => f.name === 'phone')!;
    const provinceField = formData.find(f => f.name === 'province')!;
    const cityField = formData.find(f => f.name === 'city')!;
    const addressField = formData.find(f => f.name === 'address')!;
    const postalCodeField = formData.find(f => f.name === 'postalCode')!;

    return (
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 md:p-6">

            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
                اطلاعات تحویل سفارش
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* سمت راست - فرم اطلاعات */}
                <div className="space-y-4">
                    <Input
                        id="fullName"
                        label="نام و نام خانوادگی"
                        form={fullNameField}
                        setForm={setFormData}
                        placeholder="مثال: جواد ملکیان"
                        required
                    />

                    <Input
                        id="phone"
                        label="شماره موبایل"
                        form={phoneField}
                        setForm={setFormData}
                        placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                        required
                        disabled={isLoggedIn && !!userPhone}
                    />
                    {isLoggedIn && userPhone && (
                        <p className="text-xs text-gray-400 -mt-2">این شماره با حساب کاربری شما مرتبط است</p>
                    )}

                    <Input
                        id="province"
                        label="استان"
                        type="select"
                        form={provinceField}
                        setForm={setFormData}
                        options={provinceOptions}
                        required
                    />

                    <Input
                        id="city"
                        label="شهر"
                        type="select"
                        form={cityField}
                        setForm={setFormData}
                        options={cityOptions}
                        disabled={!province}
                        required
                    />

                    <Input
                        id="address"
                        label="آدرس کامل"
                        type="textarea"
                        form={addressField}
                        setForm={setFormData}
                        placeholder="خیابان، کوچه، پلاک، واحد..."
                        required
                    />

                    <Input
                        id="postalCode"
                        label="کد پستی"
                        form={postalCodeField}
                        setForm={setFormData}
                        placeholder="۱۰ رقم"
                        required
                    />
                </div>

                {/* سمت چپ - روش ارسال */}
                {showShippingMethod && (
                    <div>
                        <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4">روش ارسال</h3>

                        {!province ? (
                            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-center text-gray-500">
                                لطفاً ابتدا استان را انتخاب کنید
                            </div>
                        ) : availableMethods.length === 0 ? (
                            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-center">
                                <AlertCircle size={32} className="text-yellow-500 mx-auto mb-2" />
                                <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-3">
                                    برای این منطقه و نوع محصول، روش ارسال نیاز به هماهنگی دارد
                                </p>
                                <button
                                    onClick={handleCall}
                                    className="flex items-center gap-2 mx-auto px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all"
                                >
                                    <PhoneCall size={16} />
                                    هماهنگی برای ارسال
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {availableMethods.map((method) => {
                                    const isSelected = shippingMethod === method.id;

                                    return (
                                        <button
                                            key={method.id}
                                            onClick={() => setShippingMethod(method.id)}
                                            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${isSelected
                                                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                                                }`}
                                        >
                                            <div className="text-right">
                                                <p className="font-medium text-gray-800 dark:text-gray-200">{method.name}</p>
                                                <p className="text-xs text-gray-400">{method.description}</p>
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-blue-600">هزینه پس از هماهنگی</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* دکمه هماهنگی */}
                        <div className="mt-4">
                            <button
                                onClick={handleCall}
                                className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                            >
                                <PhoneCall size={18} />
                                هماهنگی برای ارسال
                            </button>
                        </div>

                        {/* نکات مهم ارسال */}
                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <div className="flex items-center gap-2 mb-3">
                                <Shield size={18} className="text-blue-600" />
                                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">نکات مهم ارسال:</h4>
                            </div>
                            <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-2">
                                <li>✓ بار شما توسط سرویس‌های ارسالی معتبر بیمه می‌شود</li>
                                <li className="text-yellow-600 dark:text-yellow-400">⚠️ در صورت بروز هرگونه خسارت در حین حمل و نقل، مسئولیت با بیمه مربوطه بوده و شما مستقیماً با بیمه طرف هستید</li>
                                <li>✓ بسته‌بندی محصولات با بهترین کیفیت و استاندارد انجام می‌شود</li>
                                <li>✓ کد رهگیری پس از ارسال برای شما پیامک خواهد شد</li>
                                <li>✓ هماهنگی نهایی زمان ارسال از طریق تماس تلفنی انجام می‌شود</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* دکمه‌ها */}
            <div className="flex justify-between gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="flex btn-secondary items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                    >
                        بازگشت
                    </button>
                )}

                <button
                    onClick={handleSubmit}
                    className="flex btn-primary items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold transition-all hover:scale-105 ml-auto"
                >
                    {submitButtonText}
                </button>
            </div>
        </div>
    );
}