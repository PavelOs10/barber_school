import { Link } from 'react-router';
import { motion } from 'motion/react';
import { AnimatedSection, ScrollTicker, StaggerContainer, staggerItem } from '../components/AnimatedSection';
import { CheckCircle, ArrowRight, Star, Users, Award, Clock, MessageCircle, Zap, Target, Shield, Flame } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import logoImg from '@/assets/bf79a2c11bccd3308e961cbe03a60b3b3f1f2f07.png';
import { BarberHeroSection } from '../components/BarberHeroSection';
import { BarberPoleDivider, FloatingToolsBg, PoleSideDecor } from '../components/BarberDecor';
import { useSettings } from '../hooks/useAPI';

const RED  = '#D42B2B';
const BLUE = '#2255CC';
const CARD_BG = '#FFFFFF';
const BORDER  = '#EBEBEB';

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

const courses = [
  { title: 'Базовый курс', duration: '4 недели', level: 'С нуля', price: 'от 45 000 ₽', color: RED, desc: 'Идеальн для тех, кто хочет сменить профессию или начать с нуля' },
  { title: 'Профессиональный', duration: '8 недель', level: 'Углублённый', price: 'от 75 000 ₽', color: BLUE, desc: 'Для тех, кто уже умеет стричь и хочет выйти на новый уровень' },
  { title: 'Онлайн-интенсив', duration: '2 недели', level: 'Дистанционно', price: 'от 15 000 ₽', color: '#888888', desc: 'Теоретическая база + разборы техник онлайн для занятых' },
];

const reviews = [
  { name: 'Михаил К.', text: 'Был менеджером, теперь барбер. За месяц вышел на 70к. Лучшее решение в жизни!', rating: 5 },
  { name: 'Антон В.', text: 'Преподаватели — огонь. С нуля за 4 недели уже работаю в барбершопе.', rating: 5 },
  { name: 'Сергей П.', text: 'Думал, что поздно в 35. Оказалось — самое время. Спасибо BARBER HOUSE!', rating: 5 },
];

export function HomePage() {
  return (
    <div>
      <BarberHeroSection />

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
                    8 МАРТА — <span style={{ color: RED }}>-20%</span>
                  </div>
                  <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.6, marginBottom: '20px' }}>
                    Купи курс в подарок или запишись сам. Скидка 20% до 10 марта. Промокод: <strong style={{ color: '#0D0D0D' }}>MARCH8</strong>
                  </p>
                  <Link
                    to="/seasonal"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: RED, color: '#FFFFFF', borderRadius: '10px', padding: '12px 22px', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                  >
                    Все акции <ArrowRight size={14} />
                  </Link>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '32px', background: '#FFF8F8' }}>
                  {[
                    { icon: '🎖️', label: '23 ФЕВРАЛЯ', active: true },
                    { icon: '🌸', label: '8 МАРТА', hot: true },
                    { icon: '🌿', label: '1 МАЯ', upcoming: true },
                    { icon: '🎄', label: 'НОВ. ГОД', upcoming: true },
                  ].map(item => (
                    <div
                      key={item.label}
                      style={{
                        textAlign: 'center',
                        opacity: item.hot ? 1 : item.active ? 0.6 : 0.3,
                        transform: item.hot ? 'scale(1.15)' : 'scale(1)',
                        transition: 'transform 0.3s',
                      }}
                    >
                      <div style={{ fontSize: '28px', marginBottom: '6px' }}>{item.icon}</div>
                      <div style={{ color: item.hot ? RED : '#888', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em' }}>{item.label}</div>
                      {item.hot && (
                        <motion.div
                          animate={{ opacity: [1, 0.4, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          style={{ background: RED, borderRadius: '4px', padding: '1px 5px', fontSize: '8px', fontWeight: 800, color: '#fff', marginTop: '4px', display: 'inline-block' }}
                        >
                          HOT
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      <BarberPoleDivider />

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
                  whileHover={{ y: -5, boxShadow: `0 12px 40px rgba(0,0,0,0.1)` }}
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
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  style={{ borderRadius: '18px', overflow: 'hidden', aspectRatio: '4/3', border: `1px solid ${BORDER}` }}
                >
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1543697506-6729425f7265?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJiZXIlMjBzY2hvb2wlMjBzdHVkZW50cyUyMGxlYXJuaW5nJTIwaGFpcmN1dCUyMHRyYWluaW5nfGVufDF8fHx8MTc3MjAyNDExOHww&ixlib=rb-4.1.0&q=80&w=800"
                    alt="Barber school students"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  style={{ position: 'absolute', bottom: '-16px', right: '-16px', background: '#FFFFFF', borderRadius: '14px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: `0 8px 32px ${RED}20` }}
                >
                  <img src={logoImg} alt="BARBER HOUSE" style={{ height: '36px', width: 'auto' }} />
                </motion.div>
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

      {/* COURSES PREVIEW */}
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
            <Link
              to="/courses"
              style={{ color: RED, fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
            >
              Все курсы <ArrowRight size={14} />
            </Link>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((c, i) => (
              <AnimatedSection key={c.title} delay={i * 0.12} direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(0,0,0,0.1)' }}
                  transition={{ duration: 0.25 }}
                  style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '18px', overflow: 'hidden', height: '100%', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
                >
                  <div style={{ height: '4px', background: c.color }} />
                  <div style={{ padding: '24px' }}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 style={{ color: '#0D0D0D', fontSize: '18px', fontWeight: 700, margin: 0 }}>{c.title}</h3>
                      <span style={{ background: c.color + '18', color: c.color, borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>{c.level}</span>
                    </div>
                    <p style={{ color: '#777', fontSize: '14px', lineHeight: 1.55, marginBottom: '20px' }}>{c.desc}</p>
                    <div className="flex items-center gap-2 mb-6">
                      <Clock size={14} color="#AAA" />
                      <span style={{ color: '#888', fontSize: '13px' }}>{c.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', color: c.color }}>{c.price}</span>
                      <Link
                        to="/courses"
                        style={{ background: c.color, color: '#FFFFFF', borderRadius: '8px', padding: '8px 18px', fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase', transition: 'opacity 0.2s' }}
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

      {/* PHOTO GALLERY */}
      <section className="py-20" style={{ background: '#F8F7F5', position: 'relative', overflow: 'hidden' }}>
        <PoleSideDecor side="left" topPercent={50} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          <AnimatedSection className="text-center mb-12">
            <div style={{ color: RED, fontSize: '11px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '8px' }}>Атмосфера</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', color: '#0D0D0D', letterSpacing: '0.02em', margin: 0 }}>
              ЖИЗНЬ ШКОЛЫ
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { src: 'https://images.unsplash.com/photo-1758812818698-6ecd792a87da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJiZXIlMjB0b29scyUyMHNjaXNzb3JzJTIwY29tYiUyMHZpbnRhZ2V8ZW58MXx8fHwxNzcxOTEwMzk0fDA&ixlib=rb-4.1.0&q=80&w=400', ratio: '4/5' },
              { src: 'https://images.unsplash.com/photo-1592304346250-ef7244f8c9cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJiZXIlMjBpbnN0cnVjdG9yJTIwdGVhY2hpbmclMjBtZW50b3J8ZW58MXx8fHwxNzcyMDIyNDc4fDA&ixlib=rb-4.1.0&q=80&w=400', ratio: '4/3' },
              { src: 'https://images.unsplash.com/photo-1593185196543-01541d9258e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJiZXJzaG9wJTIwY2hhaXIlMjB2aW50YWdlJTIwbGVhdGhlciUyMGJsYWNrfGVufDF8fHx8MTc3MjAyMjQ3OHww&ixlib=rb-4.1.0&q=80&w=400', ratio: '4/5' },
              { src: 'https://images.unsplash.com/photo-1638636241638-aef5120c5153?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJiZXIlMjBjZXJ0aWZpY2F0ZSUyMGRpcGxvbWElMjBncmFkdWF0aW9ufGVufDF8fHx8MTc3MjAyMjQ3N3ww&ixlib=rb-4.1.0&q=80&w=400', ratio: '4/3' },
            ].map((img, i) => (
              <AnimatedSection key={img.src} delay={i * 0.1} direction="scale">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                  style={{ borderRadius: '14px', overflow: 'hidden', aspectRatio: img.ratio, border: `1px solid ${BORDER}` }}
                >
                  <ImageWithFallback src={img.src} alt={`School photo ${i + 1}`} className="w-full h-full object-cover" />
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <BarberPoleDivider />

      {/* REVIEWS */}
      <section className="py-20" style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <FloatingToolsBg layout={2} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          <AnimatedSection className="text-center mb-12">
            <div style={{ color: RED, fontSize: '11px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '8px' }}>Отзывы</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', color: '#0D0D0D', letterSpacing: '0.02em', margin: 0 }}>
              ЧТО ГОВОРЯТ ВЫПУСКНИКИ
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <AnimatedSection key={r.name} delay={i * 0.12} direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: '0 12px 36px rgba(0,0,0,0.08)' }}
                  transition={{ duration: 0.25 }}
                  style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '18px', padding: '26px', height: '100%', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <Star key={j} size={14} color={RED} fill={RED} />
                    ))}
                  </div>
                  <p style={{ color: '#555', fontSize: '15px', lineHeight: 1.65, marginBottom: '20px' }}>"{r.text}"</p>
                  <div style={{ fontWeight: 700, color: '#0D0D0D', fontSize: '14px' }}>{r.name}</div>
                  <div style={{ color: '#AAA', fontSize: '12px', marginTop: '3px' }}>Выпускник BARBER HOUSE</div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <BarberPoleDivider />

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
                <img src={logoImg} alt="BARBER HOUSE" style={{ height: '52px', width: 'auto' }} />
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