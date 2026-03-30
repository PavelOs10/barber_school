import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedSection, BarberPoleDivider, FloatingToolsBg, ImageWithFallback, PageHeroBand } from '../components/UI';
import { useAPI } from '../hooks/useAPI';

const RED = '#D42B2B';

interface Graduate {
  id: number; name: string; course: string; year: string; quote: string; workplace: string; photo: string;
  sort_order: number; visible: number; created_at: string;
}

export function GraduatesPage() {
  const { data: graduates, loading } = useAPI<Graduate[]>('/graduates', []);

  return (
    <div style={{ minHeight: '100vh' }}>
      <PageHeroBand label="Наши выпускники" title="РЕАЛЬНЫЕ ИСТОРИИ" subtitle="Не маркетинговые обещания — реальные люди с реальными результатами." />

      <section style={{ background: RED, padding: '24px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[{ v: '500+', l: 'Выпускников' }, { v: '85%', l: 'Нашли работу' }, { v: '60К+', l: 'Средний доход' }].map(s => (
              <AnimatedSection key={s.l}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 4vw, 44px)', color: '#FFF', lineHeight: 1 }}>{s.v}</div>
                <div style={{ color: '#FFF', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.8 }}>{s.l}</div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <BarberPoleDivider />

      <section className="py-20" style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <FloatingToolsBg layout={1} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          {loading && <div style={{ textAlign: 'center', padding: '48px', color: '#888' }}>Загрузка...</div>}
          {!loading && !graduates.length && <div style={{ textAlign: 'center', padding: '48px', color: '#888' }}>Выпускников пока нет</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {graduates.map((g, i) => (
              <AnimatedSection key={g.id} delay={i * 0.12}>
                <div style={{ background: '#FFF', border: '1px solid #EBEBEB', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                  <div className="grid grid-cols-5">
                    <div style={{ gridColumn: 'span 2', height: '240px', overflow: 'hidden' }}>
                      <ImageWithFallback src={g.photo} alt={g.name} className="w-full h-full object-cover" />
                    </div>
                    <div style={{ gridColumn: 'span 3', padding: '20px' }}>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, j) => <Star key={j} size={12} color={RED} fill={RED} />)}
                      </div>
                      <h3 style={{ color: '#0D0D0D', fontSize: '16px', fontWeight: 700, marginBottom: '2px' }}>{g.name}</h3>
                      {g.workplace && <div style={{ color: '#AAA', fontSize: '11px', marginBottom: '8px' }}>{g.workplace}</div>}
                      {g.course && (
                        <div style={{ background: '#F5F3F0', borderRadius: '6px', padding: '8px 10px', marginBottom: '10px', fontSize: '12px' }}>
                          <span style={{ color: '#888' }}>Курс: {g.course}</span>
                          {g.year && <span style={{ color: '#AAA' }}> · {g.year}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                  {g.quote && (
                    <div style={{ padding: '16px 20px', borderTop: '1px solid #EBEBEB' }}>
                      <p style={{ color: '#777', fontSize: '13px', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>"{g.quote}"</p>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <BarberPoleDivider />

      <section className="py-16" style={{ background: RED }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 4vw, 48px)', color: '#FFF', marginBottom: '12px' }}>НАПИШИ СВОЮ ИСТОРИЮ УСПЕХА</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', marginBottom: '24px' }}>Присоединяйся к выпускникам, которые изменили свою жизнь</p>
            <Link to="/courses" style={{ background: '#FFF', color: RED, borderRadius: '8px', padding: '14px 32px', fontWeight: 800, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Начать обучение <ArrowRight size={16} />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
