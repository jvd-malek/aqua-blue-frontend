import { Shield, Truck, Headphones, RefreshCw, CreditCard, Award } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'ضمانت اصالت کالا',
    description: 'تمامی محصولات اصل و با گارانتی معتبر ارائه می‌شوند',
    color: 'text-blue-500',
  },
  {
    icon: Truck,
    title: 'ارسال سریع',
    description: 'ارسال به سراسر ایران در کوتاه‌ترین زمان ممکن',
    color: 'text-cyan-500',
  },
  {
    icon: Headphones,
    title: 'پشتیبانی ۲۴/۷',
    description: 'تیم پشتیبانی ما همواره آماده پاسخگویی به شماست',
    color: 'text-blue-500',
  },
  {
    icon: RefreshCw,
    title: 'بازگشت وجه',
    description: 'امکان بازگشت وجه تا ۷ روز در صورت عدم رضایت',
    color: 'text-cyan-500',
  },
  {
    icon: CreditCard,
    title: 'پرداخت امن',
    description: 'پرداخت از طریق درگاه امن زرین‌پال',
    color: 'text-blue-500',
  },
  {
    icon: Award,
    title: 'کیفیت تضمینی',
    description: 'محصولات با بهترین کیفیت و استاندارد',
    color: 'text-cyan-500',
  },
];

export default function AboutFeatures() {
  return (
    <section className="py-16 md:py-20">
      <div className="text-center mb-12">
        <h2 className="section-title text-2xl md:text-3xl font-bold mb-4">
          چرا Aqua Blue؟
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          ما در Aqua Blue به کیفیت، اعتماد و رضایت مشتریان خود افتخار می‌کنیم
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className={`w-14 h-14 rounded-xl bg-linear-to-br from-${feature.color.split('-')[1]}-500/10 to-${feature.color.split('-')[1]}-600/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={28} className={feature.color} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}