import HERO1 from '@/public/images/fish1.webp';
import HERO2 from '@/public/images/fish2.webp';
import HERO3 from '@/public/images/fish3.webp';
import HERO4 from '@/public/images/aquarium.webp';
import HERO5 from '@/public/images/fish-food.webp';
import HERO6 from '@/public/images/accessories.webp';
import Logo from '@/public/images/Logo.webp';
import LogoRemoveBG from '@/public/images/Logo-removebg.webp';

export const HERO_IMAGES = {
  left: HERO1,
  right: HERO2,
} as const;

export const LOGO = {
  Logo: Logo,
  LogoRemoveBG: LogoRemoveBG
} as const;

export const CATEGORIES = [
  { name: 'ماهی', href: '/category/ماهی', image: HERO3, color: 'from-blue-500 to-blue-700', desc: 'انواع ماهی‌های زینتی و آب شور', badge: '۱۲۴ محصول' },
  { name: 'آکواریوم', href: '/category/آکواریوم', image: HERO4, color: 'from-cyan-500 to-teal-700', desc: 'تجهیزات و دکوراسیون حرفه‌ای', badge: '۵۶ محصول' },
  { name: 'غذا', href: '/category/غذا', image: HERO5, color: 'from-emerald-500 to-green-700', desc: 'غذای مغذی و مکمل‌های تخصصی', badge: '۸۹ محصول' },
  { name: 'لوازم جانبی', href: '/category/لوازم-جانبی', image: HERO6, color: 'from-amber-500 to-orange-700', desc: 'لوازم تزئینی و حرفه‌ای آکواریوم', badge: '۲۰۳ محصول' },
] as const;

export const SECTIONS = [
  { key: "fishProducts", title: 'ماهی‌ها', link: '/category/ماهی', type: 'product' as const },
  { key: "aquariumProducts", title: 'آکواریوم‌ها', link: '/category/آکواریوم', type: 'product' as const },
  { key: "foodProducts", title: 'غذاها', link: '/category/غذا', type: 'product' as const },
  { key: "accessoryProducts", title: 'لوازم جانبی', link: '/category/لوازم-جانبی', type: 'product' as const },
  { key: 'articles', title: 'مقالات', link: '/blog', type: 'article' as const },
] as const;