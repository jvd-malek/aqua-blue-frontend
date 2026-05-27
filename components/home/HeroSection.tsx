import Link from 'next/link';
import Image from 'next/image';
import { HERO_IMAGES } from '@/constants/home';

export default function HeroSection() {
  return (
    <section className="container mx-auto px-3 text-center relative min-h-100 flex items-center justify-center">

      {/* تصاویر شناور */}
      <div className="absolute md:left-5 md:top-0 left-5 -bottom-28">
        <Image
          src={HERO_IMAGES.left}
          alt="Hero fish"
          quality={75}
          width={300}
          height={300}
          className="object-contain w-40 md:w-52 opacity-80 animate-float-slow"
          loading="eager"
        />
      </div>

      <div className="absolute md:top-18 md:right-28 top-0 right-5">
        <Image
          src={HERO_IMAGES.right}
          alt="Hero fish"
          quality={75}
          width={300}
          height={300}
          className="object-contain w-40 md:w-52 opacity-80 animate-float-medium"
          loading="eager"
        />
      </div>

      {/* محتوا */}
      <div className="relative z-20 px-4 flex flex-col md:items-center items-end w-full">
        <div className="mt-6 flex flex-col">
          <h1 className="hero-title text-3xl md:text-center text-left md:text-5xl font-extrabold font-sans p-1 mb-4" data-text="AQUA BLUE">
            AQUA BLUE
          </h1>
          <p className="hero-subtitle text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto whitespace-pre-wrap md:whitespace-normal">
            {`فروشگاه تخصصی ماهی،
آکواریوم و لوازم جانبی`}
          </p>
        </div>

        <div className="mt-30 md:mt-8 flex md:flex-row flex-col justify-center gap-4 flex-wrap md:self-center self-start text-center">
          <Link
            href="/category/ماهی"
            className="btn-primary bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            مشاهده محصولات
          </Link>
          <Link
            href="/login"
            className="btn-secondary bg-blue-300/70 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105"
          >
            ورود / ثبت‌نام
          </Link>
        </div>
      </div>
    </section>
  );
}