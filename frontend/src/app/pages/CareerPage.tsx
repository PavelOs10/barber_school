import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { AnimatedSection, BarberPoleDivider, FloatingToolsBg, PageHeroBand, ScissorsDecor } from '../components/UI';
import { useSettings } from '../hooks/useAPI';

const RED = '#D42B2B';
const STEPS = [
  { num: '01', title: 'Формируем портфолио', desc: 'Помогаем создать профессиональное портфолио с фото работ.', icon: '📸' },
  { num: '02', title: 'Рекомендуем в барбершопы', desc: 'Рекомендуем напрямую в партнёрские барбершопы.', icon: '🤝' },
  { num: '03', title: 'Готовим к собеседованию', desc: 'Учим презентовать себя и вести переговоры.', icon: '🎯' },
  { num: '04', title: 'Первая работа', desc: 'Помогаем найти первое рабочее место.', icon: '✂️' },
  { num: '05', title: 'Сообщество', desc: 'Закрытый чат выпускников — советы, вакансии, поддержка.', icon: '💬' },
];

export function CareerPage() {
  const { data: settings } = useSettings();
  const waPhone = settings.whatsapp_phone || '79001234567';

  return (
    <div style={{ minHeight: '100vh' }}>
      <PageHeroBand label="Трудоустройство" title="ПОСЛЕ КУРСА ТЫ НЕ ОДИН" subtitle="Помогаем каждому выпускнику найти работу и построить карьеру." />

      <section className="py-20" style={{ background: '#FFF', position: 'relative', overflow: 'hidden' }}>
        <FloatingToolsBg layout={0} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          <AnimatedSection className="text-center mb-14">
            <div style={{ color: RED, fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>Наш подход</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', color: '#0D0D0D' }}>КАК МЫ ПОМОГАЕМ НАЙТИ РАБОТУ</h2>
          </AnimatedSection>
          <div className="flex flex-col gap-4">
            {STEPS.map((s, i) => (
              <AnimatedSection key={s.num} delay={i * 0.1}>
                <div style={{ background: '#FFF', border: '1px solid #EBEBEB', borderRadius: '12px', padding: '24px', display: 'flex', gap: '20px', alignItems: 'flex-start', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '40px', color: RED + '30', lineHeight: 1, minWidth: '60px' }}>{s.num}</div>
                  <div style={{ fontSize: '32px', lineHeight: 1, paddingTop: '4px' }}>{s.icon}</div>
                  <div>
                    <h3 style={{ color: '#0D0D0D', fontSize: '17px', fontWeight: 700, marginBottom: '6px' }}>{s.title}</h3>
                    <p style={{ color: '#777', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                  </div>
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
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 5vw, 56px)', color: '#FFF', marginBottom: '16px' }}>СТАНЬ ЧАСТЬЮ СООБЩЕСТВА</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', marginBottom: '28px' }}>Запишись на курс — и мы возьмём тебя за руку до первой работы</p>
            <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noopener noreferrer"
              style={{ background: '#FFF', color: RED, borderRadius: '8px', padding: '14px 32px', fontWeight: 800, fontSize: '14px', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Записаться на курс
            </a>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
