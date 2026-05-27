import { LOGO } from '@/constants/home';
import Image from 'next/image';

export default function AboutStory() {
  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* تصویر */}
        <div className="relative order-2 lg:order-1">
          <div className="px-3">
            <Image
              src={LOGO.LogoRemoveBG}
              alt="Aqua Blue Story"
              width={400}
              height={400}
              className="object-cover w-full"
            />
          </div>
        </div>
        
        {/* محتوا */}
        <div className="order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-sm font-medium mb-4">
            داستان ما
          </div>
          <h2 className="section-title text-2xl md:text-3xl font-bold mb-4">
            چگونه Aqua Blue متولد شد؟
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-7">
            <p>
              Aqua Blue در سال ۱۴۰۰ با یک ایده ساده شروع شد: ایجاد فروشگاهی تخصصی 
              که بتواند نیازهای علاقه‌مندان به دنیای آبزیان را به بهترین شکل ممکن برآورده کند.
            </p>
            <p>
              ما با گردآوری بهترین برندها و محصولات معتبر جهانی، همراه با تیمی مجرب و علاقه‌مند 
              به این حوزه، توانستیم در مدت کوتاهی به یکی از معتبرترین فروشگاه‌های آنلاین 
              در زمینه ماهی و آکواریوم تبدیل شویم.
            </p>
            <p>
              امروز، Aqua Blue با افتخار به هزاران مشتری در سراسر ایران خدمت‌رسانی می‌کند 
              و همواره تلاش می‌کند تا تجربه خریدی لذت‌بخش و مطمئن را برای شما عزیزان فراهم آورد.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}