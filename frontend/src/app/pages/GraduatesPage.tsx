import { AnimatedSection } from '../components/AnimatedSection';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Star, Award } from 'lucide-react';
import { Link } from 'react-router';
import { BarberPoleDivider, FloatingToolsBg, PageHeroBand, PoleSideDecor } from '../components/BarberDecor';

const LIME = '#D42B2B';
const CARD_BG = '#FFFFFF';
const BORDER = '#EBEBEB';

const graduates = [
  {
    name: 'Михаил Карпов',
    age: 28,
    before: 'Менеджер по продажам',
    after: 'Старший барбер',
    barbershop: 'Black Scissors VRN',
    img: 'https://images.unsplash.com/photo-1599011176306-4a96f1516d4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    story: 'Три года ненавидел офис. Пришёл в BARBER HOUSE случайно — друг позвал. Остался потому что понял — это моё. Сейчас работаю в лучшем барбершопе города и счастлив.',
    income: '80 000 ₽',
    course: 'Базовый курс',
    year: '2024',
    rating: 5,
  },
  {
    name: 'Антон Вл��сов',
    age: 24,
    before: 'Выпускник вуза без профессии',
    after: 'Барбер с постоянной клиентурой',
    barbershop: 'Street Barber VRN',
    img: 'https://images.unsplash.com/photo-1543697506-6729425f7265?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    story: 'После университета не знал чем заняться. Попробовал стричь на курсе — ощутил что это дело жизни. Теперь у меня очередь на 2 недели вперёд.',
    income: '70 000 ₽',
    course: 'Профессиональный',
    year: '2025',
    rating: 5,
  },
  {
    name: 'Сергей Петров',
    age: 35,
    before: 'IT-разработчик',
    after: 'Топ-барбер, наставник',
    barbershop: 'BARBER HOUSE (наставник)',
    img: 'https://images.unsplash.com/photo-1592304346250-ef7244f8c9cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    story: 'В IT зарабатывал хорошо, но не было смысла. Бросил программирование в 35. Мама плакала. Сейчас зарабатываю столько же и каждый день иду на работу с улыбкой.',
    income: '120 000 ₽',
    course: 'Профессиональный',
    year: '2023',
    rating: 5,
  },
  {
    name: 'Дмитрий Новиков',
    age: 21,
    before: 'Студент, подрабатывал курьером',
    after: 'Барбер, строит клиентскую базу',
    barbershop: 'Barbershop 36 VRN',
    img: 'https://images.unsplash.com/photo-1761148438883-e34e0289a214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    story: 'На курсе я был самым молодым. Боялся что не справлюсь. Александр поверил в меня с первого дня. Через 4 недели сделал первую стрижку клиенту. Ощущение непередаваемое!',
    income: '50 000 ₽',
    course: 'Базовый курс',
    year: '2025',
    rating: 5,
  },
];

const portfolioPhotos = [
  'https://images.unsplash.com/photo-1770253980751-ba1ebc8fdf48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'https://images.unsplash.com/photo-1761148438883-e34e0289a214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'https://images.unsplash.com/photo-1599011176306-4a96f1516d4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'https://images.unsplash.com/photo-1593185196543-01541d9258e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'https://images.unsplash.com/photo-1758812818698-6ecd792a87da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'https://images.unsplash.com/photo-1592304346250-ef7244f8c9cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
];

export function GraduatesPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <PageHeroBand
        label="Наши выпускники"
        title="РЕАЛЬНЫЕ ИСТОРИИ"
        subtitle="Не маркетинговые обещания — реальные люди с реальными результатами. Барбером может стать любой."
      />

      {/* Stats */}
      <section style={{ background: LIME, padding: '24px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { v: '500+', l: 'Выпускников' },
              { v: '85%',  l: 'Нашли работу' },
              { v: '60К+', l: 'Средний доход' },
            ].map(s => (
              <AnimatedSection key={s.l}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 4vw, 44px)', color: '#FFFFFF', lineHeight: 1 }}>{s.v}</div>
                <div style={{ color: '#FFFFFF', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.8 }}>{s.l}</div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <BarberPoleDivider />

      {/* Graduate cards */}
      <section className="py-20" style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <FloatingToolsBg layout={1} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {graduates.map((g, i) => (
              <AnimatedSection key={g.name} delay={i * 0.12}>
                <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                  <div className="grid grid-cols-5">
                    <div style={{ gridColumn: 'span 2', height: '240px', overflow: 'hidden' }}>
                      <ImageWithFallback src={g.img} alt={g.name} className="w-full h-full object-cover" />
                    </div>
                    <div style={{ gridColumn: 'span 3', padding: '20px' }}>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: g.rating }).map((_, j) => (
                          <Star key={j} size={12} color={LIME} fill={LIME} />
                        ))}
                      </div>
                      <h3 style={{ color: '#0D0D0D', fontSize: '16px', fontWeight: 700, marginBottom: '2px' }}>{g.name}, {g.age} лет</h3>
                      <div style={{ color: '#AAA', fontSize: '11px', marginBottom: '8px' }}>{g.barbershop}</div>
                      <div style={{ background: '#F5F3F0', borderRadius: '6px', padding: '8px 10px', marginBottom: '10px', fontSize: '12px' }}>
                        <span style={{ color: '#888' }}>{g.before}</span>
                        <span style={{ color: LIME, margin: '0 6px' }}>→</span>
                        <span style={{ color: '#0D0D0D', fontWeight: 600 }}>{g.after}</span>
                      </div>
                      <div style={{ color: LIME, fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>💰 {g.income}/мес</div>
                      <div style={{ color: '#AAA', fontSize: '11px' }}>Курс: {g.course} · {g.year}</div>
                    </div>
                  </div>
                  <div style={{ padding: '16px 20px', borderTop: `1px solid ${BORDER}` }}>
                    <p style={{ color: '#777', fontSize: '13px', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>"{g.story}"</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <BarberPoleDivider />

      {/* Certificate section */}
      <section className="py-20" style={{ background: '#FAFAF8', position: 'relative', overflow: 'hidden' }}>
        <PoleSideDecor side="left" topPercent={50} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <div style={{ color: LIME, fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>По завершению обучения</div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 4vw, 50px)', color: '#0D0D0D', letterSpacing: '0.02em', margin: '0 0 20px' }}>
                ДИПЛОМ, КОТОРЫЙ ОТКРЫВАЕТ ДВЕРИ
              </h2>
              <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.8, marginBottom: '20px' }}>
                После успешного прохождения курса ты получаешь диплом установленного образца. Его признают все партнёрские барбершопы, а международная версия открывает двери и за рубежом.
              </p>
              <div className="flex flex-col gap-3">
                {['Диплом на русском и английском', 'QR-код для проверки подлинности', 'Признаётся партнёрскими барбершопами', 'Добавляетс�� в портфолио в социальных сетях'].map(p => (
                  <div key={p} className="flex items-center gap-2">
                    <Award size={15} color={LIME} />
                    <span style={{ color: '#444', fontSize: '14px' }}>{p}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/3', border: `1px solid ${BORDER}`, background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 32px rgba(0,0,0,0.08)' }}>
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ border: `2px solid ${LIME}`, borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
                    <div style={{ color: LIME, fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>BARBER HOUSE BARBER SCHOOL</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: '#0D0D0D', letterSpacing: '0.05em', marginBottom: '8px' }}>Д��ПЛОМ</div>
                    <div style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>об окончании курса барберинга</div>
                    <div style={{ width: '80px', height: '2px', background: LIME, margin: '0 auto 16px' }} />
                    <div style={{ color: '#AAA', fontSize: '12px' }}>Воронеж · 2026</div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <BarberPoleDivider />

      {/* Portfolio */}
      <section className="py-20" style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <FloatingToolsBg layout={2} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          <AnimatedSection className="text-center mb-10">
            <div style={{ color: LIME, fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>Работы выпускников</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', color: '#0D0D0D', letterSpacing: '0.02em', margin: 0 }}>ПОРТФОЛИО</h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {portfolioPhotos.map((src, i) => (
              <AnimatedSection key={src} delay={i * 0.08}>
                <div style={{ borderRadius: '10px', overflow: 'hidden', aspectRatio: '1', border: `1px solid ${BORDER}` }}>
                  <ImageWithFallback src={src} alt={`Portfolio ${i}`} className="w-full h-full object-cover" />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <BarberPoleDivider />

      {/* CTA */}
      <section className="py-16" style={{ background: LIME }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 4vw, 48px)', color: '#FFFFFF', letterSpacing: '0.02em', marginBottom: '12px' }}>
              НАПИШИ СВОЮ ИСТОРИЮ УСПЕХА
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', marginBottom: '24px' }}>
              Присоединяйся к 500+ выпускникам, которые изменили свою жизнь
            </p>
            <Link
              to="/courses"
              style={{ background: '#FFFFFF', color: LIME, borderRadius: '8px', padding: '14px 32px', fontWeight: 800, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              Начать обучение
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}