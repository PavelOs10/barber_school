import { useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router';
import { ArrowRight, MessageCircle, CheckCircle } from 'lucide-react';
import logoImg from '@/assets/bf79a2c11bccd3308e961cbe03a60b3b3f1f2f07.png';

const RED = '#D42B2B';
const BLUE = '#2255CC';

/* ─────────────────────────────────────────
   PARTICLE SYSTEM
───────────────────────────────────────── */
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  opacity: number; size: number; decay: number; color: string;
}

const POWDER_COLORS = [
  'rgba(200,185,158,', 'rgba(218,200,172,',
  'rgba(240,225,200,', 'rgba(195,178,148,',
];

/* ─────────────────────────────────────────
   SVG TOOL COMPONENTS
───────────────────────────────────────── */
function ScissorsSVG() {
  return (
    <svg width="68" height="148" viewBox="0 0 68 148" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sc_b1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#BBBBBB"/><stop offset="45%" stopColor="#F4F4F4"/><stop offset="100%" stopColor="#888"/>
        </linearGradient>
        <linearGradient id="sc_b2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#888"/><stop offset="55%" stopColor="#F4F4F4"/><stop offset="100%" stopColor="#BBBBBB"/>
        </linearGradient>
        <filter id="sc_sh"><feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.14"/></filter>
      </defs>
      <g filter="url(#sc_sh)">
        {/* Blades */}
        <path d="M7 6 C9 4 20 4 22 8 L33 70 L23 72 Z" fill="url(#sc_b1)"/>
        <path d="M61 6 C59 4 48 4 46 8 L35 70 L45 72 Z" fill="url(#sc_b2)"/>
        {/* Blade edge highlights */}
        <line x1="8" y1="7" x2="33" y2="70" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.7"/>
        <line x1="60" y1="7" x2="35" y2="70" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.7"/>
        {/* Pivot */}
        <circle cx="34" cy="73" r="8.5" fill="#777" stroke="#555" strokeWidth="1.5"/>
        <circle cx="34" cy="73" r="4" fill="#555"/>
        <line x1="29.5" y1="73" x2="38.5" y2="73" stroke="#444" strokeWidth="1.5"/>
        <line x1="34" y1="68.5" x2="34" y2="77.5" stroke="#444" strokeWidth="1.5"/>
        {/* Left arm + ring */}
        <path d="M23 72 L19 88 C17 100 10 103 10 116 C10 130 22 138 27 133 C32 128 30 112 30 100 L33 72 Z" fill="url(#sc_b1)" stroke="#AAA" strokeWidth="0.7"/>
        <circle cx="18" cy="118" r="14" fill="none" stroke="#999" strokeWidth="3.5"/>
        {/* Right arm + ring */}
        <path d="M45 72 L49 88 C51 100 58 103 58 116 C58 130 46 138 41 133 C36 128 38 112 38 100 L35 72 Z" fill="url(#sc_b2)" stroke="#AAA" strokeWidth="0.7"/>
        <circle cx="50" cy="118" r="14" fill="none" stroke="#999" strokeWidth="3.5"/>
      </g>
    </svg>
  );
}

function ClipperSVG() {
  return (
    <svg width="92" height="134" viewBox="0 0 92 134" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cl_body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2E2E2E"/><stop offset="65%" stopColor="#191919"/><stop offset="100%" stopColor="#111"/>
        </linearGradient>
        <linearGradient id="cl_side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#555"/><stop offset="100%" stopColor="#222"/>
        </linearGradient>
        <filter id="cl_sh"><feDropShadow dx="3" dy="6" stdDeviation="6" floodColor="#000" floodOpacity="0.22"/></filter>
      </defs>
      <g filter="url(#cl_sh)">
        {/* Body */}
        <rect x="9" y="9" width="74" height="96" rx="15" fill="url(#cl_body)"/>
        {/* Left edge highlight */}
        <rect x="9" y="9" width="10" height="96" rx="15 0 0 15" fill="url(#cl_side)" opacity="0.4"/>
        {/* Top edge highlight */}
        <rect x="9" y="9" width="74" height="8" rx="15 15 0 0" fill="#3A3A3A" opacity="0.5"/>
        {/* Power button */}
        <rect x="28" y="16" width="36" height="18" rx="6" fill={RED} opacity="0.92"/>
        <circle cx="46" cy="25" r="5.5" fill="#FF7070" opacity="0.55"/>
        {/* Logo accent band */}
        <rect x="9" y="42" width="74" height="7" fill={RED} opacity="0.8"/>
        {/* Grip texture */}
        {[62, 68, 74, 80, 87].map((y, i) => (
          <line key={i} x1="17" y1={y} x2="75" y2={y} stroke="#2D2D2D" strokeWidth="1.8"/>
        ))}
        {/* Blade housing */}
        <rect x="13" y="102" width="66" height="24" rx="6" fill="#323232"/>
        <rect x="13" y="102" width="66" height="7" fill="#3A3A3A"/>
        {/* Blade teeth */}
        {Array.from({ length: 17 }).map((_, i) => (
          <rect key={i} x={15 + i * 3.8} y={118} width="2.4" height="10" rx="1.2" fill="#C4C4C4"/>
        ))}
      </g>
    </svg>
  );
}

function StraightRazorSVG() {
  return (
    <svg width="156" height="72" viewBox="0 0 156 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rz_handle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3C3C3C"/><stop offset="100%" stopColor="#1C1C1C"/>
        </linearGradient>
        <linearGradient id="rz_blade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EBEBEB"/><stop offset="40%" stopColor="#D0D0D0"/><stop offset="100%" stopColor="#9A9A9A"/>
        </linearGradient>
        <filter id="rz_sh"><feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.16"/></filter>
      </defs>
      <g filter="url(#rz_sh)">
        {/* Handle */}
        <rect x="5" y="22" width="76" height="26" rx="13" fill="url(#rz_handle)"/>
        {/* Handle rivets */}
        <circle cx="20" cy="35" r="4.5" fill="#555"/>
        <circle cx="40" cy="35" r="4.5" fill="#555"/>
        <circle cx="60" cy="35" r="4.5" fill="#555"/>
        {/* Top edge highlight */}
        <rect x="5" y="22" width="76" height="5" rx="13 13 0 0" fill="#505050" opacity="0.5"/>
        {/* Pivot */}
        <circle cx="83" cy="35" r="7" fill="#888" stroke="#666" strokeWidth="1.8"/>
        <circle cx="83" cy="35" r="3" fill="#555"/>
        {/* Blade */}
        <path d="M83 27 L148 11 L152 35 L148 59 L83 43 Z" fill="url(#rz_blade)"/>
        {/* Edge */}
        <line x1="83" y1="27" x2="152" y2="11" stroke="#F8F8F8" strokeWidth="1"/>
        {/* Spine */}
        <line x1="83" y1="35" x2="152" y2="35" stroke="#B0B0B0" strokeWidth="2"/>
        {/* Blade face highlight */}
        <path d="M83 30 L148 16 L148 20 L83 34 Z" fill="#FFFFFF" opacity="0.2"/>
      </g>
    </svg>
  );
}

function BrushSVG() {
  return (
    <svg width="62" height="152" viewBox="0 0 62 152" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="br_handle" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7A5C10"/><stop offset="42%" stopColor="#D4A030"/><stop offset="100%" stopColor="#7A5C10"/>
        </linearGradient>
        <linearGradient id="br_head" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2E1A08"/><stop offset="100%" stopColor="#180E04"/>
        </linearGradient>
        <filter id="br_sh"><feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.15"/></filter>
      </defs>
      <g filter="url(#br_sh)">
        {/* Handle */}
        <rect x="23" y="5" width="16" height="84" rx="8" fill="url(#br_handle)"/>
        {/* Handle ridges */}
        {[35, 48, 61, 74].map((y, i) => (
          <rect key={i} x="21" y={y} width="20" height="3.5" rx="1.75" fill="#5C3E0C" opacity="0.55"/>
        ))}
        {/* Ferrule */}
        <rect x="19" y="84" width="24" height="14" rx="3.5" fill="#C2C2C2" stroke="#A2A2A2" strokeWidth="1.2"/>
        <line x1="19" y1="91" x2="43" y2="91" stroke="#B0B0B0" strokeWidth="1"/>
        {/* Bristle head */}
        <ellipse cx="31" cy="124" rx="22" ry="26" fill="url(#br_head)"/>
        {/* Bristles */}
        {[-10, -5, 0, 5, 10].map((x, i) => (
          <line key={i} x1={31 + x} y1="99" x2={31 + x * 0.7} y2="146" stroke="#4A2C10" strokeWidth="1.8" strokeOpacity="0.45"/>
        ))}
        <ellipse cx="31" cy="99" rx="22" ry="6.5" fill="#3A2010"/>
      </g>
    </svg>
  );
}

function SprayBottleSVG() {
  return (
    <svg width="78" height="148" viewBox="0 0 78 148" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sp_bottle" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#CCE8F5" stopOpacity="0.94"/>
          <stop offset="42%" stopColor="#EEF8FF" stopOpacity="0.97"/>
          <stop offset="100%" stopColor="#AADCED" stopOpacity="0.9"/>
        </linearGradient>
        <filter id="sp_sh"><feDropShadow dx="2" dy="5" stdDeviation="5" floodColor="#000" floodOpacity="0.12"/></filter>
      </defs>
      <g filter="url(#sp_sh)">
        {/* Bottle body */}
        <rect x="19" y="65" width="50" height="76" rx="11" fill="url(#sp_bottle)" stroke="#A2CCDE" strokeWidth="1.5"/>
        {/* Liquid */}
        <rect x="19" y="106" width="50" height="35" rx="0 0 11 11" fill="#68B0CC" opacity="0.22"/>
        {/* Label */}
        <rect x="25" y="84" width="38" height="30" rx="5" fill={BLUE} opacity="0.78"/>
        {[90, 97, 104].map((y, i) => (
          <rect key={i} x="30" y={y} width={26 - i * 5} height="2.5" rx="1.25" fill="#FFF" opacity="0.45"/>
        ))}
        {/* Neck */}
        <rect x="27" y="46" width="34" height="22" rx="6" fill="#B2D4E8" stroke="#90C0D8" strokeWidth="1.2"/>
        {/* Head / trigger housing */}
        <rect x="9" y="34" width="50" height="16" rx="8" fill="#888"/>
        {/* Spray tube */}
        <rect x="57" y="37" width="18" height="7.5" rx="3.75" fill="#777"/>
        {/* Nozzle */}
        <circle cx="75" cy="40.75" r="3" fill="#555"/>
        {/* Trigger */}
        <path d="M25 50 C16 50 11 58 15 66 L22 66 L22 50 Z" fill="#666"/>
        {/* Top handle highlight */}
        <rect x="9" y="34" width="50" height="5" rx="8 8 0 0" fill="#A0A0A0" opacity="0.35"/>
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────
   HERO SECTION COMPONENT
───────────────────────────────────────── */
export function BarberHeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  /* Scroll parallax */
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const toolsY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const textY  = useTransform(scrollYProgress, [0, 1], [0, -55]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  /* ── Canvas particle loop ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter(p => p.opacity > 0.008);

      for (const p of particlesRef.current) {
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += 0.014;   // gravity
        p.vx *= 0.984;   // air drag
        p.vy *= 0.992;
        p.opacity -= p.decay;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.opacity + ')';
        ctx.fill();
        ctx.restore();
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      ro.disconnect();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  /* ── Emit powder from canvas coordinates ── */
  const emitAt = useCallback((cx: number, cy: number, count = 55) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.8 + 0.4;
      particlesRef.current.push({
        x:       cx + (Math.random() - 0.5) * 32,
        y:       cy + (Math.random() - 0.5) * 20,
        vx:      Math.cos(angle) * speed * 0.75,
        vy:      Math.sin(angle) * speed * 0.75 - 1.6,
        opacity: Math.random() * 0.65 + 0.3,
        size:    Math.random() * 4.5 + 1,
        decay:   Math.random() * 0.005 + 0.0022,
        color:   POWDER_COLORS[Math.floor(Math.random() * POWDER_COLORS.length)],
      });
    }
  }, []);

  const emitAtPercent = useCallback((px: number, py: number, count: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    emitAt(canvas.offsetWidth * px, canvas.offsetHeight * py, count);
  }, [emitAt]);

  /* ── Schedule particle bursts timed to tool landings ── */
  useEffect(() => {
    // [pctX, pctY, count, delay_ms]
    const bursts: [number, number, number, number][] = [
      [0.12, 0.42, 52,  1100],  // scissors lands
      [0.12, 0.42, 28,  1350],  // scissors echo
      [0.85, 0.22, 52,  1250],  // razor lands
      [0.85, 0.22, 28,  1480],  // razor echo
      [0.08, 0.62, 58,  1600],  // clipper lands
      [0.08, 0.62, 30,  1850],  // clipper echo
      [0.90, 0.52, 52,  1850],  // brush lands
      [0.90, 0.52, 26,  2100],  // brush echo
      [0.82, 0.73, 48,  2050],  // spray lands
      [0.82, 0.73, 24,  2280],  // spray echo
      // Center powder cloud rising toward text
      [0.50, 0.55, 90,  2300],
      [0.45, 0.48, 65,  2550],
      [0.55, 0.48, 65,  2700],
      [0.50, 0.40, 80,  2900],
    ];

    const timers = bursts.map(([px, py, cnt, delay]) =>
      setTimeout(() => emitAtPercent(px, py, cnt), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [emitAtPercent]);

  /* ── CTA hover reaction ── */
  const handleCTAHover = useCallback(() => {
    emitAtPercent(0.5, 0.76, 28);
  }, [emitAtPercent]);

  /* ── Shared spring config for tool fall ── */
  const fallTransition = (delay: number, stiffness = 80, damping = 15) => ({
    y:       { type: 'spring' as const, stiffness, damping, delay },
    rotate:  { duration: 1.3, delay, ease: [0.16, 1, 0.3, 1] as any },
    opacity: { duration: 0.35, delay },
  });

  return (
    <section
      ref={heroRef}
      style={{
        background: '#FFFFFF',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '80px',
      }}
    >
      {/* Subtle dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, #D4D4D4 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        opacity: 0.5,
        zIndex: 0,
        pointerEvents: 'none',
      }} />

      {/* Very subtle gradient wash */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,43,43,0.04) 0%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />

      {/* ── Canvas for powder particles ── */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* ──────────── TOOLS (desktop only) ──────────── */}

      {/* LEFT: Scissors */}
      <motion.div style={{ position: 'absolute', left: '3%', top: '26%', zIndex: 3, y: toolsY }}>
        <motion.div
          initial={{ y: -340, rotate: -120, opacity: 0 }}
          animate={{ y: 0,    rotate: -22,  opacity: 1 }}
          transition={fallTransition(0.0, 85, 14)}
          className="hidden lg:block"
        >
          <motion.div
            animate={{ y: [0, -7, 0], rotate: [-22, -19, -22] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 2.2 }}
          >
            <ScissorsSVG />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* LEFT: Clipper */}
      <motion.div style={{ position: 'absolute', left: '1.5%', top: '56%', zIndex: 3, y: toolsY }}>
        <motion.div
          initial={{ y: -440, rotate: 20, opacity: 0 }}
          animate={{ y: 0,    rotate: 9,  opacity: 1 }}
          transition={fallTransition(0.22, 58, 17)}
          className="hidden lg:block"
        >
          <motion.div
            animate={{ y: [0, 9, 0], rotate: [9, 11, 9] }}
            transition={{ duration: 5.1, repeat: Infinity, ease: 'easeInOut', delay: 2.7 }}
          >
            <ClipperSVG />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* RIGHT: Straight Razor */}
      <motion.div style={{ position: 'absolute', right: '2%', top: '14%', zIndex: 3, y: toolsY }}>
        <motion.div
          initial={{ y: -380, rotate: -60, opacity: 0 }}
          animate={{ y: 0,    rotate: 28,  opacity: 1 }}
          transition={fallTransition(0.1, 92, 14)}
          className="hidden lg:block"
        >
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [28, 25, 28] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 2.4 }}
          >
            <StraightRazorSVG />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* RIGHT: Brush */}
      <motion.div style={{ position: 'absolute', right: '1.5%', top: '50%', zIndex: 3, y: toolsY }}>
        <motion.div
          initial={{ y: -360, rotate: 40, opacity: 0 }}
          animate={{ y: 0,    rotate: -14, opacity: 1 }}
          transition={fallTransition(0.28, 76, 15)}
          className="hidden lg:block"
        >
          <motion.div
            animate={{ y: [0, 8, 0], rotate: [-14, -11, -14] }}
            transition={{ duration: 3.9, repeat: Infinity, ease: 'easeInOut', delay: 3.0 }}
          >
            <BrushSVG />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* RIGHT: Spray Bottle */}
      <motion.div style={{ position: 'absolute', right: '9%', bottom: '10%', zIndex: 3, y: toolsY }}>
        <motion.div
          initial={{ y: -300, rotate: -25, opacity: 0 }}
          animate={{ y: 0,    rotate: 12,  opacity: 1 }}
          transition={fallTransition(0.38, 68, 16)}
          className="hidden lg:block"
        >
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [12, 14, 12] }}
            transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut', delay: 3.2 }}
          >
            <SprayBottleSVG />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ──────────── MAIN CONTENT ──────────── */}
      <motion.div
        style={{ y: textY, opacity: heroOpacity, position: 'relative', zIndex: 10, width: '100%' }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center py-16 lg:py-24">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: '24px' }}
          >
            <img src={logoImg} alt="BARBER HOUSE" style={{ height: '68px', width: 'auto' }} />
          </motion.div>

          {/* Label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.18 }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px' }}
          >
            <div style={{ width: '36px', height: '2px', background: RED }} />
            <span style={{ color: RED, fontSize: '12px', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase' }}>
              Школа барберинга • Воронеж
            </span>
            <div style={{ width: '36px', height: '2px', background: RED }} />
          </motion.div>

          {/* ── HEADING: powder reveal ── */}
          <motion.div
            initial={{ opacity: 0, filter: 'blur(28px)', y: 18 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 1.8, delay: 3.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(58px, 11vw, 124px)',
              lineHeight: 0.88,
              color: '#0D0D0D',
              letterSpacing: '0.025em',
              marginBottom: '4px',
            }}
          >
            СТАНЬ БАРБЕРОМ
          </motion.div>

          <motion.div
            initial={{ opacity: 0, filter: 'blur(22px)', y: 14 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 1.5, delay: 3.85, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(58px, 11vw, 124px)',
              lineHeight: 0.88,
              color: RED,
              letterSpacing: '0.025em',
              marginBottom: '32px',
              display: 'block',
            }}
          >
            ЗА 4 НЕДЕЛИ
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 4.7 }}
            style={{ color: '#555555', fontSize: '17px', lineHeight: 1.68, maxWidth: '540px', marginBottom: '22px' }}
          >
            Школа барберинга BARBER HOUSE в Воронеже: полная программа, лучшие мастера,
            практика на моделях и{' '}
            <strong style={{ color: '#0D0D0D' }}>гарантия трудоустройства</strong>
          </motion.p>

          {/* Check points */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 4.95 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', justifyContent: 'center', marginBottom: '36px' }}
          >
            {[
              'Обучим с нуля — опыт не нужен',
              'Заработок от 60 000 ₽ сразу',
              'Рассрочка 0% без переплат',
            ].map(p => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <CheckCircle size={15} color={RED} />
                <span style={{ color: '#333', fontSize: '14px', fontWeight: 600 }}>{p}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 5.3 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}
          >
            <motion.div
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.97 }}
              onHoverStart={handleCTAHover}
            >
              <Link
                to="/courses"
                style={{
                  background: RED,
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '16px 38px',
                  fontWeight: 800,
                  fontSize: '14px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '9px',
                  boxShadow: `0 10px 35px ${RED}38`,
                  transition: 'box-shadow 0.3s',
                }}
              >
                Подобрать курс <ArrowRight size={16} />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }}>
              <a
                href={`https://wa.me/79001234567?text=Хочу%20получить%20консультацию`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  border: '2px solid #0D0D0D',
                  color: '#0D0D0D',
                  borderRadius: '12px',
                  padding: '16px 38px',
                  fontWeight: 700,
                  fontSize: '14px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '9px',
                  background: 'transparent',
                  transition: 'background 0.25s, color 0.25s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#0D0D0D';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#0D0D0D';
                }}
              >
                <MessageCircle size={16} /> Консультация
              </a>
            </motion.div>
          </motion.div>

        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 6.2 }}
        style={{ position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
      >
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
        >
          <span style={{ color: '#AAAAAA', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase' }}>Листай вниз</span>
          <div style={{ width: '1.5px', height: '38px', background: `linear-gradient(to bottom, ${RED}, transparent)` }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
