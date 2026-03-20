import { motion, useScroll, useTransform } from 'motion/react';
import { ReactNode, useRef } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none' | 'scale' | 'rotate';
  distance?: number;
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  style,
  direction = 'up',
  distance = 60,
}: Props) {
  const getInitial = () => {
    switch (direction) {
      case 'left': return { opacity: 0, x: -distance, y: 0, scale: 1, rotate: 0 };
      case 'right': return { opacity: 0, x: distance, y: 0, scale: 1, rotate: 0 };
      case 'down': return { opacity: 0, y: -distance, x: 0, scale: 1, rotate: 0 };
      case 'scale': return { opacity: 0, scale: 0.8, x: 0, y: 0, rotate: 0 };
      case 'rotate': return { opacity: 0, rotate: -8, x: 0, y: distance / 2, scale: 0.95 };
      case 'none': return { opacity: 0, x: 0, y: 0, scale: 1, rotate: 0 };
      default: return { opacity: 0, y: distance, x: 0, scale: 1, rotate: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1, rotate: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// Parallax wrapper for hero sections
interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function ParallaxSection({ children, speed = 0.3, className, style }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);

  return (
    <div ref={ref} className={className} style={{ overflow: 'hidden', ...style }}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

// Stagger container for lists
interface StaggerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ children, className, staggerDelay = 0.1 }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{ visible: { transition: { staggerChildren: staggerDelay } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};

// Horizontal scroll text ticker
interface TickerProps {
  text: string;
  speed?: number;
  color?: string;
  bg?: string;
}

export function ScrollTicker({ text, speed = 30, color = '#0D0D0D', bg = '#F0EDE8' }: TickerProps) {
  const repeated = Array(6).fill(text).join(' · ');
  return (
    <div style={{ background: bg, overflow: 'hidden', whiteSpace: 'nowrap', padding: '10px 0' }}>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        style={{
          display: 'inline-block',
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '18px',
          color,
          letterSpacing: '0.1em',
        }}
      >
        {repeated + ' · ' + repeated}
      </motion.div>
    </div>
  );
}