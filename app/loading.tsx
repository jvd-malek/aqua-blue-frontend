import Image from 'next/image';
import { LOGO } from '@/constants/home';

export default function Loading() {
  return (
    <div className="h-screen flex flex-col items-center justify-center relative z-10">
      
      {/* لوگو */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 via-gold/10 to-blue-500/10 rounded-full blur-xl animate-pulse" />
        <Image
          src={LOGO.LogoRemoveBG}
          alt="Aqua Blue"
          width={240}
          height={240}
          className="relative object-contain"
          priority
        />
      </div>

      {/* تایتل */}
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        Aqua Blue
      </h2>

      {/* لودر سه نقطه‌ای که از قبل داری */}
      <div className="loader text-blue-600/75" />
    </div>
  );
}