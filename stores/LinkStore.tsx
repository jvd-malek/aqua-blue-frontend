// stores/LinkStore.ts
'use client';

import { create } from 'zustand';
import type { LinkItem } from '@/types/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3815/api';

type LinkStore = {
    links: LinkItem[];
    isLoading: boolean;
    fetchLinks: () => Promise<void>;
    getMainLinks: () => LinkItem[];
    getSubLinks: (parentId: string) => LinkItem[];
    getCategoriesForBlog: () => { major: string; minor: string; label: string }[];
    getMainLinkByTxt: (txt: string) => LinkItem | undefined;
};

export const useLinkStore = create<LinkStore>((set, get) => ({
    links: [],
    isLoading: false,

    fetchLinks: async () => {
        const { links } = get();
        if (links.length > 0) return; // قبلاً دریافت شده

        set({ isLoading: true });
        try {
            const res = await fetch(`${API_URL}/links`, { credentials: 'include' });
            const data = await res.json();
            if (data.success && data.items) {
                set({ links: data.items, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            console.error('Error fetching links:', error);
            set({ isLoading: false });
        }
    },

    getMainLinks: () => {
        const { links } = get();
        return links.filter(link => link.sort?.[0] === 0);
    },

    getMainLinkByTxt: (txt: string) => {
        const { links } = get();
        return links.find(link => link.txt === txt && link.sort?.[0] === 0);
    },

    getSubLinks: (parentId: string) => {
        const { links } = get();
        const parent = links.find(l => l.id === parentId);
        if (!parent?.subLinks) return [];
        return parent.subLinks
            .map(subId => links.find(l => l.id === subId))
            .filter(Boolean) as LinkItem[];
    },

    // تبدیل لینک‌ها به فرمت مورد نیاز BoxHeader برای بلاگ
    getCategoriesForBlog: () => {
        const { links, getSubLinks } = get();

        // فقط لینک‌هایی که زیرمجموعه مجله هستن رو برمیگردونیم
        // فرض: یک لینک اصلی با txt='مجله' یا id='cat-magazine' داری
        const magazineMain = links.find(l => l.txt === 'مجله' || l.id.includes('magazine'));

        if (!magazineMain) {
            // fallback: همه لینک‌های اصلی با زیرمجموعه رو برگردون
            return get().getMainLinks().flatMap(main => {
                const subs = getSubLinks(main.id);
                if (subs.length === 0) return [];
                return subs.map(sub => ({
                    major: main.txt,
                    minor: sub.txt,
                    label: sub.txt,
                }));
            });
        }

        // زیرمجموعه‌های مجله رو بردار
        const subLinks = getSubLinks(magazineMain.id);
        return subLinks.map(sub => ({
            major: magazineMain.txt,
            minor: sub.txt,
            label: sub.txt,
        }));
    },
}));