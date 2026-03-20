import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import logoImg from '@/assets/bf79a2c11bccd3308e961cbe03a60b3b3f1f2f07.png';
import { BarberPoleDivider } from './BarberDecor';

const RED  = '#D42B2B';
const BLUE = '#2255CC';

const navLinks = [
  { label: 'Курсы',         href: '/courses' },
  { label: 'О школе',       href: '/about' },
  { label: 'Преподаватели', href: '/teachers' },
  { label: 'Акции',         href: '/seasonal' },
  { label: 'Расписание',    href: '/schedule' },
  { label: 'Карьера',       href: '/career' },
  { label: 'Выпускники',    href: '/graduates' },
  { label: 'Блог',          href: '/blog' },
  { label: 'Контакты',      href: '/contacts' },
];

export function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location              = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <>
      <header
        style={{
          background:   scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: scrolled ? '1px solid #E8E6E3' : '1px solid transparent',
          boxShadow:    scrolled ? '0 2px 20px rgba(0,0,0,0.07)' : 'none',
          transition:   'all 0.35s ease',
        }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        {/* Pole stripe — only when not scrolled */}
        <div style={{ overflow: 'hidden', height: scrolled ? 0 : 3, transition: 'height 0.35s ease' }}>
          <BarberPoleDivider height={3} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-[68px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-0 group">
            <img src={logoImg} alt="BARBER HOUSE" style={{ height: '46px', width: 'auto', display: 'block' }} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-5">
            {navLinks.map(link => {
              const isActive = location.pathname === link.href;
              const isPromo  = link.href === '/seasonal';
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  style={{
                    color:           isActive ? RED : isPromo ? RED : '#333333',
                    fontSize:        '12px',
                    fontWeight:      600,
                    letterSpacing:   '0.07em',
                    textTransform:   'uppercase',
                    transition:      'color 0.2s',
                    position:        'relative',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = RED)}
                  onMouseLeave={e => (e.currentTarget.style.color = isActive ? RED : isPromo ? RED : '#333333')}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      style={{ position: 'absolute', bottom: '-4px', left: 0, right: 0, height: '2px', background: RED, borderRadius: '1px' }}
                    />
                  )}
                  {isPromo && (
                    <span style={{
                      position: 'absolute', top: '-8px', right: '-8px',
                      background: RED, color: '#fff', borderRadius: '4px',
                      fontSize: '8px', padding: '1px 4px', fontWeight: 800, letterSpacing: 0,
                    }}>HOT</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <motion.a
              href={`https://wa.me/${waPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background:    RED,
                color:         '#FFFFFF',
                borderRadius:  '8px',
                padding:       '9px 22px',
                fontWeight:    700,
                fontSize:      '12px',
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                display:       'inline-block',
              }}
            >
              Записаться
            </motion.a>
          </div>

          {/* Mobile burger */}
          <button
            className="lg:hidden p-2"
            onClick={() => setOpen(!open)}
            aria-label="Меню"
            style={{ color: '#0D0D0D' }}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ background: '#FFFFFF', borderLeft: '1px solid #E8E6E3', boxShadow: '-4px 0 24px rgba(0,0,0,0.08)' }}
            className="fixed top-0 right-0 bottom-0 w-72 z-50 flex flex-col pb-8 px-6"
          >
            <div style={{ paddingTop: '20px' }}>
              <button
                onClick={() => setOpen(false)}
                className="absolute top-5 right-5 p-2"
                style={{ color: '#888' }}
              >
                <X size={24} />
              </button>

              <div style={{ marginBottom: '8px' }}>
                <img src={logoImg} alt="BARBER HOUSE" style={{ height: '42px', width: 'auto' }} />
              </div>
              <BarberPoleDivider height={3} />

              <nav className="flex flex-col gap-0 mt-4">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    style={{
                      color:         location.pathname === link.href ? RED : '#333333',
                      padding:       '11px 0',
                      fontSize:      '14px',
                      fontWeight:    600,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      borderBottom:  '1px solid #F0EDE8',
                      display:       'flex',
                      alignItems:    'center',
                      gap:           '8px',
                    }}
                  >
                    {link.label}
                    {link.href === '/seasonal' && (
                      <span style={{ background: RED, color: '#fff', borderRadius: '4px', fontSize: '9px', padding: '1px 5px', fontWeight: 800 }}>HOT</span>
                    )}
                  </Link>
                ))}
              </nav>

              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={`https://wa.me/${waPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ background: RED, color: '#FFFFFF', borderRadius: '8px', padding: '12px', fontWeight: 700, fontSize: '14px', textAlign: 'center', letterSpacing: '0.05em', textTransform: 'uppercase' }}
                >
                  WhatsApp
                </a>
                <a
                  href={`https://t.me/${tgChannel}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ background: BLUE, color: '#FFFFFF', borderRadius: '8px', padding: '12px', fontWeight: 700, fontSize: '14px', textAlign: 'center', letterSpacing: '0.05em', textTransform: 'uppercase' }}
                >
                  Telegram
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.25)' }}
          />
        )}
      </AnimatePresence>
    </>
  );
}