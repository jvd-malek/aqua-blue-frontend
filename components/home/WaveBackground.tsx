// components/home/WaveBackground.tsx
'use client';

import { useEffect, useRef } from 'react';

interface WaveBackgroundProps {
  className?: string;
}

const WaveBackground: React.FC<WaveBackgroundProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    
    const getColors = () => {
      const isDark = document.documentElement.classList.contains('dark');
      return {
        bg1: isDark ? '#0A0F1A' : '#E8EEF6',
        bg2: isDark ? '#111827' : '#D4E0F0',
        wave1: isDark ? '#1E3A8A' : '#A0C4FF',
        wave2: isDark ? '#1D4ED8' : '#7BAFF7',
        wave3: isDark ? '#2563EB' : '#4A90E2',
        wave4: isDark ? '#3B82F6' : '#2B6ED7',
        gold: isDark ? 'rgba(245, 158, 11, 0.25)' : 'rgba(217, 119, 6, 0.25)',
        goldStroke: isDark ? 'rgba(245, 158, 11, 0.4)' : 'rgba(217, 119, 6, 0.4)',
        shape: isDark ? 'rgba(37, 99, 235, 0.06)' : 'rgba(59, 130, 246, 0.08)',
      };
    };
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    const drawWave = (
      yBase: number, 
      amplitude: number, 
      frequency: number, 
      speed: number, 
      color: string,
      opacity: number
    ) => {
      ctx.beginPath();
      ctx.moveTo(-50, canvas.height); // شروع از خارج صفحه سمت راست
      
      for (let x = -50; x <= canvas.width + 50; x += 15) {
        const deformation = Math.sin(x * 0.003 + time * speed) * 3;
        const yPos = yBase + 
                     Math.sin(x * frequency + time * speed) * amplitude +
                     Math.cos(x * 0.005 + time * 0.4) * 4 +
                     deformation;
        
        if (x === -50) {
          ctx.moveTo(x, yPos);
        } else {
          ctx.lineTo(x, yPos);
        }
      }
      
      ctx.lineTo(canvas.width + 50, canvas.height);
      ctx.lineTo(-50, canvas.height);
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      ctx.fill();
    };
    
    const drawGoldVeins = () => {
      ctx.save();
      
      ctx.beginPath();
      ctx.globalAlpha = 0.35;
      
      for (let x = -50; x <= canvas.width + 50; x += 20) {
        const y = canvas.height * 0.82 + 
                  Math.sin(x * 0.008 + time * 0.4) * 12 +
                  Math.cos(x * 0.006 + time * 0.25) * 8;
        
        if (x === -50) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(245, 158, 11, 0.5)';
      ctx.stroke();
      
      ctx.beginPath();
      ctx.globalAlpha = 0.2;
      
      for (let x = -50; x <= canvas.width + 50; x += 25) {
        const y = canvas.height * 0.78 + 
                  Math.sin(x * 0.012 + time * 0.55) * 8 +
                  Math.cos(x * 0.009 + time * 0.35) * 5;
        
        if (x === -50) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      
      ctx.shadowBlur = 0;
      ctx.restore();
    };
    
    // حذف حباب‌ها و اضافه کردن نقاط طلایی از WaveBackgroundHome
    const drawGoldDust = () => {
      for (let i = 0; i < 12; i++) {
        const x = (Math.sin(time * 0.2 + i) * canvas.width * 0.3 + canvas.width * 0.5) % canvas.width;
        const y = canvas.height * 0.75 + Math.sin(time * 0.5 + i) * 40;
        const size = 1.5 + Math.sin(time * 1.5 + i) * 0.8;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = '#FBBF24';
        ctx.globalAlpha = 0.25;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.fillStyle = '#F59E0B';
        ctx.globalAlpha = 0.08;
        ctx.fill();
      }
    };
    
    const drawDeformedShapes = () => {
      const colors = getColors();
      const shapes = [
        { x: '20%', y: '15%', size: 450, speed: 0.25 },
        { x: '80%', y: '65%', size: 500, speed: 0.35 },
        { x: '50%', y: '85%', size: 400, speed: 0.3 },
        { x: '10%', y: '70%', size: 380, speed: 0.4 },
        { x: '90%', y: '25%', size: 420, speed: 0.28 },
      ];
      
      shapes.forEach(shape => {
        const x = typeof shape.x === 'string' ? 
          parseFloat(shape.x) / 100 * canvas.width : shape.x;
        const y = typeof shape.y === 'string' ? 
          parseFloat(shape.y) / 100 * canvas.height : shape.y;
        
        ctx.save();
        ctx.beginPath();
        
        const points: { x: number; y: number }[] = [];
        const segments = 24;
        
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          const noise = Math.sin(angle * 4 + time * shape.speed) * 35 +
                        Math.cos(angle * 6 + time * 0.7) * 18;
          const r = shape.size / 2 + noise;
          const px = x + Math.cos(angle) * r;
          const py = y + Math.sin(angle) * r;
          points.push({ x: px, y: py });
        }
        
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i <= segments; i++) {
          const p1 = points[i - 1];
          const p2 = points[i];
          const cp1x = p1.x + (p2.x - p1.x) * 0.3;
          const cp1y = p1.y + (p2.y - p1.y) * 0.3;
          const cp2x = p2.x - (p2.x - p1.x) * 0.3;
          const cp2y = p2.y - (p2.y - p1.y) * 0.3;
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
        }
        
        ctx.closePath();
        ctx.fillStyle = colors.shape;
        ctx.globalAlpha = 0.06;
        ctx.fill();
        ctx.restore();
      });
    };
    
    const animate = () => {
      if (!ctx || !canvas) return;
      
      const colors = getColors();
      
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, colors.bg1);
      gradient.addColorStop(1, colors.bg2);
      ctx.fillStyle = gradient;
      ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      drawDeformedShapes();
      
      const isDark = document.documentElement.classList.contains('dark');
      const opacityMultiplier = isDark ? 1 : 1.3;
      
      drawWave(canvas.height * 0.7, 22, 0.0045, 0.45, colors.wave1, 0.08 * opacityMultiplier);
      drawWave(canvas.height * 0.74, 28, 0.007, 0.65, colors.wave2, 0.07 * opacityMultiplier);
      drawWave(canvas.height * 0.78, 20, 0.0095, 0.85, colors.wave3, 0.06 * opacityMultiplier);
      drawWave(canvas.height * 0.83, 25, 0.006, 1.05, colors.wave4, 0.05 * opacityMultiplier);
      drawWave(canvas.height * 0.88, 16, 0.011, 1.25, colors.wave2, 0.04 * opacityMultiplier);
      
      drawGoldVeins();
      drawGoldDust(); // نقاط طلایی به جای حباب
        
      time += 0.006;
      animationId = requestAnimationFrame(animate);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();
    
    const observer = new MutationObserver(() => {});
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
      style={{ zIndex: 0 }}
    />
  );
};

export default WaveBackground;