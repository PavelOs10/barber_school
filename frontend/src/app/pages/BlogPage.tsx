import { AnimatedSection } from '../components/AnimatedSection';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import { useState } from 'react';
import { BarberPoleDivider, FloatingToolsBg, PageHeroBand } from '../components/BarberDecor';
import { useSettings, useAPI } from '../hooks/useAPI';

const LIME = '#D42B2B';
const CARD_BG = '#FFFFFF';
const BORDER = '#EBEBEB';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  img: string;
  read_time: string;
  hot: number;
  visible: number;
  created_at: string;
}

const categoryColors: Record<string, string> = {
  'Тренды': LIME,
  'О школе': '#2A96F3',
  'События': '#FFA500',
  'Советы': '#9B59B6',
  'Истории': '#FF6B6B',
  'Акции': '#E74C3C',
};

function formatDate(dt: string): string {
  try {
    const d = new Date(dt);
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dt;
  }
}

export function BlogPage() {
  const { data: settings } = useSettings();
  const { data: posts, loading } = useAPI<BlogPost[]>('/blog', []);
  const tgChannel = settings.telegram_channel || 'barberhouse_vrn';
  const [activeCategory, setActiveCategory] = useState('Все');

  const categories = ['Все', ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];
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

          {loading && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#AAA' }}>Загрузка...</div>
          )}

          {!loading && !filtered.length && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#AAA' }}>Статей пока нет</div>
          )}

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
                      <span style={{ background: (categoryColors[filtered[0].category] || LIME) + '12', color: categoryColors[filtered[0].category] || LIME, borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 700 }}>{filtered[0].category}</span>
                      {filtered[0].hot ? <span style={{ background: '#FF4444', color: '#FFFFFF', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 700 }}>HOT</span> : null}
                    </div>
                    <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(24px, 3vw, 38px)', color: '#0D0D0D', letterSpacing: '0.02em', marginBottom: '14px', lineHeight: 1.1 }}>
                      {filtered[0].title}
                    </h2>
                    <p style={{ color: '#777', fontSize: '15px', lineHeight: 1.7, marginBottom: '20px' }}>{filtered[0].excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} color="#AAA" />
                        <span style={{ color: '#AAA', fontSize: '12px' }}>{formatDate(filtered[0].created_at)}</span>
                        <span style={{ color: '#CCC', fontSize: '12px' }}>·</span>
                        <span style={{ color: '#AAA', fontSize: '12px' }}>{filtered[0].read_time}</span>
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
                      <Tag size={12} color={categoryColors[post.category] || LIME} />
                      <span style={{ color: categoryColors[post.category] || LIME, fontSize: '11px', fontWeight: 700 }}>{post.category}</span>
                      {post.hot ? <span style={{ background: '#FF4444', color: '#fff', borderRadius: '4px', padding: '1px 6px', fontSize: '9px', fontWeight: 800 }}>HOT</span> : null}
                    </div>
                    <h3 style={{ color: '#0D0D0D', fontSize: '16px', fontWeight: 700, lineHeight: 1.35, marginBottom: '10px', flex: 1 }}>{post.title}</h3>
                    <p style={{ color: '#888', fontSize: '13px', lineHeight: 1.65, marginBottom: '16px' }}>{post.excerpt.substring(0, 80)}...</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} color="#CCC" />
                        <span style={{ color: '#AAA', fontSize: '11px' }}>{formatDate(post.created_at)}</span>
                        <span style={{ color: '#DDD', margin: '0 4px' }}>·</span>
                        <span style={{ color: '#AAA', fontSize: '11px' }}>{post.read_time}</span>
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
