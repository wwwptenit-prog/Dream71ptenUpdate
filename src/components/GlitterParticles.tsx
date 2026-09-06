import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  color: string;
  sparkleType: 'star5' | 'circle' | 'diamond';
}

interface GlitterParticlesProps {
  mouseCoords: { x: number; y: number } | null;
}

export const GlitterParticles: React.FC<GlitterParticlesProps> = ({ mouseCoords }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const targetMouseRef = useRef<{ x: number; y: number } | null>(null);

  // Keep mouse position ref up to date
  useEffect(() => {
    targetMouseRef.current = mouseCoords;
  }, [mouseCoords]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 800);

    // Rich colorful shimmering palette with gold, emerald, sky blue & diamond white
    const palette = [
      '#FCD34D', // Gold
      '#FBBF24', // Amber Gold
      '#1DB954', // Emerald Green
      '#34D399', // Mint Shimmer
      '#38BDF8', // Sky Blue Sparkle
      '#FFFFFF', // Diamond White Sparkle
      '#FDE68A', // Soft Light Gold
    ];

    // Comfortable, uniform particle count across the entire hero + eid offer section
    const particleCount = Math.min(85, Math.max(45, Math.floor((width * height) / 14000)));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const color = palette[Math.floor(Math.random() * palette.length)];
      
      // Mostly small shimmering dust & diamonds, with very few 5-pointed stars (only ~15%)
      const rand = Math.random();
      let sparkleType: 'star5' | 'circle' | 'diamond' = 'circle';
      if (rand < 0.15) {
        sparkleType = 'star5'; // Very few 5-stars
      } else if (rand < 0.45) {
        sparkleType = 'diamond'; // Small sparkling diamonds
      } else {
        sparkleType = 'circle'; // Tiny shimmering dust
      }

      const size = sparkleType === 'star5' 
        ? Math.random() * 1.5 + 1.2 
        : sparkleType === 'diamond' 
          ? Math.random() * 1.2 + 0.8 
          : Math.random() * 1.2 + 0.6;
      const baseAlpha = Math.random() * 0.4 + 0.25;

      particles.push({
        x,
        y,
        originX: x,
        originY: y,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size,
        baseAlpha,
        alpha: baseAlpha,
        twinkleSpeed: Math.random() * 0.025 + 0.015,
        color,
        sparkleType,
      });
    }

    // Resize observer
    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      const newWidth = canvas.parentElement.clientWidth;
      const newHeight = canvas.parentElement.clientHeight;
      if (newWidth > 0 && newHeight > 0 && (newWidth !== width || newHeight !== height)) {
        width = canvas.width = newWidth;
        height = canvas.height = newHeight;
        for (const p of particles) {
          if (p.x > width) p.x = Math.random() * width;
          if (p.y > height) p.y = Math.random() * height;
          p.originX = p.x;
          p.originY = p.y;
        }
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      angle += 0.018;

      // 1. DYNAMIC COLORFUL AMBIENT AURAS ROTATING & FLOATING ACROSS THE ENTIRE CONTAINER
      // Ambient Light 1: Rotating Emerald/Teal Glow sweeping across
      const aura1X = width * 0.35 + Math.cos(angle * 0.7) * (width * 0.3);
      const aura1Y = height * 0.4 + Math.sin(angle * 0.5) * (height * 0.25);
      const grad1 = ctx.createRadialGradient(aura1X, aura1Y, 0, aura1X, aura1Y, Math.min(width, height) * 0.6);
      grad1.addColorStop(0, 'rgba(29, 185, 84, 0.16)');
      grad1.addColorStop(0.5, 'rgba(20, 184, 166, 0.08)');
      grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad1;
      ctx.beginPath();
      ctx.arc(aura1X, aura1Y, Math.min(width, height) * 0.6, 0, Math.PI * 2);
      ctx.fill();

      // Ambient Light 2: Rotating Sky Blue/Indigo Glow on the opposite side
      const aura2X = width * 0.65 + Math.sin(angle * 0.6) * (width * 0.28);
      const aura2Y = height * 0.6 + Math.cos(angle * 0.7) * (height * 0.22);
      const grad2 = ctx.createRadialGradient(aura2X, aura2Y, 0, aura2X, aura2Y, Math.min(width, height) * 0.55);
      grad2.addColorStop(0, 'rgba(56, 189, 248, 0.14)');
      grad2.addColorStop(0.5, 'rgba(99, 102, 241, 0.07)');
      grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad2;
      ctx.beginPath();
      ctx.arc(aura2X, aura2Y, Math.min(width, height) * 0.55, 0, Math.PI * 2);
      ctx.fill();

      // Ambient Light 3: Shimmering Gold/Amber warm core floating through center
      const aura3X = width * 0.5 + Math.sin(angle * 0.9 + 1.5) * (width * 0.25);
      const aura3Y = height * 0.3 + Math.cos(angle * 0.8 + 1.2) * (height * 0.2);
      const grad3 = ctx.createRadialGradient(aura3X, aura3Y, 0, aura3X, aura3Y, Math.min(width, height) * 0.45);
      grad3.addColorStop(0, 'rgba(251, 191, 36, 0.12)');
      grad3.addColorStop(0.6, 'rgba(245, 158, 11, 0.04)');
      grad3.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad3;
      ctx.beginPath();
      ctx.arc(aura3X, aura3Y, Math.min(width, height) * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // Smooth mouse coordinate interpolation
      if (targetMouseRef.current) {
        if (!mouseRef.current) {
          mouseRef.current = { ...targetMouseRef.current };
        } else {
          mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.12;
          mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.12;
        }
      } else {
        mouseRef.current = null;
      }

      const curMouse = mouseRef.current;

      // Draw active cursor spotlight glow that follows the mouse across the whole container
      if (curMouse) {
        const mouseGrad = ctx.createRadialGradient(
          curMouse.x,
          curMouse.y,
          0,
          curMouse.x,
          curMouse.y,
          320
        );
        mouseGrad.addColorStop(0, 'rgba(29, 185, 84, 0.25)');
        mouseGrad.addColorStop(0.35, 'rgba(14, 165, 233, 0.14)');
        mouseGrad.addColorStop(0.7, 'rgba(245, 158, 11, 0.06)');
        mouseGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = mouseGrad;
        ctx.beginPath();
        ctx.arc(curMouse.x, curMouse.y, 320, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw all uniform sparkling glitter particles ("জড়ির মত")
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Twinkle effect
        p.alpha = p.baseAlpha + Math.sin(angle * 2.2 + i) * 0.28;
        if (p.alpha < 0.1) p.alpha = 0.1;
        if (p.alpha > 0.95) p.alpha = 0.95;

        // Interaction with mouse cursor:
        if (curMouse) {
          const dx = curMouse.x - p.x;
          const dy = curMouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 260) {
            const force = (1 - dist / 260) * 0.8;
            p.x += (dx / dist) * force * 2.2;
            p.y += (dy / dist) * force * 2.2;
            p.alpha = Math.min(1, p.alpha + (1 - dist / 260) * 0.5);
          } else {
            p.x += (p.originX - p.x) * 0.01 + p.vx;
            p.y += (p.originY - p.y) * 0.01 + p.vy;
          }
        } else {
          // Gentle ambient float
          p.x += p.vx + Math.sin(angle + i) * 0.22;
          p.y += p.vy + Math.cos(angle + i) * 0.22;
        }

        // Boundary wrap
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;

        if (p.sparkleType === 'star5') {
          // Classic 5-pointed star (কম সংখ্যায়, পরিমিত ৫ কোণা স্টার)
          const spikes = 5;
          const outerRadius = p.size * 2.0;
          const innerRadius = outerRadius * 0.45;
          let rot = (Math.PI / 2) * 3;
          let cx = p.x;
          let cy = p.y;
          const step = Math.PI / spikes;

          ctx.beginPath();
          ctx.moveTo(cx, cy - outerRadius);
          for (let s = 0; s < spikes; s++) {
            cx = p.x + Math.cos(rot) * outerRadius;
            cy = p.y + Math.sin(rot) * outerRadius;
            ctx.lineTo(cx, cy);
            rot += step;

            cx = p.x + Math.cos(rot) * innerRadius;
            cy = p.y + Math.sin(rot) * innerRadius;
            ctx.lineTo(cx, cy);
            rot += step;
          }
          ctx.lineTo(p.x, p.y - outerRadius);
          ctx.closePath();
          ctx.fill();
        } else if (p.sparkleType === 'diamond') {
          // Tiny diamond sparkle
          const s = p.size * 1.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - s);
          ctx.lineTo(p.x + s * 0.7, p.y);
          ctx.lineTo(p.x, p.y + s);
          ctx.lineTo(p.x - s * 0.7, p.y);
          ctx.closePath();
          ctx.fill();
        } else {
          // Soft circular shimmering dust
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-20"
      style={{ display: 'block' }}
    />
  );
};
