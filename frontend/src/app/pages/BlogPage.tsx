import { Calendar, ArrowRight, Tag } from 'lucide-react';
import { useState } from 'react';
import { AnimatedSection, BarberPoleDivider, FloatingToolsBg, ImageWithFallback, PageHeroBand } from '../components/UI';
import { useAPI, useSettings } from '../hooks/useAPI';

const RED = '#D42B2B';
const catColors: Record<string, string> = { 'Тренды': RED, 'О школе': '#2A96F3', 'События': '#FFA500', 'Советы': '#9B59B6', 'Истории': '#FF6B6B', 'Акции': '#E74C3C' };

function fmtDate(dt: string) { try { return new Date(dt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }); } catch { return dt; } }

interface Post { id: number; title: string; excerpt: string; content: string; category: string; img: string; read_time: string; hot: number; visible: number; created_at: string; }

export function BlogPage() {
  const { data: settings } = useSettings();
  const { data: posts, loading } = useAPI<Post[]>('/blog', []);
  const tgChannel = settings.telegram_channel || 'barberhouse_vrn';
  const [cat, setCat] = useState('Все');
  const categories = ['Все', ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];
  const filtered = cat === 'Все' ? posts : posts.filter(p => p.category === cat);

  return (
    <div style={{ minHeight: '100vh' }}>
      <PageHeroBand label="Блог" title="СТАТЬИ И НОВОСТИ" subtitle="Советы мастеров, тренды, истории из жизни барберов." />

      <section className="py-6" style={{ background: '#F8F7F5', borderBottom: '1px solid #EBEBEB' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap gap-2">
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{ background: cat === c ? RED : '#FFF', color: cat === c ? '#FFF' : '#555', border: `1px solid ${cat === c ? RED : '#DDDAD6'}`, borderRadius: '8px', padding: '7px 16px', fontWeight: 700, fontSize: '12px', cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase', transition: 'all 0.2s' }}>
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="py-16" style={{ background: '#FFF', position: 'relative', overflow: 'hidden' }}>
        <FloatingToolsBg layout={2} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          {loading && <div style={{ textAlign: 'center', padding: '40px', color: '#AAA' }}>Загрузка...</div>}
          {!loading && !filtered.length && <div style={{ textAlign: 'center', padding: '40px', color: '#AAA' }}>Статей пока нет</div>}

          {cat === 'Все' && filtered[0] && (
            <AnimatedSection className="mb-8">
              <div style={{ background: '#FFF', border: '1px solid #EBEBEB', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div style={{ height: '320px', overflow: 'hidden' }}><ImageWithFallback src={filtered[0].img} alt={filtered[0].title} className="w-full h-full object-cover" /></div>
                  <div style={{ padding: '40px' }}>
                    <div className="flex items-center gap-2 mb-4">
                      <span style={{ background: (catColors[filtered[0].category] || RED) + '12', color: catColors[filtered[0].category] || RED, borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 700 }}>{filtered[0].category}</span>
                      {filtered[0].hot ? <span style={{ background: '#FF4444', color: '#FFF', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 700 }}>HOT</span> : null}
                    </div>
                    <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(24px, 3vw, 38px)', color: '#0D0D0D', letterSpacing: '0.02em', marginBottom: '14px', lineHeight: 1.1 }}>{filtered[0].title}</h2>
                    <p style={{ color: '#777', fontSize: '15px', lineHeight: 1.7, marginBottom: '20px' }}>{filtered[0].excerpt}</p>
                    <div className="flex items-center gap-2">
                      <Calendar size={13} color="#AAA" /><span style={{ color: '#AAA', fontSize: '12px' }}>{fmtDate(filtered[0].created_at)}</span>
                      <span style={{ color: '#CCC' }}>·</span><span style={{ color: '#AAA', fontSize: '12px' }}>{filtered[0].read_time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(cat === 'Все' ? filtered.slice(1) : filtered).map((p, i) => (
              <AnimatedSection key={p.id} delay={i * 0.1}>
                <div style={{ background: '#FFF', border: '1px solid #EBEBEB', borderRadius: '16px', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', transition: 'box-shadow 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)')}>
                  <div style={{ height: '200px', overflow: 'hidden' }}><ImageWithFallback src={p.img} alt={p.title} className="w-full h-full object-cover" /></div>
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Tag size={12} color={catColors[p.category] || RED} />
                      <span style={{ color: catColors[p.category] || RED, fontSize: '11px', fontWeight: 700 }}>{p.category}</span>
                      {p.hot ? <span style={{ background: '#FF4444', color: '#fff', borderRadius: '4px', padding: '1px 6px', fontSize: '9px', fontWeight: 800 }}>HOT</span> : null}
                    </div>
                    <h3 style={{ color: '#0D0D0D', fontSize: '16px', fontWeight: 700, lineHeight: 1.35, marginBottom: '10px', flex: 1 }}>{p.title}</h3>
                    <p style={{ color: '#888', fontSize: '13px', lineHeight: 1.65, marginBottom: '16px' }}>{p.excerpt.substring(0, 80)}...</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} color="#CCC" /><span style={{ color: '#AAA', fontSize: '11px' }}>{fmtDate(p.created_at)}</span>
                        <span style={{ color: '#DDD', margin: '0 4px' }}>·</span><span style={{ color: '#AAA', fontSize: '11px' }}>{p.read_time}</span>
                      </div>
                      <button style={{ color: RED, fontWeight: 700, fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
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

      <section className="py-16" style={{ background: '#FAFAF8' }}>
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 4vw, 44px)', color: '#0D0D0D', marginBottom: '10px' }}>СЛЕДИ ЗА ОБНОВЛЕНИЯМИ</h2>
            <p style={{ color: '#777', fontSize: '15px', marginBottom: '24px' }}>Подпишись в Telegram — новые статьи первым</p>
            <a href={`https://t.me/${tgChannel}`} target="_blank" rel="noopener noreferrer"
              style={{ background: '#2A96F3', color: '#FFF', borderRadius: '8px', padding: '14px 32px', fontWeight: 700, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Подписаться в Telegram
            </a>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
