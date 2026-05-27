'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/CartStore';
import CartProducts from './CartProducts';
import CartInfo from './CartInfo';
import CartPayment from './CartPayment';

type Props = {
    initialItems: any[];
    initialTotalPrice: number;
    isLoggedIn: boolean;
};

type TabType = 'products' | 'info' | 'payment';

export default function CartClient({ initialItems, initialTotalPrice, isLoggedIn }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeTab = (searchParams.get('step') as TabType) || 'products';

    const { items, totalPrice } = useCartStore();  // ← فقط اینارو استفاده کن
    const [formData, setFormData] = useState({});

    const displayItems = items.length > 0 ? items : initialItems;
    const displayTotal = totalPrice > 0 ? totalPrice : initialTotalPrice;

    const changeTab = (tab: TabType) => {
        router.push(`/cart?step=${tab}`);
    };

    const hasFish = items.some(item =>
        item.title?.includes('ماهی')
    );

    // تب محصولات
    if (activeTab === 'products') {
        return (
            <CartProducts
                items={displayItems}
                totalPrice={displayTotal}
                isLoggedIn={isLoggedIn}
                onNext={() => changeTab('info')}
            />
        );
    }

    // تب اطلاعات کاربر
    if (activeTab === 'info') {
        return (
            <CartInfo
                formData={formData}
                setFormData={setFormData}
                onNext={() => changeTab('payment')}
                onBack={() => changeTab('products')}
                hasFish={hasFish}
            />
        );
    }

    // تب پرداخت
    return (
        <CartPayment
            items={displayItems}
            totalPrice={displayTotal}
            isLoggedIn={isLoggedIn}
            formData={formData}
            onBack={() => changeTab('info')}
        />
    );
}