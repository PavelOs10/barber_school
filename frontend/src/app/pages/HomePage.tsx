import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, MessageCircle, Star, CheckCircle, Users, Award, Zap, Target, Shield, Flame } from 'lucide-react';
import { AnimatedSection, BarberPoleDivider, FloatingToolsBg, ImageWithFallback, PoleSideDecor, ScrollTicker, StaggerContainer, staggerItem } from '../components/UI';
import { useAPI, useSettings } from '../hooks/useAPI';

const RED = '#D42B2B';
const BLUE = '#2255CC';
const CARD_BG = '#FFFFFF';
const BORDER = '#EBEBEB';

const stats = [
  { value: '500+', label: 'Выпускников' },
  { value: '85%', label: 'Трудоустройство' },
  { value: '10+', label: 'Преподавателей' },
  { value: '4', label: 'Года на рынке' },
];

const advantages = [
  { icon: Star, title: 'Топовые преподаватели', text: 'Действующие барберы-чемпионы с реальной практикой и своими барбершопами' },
  { icon: Shield, title: 'Гарантия трудоустройства', text: 'При успешном окончании курса гарантируем помощь в трудоустройстве в лучшие барбершопы Воронежа' },
  { icon: Users, title: 'Практика на моделях', text: 'С первых дней обучения практикуешься на живых моделях под контролем наставника' },
  { icon: Zap, title: 'Быстрый старт', text: 'За 4 недели с нуля до уровня, с которым можно зарабатывать от 60 000 руб/месяц' },
  { icon: Target, title: 'Рассрочка 0%', text: 'Доступная рассрочка без процентов — стартуй уже сейчас, плати удобно' },
  { icon: Award, title: 'Диплом установленного образца', text: 'Сертификат международного образца, который признают лучшие барбершопы страны' },
];

export function HomePage() {
  const { data: settings } = useSettings();
  const { data: courses } = useAPI<any[]>('/courses', []);
  const { data: graduates } = useAPI<any[]>('/graduates', []);
  const { data: teachers } = useAPI<any[]>('/teachers', []);
  const { data: promos } = useAPI<any[]>('/promos', []);
  const waPhone = settings.whatsapp_phone || '79001234567';
  const topCourses = courses.slice(0, 3);

  // Find active promo
  const now = new Date().toISOString().split('T')[0];
  const activePromo = promos.find(p => now >= p.start_date && now <= p.end_date);

  return (
    <div>
      {/* ──── HERO (white background, matching maket) ──── */}
      <section
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

        {/* Subtle gradient wash */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,43,43,0.04) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none',
        }} />

        <motion.div
          style={{ position: 'relative', zIndex: 10, width: '100%' }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center py-16 lg:py-24">

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ marginBottom: '24px' }}
            >
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', color: '#0D0D0D', letterSpacing: '0.06em' }}>
                BARBER <span style={{ color: RED }}>HOUSE</span>
              </span>
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

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
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
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
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
              transition={{ duration: 0.9, delay: 0.9 }}
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
              transition={{ duration: 0.8, delay: 1.1 }}
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
              transition={{ duration: 0.9, delay: 1.3 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}
            >
              <motion.div whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/courses"
                  style={{
                    background: RED, color: '#FFFFFF', borderRadius: '12px',
                    padding: '16px 38px', fontWeight: 800, fontSize: '14px',
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    display: 'inline-flex', alignItems: 'center', gap: '9px',
                    boxShadow: `0 10px 35px ${RED}38`,
                  }}
                >
                  Подобрать курс <ArrowRight size={16} />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }}>
                <a
                  href={`https://wa.me/${waPhone}?text=Хочу%20получить%20консультацию`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    border: '2px solid #0D0D0D', color: '#0D0D0D', borderRadius: '12px',
                    padding: '16px 38px', fontWeight: 700, fontSize: '14px',
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    display: 'inline-flex', alignItems: 'center', gap: '9px',
                    background: 'transparent', transition: 'background 0.25s, color 0.25s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#0D0D0D'; e.currentTarget.style.color = '#FFFFFF'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#0D0D0D'; }}
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
          transition={{ duration: 1.2, delay: 2 }}
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

      {/* STATS BAR */}
      <section style={{ background: RED, padding: '28px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <motion.div key={s.label} variants={staggerItem} className="text-center">
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 5vw, 56px)', color: '#FFFFFF', lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ color: '#FFFFFF', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', opacity: 0.8, textTransform: 'uppercase' }}>
                  {s.label}
                </div>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* TICKER */}
      <ScrollTicker
        text="BARBER HOUSE · ШКОЛА БАРБЕРИНГА · ВОРОНЕЖ · ОБУЧЕНИЕ С НУЛЯ · ГАРАНТИЯ ТРУДОУСТРОЙСТВА"
        bg="#F0EDE8"
        color="#555"
        speed={35}
      />

      <BarberPoleDivider />

      {/* SEASONAL PROMO BANNER */}
      {activePromo && (
        <>
          <section style={{ background: '#FAFAF8', padding: '48px 0', position: 'relative', overflow: 'hidden' }}>
            <FloatingToolsBg layout={2} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
              <AnimatedSection>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: '#FFFFFF',
                    border: `1px solid ${RED}30`,
                    borderRadius: '20px',
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: `0 4px 32px ${RED}12`,
                  }}
                >
                  <BarberPoleDivider height={4} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-center">
                    <div style={{ padding: '36px 40px' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <Flame size={16} color={RED} />
                        <span style={{ color: RED, fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Горячая акция</span>
                      </div>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 5vw, 56px)', color: '#0D0D0D', lineHeight: 0.95, marginBottom: '12px' }}>
                        {activePromo.title} — <span style={{ color: RED }}>{activePromo.discount}</span>
                      </div>
                      <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.6, marginBottom: '20px' }}>
                        {activePromo.description}
                        {activePromo.promo_code && <> Промокод: <strong style={{ color: '#0D0D0D' }}>{activePromo.promo_code}</strong></>}
                      </p>
                      <Link
                        to="/seasonal"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: RED, color: '#FFFFFF', borderRadius: '10px', padding: '12px 22px', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                      >
                        Все акции <ArrowRight size={14} />
                      </Link>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', background: '#FFF8F8' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '64px', marginBottom: '8px' }}>{activePromo.icon || '🔥'}</div>
                        <div style={{ color: RED, fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em' }}>{activePromo.holiday || 'АКЦИЯ'}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            </div>
          </section>
          <BarberPoleDivider />
        </>
      )}

      {/* WHY US */}
      <section className="py-20" style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <FloatingToolsBg layout={1} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          <AnimatedSection className="text-center mb-14">
            <div style={{ color: RED, fontSize: '11px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '12px' }}>Наши преимущества</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 5vw, 60px)', color: '#0D0D0D', letterSpacing: '0.02em', margin: '0 0 12px' }}>
              ПОЧЕМУ BARBER HOUSE?
            </h2>
            <p style={{ color: '#777', fontSize: '16px', maxWidth: '480px', margin: '0 auto' }}>
              Мы не просто учим стричь — мы строим карьеры и создаём мастеров.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {advantages.map((a, i) => (
              <AnimatedSection key={a.title} delay={i * 0.08} direction="scale">
                <motion.div
                  whileHover={{ y: -5, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
                  transition={{ duration: 0.25 }}
                  style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '24px', height: '100%', cursor: 'default', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
                >
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    style={{ background: RED + '12', borderRadius: '10px', width: '46px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}
                  >
                    <a.icon size={22} color={RED} />
                  </motion.div>
                  <h3 style={{ color: '#0D0D0D', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>{a.title}</h3>
                  <p style={{ color: '#777', fontSize: '14px', lineHeight: 1.65, margin: 0 }}>{a.text}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <BarberPoleDivider />

      {/* ABOUT PREVIEW */}
      <section className="py-20" style={{ background: '#FAFAF8', position: 'relative', overflow: 'hidden' }}>
        <PoleSideDecor side="right" topPercent={40} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <div className="relative">
                <div style={{ borderRadius: '18px', overflow: 'hidden', aspectRatio: '4/3', border: `1px solid ${BORDER}`, background: '#F5F3F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '56px', color: '#0D0D0D' }}>BARBER</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '56px', color: RED }}>HOUSE</div>
                    <div style={{ color: '#AAA', fontSize: '14px', marginTop: '8px' }}>Воронеж · с 2021</div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div style={{ color: RED, fontSize: '11px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '12px' }}>О школе</div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', color: '#0D0D0D', letterSpacing: '0.02em', margin: '0 0 16px' }}>
                МЫ В ДВИЖЕНИИ —<br />БУДЬ С НАМИ
              </h2>
              <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.7, marginBottom: '16px' }}>
                BARBER HOUSE — это не просто школа. Это сообщество профессионалов, которые живут барберингом. Мы начинали с небольшого класса в Воронеже и выросли до полноценной школы с оборудованными рабочими местами и сильнейшими преподавателями.
              </p>
              <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.7, marginBottom: '28px' }}>
                Более <strong style={{ color: '#0D0D0D' }}>500 выпускников</strong> уже работают в лучших барбершопах Воронежа и по всей России. <strong style={{ color: '#0D0D0D' }}>85% из них</strong> нашли работу в течение месяца.
              </p>
              <Link
                to="/about"
                style={{ border: `1.5px solid ${RED}`, color: RED, borderRadius: '10px', padding: '12px 24px', fontWeight: 700, fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.background = RED; e.currentTarget.style.color = '#FFFFFF'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = RED; }}
              >
                Подробнее о школе <ArrowRight size={14} />
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <BarberPoleDivider />

      {/* COURSES PREVIEW from API */}
      <section className="py-20" style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <FloatingToolsBg layout={0} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          <AnimatedSection className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <div style={{ color: RED, fontSize: '11px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '8px' }}>Наши курсы</div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', color: '#0D0D0D', letterSpacing: '0.02em', margin: 0 }}>
                ВЫБЕРИ СВОЙ ПУТЬ
              </h2>
            </div>
            <Link to="/courses" style={{ color: RED, fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
              Все курсы <ArrowRight size={14} />
            </Link>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topCourses.map((c, i) => (
              <AnimatedSection key={c.id} delay={i * 0.12} direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(0,0,0,0.1)' }}
                  transition={{ duration: 0.25 }}
                  style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '18px', overflow: 'hidden', height: '100%', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
                >
                  <div style={{ height: '4px', background: c.color || RED }} />
                  <div style={{ padding: '24px' }}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 style={{ color: '#0D0D0D', fontSize: '18px', fontWeight: 700, margin: 0 }}>{c.title}</h3>
                      <span style={{ background: (c.color || RED) + '18', color: c.color || RED, borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>{c.level}</span>
                    </div>
                    <p style={{ color: '#777', fontSize: '14px', lineHeight: 1.55, marginBottom: '20px' }}>{c.subtitle || c.desc}</p>
                    <div className="flex items-center gap-2 mb-6">
                      <Clock size={14} color="#AAA" />
                      <span style={{ color: '#888', fontSize: '13px' }}>{c.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', color: c.color || RED }}>{c.price}</span>
                      <Link
                        to="/courses"
                        style={{ background: c.color || RED, color: '#FFFFFF', borderRadius: '8px', padding: '8px 18px', fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase', transition: 'opacity 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                      >
                        Записаться
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <BarberPoleDivider />

      {/* TEACHERS from API */}
      {teachers.length > 0 && (
        <>
          <section className="py-20" style={{ background: '#F8F7F5', position: 'relative', overflow: 'hidden' }}>
            <PoleSideDecor side="left" topPercent={50} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
              <AnimatedSection className="text-center mb-12">
                <div style={{ color: RED, fontSize: '11px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '8px' }}>Команда</div>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', color: '#0D0D0D', letterSpacing: '0.02em', margin: 0 }}>НАШИ ПРЕПОДАВАТЕЛИ</h2>
              </AnimatedSection>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {teachers.slice(0, 4).map((t, i) => (
                  <AnimatedSection key={t.id} delay={i * 0.1}>
                    <motion.div whileHover={{ y: -6 }} style={{ background: '#FFF', border: '1px solid #EBEBEB', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                      <div style={{ height: '220px', overflow: 'hidden' }}>
                        <ImageWithFallback src={t.photo} alt={t.name} className="w-full h-full object-cover" />
                      </div>
                      <div style={{ padding: '16px' }}>
                        <h3 style={{ color: '#0D0D0D', fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{t.name}</h3>
                        <p style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>{t.role}</p>
                        {t.experience && <span style={{ color: RED, fontSize: '11px', fontWeight: 700 }}>{t.experience}</span>}
                      </div>
                    </motion.div>
                  </AnimatedSection>
                ))}
              </div>
              <AnimatedSection className="text-center mt-8">
                <Link to="/teachers" style={{ color: RED, fontSize: '13px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  Все преподаватели <ArrowRight size={14} />
                </Link>
              </AnimatedSection>
            </div>
          </section>
          <BarberPoleDivider />
        </>
      )}

      {/* REVIEWS from API */}
      {graduates.length > 0 && (
        <>
          <section className="py-20" style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
            <FloatingToolsBg layout={2} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
              <AnimatedSection className="text-center mb-12">
                <div style={{ color: RED, fontSize: '11px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '8px' }}>Отзывы</div>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', color: '#0D0D0D', letterSpacing: '0.02em', margin: 0 }}>ЧТО ГОВОРЯТ ВЫПУСКНИКИ</h2>
              </AnimatedSection>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {graduates.slice(0, 3).map((g, i) => (
                  <AnimatedSection key={g.id} delay={i * 0.12} direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}>
                    <motion.div
                      whileHover={{ y: -4, boxShadow: '0 12px 36px rgba(0,0,0,0.08)' }}
                      transition={{ duration: 0.25 }}
                      style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '18px', padding: '26px', height: '100%', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                    >
                      <div className="flex gap-1 mb-4">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} size={14} color={RED} fill={RED} />
                        ))}
                      </div>
                      {g.quote && <p style={{ color: '#555', fontSize: '15px', lineHeight: 1.65, marginBottom: '20px' }}>"{g.quote}"</p>}
                      <div className="flex items-center gap-3">
                        {g.photo && <ImageWithFallback src={g.photo} alt={g.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />}
                        <div>
                          <div style={{ fontWeight: 700, color: '#0D0D0D', fontSize: '14px' }}>{g.name}</div>
                          <div style={{ color: '#AAA', fontSize: '12px' }}>{g.course ? `${g.course}, ${g.year}` : 'Выпускник BARBER HOUSE'}</div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
          <BarberPoleDivider />
        </>
      )}

      {/* CTA BANNER */}
      <section className="py-20" style={{ background: RED, position: 'relative', overflow: 'hidden' }}>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', top: '-50%', right: '-20%', width: '600px', height: '600px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', pointerEvents: 'none' }}
        />
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', bottom: '-50%', left: '-10%', width: '400px', height: '400px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%', pointerEvents: 'none' }}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative" style={{ zIndex: 10 }}>
          <AnimatedSection direction="scale">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '8px 14px', display: 'inline-flex' }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: '#0D0D0D', letterSpacing: '0.06em' }}>
                  BARBER <span style={{ color: RED }}>HOUSE</span>
                </span>
              </div>
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 6vw, 72px)', color: '#FFFFFF', letterSpacing: '0.02em', marginBottom: '12px' }}>
              ГОТОВ СТАТЬ БАРБЕРОМ?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', marginBottom: '32px', lineHeight: 1.5 }}>
              Следующий набор уже скоро. Места ограничены — запишись сейчас!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/courses"
                  style={{ background: '#FFFFFF', color: RED, borderRadius: '10px', padding: '14px 32px', fontWeight: 800, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  Выбрать курс <ArrowRight size={16} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <a
                  href={`https://wa.me/${waPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ border: '2px solid rgba(255,255,255,0.6)', color: '#FFFFFF', borderRadius: '10px', padding: '14px 32px', fontWeight: 700, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <MessageCircle size={16} /> WhatsApp
                </a>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
