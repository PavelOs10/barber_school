import { AnimatedSection } from '../components/AnimatedSection';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import { useState } from 'react';
import { BarberPoleDivider, FloatingToolsBg, PageHeroBand } from '../components/BarberDecor';
import { useSettings } from '../hooks/useAPI';

const LIME = '#D42B2B';
const CARD_BG = '#FFFFFF';
const BORDER = '#EBEBEB';

const posts = [
  {
    id: 1,
    title: 'Тренды барберинга 2026: что будет популярно в этом году',
    excerpt: 'Разбираем главные тренды мужских стрижек и уходовых процедур, которые будут доминировать в 2026 году. Что заказывают клиенты, какие техники в моде.',
    category: 'Тренды',
    date: '20 февраля 2026',
    img: 'https://images.unsplash.com/photo-1770253980751-ba1ebc8fdf48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    readTime: '5 мин',
    hot: true,
  },
  {
    id: 2,
    title: 'История нашей школы: как маленький класс стал школой №1 в Воронеже',
    excerpt: 'Рассказываем путь BARBER HOUSE: от первых 6 студентов в небольшом помещении до 500+ выпускников и собственного учебного барбершопа.',
    category: 'О школе',
    date: '15 февраля 2026',
    img: 'https://images.unsplash.com/photo-1543697506-6729425f7265?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    readTime: '7 мин',
    hot: false,
  },
  {
    id: 3,
    title: 'Итоги конкурса "Золотой Шейвер 2025"',
    excerpt: 'В декабре 2025 прошёл наш ежегодный конкурс барберов среди выпускников школы. Рассказываем о победителях и лучших работах.',
    category: 'События',
    date: '5 января 2026',
    img: 'https://images.unsplash.com/photo-1638636241638-aef5120c5153?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    readTime: '4 мин',
    hot: false,
  },
  {
    id: 4,
    title: 'Как выбрать профессиональный инструмент барбера: полный гид',
    excerpt: 'Машинки, триммеры, бритвы, ножницы — что купить на старте карьеры и на что не стоит тратить деньги. Рекомендации наших преподавателей.',
    category: 'Советы',
    date: '28 января 2026',
    img: 'https://images.unsplash.com/photo-1758812818698-6ecd792a87da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    readTime: '8 мин',
    hot: false,
  },
  {
    id: 5,
    title: 'Выпускник Сергей: "Бросил IT в 35 лет — и ни о чём не жалею"',
    excerpt: 'История одного из наших самых вдохновляющих выпускников. Программист с 10-летним стажем ушёл в барберинг и стал наставником в BARBER HOUSE.',
    category: 'Истории',
    date: '10 февраля 2026',
    img: 'https://images.unsplash.com/photo-1592304346250-ef7244f8c9cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    readTime: '6 мин',
    hot: false,
  },
  {
    id: 6,
    title: 'Весенние акции в школе: скидки и специальные предложения',
    excerpt: 'К 8 марта и весеннему сезону мы подготовили специальные предложения для новых студентов. Рассрочка 0%, бонусный инструментарий и другие приятности.',
    category: 'Акции',
    date: '1 марта 2026',
    img: 'https://images.unsplash.com/photo-1593185196543-01541d9258e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    readTime: '3 мин',
    hot: true,
  },
];

const categories = ['Все', 'Тренды', 'О школе', 'События', 'Советы', 'Истории', 'Акции'];

const categoryColors: Record<string, string> = {
  'Тренды': LIME,
  'О школе': '#2A96F3',
  'События': '#FFA500',
  'Советы': '#9B59B6',
  'Истории': '#FF6B6B',
  'Акции': '#E74C3C',
};

export function BlogPage() {
  const { data: settings } = useSettings();
  const waPhone = settings.whatsapp_phone || '79001234567';
  const tgChannel = settings.telegram_channel || 'barberhouse_vrn';
  const [activeCategory, setActiveCategory] = useState('Все');
  const filtered = activeCategory === 'Все' ? posts : posts.filter(p => p.category === activeCategory);

  return (
    <div style={{ minHeight: '100vh' }}>
      <PageHeroBand
        label="Блог"
        title="СТАТЬИ И НОВОСТИ"
        subtitle="Советы мастеров, тренды, истории из жизни барберов. Читай — развивайся — зарабатывай."
      />

      {/* Category filters */}
      <section className="py-6" style={{ background: '#F8F7F5', borderBottom: '1px solid #EBEBEB' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap gap-2">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              style={{
                background:    activeCategory === c ? LIME : '#FFFFFF',
                color:         activeCategory === c ? '#FFFFFF' : '#555',
                border:        `1px solid ${activeCategory === c ? LIME : '#DDDAD6'}`,
                borderRadius:  '8px',
                padding:       '7px 16px',
                fontWeight:    700,
                fontSize:      '12px',
                cursor:        'pointer',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                transition:    'all 0.2s',
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-16" style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <FloatingToolsBg layout={2} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          {/* Featured */}
          {activeCategory === 'Все' && filtered[0] && (
            <AnimatedSection className="mb-8">
              <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div style={{ height: '320px', overflow: 'hidden' }}>
                    <ImageWithFallback src={filtered[0].img} alt={filtered[0].title} className="w-full h-full object-cover" />
                  </div>
                  <div style={{ padding: '40px' }}>
                    <div className="flex items-center gap-2 mb-4">
                      <span style={{ background: LIME + '12', color: LIME, borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 700 }}>{filtered[0].category}</span>
                      <span style={{ background: '#FF4444', color: '#FFFFFF', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 700 }}>HOT</span>
                    </div>
                    <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(24px, 3vw, 38px)', color: '#0D0D0D', letterSpacing: '0.02em', marginBottom: '14px', lineHeight: 1.1 }}>
                      {filtered[0].title}
                    </h2>
                    <p style={{ color: '#777', fontSize: '15px', lineHeight: 1.7, marginBottom: '20px' }}>{filtered[0].excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} color="#AAA" />
                        <span style={{ color: '#AAA', fontSize: '12px' }}>{filtered[0].date}</span>
                        <span style={{ color: '#CCC', fontSize: '12px' }}>·</span>
                        <span style={{ color: '#AAA', fontSize: '12px' }}>{filtered[0].readTime}</span>
                      </div>
                      <button style={{ color: LIME, fontWeight: 700, fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        Читать <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeCategory === 'Все' ? filtered.slice(1) : filtered).map((post, i) => (
              <AnimatedSection key={post.id} delay={i * 0.1}>
                <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', transition: 'box-shadow 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)')}
                >
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <ImageWithFallback src={post.img} alt={post.title} className="w-full h-full object-cover" style={{ transition: 'transform 0.4s' }}
                      onMouseEnter={(e: any) => (e.target.style.transform = 'scale(1.05)')}
                      onMouseLeave={(e: any) => (e.target.style.transform = 'scale(1)')}
                    />
                  </div>
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Tag size={12} color={LIME} />
                      <span style={{ color: LIME, fontSize: '11px', fontWeight: 700 }}>{post.category}</span>
                    </div>
                    <h3 style={{ color: '#0D0D0D', fontSize: '16px', fontWeight: 700, lineHeight: 1.35, marginBottom: '10px', flex: 1 }}>{post.title}</h3>
                    <p style={{ color: '#888', fontSize: '13px', lineHeight: 1.65, marginBottom: '16px' }}>{post.excerpt.substring(0, 80)}...</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} color="#CCC" />
                        <span style={{ color: '#AAA', fontSize: '11px' }}>{post.date}</span>
                        <span style={{ color: '#DDD', margin: '0 4px' }}>·</span>
                        <span style={{ color: '#AAA', fontSize: '11px' }}>{post.readTime}</span>
                      </div>
                      <button style={{ color: LIME, fontWeight: 700, fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', letterSpacing: '0.05em' }}>
                        Читать <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <BarberPoleDivider />

      {/* Subscribe */}
      <section className="py-16" style={{ background: '#FAFAF8' }}>
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 4vw, 44px)', color: '#0D0D0D', letterSpacing: '0.02em', marginBottom: '10px' }}>
              СЛЕДИ ЗА ОБНОВЛЕНИЯМИ
            </h2>
            <p style={{ color: '#777', fontSize: '15px', marginBottom: '24px' }}>Подпишись в Telegram — новые статьи, акции и новости первым</p>
            <a
              href={`https://t.me/${tgChannel}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: '#2A96F3', color: '#FFFFFF', borderRadius: '8px', padding: '14px 32px', fontWeight: 700, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              Подписаться в Telegram
            </a>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}