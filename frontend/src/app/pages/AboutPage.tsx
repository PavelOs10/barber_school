// ── AboutPage ──
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { AnimatedSection, BarberPoleDivider, FloatingToolsBg, ImageWithFallback, PageHeroBand, ScissorsDecor } from '../components/UI';

const RED = '#D42B2B';

export function AboutPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <PageHeroBand label="О школе" title="BARBER HOUSE" subtitle="Школа барберинга нового поколения. Мы не просто учим стричь — мы передаём стиль жизни." />
      <section className="py-16" style={{ background: '#FFF', position: 'relative', overflow: 'hidden' }}>
        <FloatingToolsBg layout={1} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <p style={{ color: '#666', fontSize: '16px', lineHeight: 1.8, marginBottom: '16px' }}>BARBER HOUSE — это школа барберинга нового поколения. Мы не просто учим стричь — мы передаём стиль жизни, философию профессионала.</p>
              <p style={{ color: '#666', fontSize: '16px', lineHeight: 1.8, marginBottom: '28px' }}>Наша миссия: создать в Воронеже сообщество сильных барберов, которые гордятся своей профессией и зарабатывают достойные деньги.</p>
              <Link to="/courses" style={{ background: RED, color: '#FFF', borderRadius: '8px', padding: '14px 28px', fontWeight: 800, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Записаться на курс <ArrowRight size={16} />
              </Link>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/3', border: '1px solid #EBEBEB', background: '#F5F3F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px', color: '#0D0D0D' }}>BARBER</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px', color: RED }}>HOUSE</div>
                  <div style={{ color: '#AAA', fontSize: '14px', marginTop: '8px' }}>Воронеж · с 2021</div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
      <section style={{ background: RED, padding: '28px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[{ v: '500+', l: 'Выпускников' }, { v: '85%', l: 'Нашли работу' }, { v: '4 года', l: 'На рынке' }, { v: '20+', l: 'Партнёров' }].map(s => (
            <AnimatedSection key={s.l}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(30px, 4vw, 48px)', color: '#FFF', lineHeight: 1 }}>{s.v}</div>
              <div style={{ color: '#FFF', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.8 }}>{s.l}</div>
            </AnimatedSection>
          ))}
        </div>
      </section>
      <BarberPoleDivider />
      <section className="py-20" style={{ background: '#F8F7F5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-14">
            <div style={{ color: RED, fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>География</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', color: '#0D0D0D' }}>МЫ ЗДЕСЬ</h2>
          </AnimatedSection>
          <div className="flex flex-wrap justify-center gap-4">
            {['Воронеж', 'Липецк (скоро)', 'Белгород (скоро)'].map((c, i) => (
              <AnimatedSection key={c} delay={i * 0.1}>
                <div style={{ background: '#FFF', border: `1px solid ${i === 0 ? RED : '#EBEBEB'}`, borderRadius: '10px', padding: '14px 22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color={i === 0 ? RED : '#AAA'} />
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
