import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AboutHero from '@/components/about/AboutHero';
import AboutStory from '@/components/about/AboutStory';
import AboutFeatures from '@/components/about/AboutFeatures';
import AboutTeam from '@/components/about/AboutTeam';
import AboutContact from '@/components/about/AboutContact';
import AboutPayment from '@/components/about/AboutPayment';
import AboutShipping from '@/components/about/AboutShipping';
import AboutReturns from '@/components/about/AboutReturns';

export const metadata: Metadata = {
  title: 'درباره ما',
  description: 'فروشگاه تخصصی Aqua Blue، ارائه‌دهنده انواع ماهی‌های زینتی، آکواریوم، تجهیزات و لوازم جانبی با بهترین کیفیت و قیمت.',
  keywords: ['درباره ما', 'فروشگاه آکواریوم', 'ماهی زینتی', 'تجهیزات آکواریوم'],
  openGraph: {
    title: 'درباره ما',
    description: 'با فروشگاه تخصصی Aqua Blue آشنا شوید',
    url: 'https://aquablueiran.com/about-us',
    siteName: 'Aqua Blue',
    locale: 'fa_IR',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <>
      <Header />

      <main className="relative z-10 container mx-auto px-3">
        <AboutHero />
        <AboutStory />
        <AboutFeatures />
        <AboutPayment />
        <AboutShipping />
        <AboutReturns />
        <AboutTeam />
        <AboutContact />
      </main>

      <Footer />
    </>
  );
}