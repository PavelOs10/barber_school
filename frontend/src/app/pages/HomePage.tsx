import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, MessageCircle, Star } from 'lucide-react';
import { AnimatedSection, BarberPoleDivider, FloatingToolsBg, ImageWithFallback, ScissorsDecor } from '../components/UI';
import { useAPI, useSettings } from '../hooks/useAPI';

const RED = '#D42B2B';

export function HomePage() {
  const { data: settings } = useSettings();
  const { data: courses } = useAPI<any[]>('/courses', []);
  const { data: graduates } = useAPI<any[]>('/graduates', []);
  const { data: teachers } = useAPI<any[]>('/teachers', []);
  const waPhone = settings.whatsapp_phone || '79001234567';
  const topCourses = courses.slice(0, 3);

  return (
    <div>
      {/* HERO */}
      <section style={{ background: '#0D0D0D', minHeight: '85vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', top: '-30%', right: '-15%', width: '600px', height: '600px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          <AnimatedSection>
            <div style={{ color: RED, fontSize: '11px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '16px' }}>Школа барберинга · Воронеж</div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 8vw, 96px)', color: '#FFFFFF', letterSpacing: '0.02em', lineHeight: 0.95, marginBottom: '20px' }}>
              СТАНЬ<br /><span style={{ color: RED }}>БАРБЕРОМ</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', maxWidth: '500px', lineHeight: 1.6, marginBottom: '36px' }}>
              От нуля до профессионала за 4 недели. Практика на реальных клиентах. Гарантия трудоустройства.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link to="/courses" style={{ background: RED, color: '#FFFFFF', borderRadius: '10px', padding: '14px 32px', fontWeight: 800, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  Выбрать курс <ArrowRight size={16} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noopener noreferrer"
                  style={{ border: '2px solid rgba(255,255,255,0.4)', color: '#FFFFFF', borderRadius: '10px', padding: '14px 32px', fontWeight: 700, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <MessageCircle size={16} /> WhatsApp
                </a>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: RED, padding: '28px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[{ v: '500+', l: 'Выпускников' }, { v: '85%', l: 'Нашли работу' }, { v: '4 года', l: 'На рынке' }, { v: '20+', l: 'Партнёров' }].map(s => (
              <AnimatedSection key={s.l}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(30px, 4vw, 48px)', color: '#FFF', lineHeight: 1 }}>{s.v}</div>
                <div style={{ color: '#FFF', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.8 }}>{s.l}</div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <BarberPoleDivider />

      {/* Courses preview from API */}
      <section className="py-20" style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <FloatingToolsBg layout={0} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          <AnimatedSection className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <div style={{ color: RED, fontSize: '11px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '8px' }}>Наши курсы</div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', color: '#0D0D0D', letterSpacing: '0.02em', margin: 0 }}>ВЫБЕРИ СВОЙ ПУТЬ</h2>
            </div>
            <Link to="/courses" style={{ color: RED, fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Все курсы <ArrowRight size={14} />
            </Link>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topCourses.map((c, i) => (
              <AnimatedSection key={c.id} delay={i * 0.12} direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}>
                <motion.div whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(0,0,0,0.1)' }} transition={{ duration: 0.25 }}
                  style={{ background: '#FFF', border: '1px solid #EBEBEB', borderRadius: '18px', overflow: 'hidden', height: '100%', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                  <div style={{ height: '4px', background: c.color || RED }} />
                  <div style={{ padding: '24px' }}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 style={{ color: '#0D0D0D', fontSize: '18px', fontWeight: 700, margin: 0 }}>{c.title}</h3>
                      <span style={{ background: (c.color || RED) + '18', color: c.color || RED, borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap' }}>{c.level}</span>
                    </div>
                    <p style={{ color: '#777', fontSize: '14px', lineHeight: 1.55, marginBottom: '20px' }}>{c.subtitle}</p>
                    <div className="flex items-center gap-2 mb-6">
                      <Clock size={14} color="#AAA" />
                      <span style={{ color: '#888', fontSize: '13px' }}>{c.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', color: c.color || RED }}>{c.price}</span>
                      <Link to="/courses" style={{ background: c.color || RED, color: '#FFF', borderRadius: '8px', padding: '8px 18px', fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
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

      {/* Teachers preview from API */}
      {teachers.length > 0 && (
        <section className="py-20" style={{ background: '#F8F7F5', position: 'relative', overflow: 'hidden' }}>
          <ScissorsDecor side="left" topPercent={50} />
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
      )}

      <BarberPoleDivider />

      {/* Graduates / reviews from API */}
      {graduates.length > 0 && (
        <section className="py-20" style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
          <FloatingToolsBg layout={2} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
            <AnimatedSection className="text-center mb-12">
              <div style={{ color: RED, fontSize: '11px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '8px' }}>Отзывы</div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', color: '#0D0D0D', letterSpacing: '0.02em', margin: 0 }}>ЧТО ГОВОРЯТ ВЫПУСКНИКИ</h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {graduates.slice(0, 3).map((g, i) => (
                <AnimatedSection key={g.id} delay={i * 0.12}>
                  <motion.div whileHover={{ y: -4 }} style={{ background: '#FFF', border: '1px solid #EBEBEB', borderRadius: '18px', padding: '26px', height: '100%', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, j) => <Star key={j} size={14} color={RED} fill={RED} />)}
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
      )}

      <BarberPoleDivider />

      {/* CTA */}
      <section className="py-20" style={{ background: RED, position: 'relative', overflow: 'hidden' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative" style={{ zIndex: 10 }}>
          <AnimatedSection direction="scale">
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 6vw, 72px)', color: '#FFF', letterSpacing: '0.02em', marginBottom: '12px' }}>ГОТОВ СТАТЬ БАРБЕРОМ?</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', marginBottom: '32px' }}>Следующий набор уже скоро. Места ограничены — запишись сейчас!</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/courses" style={{ background: '#FFF', color: RED, borderRadius: '10px', padding: '14px 32px', fontWeight: 800, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Выбрать курс <ArrowRight size={16} />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
