import { AnimatedSection } from '../components/AnimatedSection';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { CheckCircle, ArrowRight, MessageCircle, Trophy, Users, Briefcase, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { BarberPoleDivider, FloatingToolsBg, PageHeroBand, PoleSideDecor } from '../components/BarberDecor';
import { useSettings } from '../hooks/useAPI';

const LIME = '#D42B2B';
const CARD_BG = '#FFFFFF';
const BORDER = '#EBEBEB';

const steps = [
  {
    num: '01',
    title: 'Формируем портфолио',
    desc: 'Помогаем создать профессиональное портфолио: фото до/после, оформление страницы во ВКонтакте или Telegram как полноценного резюме.',
    icon: '📸',
  },
  {
    num: '02',
    title: 'Рекомендуем в барбершопы',
    desc: 'Если ты показал хороший результат, мы рекомендуем тебя напрямую в партнёрские барбершопы — даже если у нас пока нет открытых мест.',
    icon: '🤝',
  },
  {
    num: '03',
    title: 'Готовим к собеседованию',
    desc: 'Учим как общаться с работодателями, как правильно презентовать себя и свои навыки, как вести переговоры о зарплате.',
    icon: '🎯',
  },
  {
    num: '04',
    title: 'Первая работа или стажировка',
    desc: 'Помогаем найти первое рабочее место или стажировку в проверенном барбершопе. Сопровождаем на старте карьеры.',
    icon: '✂️',
  },
  {
    num: '05',
    title: 'Сообщество после курса',
    desc: 'Ты попадаешь в закрытый чат выпускников BARBER HOUSE — общаешься с коллегами, получаешь советы наставников, узнаёшь о вакансиях первым.',
    icon: '💬',
  },
];

const partners = [
  { name: 'BARBERSHOP 36', city: 'Воронеж', type: 'Барбершоп' },
  { name: 'BLACK SCISSORS', city: 'Воронеж', type: 'Барбершоп' },
  { name: 'STREET BARBER', city: 'Воронеж', type: 'Барбершоп' },
  { name: 'OLD TOWN BARBER', city: 'Воронеж', type: 'Барбершоп' },
  { name: 'БРИТВА VRN', city: 'Воронеж', type: 'Сеть' },
  { name: 'CHOP CHOP', city: 'Воронеж', type: 'Сеть' },
];

const cases = [
  {
    name: 'Михаил, 28 лет',
    before: 'Менеджер по продажам',
    after: 'Барбер в Black Scissors',
    income: '80 000 ₽/мес',
    quote: 'Три года работал менеджером — ненавидел офис. Пришёл в BARBER HOUSE, не веря что у меня получится. Через 4 недели устроился в барбершоп, через 3 месяца вышел на 80к. Лучшее решение в жизни.',
  },
  {
    name: 'Антон, 24 года',
    before: 'Студент, без профессии',
    after: 'Старший барбер, ведёт своих клиентов',
    income: '70 000 ₽/мес',
    quote: 'После университета не знал, кем быть. Попробовал барберинг — и понял, что это моё. Сейчас у меня своя постоянная клиентура и мечта открыть свой барбершоп.',
  },
  {
    name: 'Сергей, 35 лет',
    before: 'IT-разработчик',
    after: 'Топ-барбер, наставник',
    income: '120 000 ₽/мес',
    quote: 'Зарабатывал хорошо в IT, но не было удовлетворения. Ушёл в барберинг — зарабатываю столько же, но теперь счастлив. Каждый день делаю людей лучше.',
  },
];

const ideas = [
  { icon: Trophy, title: 'Конкурс "Золотой Шейвер"', desc: 'Ежегодный чемпионат среди выпускников. Победители получают призы от брендов и повышение статуса.' },
  { icon: Users, title: 'Барбер-фестиваль', desc: 'Ежегодный фестиваль по типу тату-фестов: мастер-классы, шоу-программы, партнёры из индустрии.' },
  { icon: Star, title: 'Консультации наставников', desc: 'Сложный случай? Пиши в чат — наши мастера помогут разобраться с любой ситуацией.' },
  { icon: Briefcase, title: 'Бизнес в барберинге', desc: 'Отдельный модуль: как открыть свой барбершоп, найти партнёров и выйти на доход от 200к.' },
];

export function CareerPage() {
  const { data: settings } = useSettings();
  const waPhone = settings.whatsapp_phone || '79001234567';
  const tgChannel = settings.telegram_channel || 'barberhouse_vrn';
  return (
    <div style={{ minHeight: '100vh' }}>
      <PageHeroBand
        label="Трудоустройство"
        title="ПОСЛЕ КУРСА ТЫ НЕ ОДИН"
        subtitle="Мы не просто выдаём диплом и прощаемся. Помогаем каждому выпускнику найти работу и построить карьеру."
      />

      {/* Steps */}
      <section className="py-20" style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <FloatingToolsBg layout={0} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          <AnimatedSection className="text-center mb-14">
            <div style={{ color: LIME, fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>Наш подход</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', color: '#0D0D0D', letterSpacing: '0.02em', margin: 0 }}>
              КАК МЫ ПОМОГАЕМ НАЙТИ РАБОТУ
            </h2>
          </AnimatedSection>
          <div className="flex flex-col gap-4">
            {steps.map((s, i) => (
              <AnimatedSection key={s.num} delay={i * 0.1}>
                <div
                  style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '24px', display: 'flex', gap: '20px', alignItems: 'flex-start', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', transition: 'box-shadow 0.3s, border-color 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = LIME + '50'; e.currentTarget.style.boxShadow = `0 8px 32px rgba(212,43,43,0.1)`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; }}
                >
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '40px', color: LIME + '30', lineHeight: 1, minWidth: '60px' }}>{s.num}</div>
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

      {/* Partners */}
      <section className="py-20" style={{ background: '#FAFAF8', position: 'relative', overflow: 'hidden' }}>
        <PoleSideDecor side="left" topPercent={50} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          <AnimatedSection className="text-center mb-12">
            <div style={{ color: LIME, fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>Партнёры</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', color: '#0D0D0D', letterSpacing: '0.02em', margin: 0 }}>
              ПАРТНЁРСКИЕ БАРБЕРШОПЫ
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {partners.map((p, i) => (
              <AnimatedSection key={p.name} delay={i * 0.08}>
                <div
                  style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '16px', textAlign: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.04)', transition: 'border-color 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = LIME + '60')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}
                >
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', color: '#0D0D0D', letterSpacing: '0.08em', marginBottom: '4px' }}>{p.name}</div>
                  <div style={{ color: '#AAA', fontSize: '11px' }}>{p.type}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection className="text-center mt-8">
            <p style={{ color: '#AAA', fontSize: '14px' }}>И ещё 14+ барбершопов-партнёров по всему Воронежу</p>
          </AnimatedSection>
        </div>
      </section>

      <BarberPoleDivider />

      {/* Cases */}
      <section className="py-20" style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <FloatingToolsBg layout={2} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          <AnimatedSection className="text-center mb-12">
            <div style={{ color: LIME, fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>Истории успеха</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', color: '#0D0D0D', letterSpacing: '0.02em', margin: 0 }}>
              ИЗ ГРЯЗИ В КНЯЗИ
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cases.map((c, i) => (
              <AnimatedSection key={c.name} delay={i * 0.12}>
                <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '24px', height: '100%', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                  <div className="flex items-center gap-3 mb-4" style={{ padding: '12px', background: '#F5F3F0', borderRadius: '10px' }}>
                    <div>
                      <div style={{ color: '#AAA', fontSize: '11px', marginBottom: '2px' }}>До →</div>
                      <div style={{ color: '#444', fontSize: '13px', fontWeight: 600 }}>{c.before}</div>
                    </div>
                    <ArrowRight size={16} color={LIME} className="shrink-0" />
                    <div>
                      <div style={{ color: LIME, fontSize: '11px', marginBottom: '2px' }}>После</div>
                      <div style={{ color: '#0D0D0D', fontSize: '13px', fontWeight: 600 }}>{c.after}</div>
                    </div>
                  </div>
                  <div style={{ background: LIME + '10', border: `1px solid ${LIME}30`, borderRadius: '8px', padding: '8px 12px', marginBottom: '16px' }}>
                    <span style={{ color: LIME, fontWeight: 700, fontSize: '15px' }}>💰 {c.income}</span>
                  </div>
                  <p style={{ color: '#777', fontSize: '13px', lineHeight: 1.7, marginBottom: '16px' }}>"{c.quote}"</p>
                  <div style={{ color: '#0D0D0D', fontWeight: 700, fontSize: '14px' }}>{c.name}</div>
                  <div style={{ color: '#AAA', fontSize: '12px' }}>Выпускник BARBER HOUSE</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <BarberPoleDivider />

      {/* Community ideas */}
      <section className="py-20" style={{ background: '#F8F7F5', position: 'relative', overflow: 'hidden' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-12">
            <div style={{ color: LIME, fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>Сообщество</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', color: '#0D0D0D', letterSpacing: '0.02em', margin: 0 }}>
              МЫ ЖИВЁМ БАРБЕРИНГОМ
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ideas.map((idea, i) => (
              <AnimatedSection key={idea.title} delay={i * 0.1}>
                <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '24px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                  <div style={{ background: LIME + '12', borderRadius: '10px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <idea.icon size={22} color={LIME} />
                  </div>
                  <h3 style={{ color: '#0D0D0D', fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>{idea.title}</h3>
                  <p style={{ color: '#777', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{idea.desc}</p>
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
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 5vw, 56px)', color: '#FFFFFF', letterSpacing: '0.02em', marginBottom: '16px' }}>
              СТАНЬ ЧАСТЬЮ СООБЩЕСТВА
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', marginBottom: '28px' }}>
              Запишись на курс — и мы возьмём тебя за руку до первой работы
            </p>
            <a
              href={`https://wa.me/${waPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: '#FFFFFF', color: LIME, borderRadius: '8px', padding: '14px 32px', fontWeight: 800, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              Записаться на курс
            </a>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}