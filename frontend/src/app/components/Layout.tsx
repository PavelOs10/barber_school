import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MapPin, Phone, Mail, Send } from 'lucide-react';
import { useSettings } from '../hooks/useAPI';
import { BarberPoleDivider } from './UI';

const RED = '#D42B2B';
const BLUE = '#2255CC';

const navLinks = [
  { label: 'Курсы', href: '/courses' },
  { label: 'О школе', href: '/about' },
  { label: 'Преподаватели', href: '/teachers' },
  { label: 'Акции', href: '/seasonal' },
  { label: 'Расписание', href: '/schedule' },
  { label: 'Карьера', href: '/career' },
  { label: 'Выпускники', href: '/graduates' },
  { label: 'Блог', href: '/blog' },
  { label: 'Контакты', href: '/contacts' },
];

export function Layout() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { data: settings } = useSettings();
  const phone = settings.phone || '+7 (900) 123-45-67';
  const waPhone = settings.whatsapp_phone || '79001234567';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [location.pathname]);

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }} className="overflow-x-hidden">
      {/* ── HEADER (white, matching maket) ── */}
      <header
        style={{
          background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: scrolled ? '1px solid #E8E6E3' : '1px solid transparent',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.07)' : 'none',
          transition: 'all 0.35s ease',
        }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        {/* Barber pole stripe — only when not scrolled */}
        <div style={{ overflow: 'hidden', height: scrolled ? 0 : 3, transition: 'height 0.35s ease' }}>
          <BarberPoleDivider height={3} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-[68px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-0 group">
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: '#0D0D0D', letterSpacing: '0.06em' }}>
              BARBER <span style={{ color: RED }}>HOUSE</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-5">
            {navLinks.map(link => {
              const isActive = location.pathname === link.href;
              const isPromo = link.href === '/seasonal';
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  style={{
                    color: isActive ? RED : isPromo ? RED : '#333333',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                    transition: 'color 0.2s',
                    position: 'relative',
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
                background: RED, color: '#FFFFFF', borderRadius: '8px',
                padding: '9px 22px', fontWeight: 700, fontSize: '12px',
                letterSpacing: '0.07em', textTransform: 'uppercase', display: 'inline-block',
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
            style={{ color: '#0D0D0D', background: 'none', border: 'none', cursor: 'pointer' }}
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
                style={{ color: '#888', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>

              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', color: '#0D0D0D', letterSpacing: '0.06em' }}>
                  BARBER <span style={{ color: RED }}>HOUSE</span>
                </span>
              </div>
              <BarberPoleDivider height={3} />

              <nav className="flex flex-col gap-0 mt-4">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    style={{
                      color: location.pathname === link.href ? RED : '#333333',
                      padding: '11px 0', fontSize: '14px', fontWeight: 600,
                      letterSpacing: '0.05em', textTransform: 'uppercase',
                      borderBottom: '1px solid #F0EDE8',
                      display: 'flex', alignItems: 'center', gap: '8px',
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
                  href={`https://t.me/${settings.telegram_channel || 'barberhouse_vrn'}`}
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

      {/* Content */}
      <main>
        <Outlet />
      </main>

      {/* ── FOOTER (light background, matching maket) ── */}
      <footer style={{ background: '#F8F7F5', borderTop: '1px solid #E8E6E3' }} className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12"
            style={{ borderBottom: '1px solid #E8E6E3' }}
          >
            {/* Logo & desc */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center gap-0 mb-5 group">
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', color: '#0D0D0D', letterSpacing: '0.06em' }}>
                  BARBER <span style={{ color: RED }}>HOUSE</span>
                </span>
              </Link>
              <p style={{ color: '#777', fontSize: '13px', lineHeight: 1.7 }}>
                Школа барберинга в Воронеже. Обучаем с нуля до мастера — с гарантией трудоустройства.
              </p>
              <div className="flex gap-2 mt-5 flex-wrap">
                {[
                  { label: 'ВК', href: '#' },
                  { label: 'TG', href: `https://t.me/${settings.telegram_channel || 'barberhouse_vrn'}` },
                  { label: 'YT', href: '#' },
                  { label: 'TikTok', href: '#' },
                ].map(s => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    whileHover={{ scale: 1.06, borderColor: RED, color: RED }}
                    style={{ border: '1px solid #D8D5D0', borderRadius: '6px', padding: '6px 10px', color: '#888', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', display: 'inline-block' }}
                  >
                    {s.label}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 style={{ color: '#0D0D0D', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>Навигация</h4>
              <ul className="flex flex-col gap-2" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  { label: 'Курсы', href: '/courses' },
                  { label: 'О школе', href: '/about' },
                  { label: 'Преподаватели', href: '/teachers' },
                  { label: 'Расписание', href: '/schedule' },
                  { label: 'Карьера', href: '/career' },
                  { label: 'Выпускники', href: '/graduates' },
                ].map(l => (
                  <li key={l.href}>
                    <Link
                      to={l.href}
                      style={{ color: '#777', fontSize: '13px', transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = RED)}
                      onMouseLeave={e => (e.currentTarget.style.color = '#777')}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sections */}
            <div>
              <h4 style={{ color: '#0D0D0D', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>Разделы</h4>
              <ul className="flex flex-col gap-2" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  { label: '🔥 Акции и сезонки', href: '/seasonal' },
                  { label: 'Стать моделью', href: '/become-model' },
                  { label: 'Блог', href: '/blog' },
                  { label: 'Контакты', href: '/contacts' },
                ].map(l => (
                  <li key={l.href}>
                    <Link
                      to={l.href}
                      style={{ color: l.href === '/seasonal' ? RED : '#777', fontSize: '13px', transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = RED)}
                      onMouseLeave={e => (e.currentTarget.style.color = l.href === '/seasonal' ? RED : '#777')}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacts */}
            <div>
              <h4 style={{ color: '#0D0D0D', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>Контакты</h4>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2">
                  <MapPin size={15} color={RED} className="mt-0.5 shrink-0" />
                  <span style={{ color: '#666', fontSize: '13px' }}>{settings.address || 'г. Воронеж, ул. Плехановская, 67'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={15} color={RED} className="shrink-0" />
                  <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} style={{ color: '#666', fontSize: '13px' }}>{phone}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={15} color={RED} className="shrink-0" />
                  <a href={`mailto:${settings.email || 'info@barberhouse.ru'}`} style={{ color: '#666', fontSize: '13px' }}>{settings.email || 'info@barberhouse.ru'}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Send size={15} color={BLUE} className="shrink-0" />
                  <a href={`https://t.me/${settings.telegram_channel || 'barberhouse_vrn'}`} style={{ color: '#666', fontSize: '13px' }}>@{settings.telegram_channel || 'barberhouse_vrn'}</a>
                </div>
              </div>
            </div>
          </div>

          {/* Barber pole accent line */}
          <div style={{ margin: '0 0 24px' }}>
            <BarberPoleDivider height={3} />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span style={{ color: '#AAA', fontSize: '12px' }}>© {new Date().getFullYear()} BARBER HOUSE — Школа барберинга. Воронеж. Все права защищены.</span>
            <span style={{ color: '#AAA', fontSize: '12px' }}>Welcome to the craft</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
