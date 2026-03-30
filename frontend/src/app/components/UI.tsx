import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState, ImgHTMLAttributes } from 'react';

// ── Animated section (scroll-triggered fade-in) ──
export function AnimatedSection({ children, className, delay = 0, direction = 'up' }: {
  children: ReactNode; className?: string; delay?: number; direction?: 'up' | 'left' | 'right' | 'scale';
}) {
  const variants = {
    up:    { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 } },
    left:  { initial: { opacity: 0, x: -40 }, whileInView: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: 40 }, whileInView: { opacity: 1, x: 0 } },
    scale: { initial: { opacity: 0, scale: 0.92 }, whileInView: { opacity: 1, scale: 1 } },
  };
  const v = variants[direction] || variants.up;
  return (
    <motion.div
      initial={v.initial as any}
      whileInView={v.whileInView as any}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Image with fallback placeholder ──
export function ImageWithFallback({ src, alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const [err, setErr] = useState(false);
  if (err || !src) {
    return (
      <div
        style={{ background: '#F0EDE8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CCC', fontSize: '32px' }}
        className={props.className as string}
      >✂️</div>
    );
  }
  return <img src={src} alt={alt} onError={() => setErr(true)} {...props} />;
}

// ── Barber pole divider ──
export function BarberPoleDivider() {
  return (
    <div style={{ height: '6px', background: 'repeating-linear-gradient(135deg, #D42B2B 0, #D42B2B 10px, #FFFFFF 10px, #FFFFFF 20px, #2255CC 20px, #2255CC 30px, #FFFFFF 30px, #FFFFFF 40px)' }} />
  );
}

// ── Floating tools background ──
export function FloatingToolsBg({ layout = 0 }: { layout?: number }) {
  const items = ['✂️', '💈', '🪒'][layout % 3];
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', opacity: 0.04 }}>
      <div style={{ position: 'absolute', top: '10%', right: '5%', fontSize: '120px', transform: 'rotate(15deg)' }}>{items}</div>
      <div style={{ position: 'absolute', bottom: '15%', left: '8%', fontSize: '80px', transform: 'rotate(-20deg)' }}>💈</div>
    </div>
  );
}

// ── Scissors decoration ──
export function ScissorsDecor({ side = 'left', topPercent = 50 }: { side?: 'left' | 'right'; topPercent?: number }) {
  return (
    <div style={{ position: 'absolute', [side]: '-20px', top: `${topPercent}%`, fontSize: '48px', opacity: 0.06, transform: 'rotate(30deg)', pointerEvents: 'none' }}>✂️</div>
  );
}

// ── Page hero band ──
export function PageHeroBand({ label, title, subtitle }: { label: string; title: string; subtitle: string }) {
  return (
    <section style={{ background: '#0D0D0D', padding: '80px 0 60px', position: 'relative', overflow: 'hidden' }}>
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', top: '-40%', right: '-10%', width: '500px', height: '500px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '50%', pointerEvents: 'none' }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
        <AnimatedSection>
          <div style={{ color: '#D42B2B', fontSize: '11px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '12px' }}>{label}</div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 6vw, 72px)', color: '#FFFFFF', letterSpacing: '0.02em', marginBottom: '14px', lineHeight: 1 }}>{title}</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '17px', maxWidth: '600px', lineHeight: 1.6 }}>{subtitle}</p>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ── Marquee ticker ──
export function MarqueeTicker({ text, bg = '#D42B2B', color = '#FFFFFF', speed = 25 }: { text: string; bg?: string; color?: string; speed?: number }) {
  return (
    <div style={{ background: bg, overflow: 'hidden', padding: '10px 0', whiteSpace: 'nowrap' }}>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'inline-block', color, fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}
      >
        {text} &nbsp;&nbsp;&nbsp; {text} &nbsp;&nbsp;&nbsp;
      </motion.div>
    </div>
  );
}