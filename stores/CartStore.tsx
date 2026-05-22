// stores/CartStore.ts

'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, AddToCartPayload } from '@/types/cart';
import { notify } from '@/utils/notify';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3815/api';

// ============================================
// Helper Functions
// ============================================

const calculateTotalItems = (items: CartItem[]) => {
  return items.reduce((sum, item) => sum + item.count, 0);
};

const createTempId = () => `temp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

// ============================================
// API Functions
// ============================================

async function apiFetch<T>(
  endpoint: string, 
  options?: { method?: string; body?: any }
): Promise<T | null> {
  try {
    const isDelete = options?.method === 'DELETE';
    
    const res = await fetch(`${API_URL}${endpoint}`, {
      credentials: 'include',
      headers: !isDelete ? { 'Content-Type': 'application/json' } : undefined,
      ...options,
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await res.json();

    if (!res.ok) {
      notify(data.message || 'خطا در ارتباط با سرور', 'error');
      return null;
    }

    return data as T;
  } catch {
    notify('خطا در ارتباط با سرور', 'error');
    return null;
  }
}

// ============================================
// Types
// ============================================

type FetchCartResponse = {
  items: CartItem[];
  totalPrice: number;
  totalDiscount: number;
  totalWeight: number;
  success: boolean;
};

type AddToCartResponse = {
  message: string;
  cartId?: string;
  success: boolean;
};

type CartStore = {
  // State
  items: CartItem[];
  isLoading: boolean;
  totalItems: number;
  totalPrice: number;
  
  // Actions
  fetchCart: () => Promise<void>;
  addItem: (payload: AddToCartPayload) => Promise<void>;
  removeItem: (cartId: string) => Promise<void>;
  updateCount: (cartId: string, count: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncLocalCartWithServer: () => Promise<void>;
};

// ============================================
// Store
// ============================================

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // ========== Initial State ==========
      items: [],
      isLoading: false,
      totalItems: 0,
      totalPrice: 0,

      // ========== Fetch Cart from Server ==========
      fetchCart: async () => {
        set({ isLoading: true });
        const data = await apiFetch<FetchCartResponse>('/user/cart');
        
        if (data?.items) {
          set({
            items: data.items,
            totalItems: calculateTotalItems(data.items),
            totalPrice: data.totalPrice,
            isLoading: false,
          });
        } else {
          set({ isLoading: false });
        }
      },

      // ========== Sync Local Cart with Server ==========
      syncLocalCartWithServer: async () => {
        const { items } = get();
        const tempItems = items.filter(i => i.cartId.startsWith('temp-'));
        
        if (tempItems.length === 0) return;
        
        set({ isLoading: true });
        
        try {
          // Check if user is logged in
          const meRes = await fetch(`${API_URL}/user/me`, {
            credentials: 'include',
          });
          
          if (meRes.ok) {
            // User is logged in - sync each temp item to server
            for (const item of tempItems) {
              const result = await apiFetch<AddToCartResponse>('/user/cart', {
                method: 'POST',
                body: JSON.stringify({ productId: item.productId, count: item.count }),
              });
              
              if (result?.cartId) {
                const updatedItems = get().items.map(i =>
                  i.cartId === item.cartId ? { ...i, cartId: result.cartId! } : i
                );
                set({
                  items: updatedItems,
                  totalItems: calculateTotalItems(updatedItems),
                  totalPrice: updatedItems.reduce((sum, i) => sum + i.finalPrice * i.count, 0),
                });
              }
            }
            
            // Refresh cart from server after sync
            await get().fetchCart();
          }
        } catch (error) {
          console.error('Sync error:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      // ========== Add Item ==========
      addItem: async (payload) => {
        const { items } = get();
        const existing = items.find(i => i.productId === payload.productId);

        let newItems: CartItem[];
        
        if (existing) {
          newItems = items.map(i =>
            i.productId === payload.productId
              ? { ...i, count: Math.min(i.count + 1, payload.showCount) }
              : i
          );
        } else {
          newItems = [...items, {
            cartId: createTempId(),
            productId: payload.productId,
            title: payload.title,
            price: payload.price,
            finalPrice: payload.finalPrice,
            discountPercent: payload.discountPercent,
            count: payload.count || 1,
            showCount: payload.showCount,
            cover: payload.cover,
          }];
        }

        set({
          items: newItems,
          totalItems: calculateTotalItems(newItems),
          totalPrice: newItems.reduce((sum, i) => sum + i.finalPrice * i.count, 0),
        });

        // Try to sync with server if user is logged in
        const meRes = await fetch(`${API_URL}/user/me`, { credentials: 'include' });
        if (meRes.ok) {
          await get().syncLocalCartWithServer();
        }
      },

      // ========== Remove Item ==========
      removeItem: async (cartId) => {
        const { items } = get();
        const newItems = items.filter(i => i.cartId !== cartId);
        
        set({
          items: newItems,
          totalItems: calculateTotalItems(newItems),
          totalPrice: newItems.reduce((sum, i) => sum + i.finalPrice * i.count, 0),
        });

        if (!cartId.startsWith('temp-')) {
          await apiFetch(`/user/cart/${cartId}`, { method: 'DELETE' });
        }
      },

      // ========== Update Count ==========
      updateCount: async (cartId, count) => {
        if (count < 1) {
          await get().removeItem(cartId);
          return;
        }

        const { items } = get();
        const item = items.find(i => i.cartId === cartId);
        if (!item) return;

        if (count > item.showCount) {
          notify('تعداد بیشتر از موجودی است', 'error');
          return;
        }

        const newItems = items.map(i =>
          i.cartId === cartId ? { ...i, count } : i
        );
        
        set({
          items: newItems,
          totalItems: calculateTotalItems(newItems),
          totalPrice: newItems.reduce((sum, i) => sum + i.finalPrice * i.count, 0),
        });

        if (!cartId.startsWith('temp-')) {
          await apiFetch(`/user/cart/${cartId}`, {
            method: 'PUT',
            body: JSON.stringify({ count }),
          });
        }
      },

      // ========== Clear Cart ==========
      clearCart: async () => {
        const { items } = get();
        set({ items: [], totalItems: 0, totalPrice: 0 });

        const realItems = items.filter(i => !i.cartId.startsWith('temp-'));
        for (const item of realItems) {
          await apiFetch(`/user/cart/${item.cartId}`, { method: 'DELETE' });
        }
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
      }),
    }
  )
);