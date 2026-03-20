import { AnimatedSection } from '../components/AnimatedSection';
import { Calendar, MapPin, Clock, Users, Flame, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { BarberPoleDivider, FloatingToolsBg, PageHeroBand } from '../components/BarberDecor';
import { useAPI, useSettings } from '../hooks/useAPI';

const LIME = '#D42B2B';
const CARD_BG = '#FFFFFF';
const BORDER = '#EBEBEB';
const formats = ['Все', 'Очно', 'Онлайн'];

export function SchedulePage() {
  const [formatFilter, setFormatFilter] = useState('Все');
  const { data: scheduleData, loading } = useAPI<any[]>('/schedule', []);
  const { data: settings } = useSettings();
  const waPhone = settings.whatsapp_phone || '79001234567';
  const filtered = formatFilter === 'Все' ? scheduleData : scheduleData.filter((s: any) => s.format === formatFilter);
  const hotItem = scheduleData.find((s: any) => s.hot && s.spots_left <= 5);

  return (
    <div style={{ minHeight: '100vh' }}>
      <PageHeroBand label="Набор открыт" title="РАСПИСАНИЕ КУРСОВ" subtitle="Выбери удобную дату и формат. Места в группах ограничены — не откладывай запись!" />
      {hotItem && (
        <AnimatedSection>
          <div style={{ background: 'linear-gradient(90deg, #FF3A20, #FF7A00)', padding: '14px 24px' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-3">
              <Flame size={20} color="#FFFFFF" />
              <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '14px' }}>
                🔥 На ближайший {hotItem.course_name.toLowerCase()} осталось только {hotItem.spots_left} {hotItem.spots_left <= 1 ? 'место' : hotItem.spots_left < 5 ? 'места' : 'мест'}!
              </span>
              <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noopener noreferrer" style={{ background: '#FFFFFF', color: '#FF3A20', borderRadius: '6px', padding: '6px 14px', fontWeight: 800, fontSize: '12px', marginLeft: 'auto', whiteSpace: 'nowrap', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Записаться</a>
            </div>
          </div>
        </AnimatedSection>
      )}
      <section className="py-6" style={{ background: '#F8F7F5', borderBottom: '1px solid #EBEBEB' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap gap-2 items-center">
          <span style={{ color: '#888', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: '8px' }}>Формат:</span>
          {formats.map(f => (
            <button key={f} onClick={() => setFormatFilter(f)} style={{ background: formatFilter === f ? LIME : '#FFFFFF', color: formatFilter === f ? '#FFFFFF' : '#555', border: `1px solid ${formatFilter === f ? LIME : '#DDDAD6'}`, borderRadius: '8px', padding: '6px 16px', fontWeight: 700, fontSize: '12px', cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase', transition: 'all 0.2s' }}>{f}</button>
          ))}
        </div>
      </section>
      <section className="py-12" style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <FloatingToolsBg layout={2} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          {loading ? <div style={{ textAlign: 'center', padding: '48px', color: '#888' }}>Загрузка...</div> : (
          <div className="flex flex-col gap-4">
            {filtered.map((s: any, i: number) => {
              const pct = ((s.total_spots - s.spots_left) / s.total_spots) * 100;
              const isAlmostFull = s.spots_left <= 3;
              return (
                <AnimatedSection key={s.id} delay={i * 0.08}>
                  <div style={{ background: CARD_BG, border: `1px solid ${s.hot ? s.color + '60' : BORDER}`, borderRadius: '12px', padding: '20px 24px', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                    {s.hot && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${s.color}, transparent)` }} />}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                      <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-2">
                          {s.hot && <span style={{ background: '#FF3A20', color: '#FFFFFF', borderRadius: '4px', padding: '2px 8px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>🔥 Горячий набор</span>}
                          <span style={{ background: s.color + '15', color: s.color, borderRadius: '4px', padding: '2px 8px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.format}</span>
                        </div>
                        <h3 style={{ color: '#0D0D0D', fontSize: '16px', fontWeight: 700, margin: 0 }}>{s.course_name}</h3>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2"><Calendar size={13} color="#AAA" /><span style={{ color: '#666', fontSize: '13px' }}>{s.start_date}</span></div>
                        <div className="flex items-center gap-2"><Clock size={13} color="#AAA" /><span style={{ color: '#777', fontSize: '12px' }}>{s.time_info}</span></div>
                        <div className="flex items-center gap-2"><MapPin size={13} color="#AAA" /><span style={{ color: '#777', fontSize: '12px' }}>{s.city}</span></div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1"><Users size={12} color="#AAA" /><span style={{ color: '#888', fontSize: '12px' }}>Места</span></div>
                          <span style={{ color: isAlmostFull ? '#FF4444' : s.color, fontSize: '12px', fontWeight: 700 }}>{s.spots_left}/{s.total_spots}</span>
                        </div>
                        <div style={{ background: '#EEE', borderRadius: '4px', height: '6px' }}>
                          <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 0.8, ease: 'easeOut' }} style={{ background: isAlmostFull ? '#FF4444' : s.color, height: '100%', borderRadius: '4px' }} />
                        </div>
                        {isAlmostFull && <p style={{ color: '#FF4444', fontSize: '10px', fontWeight: 600, margin: '3px 0 0' }}>⚡ Мало мест!</p>}
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-3">
                        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', color: s.color }}>{s.price}</div>
                        <a href={`https://wa.me/${waPhone}?text=Хочу записаться: ${s.course_name} (${s.start_date})`} target="_blank" rel="noopener noreferrer" style={{ background: s.color, color: '#FFFFFF', borderRadius: '6px', padding: '8px 14px', fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}><MessageCircle size={13} /> Записаться</a>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
          )}
        </div>
      </section>
      <BarberPoleDivider />
      <section className="py-16" style={{ background: '#FAFAF8', position: 'relative', overflow: 'hidden' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-10">
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 4vw, 44px)', color: '#0D0D0D', letterSpacing: '0.02em', margin: 0 }}>ФОРМАТЫ ОБУЧЕНИЯ</h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { title: 'Очное обучение', desc: 'Занятия в учебном классе с наставником. Практика на моделях. Полное погружение в профессию.', icon: '🎓' },
              { title: 'Онлайн-формат', desc: 'Видеоуроки, чат с наставником, разборы техник. Учишься в своём темпе из любой точки.', icon: '💻' },
              { title: 'Индивидуальные занятия', desc: 'Личный наставник только для тебя. Гибкое расписание. Максимальный результат.', icon: '⭐' },
            ].map((f, i) => (
              <AnimatedSection key={f.title} delay={i * 0.1}>
                <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '24px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>{f.icon}</div>
                  <h3 style={{ color: '#0D0D0D', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>{f.title}</h3>
                  <p style={{ color: '#777', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
