import Image from 'next/image';
import { Mail, Phone } from 'lucide-react';
import { LOGO } from '@/constants/home';

const team = [
  {
    name: 'عرفان افشار',
    role: 'مدیرعامل و بنیان‌گذار',
    email: 'erfanafshar@gmail.com',
    phone: '09193919019',
    image: LOGO.LogoRemoveBG,
  },
  {
    name: 'جواد ملکیان',
    role: 'طراح سایت',
    email: 'jvd.malek0079@gmail.com',
    phone: '09960025507',
    image: LOGO.LogoRemoveBG,
  },
  // اضافه کردن اعضای تیم بعداً
];

export default function AboutTeam() {
  return (
    <section className="py-16 md:py-20">
      <div className="text-center mb-12">
        <h2 className="section-title text-2xl md:text-3xl font-bold mb-4">
          تیم ما
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          ما در Aqua Blue متشکل از عاشقان دنیای آبزیان هستیم
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8">
        {team.map((member, index) => (
          <div
            key={index}
            className="group w-72 p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-blue-500/20 group-hover:border-blue-500/50 transition-all duration-300">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
              {member.name}
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">
              {member.role}
            </p>
            <div className="flex justify-center gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <a
                href={`mailto:${member.email}`}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-blue-500 hover:text-white transition-all"
                aria-label="ایمیل"
              >
                <Mail size={16} />
              </a>
              <a
                href={`tel:${member.phone}`}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-blue-500 hover:text-white transition-all"
                aria-label="تلفن"
              >
                <Phone size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}