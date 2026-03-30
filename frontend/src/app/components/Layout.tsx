import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import { useSettings } from '../hooks/useAPI';
import { BarberPoleDivider } from './UI';

const RED = '#D42B2B';
const NAV_LINKS = [
  { to: '/', label: 'Главная' },
  { to: '/courses', label: 'Курсы' },
  { to: '/schedule', label: 'Расписание' },
  { to: '/teachers', label: 'Преподаватели' },
  { to: '/graduates', label: 'Выпускники' },
  { to: '/about', label: 'О школе' },
  { to: '/blog', label: 'Блог' },
  { to: '/seasonal', label: 'Акции' },
  { to: '/contacts', label: 'Контакты' },
];

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { data: settings } = useSettings();
  const phone = settings.phone || '+7 (900) 123-45-67';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ background: '#0D0D0D', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #222' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between" style={{ height: '64px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', color: '#FFFFFF', letterSpacing: '0.08em' }}>
              BARBER <span style={{ color: RED }}>HOUSE</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(l => (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  color: location.pathname === l.to ? RED : '#AAA',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  transition: 'color 0.2s',
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="hidden sm:flex items-center gap-2" style={{ color: '#AAA', fontSize: '12px' }}>
              <Phone size={13} color={RED} /> {phone}
            </a>
            <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ color: '#FFF', background: 'none', border: 'none', cursor: 'pointer' }}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden', background: '#111' }}
            >
              <nav className="flex flex-col gap-1 p-4">
                {NAV_LINKS.map(l => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      color: location.pathname === l.to ? RED : '#AAA',
                      fontSize: '13px',
                      fontWeight: 700,
                      padding: '10px 12px',
                      borderRadius: '6px',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Content */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <BarberPoleDivider />
      <footer style={{ background: '#0D0D0D', padding: '48px 0 24px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: '#FFFFFF', letterSpacing: '0.08em', marginBottom: '12px' }}>
                BARBER <span style={{ color: RED }}>HOUSE</span>
              </div>
              <p style={{ color: '#777', fontSize: '13px', lineHeight: 1.7 }}>Школа барберинга нового поколения. Воронеж.</p>
            </div>
            <div>
              <div style={{ color: '#FFFFFF', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>Навигация</div>
              <div className="flex flex-col gap-2">
                {NAV_LINKS.slice(0, 6).map(l => (
                  <Link key={l.to} to={l.to} style={{ color: '#777', fontSize: '13px', transition: 'color 0.2s' }}>{l.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <div style={{ color: '#FFFFFF', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>Контакты</div>
              <div className="flex flex-col gap-2" style={{ color: '#777', fontSize: '13px' }}>
                <div>{settings.address || 'г. Воронеж'}</div>
                <div>{phone}</div>
                <div>{settings.email || 'info@barberhouse.ru'}</div>
                <div>{settings.work_hours || 'Пн–Сб: 9:00–20:00'}</div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #222', paddingTop: '16px', color: '#555', fontSize: '12px', textAlign: 'center' }}>
            © {new Date().getFullYear()} BARBER HOUSE. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}
