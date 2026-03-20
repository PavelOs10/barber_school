import { AnimatedSection } from '../components/AnimatedSection';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Link } from 'react-router';
import { MapPin, ArrowRight } from 'lucide-react';
import { BarberPoleDivider, FloatingToolsBg, PageHeroBand, PoleSideDecor } from '../components/BarberDecor';

const LIME = '#D42B2B';
const CARD_BG = '#FFFFFF';
const BORDER = '#EBEBEB';

const timeline = [
  { year: '2021', text: 'Открытие первого учебного класса в Воронеже. Первый набор — 6 студентов.' },
  { year: '2022', text: 'Выпустили 100 барберов. Открыли второй класс с профессиональным оборудованием.' },
  { year: '2023', text: 'Запустили онлайн-обучение. Партнёрство с 15 лучшими барбершопами Воронежа.' },
  { year: '2024', text: 'Провели первый барбер-фест "Золотой Шейвер". Открыли набор в другие города.' },
  { year: '2025', text: 'Более 500 выпускников. Стали школой №1 по барберингу в Воронеже.' },
  { year: '2026', text: 'Новые программы, международные сертификаты, расширение по всей России.' },
];

const infra = [
  { title: '3 учебных класса', desc: 'Оборудованные станции с профессиональными креслами и зеркалами' },
  { title: 'Профессиональный инструмент', desc: 'Только лучшие бренды: Wahl, Andis, Babyliss, опасные бритвы Dovo' },
  { title: 'Учебный барбершоп', desc: 'Работаем с реальными клиентами под контролем наставников' },
  { title: 'Онлайн-платформа', desc: 'Собственная платформа с видеоуроками и тестами' },
];

const cities = ['Воронеж', 'Липецк (скоро)', 'Белгород (скоро)'];

export function AboutPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <PageHeroBand
        label="О школе"
        title="ПРИШЁЛ К НАМ — ЗНАЧИТ, СОСТОЯЛСЯ"
        subtitle="BARBER HOUSE — школа барберинга нового поколения. Мы не просто учим стричь — мы передаём стиль жизни и философию профессионала."
      />

      {/* Hero content */}
      <section className="py-16" style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <FloatingToolsBg layout={1} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <p style={{ color: '#666', fontSize: '16px', lineHeight: 1.8, marginBottom: '16px' }}>
                BARBER HOUSE — это школа барберинга нового поколения. Мы не просто учим стричь — мы передаём стиль жизни, философию профессионала, любовь к мастерству.
              </p>
              <p style={{ color: '#666', fontSize: '16px', lineHeight: 1.8, marginBottom: '28px' }}>
                Наша миссия: создать в Воронеже сообщество сильных барберов, которые гордятся своей профессией и зарабатывают достойные деньги любимым делом.
              </p>
              <Link
                to="/courses"
                style={{ background: LIME, color: '#FFFFFF', borderRadius: '8px', padding: '14px 28px', fontWeight: 800, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                Записаться на курс <ArrowRight size={16} />
              </Link>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/3', border: `1px solid ${BORDER}` }}>
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1592304346250-ef7244f8c9cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJiZXIlMjBpbnN0cnVjdG9yJTIwdGVhY2hpbmclMjBtZW50b3J8ZW58MXx8fHwxNzcyMDIyNDc4fDA&ixlib=rb-4.1.0&q=80&w=800"
                  alt="Barber instructor"
                  className="w-full h-full object-cover"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: LIME, padding: '28px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { v: '500+', l: 'Выпускников' },
              { v: '85%',  l: 'Нашли работу' },
              { v: '4 года', l: 'На рынке' },
              { v: '20+',  l: 'Партнёров' },
            ].map(s => (
              <AnimatedSection key={s.l}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(30px, 4vw, 48px)', color: '#FFFFFF', lineHeight: 1 }}>{s.v}</div>
                <div style={{ color: '#FFFFFF', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.8 }}>{s.l}</div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <BarberPoleDivider />

      {/* Timeline */}
      <section className="py-20" style={{ background: '#FAFAF8', position: 'relative', overflow: 'hidden' }}>
        <PoleSideDecor side="left" topPercent={50} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          <AnimatedSection className="text-center mb-14">
            <div style={{ color: LIME, fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>История</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', color: '#0D0D0D', letterSpacing: '0.02em', margin: 0 }}>КАК МЫ НАЧИНАЛИ</h2>
          </AnimatedSection>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ background: `linear-gradient(to bottom, ${LIME}, transparent)`, transform: 'translateX(-50%)' }} />
            <div className="flex flex-col gap-8">
              {timeline.map((t, i) => (
                <AnimatedSection key={t.year} delay={i * 0.1} direction={i % 2 === 0 ? 'left' : 'right'}>
                  <div className={`flex items-center gap-6 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className="flex-1 max-w-xs" style={{ textAlign: i % 2 === 0 ? 'right' : 'left' }}>
                      <div style={{ color: LIME, fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', lineHeight: 1 }}>{t.year}</div>
                      <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6, margin: '8px 0 0' }}>{t.text}</p>
                    </div>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: LIME, border: '3px solid #FFFFFF', boxShadow: '0 0 0 2px ' + LIME + '40', flexShrink: 0, zIndex: 1 }} />
                    <div className="flex-1 max-w-xs" />
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      <BarberPoleDivider />

      {/* Infrastructure */}
      <section className="py-20" style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <FloatingToolsBg layout={0} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          <AnimatedSection className="text-center mb-12">
            <div style={{ color: LIME, fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>Инфраструктура</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', color: '#0D0D0D', letterSpacing: '0.02em', margin: 0 }}>НАШИ ВОЗМОЖНОСТИ</h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {infra.map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.1}>
                <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                  <div style={{ background: LIME + '15', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: LIME, fontWeight: 900, fontSize: '14px' }}>{i + 1}</span>
                  </div>
                  <div>
                    <h3 style={{ color: '#0D0D0D', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{item.title}</h3>
                    <p style={{ color: '#777', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
            {[
              'https://images.unsplash.com/photo-1768938896401-fe52fd18d3af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
              'https://images.unsplash.com/photo-1593185196543-01541d9258e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
              'https://images.unsplash.com/photo-1758812818698-6ecd792a87da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
            ].map((src, i) => (
              <AnimatedSection key={src} delay={i * 0.1}>
                <div style={{ borderRadius: '12px', overflow: 'hidden', aspectRatio: '4/3', border: `1px solid ${BORDER}` }}>
                  <ImageWithFallback src={src} alt={`School photo ${i}`} className="w-full h-full object-cover" />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <BarberPoleDivider />

      {/* Geography */}
      <section className="py-20" style={{ background: '#F8F7F5', position: 'relative', overflow: 'hidden' }}>
        <PoleSideDecor side="right" topPercent={50} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          <AnimatedSection className="text-center mb-12">
            <div style={{ color: LIME, fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>География</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', color: '#0D0D0D', letterSpacing: '0.02em', margin: 0 }}>МЫ ЗДЕСЬ</h2>
          </AnimatedSection>
          <div className="flex flex-wrap justify-center gap-4">
            {cities.map((c, i) => (
              <AnimatedSection key={c} delay={i * 0.1}>
                <div style={{ background: CARD_BG, border: `1px solid ${i === 0 ? LIME : BORDER}`, borderRadius: '10px', padding: '14px 22px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <MapPin size={16} color={i === 0 ? LIME : '#AAA'} />
                  <span style={{ color: i === 0 ? '#0D0D0D' : '#888', fontWeight: 600, fontSize: '14px' }}>{c}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}