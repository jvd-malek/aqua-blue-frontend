// hooks/useCart.ts

'use client';

import { useCallback } from 'react';
import { useCartStore } from '@/stores/CartStore';
import type { AddToCartPayload } from '@/types/cart';
import { notify } from '@/utils/notify';

/**
 * هوک سفارشی برای کار با سبد خرید
 * همه عملیات‌های سبد خرید رو در یک جا جمع کرده
 */
export const useCart = () => {
    const {
        items,
        isLoading,
        totalItems,
        totalPrice,
        fetchCart,
        addItem,
        removeItem,
        updateCount,
        clearCart,
    } = useCartStore();

    // افزودن محصول با اعتبارسنجی سریع
    const addToCart = useCallback(
        async (payload: AddToCartPayload) => {
            // اعتبارسنجی موجودی
            if (payload.showCount <= 0) {
                notify('این محصول در حال حاضر موجود نیست', 'error');
                return;
            }

            await addItem(payload);
        },
        [addItem]
    );

    // حذف محصول
    const removeFromCart = useCallback(
        async (cartId: string) => {
            await removeItem(cartId);
        },
        [removeItem]
    );

    // تغییر تعداد
    const changeCount = useCallback(
        async (cartId: string, count: number) => {
            if (count < 1) {
                await removeFromCart(cartId);
                return;
            }
            await updateCount(cartId, count);
        },
        [updateCount, removeFromCart]
    );

    // بررسی وجود محصول در سبد خرید (با productId)
    const isInCart = useCallback(
        (productId: string) => {
            return items.some(item => item.productId === productId);
        },
        [items]
    );

    // دریافت آیتم از سبد خرید (با productId)
    const getCartItem = useCallback(
        (productId: string) => {
            return items.find(item => item.productId === productId);
        },
        [items]
    );

    // دریافت تعداد یک محصول در سبد خرید
    const getItemCount = useCallback(
        (productId: string) => {
            const item = items.find(i => i.productId === productId);
            return item?.count || 0;
        },
        [items]
    );

    // این تابع جدید برای افزایش/کاهش مستقیم با productId
    const updateProductCount = useCallback(
        async (productId: string, newCount: number) => {
            const item = getCartItem(productId);
            if (!item) return;

            if (newCount < 1) {
                await removeFromCart(item.cartId);
            } else {
                await updateCount(item.cartId, newCount);
            }
        },
        [getCartItem, removeFromCart, updateCount]
    );

    return {
        // State
        items,
        isLoading,
        totalItems,
        totalPrice,
        isEmpty: items.length === 0,

        // Actions
        fetchCart,
        addToCart,
        removeFromCart,
        changeCount,
        updateCount,
        clearCart,

        // Helpers
        isInCart,
        getCartItem,
        getItemCount,
        updateProductCount
    };
};