/**
 * BarberDecor — shared animated decorative components
 * Barber pole stripes, floating tool silhouettes, section dividers
 */
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

const RED  = '#D42B2B';
const BLUE = '#2255CC';

/* ─────────────────────────────────────────
   STRIPE PATTERN
───────────────────────────────────────── */
const POLE_IMAGE = `repeating-linear-gradient(
  -45deg,
  ${RED}   0px,  ${RED}   18px,
  #FFFFFF   18px, #FFFFFF  36px,
  ${BLUE}   36px, ${BLUE}  54px,
  #FFFFFF   54px, #FFFFFF  72px
)`;

/* ─────────────────────────────────────────
   HORIZONTAL POLE DIVIDER  (full-width, 5px)
───────────────────────────────────────── */
export function BarberPoleDivider({ height = 5 }: { height?: number }) {
  return (
    <motion.div
      animate={{ backgroundPosition: ['0px 0px', '0px 72px'] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
      style={{ height, backgroundImage: POLE_IMAGE, flexShrink: 0 }}
    />
  );
}

/* ─────────────────────────────────────────
   VERTICAL POLE (cylinder with gloss)
───────────────────────────────────────── */
export function BarberPoleVertical({
  height = 180,
  width = 20,
}: {
  height?: number;
  width?: number;
}) {
  const r = width / 2;
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: `${r}px`,
        overflow: 'hidden',
        boxShadow: `2px 2px 10px rgba(0,0,0,0.15), inset -3px 0 6px rgba(0,0,0,0.1)`,
        flexShrink: 0,
      }}
    >
      <motion.div
        animate={{ backgroundPosition: ['0px 0px', '0px 72px'] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', inset: 0, backgroundImage: POLE_IMAGE }}
      />
      {/* Gloss overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 35%, rgba(0,0,0,0.08) 100%)',
          borderRadius: `${r}px`,
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   FULL POLE PROP (cap + pole + cap)
───────────────────────────────────────── */
export function BarberPoleProp({
  height = 220,
  width = 22,
}: {
  height?: number;
  width?: number;
}) {
  const capW = width + 6;
  const capH = 14;
  const capStyle = (rounded: string): React.CSSProperties => ({
    width: capW,
    height: capH,
    background: 'linear-gradient(135deg, #3A3A3A 0%, #1A1A1A 100%)',
    borderRadius: rounded,
    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
    flexShrink: 0,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
      <div style={capStyle('4px 4px 0 0')} />
      <BarberPoleVertical height={height} width={width} />
      <div style={capStyle('0 0 4px 4px')} />
    </div>
  );
}

/* ─────────────────────────────────────────
   SECTION SIDE DECORATION
   – pole + floating tool, positioned absolute
───────────────────────────────────────── */
export function PoleSideDecor({
  side = 'right',
  topPercent = 30,
}: {
  side?: 'left' | 'right';
  topPercent?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'right' ? 50 : -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'absolute',
        [side]: 0,
        top: `${topPercent}%`,
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <BarberPoleProp height={200} width={20} />
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   FLOATING TOOL SILHOUETTES (background)
───────────────────────────────────────── */
function ScissorsOutline({ size = 60, opacity = 0.07 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size * 0.5} height={size} viewBox="0 0 68 148" fill="none" style={{ opacity }}>
      <path d="M7 6 C9 4 20 4 22 8 L33 70 L23 72 Z" stroke="#0D0D0D" strokeWidth="2" fill="none"/>
      <path d="M61 6 C59 4 48 4 46 8 L35 70 L45 72 Z" stroke="#0D0D0D" strokeWidth="2" fill="none"/>
      <circle cx="34" cy="73" r="8" stroke="#0D0D0D" strokeWidth="2" fill="none"/>
      <path d="M23 72 L19 88 C17 100 10 103 10 116 C10 130 22 138 27 133 C32 128 30 112 30 100 L33 72 Z" stroke="#0D0D0D" strokeWidth="2" fill="none"/>
      <circle cx="18" cy="118" r="14" stroke="#0D0D0D" strokeWidth="2" fill="none"/>
      <path d="M45 72 L49 88 C51 100 58 103 58 116 C58 130 46 138 41 133 C36 128 38 112 38 100 L35 72 Z" stroke="#0D0D0D" strokeWidth="2" fill="none"/>
      <circle cx="50" cy="118" r="14" stroke="#0D0D0D" strokeWidth="2" fill="none"/>
    </svg>
  );
}

function ClipperOutline({ size = 80, opacity = 0.06 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size * 0.7} height={size} viewBox="0 0 92 134" fill="none" style={{ opacity }}>
      <rect x="9" y="9" width="74" height="96" rx="15" stroke="#0D0D0D" strokeWidth="2" fill="none"/>
      <rect x="28" y="16" width="36" height="18" rx="6" stroke="#0D0D0D" strokeWidth="1.5" fill="none"/>
      <rect x="13" y="102" width="66" height="24" rx="6" stroke="#0D0D0D" strokeWidth="1.5" fill="none"/>
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x={15 + i * 7.5} y={118} width="4" height="10" rx="2" stroke="#0D0D0D" strokeWidth="1" fill="none"/>
      ))}
    </svg>
  );
}

function RazorOutline({ size = 100, opacity = 0.06 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 156 72" fill="none" style={{ opacity }}>
      <rect x="5" y="22" width="76" height="26" rx="13" stroke="#0D0D0D" strokeWidth="2" fill="none"/>
      <circle cx="83" cy="35" r="7" stroke="#0D0D0D" strokeWidth="2" fill="none"/>
      <path d="M83 27 L148 11 L152 35 L148 59 L83 43 Z" stroke="#0D0D0D" strokeWidth="2" fill="none"/>
    </svg>
  );
}

function CombOutline({ size = 100, opacity = 0.06 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size * 0.3} viewBox="0 0 200 60" fill="none" style={{ opacity }}>
      <rect x="4" y="4" width="192" height="30" rx="8" stroke="#0D0D0D" strokeWidth="2" fill="none"/>
      {Array.from({ length: 20 }).map((_, i) => (
        <rect key={i} x={10 + i * 9.5} y={34} width="5" height="22" rx="2.5" stroke="#0D0D0D" strokeWidth="1.5" fill="none"/>
      ))}
    </svg>
  );
}

function BrushOutline({ size = 60, opacity = 0.07 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size * 0.45} height={size} viewBox="0 0 62 152" fill="none" style={{ opacity }}>
      <rect x="23" y="5" width="16" height="84" rx="8" stroke="#0D0D0D" strokeWidth="2" fill="none"/>
      <rect x="19" y="84" width="24" height="14" rx="3" stroke="#0D0D0D" strokeWidth="1.5" fill="none"/>
      <ellipse cx="31" cy="124" rx="22" ry="26" stroke="#0D0D0D" strokeWidth="2" fill="none"/>
    </svg>
  );
}

/* ─────────────────────────────────────────
   FLOATING TOOLS BACKGROUND LAYER
───────────────────────────────────────── */
type ToolItem = {
  Component: React.FC<{ size?: number; opacity?: number }>;
  size: number;
  opacity: number;
  left: string;
  top: string;
  rotate: number;
  floatY: number;
  floatDelay: number;
  floatDur: number;
};

const toolLayouts: ToolItem[][] = [
  // Layout 0 – courses/about style
  [
    { Component: ScissorsOutline, size: 140, opacity: 0.06, left: '4%',  top: '10%', rotate: -25, floatY: -10, floatDelay: 0,   floatDur: 5 },
    { Component: ClipperOutline,  size: 160, opacity: 0.05, left: '80%', top: '15%', rotate: 15,  floatY: 8,   floatDelay: 1,   floatDur: 6 },
    { Component: RazorOutline,    size: 120, opacity: 0.05, left: '60%', top: '72%', rotate: -10, floatY: -7,  floatDelay: 0.5, floatDur: 4.5 },
    { Component: CombOutline,     size: 130, opacity: 0.05, left: '5%',  top: '65%', rotate: 8,   floatY: 9,   floatDelay: 1.5, floatDur: 5.5 },
  ],
  // Layout 1 – teachers/graduates style
  [
    { Component: BrushOutline,    size: 130, opacity: 0.06, left: '2%',  top: '20%', rotate: 12,  floatY: -8,  floatDelay: 0.2, floatDur: 4.8 },
    { Component: ScissorsOutline, size: 120, opacity: 0.05, left: '85%', top: '25%', rotate: -30, floatY: 10,  floatDelay: 0.8, floatDur: 5.2 },
    { Component: CombOutline,     size: 110, opacity: 0.05, left: '75%', top: '68%', rotate: 5,   floatY: -6,  floatDelay: 1.2, floatDur: 4.2 },
    { Component: RazorOutline,    size: 100, opacity: 0.05, left: '8%',  top: '70%', rotate: -15, floatY: 7,   floatDelay: 0.4, floatDur: 5.8 },
  ],
  // Layout 2 – contact/blog style
  [
    { Component: ClipperOutline,  size: 150, opacity: 0.05, left: '3%',  top: '15%', rotate: -8,  floatY: -9,  floatDelay: 0,   floatDur: 5.1 },
    { Component: RazorOutline,    size: 130, opacity: 0.05, left: '78%', top: '18%', rotate: 20,  floatY: 8,   floatDelay: 1,   floatDur: 4.6 },
    { Component: BrushOutline,    size: 120, opacity: 0.06, left: '82%', top: '65%', rotate: -18, floatY: -7,  floatDelay: 0.6, floatDur: 5.4 },
    { Component: ScissorsOutline, size: 110, opacity: 0.05, left: '2%',  top: '62%', rotate: 22,  floatY: 9,   floatDelay: 1.4, floatDur: 4.8 },
  ],
];

interface FloatingBgProps {
  layout?: 0 | 1 | 2;
  scrollFactor?: number;
}

export function FloatingToolsBg({ layout = 0, scrollFactor = 0.15 }: FloatingBgProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -120 * scrollFactor * 10]);

  return (
    <div
      ref={ref}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}
    >
      <motion.div style={{ y, position: 'absolute', inset: 0 }}>
        {toolLayouts[layout].map((t, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, t.floatY, 0] }}
            transition={{ duration: t.floatDur, repeat: Infinity, ease: 'easeInOut', delay: t.floatDelay }}
            style={{
              position: 'absolute',
              left: t.left,
              top: t.top,
              transform: `rotate(${t.rotate}deg)`,
            }}
          >
            <t.Component size={t.size} opacity={t.opacity} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ANIMATED PAGE TITLE BAND
   (scrolling ticker with pole stripe above)
───────────────────────────────────────── */
export function PageHeroBand({
  label,
  title,
  subtitle,
}: {
  label: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div style={{ paddingTop: '80px' }}>
      <BarberPoleDivider height={4} />
      <section
        style={{ background: '#FFFFFF', padding: '60px 0 40px', position: 'relative', overflow: 'hidden' }}
      >
        <FloatingToolsBg layout={0} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '14px',
            }}
          >
            <div style={{ width: '32px', height: '2px', background: RED }} />
            <span style={{ color: RED, fontSize: '12px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              {label}
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(40px, 6vw, 72px)',
              color: '#0D0D0D',
              letterSpacing: '0.02em',
              margin: 0,
            }}
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{ color: '#666', fontSize: '17px', lineHeight: 1.65, marginTop: '14px', maxWidth: '560px' }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </section>
      <BarberPoleDivider height={4} />
    </div>
  );
}
