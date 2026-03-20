import { Link } from 'react-router';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { motion } from 'motion/react';
import logoImg from '@/assets/bf79a2c11bccd3308e961cbe03a60b3b3f1f2f07.png';
import { BarberPoleDivider } from './BarberDecor';

const RED  = '#D42B2B';
const BLUE = '#2255CC';

export function Footer() {
  return (
    <footer style={{ background: '#F8F7F5', borderTop: '1px solid #E8E6E3' }} className="pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12"
          style={{ borderBottom: '1px solid #E8E6E3' }}
        >
          {/* Logo & desc */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-0 mb-5 group">
              <img src={logoImg} alt="BARBER HOUSE" style={{ height: '52px', width: 'auto' }} />
            </Link>
            <p style={{ color: '#777', fontSize: '13px', lineHeight: 1.7 }}>
              Школа барберинга в Воронеже. Обучаем с нуля до мастера — с гарантией трудоустройства.
            </p>
            <div className="flex gap-2 mt-5 flex-wrap">
              {[
                { label: 'ВК',     href: '#' },
                { label: 'TG',     href: 'https://t.me/barberhouse_vrn' },
                { label: 'YT',     href: '#' },
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
            <ul className="flex flex-col gap-2">
              {[
                { label: 'Курсы',        href: '/courses' },
                { label: 'О школе',      href: '/about' },
                { label: 'Преподаватели',href: '/teachers' },
                { label: 'Расписание',   href: '/schedule' },
                { label: 'Карьера',      href: '/career' },
                { label: 'Выпускники',   href: '/graduates' },
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
            <ul className="flex flex-col gap-2">
              {[
                { label: '🔥 Акции и сезонки', href: '/seasonal' },
                { label: 'Стать моделью',       href: '/become-model' },
                { label: 'Блог',                href: '/blog' },
                { label: 'Контакты',            href: '/contacts' },
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
                <span style={{ color: '#666', fontSize: '13px' }}>г. Воронеж, ул. Плехановская, 67</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} color={RED} className="shrink-0" />
                <a href="tel:+79001234567" style={{ color: '#666', fontSize: '13px' }}>+7 (900) 123-45-67</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={15} color={RED} className="shrink-0" />
                <a href="mailto:info@barberhouse.ru" style={{ color: '#666', fontSize: '13px' }}>info@barberhouse.ru</a>
              </div>
              <div className="flex items-center gap-2">
                <Send size={15} color={BLUE} className="shrink-0" />
                <a href={`https://t.me/${tgChannel}`} style={{ color: '#666', fontSize: '13px' }}>@barberhouse_vrn</a>
              </div>
            </div>
          </div>
        </div>

        {/* Barber pole accent line */}
        <div style={{ margin: '0 0 24px' }}>
          <BarberPoleDivider height={3} />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span style={{ color: '#AAA', fontSize: '12px' }}>© 2026 BARBER HOUSE — Школа барберинга. Воронеж. Все права защищены.</span>
          <span style={{ color: '#AAA', fontSize: '12px' }}>Welcome to the craft</span>
        </div>
      </div>
    </footer>
  );
}
