import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function AboutContact() {
  return (
    <section className="py-16 md:py-20">
      <div className="text-center mb-12">
        <h2 className="section-title text-2xl md:text-3xl font-bold mb-4">
          ارتباط با ما
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          ما همیشه خوشحال می‌شویم از شما بشنویم
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="text-center p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
          <div className="w-12 h-12 mx-auto rounded-xl bg-blue-500/10 flex items-center justify-center mb-3">
            <MapPin size={24} className="text-blue-500" />
          </div>
          <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">آدرس</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            تهران، خیابان یکم نیروهوایی، پلاک ۱۲۱
          </p>
        </div>

        <div className="text-center p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
          <div className="w-12 h-12 mx-auto rounded-xl bg-blue-500/10 flex items-center justify-center mb-3">
            <Phone size={24} className="text-blue-500" />
          </div>
          <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">تلفن</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">09193919019</p>
        </div>

        <div className="text-center p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
          <div className="w-12 h-12 mx-auto rounded-xl bg-blue-500/10 flex items-center justify-center mb-3">
            <Mail size={24} className="text-blue-500" />
          </div>
          <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">ایمیل</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">info@aquablueiran.com</p>
        </div>

        <div className="text-center p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
          <div className="w-12 h-12 mx-auto rounded-xl bg-blue-500/10 flex items-center justify-center mb-3">
            <Clock size={24} className="text-blue-500" />
          </div>
          <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">ساعت کاری</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">شنبه تا پنجشنبه ۱۰ تا ۱۹</p>
        </div>
      </div>
    </section>
  );
}