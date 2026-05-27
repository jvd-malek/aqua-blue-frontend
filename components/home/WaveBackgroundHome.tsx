'use client';

import { useEffect, useRef } from 'react';

interface WaveBackgroundHomeProps {
  className?: string;
}

interface FishSchool {
  x: number;
  y: number;
  count: number;
  size: number;
  speed: number;
  direction: number;
  color: string;
  isGold: boolean;
  spread: number;
  phase: number;
}

const WaveBackgroundHome: React.FC<WaveBackgroundHomeProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    let schools: FishSchool[] = [];
    
    const getColors = () => {
      const isDark = document.documentElement.classList.contains('dark');
      return {
        blue1: isDark ? '#3B82F6' : '#2563EB',
        blue2: isDark ? '#60A5FA' : '#3B82F6',
        blue3: isDark ? '#93C5FD' : '#60A5FA',
        gold: '#FBBF24',
      };
    };
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initSchools();
    };
    
    const initSchools = () => {
      const colors = getColors();
      schools = [];
      
      // دسته 1: ماهی‌های آبی - راست به چپ (داخل صفحه، سمت راست)
      schools.push({
        x: canvas.width * 0.85,
        y: canvas.height * 0.15,
        count: 6,
        size: 12,
        speed: 0.25,
        direction: -1,
        color: colors.blue1,
        isGold: false,
        spread: 22,
        phase: 0,
      });
      
      // دسته 2: ماهی‌های آبی روشن - چپ به راست (داخل صفحه، سمت چپ)
      schools.push({
        x: canvas.width * 0.1,
        y: canvas.height * 0.32,
        count: 5,
        size: 10,
        speed: 0.22,
        direction: 1,
        color: colors.blue2,
        isGold: false,
        spread: 18,
        phase: 1,
      });
      
      // دسته 3: ماهی‌های آبی متوسط - چپ به راست (وسط صفحه)
      schools.push({
        x: canvas.width * 0.3,
        y: canvas.height * 0.52,
        count: 7,
        size: 11,
        speed: 0.2,
        direction: 1,
        color: colors.blue3,
        isGold: false,
        spread: 28,
        phase: 2,
      });
      
      // دسته 4: ماهی‌های طلایی - راست به چپ (داخل صفحه، سمت راست پایین) - سریعتر
      schools.push({
        x: canvas.width * 0.75,
        y: canvas.height * 0.68,
        count: 4,
        size: 13,
        speed: 0.28,
        direction: -1,
        color: colors.gold,
        isGold: true,
        spread: 32,
        phase: 3,
      });
      
      // دسته 5: ماهی‌های آبی تیره - راست به چپ (پایین صفحه)
      schools.push({
        x: canvas.width * 0.5,
        y: canvas.height * 0.82,
        count: 5,
        size: 9,
        speed: 0.23,
        direction: -1,
        color: colors.blue1,
        isGold: false,
        spread: 16,
        phase: 4,
      });
      
      // دسته 6: ماهی‌های آبی جدید - چپ به راست (بالا صفحه)
      schools.push({
        x: canvas.width * 0.2,
        y: canvas.height * 0.07,
        count: 4,
        size: 10,
        speed: 0.21,
        direction: 1,
        color: colors.blue2,
        isGold: false,
        spread: 20,
        phase: 5,
      });
    };
    
    const drawFishIcon = (x: number, y: number, size: number, color: string, isGold: boolean, direction: number) => {
      ctx.save();
      
      ctx.fillStyle = color;
      ctx.globalAlpha = isGold ? 0.5 : 0.35;
      ctx.shadowBlur = isGold ? 3 : 1;
      ctx.shadowColor = isGold ? 'rgba(251, 191, 36, 0.25)' : 'rgba(59, 130, 246, 0.15)';
      
      if (direction === -1) {
        ctx.scale(-1, 1);
        ctx.translate(-x * 2, 0);
      }
      
      const drawX = direction === -1 ? -x : x;
      const drawY = y;
      
      ctx.beginPath();
      ctx.ellipse(drawX, drawY, size * 0.6, size * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(drawX - size * 0.55, drawY);
      ctx.lineTo(drawX - size * 0.9, drawY - size * 0.3);
      ctx.lineTo(drawX - size * 0.9, drawY + size * 0.3);
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(drawX - size * 0.1, drawY - size * 0.35);
      ctx.lineTo(drawX - size * 0.4, drawY - size * 0.55);
      ctx.lineTo(drawX - size * 0.7, drawY - size * 0.35);
      ctx.fill();
      
      if (size > 10) {
        ctx.beginPath();
        ctx.arc(drawX + size * 0.25, drawY - size * 0.1, size * 0.08, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(drawX + size * 0.28, drawY - size * 0.12, size * 0.04, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fill();
      }
      
      ctx.restore();
    };
    
    const drawSchool = (school: FishSchool) => {
      const colors = getColors();
      
      let x = school.x + school.direction * school.speed;
      
      if (school.direction === -1 && x < -150) {
        x = canvas.width + 150;
      } else if (school.direction === 1 && x > canvas.width + 150) {
        x = -150;
      }
      
      school.x = x;
      
      for (let i = 0; i < school.count; i++) {
        const angle = (i / school.count) * Math.PI * 2 + school.phase;
        const offsetX = Math.sin(angle) * (school.spread * 0.25);
        const offsetY = Math.cos(angle) * (school.spread * 0.35);
        const fishSize = school.size * (0.85 + Math.sin(angle) * 0.15);
        
        let fishColor = school.color;
        if (!school.isGold) {
          if (i % 3 === 0) fishColor = colors.blue1;
          else if (i % 3 === 1) fishColor = colors.blue2;
          else fishColor = colors.blue3;
        }
        
        const isGoldFish = school.isGold && i === Math.floor(school.count / 2);
        
        drawFishIcon(
          x + offsetX,
          school.y + offsetY,
          fishSize,
          fishColor,
          isGoldFish,
          school.direction
        );
      }
    };
    
    const drawGoldDust = () => {
      for (let i = 0; i < 15; i++) {
        const x = (Math.sin(time * 0.08 + i * 1.2) * canvas.width * 0.4 + canvas.width * 0.5) % canvas.width;
        const y = (Math.cos(time * 0.07 + i * 1.1) * canvas.height * 0.35 + canvas.height * 0.5) % canvas.height;
        const size = 1.2 + Math.sin(time * 1.2 + i) * 0.6;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = '#FBBF24';
        ctx.globalAlpha = 0.15;
        ctx.fill();
      }
    };
    
    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      schools.forEach(school => drawSchool(school));
      drawGoldDust();
      
      time += 0.016;
      animationId = requestAnimationFrame(animate);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();
    
    const observer = new MutationObserver(() => {
      const colors = getColors();
      schools.forEach((school, idx) => {
        if (!school.isGold) {
          if (idx === 0) school.color = colors.blue1;
          else if (idx === 1) school.color = colors.blue2;
          else if (idx === 2) school.color = colors.blue3;
          else if (idx === 4) school.color = colors.blue1;
          else if (idx === 5) school.color = colors.blue2;
        }
      });
    });
    
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      observer.disconnect();
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className={`fixed-custome top-0 left-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  );
};

export default WaveBackgroundHome;