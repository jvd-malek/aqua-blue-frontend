// components/product/DiscountTimer.tsx

'use client';

import { useEffect, useState } from 'react';

type Props = { endDate: number };

export default function DiscountTimer({ endDate }: Props) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (endDate <= Date.now()) return;
    const timer = setInterval(() => {
      const diff = endDate - Date.now();
      if (diff <= 0) { clearInterval(timer); return; }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="bg-red-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-bold inline-flex gap-2 shadow-md">
      {timeLeft.days > 0 && <span>{timeLeft.days} روز</span>}
      <span>{pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}</span>
    </div>
  );
}