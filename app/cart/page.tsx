import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/product/Breadcrumb';
import CartClient from '@/components/cart/CartClient';
import { serverFetch } from '@/lib/server-fetch';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
    title: 'سبد خرید',
    description: 'مشاهده و مدیریت سبد خرید، تکمیل اطلاعات و پرداخت',
    robots: { index: false, follow: true },
};

async function getCartData() {
    const cookieJar = await cookies();
    const token = cookieJar.get('token')?.value;

    // تلاش برای دریافت از سرور (کاربر لاگین)
    if (token) {
        const res = await serverFetch<{ items: any[]; totalPrice: number }>('/user/cart');
        if (res.success && res.data) {
            return {
                items: res.data.items || [],
                totalPrice: res.data.totalPrice || 0,
                isLoggedIn: true,
            };
        }
    }

    // دریافت از کوکی (کاربر مهمان)
    const localCart = cookieJar.get('cart-storage')?.value;
    let localItems: any[] = [];

    if (localCart) {
        try {
            const parsed = JSON.parse(localCart);
            localItems = parsed.state?.items || [];
        } catch {
            localItems = [];
        }
    }

    const totalPrice = localItems.reduce((sum, i) => sum + (i.finalPrice * i.count), 0);

    return {
        items: localItems,
        totalPrice,
        isLoggedIn: false,
    };
}

export default async function CartPage() {
    const { items, totalPrice, isLoggedIn } = await getCartData();

    return (
        <>
            <Header />

            <main className="container mx-auto px-3 py-6 relative z-10">

                <Breadcrumb title="سبد خرید" />

                <div className="mt-6">
                    <h1 className="hero-title text-2xl md:text-3xl font-bold mb-6" data-text="سبد خرید">
                        سبد خرید
                    </h1>

                    <Suspense fallback={<div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />}>
                        <CartClient
                            initialItems={items}
                            initialTotalPrice={totalPrice}
                            isLoggedIn={isLoggedIn}
                        />
                    </Suspense>
                </div>
            </main>

            <Footer />
        </>
    );
}