import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, AlertTriangle, MessageCircle } from 'lucide-react';
import { AnimatedSection, BarberPoleDivider, FloatingToolsBg, PageHeroBand } from '../components/UI';
import { useAPI, useSettings } from '../hooks/useAPI';

const RED = '#D42B2B';
const TABS = ['Все', 'Очно', 'Онлайн'];

export function SchedulePage() {
  const [tab, setTab] = useState('Все');
  const { data: rows, loading } = useAPI<any[]>('/schedule', []);
  const { data: settings } = useSettings();
  const waPhone = settings.whatsapp_phone || '79001234567';
  const filtered = tab === 'Все' ? rows : rows.filter(r => r.format === tab);
  const hot = rows.find(r => r.hot && r.spots_left <= 5);

  return (
    <div style={{ minHeight: '100vh' }}>
      <PageHeroBand label="Набор открыт" title="РАСПИСАНИЕ КУРСОВ" subtitle="Выбери удобную дату и формат. Места ограничены!" />

      {hot && (
        <AnimatedSection>
          <div style={{ background: 'linear-gradient(90deg, #FF3A20, #FF7A00)', padding: '14px 24px' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-3">
              <AlertTriangle size={20} color="#FFF" />
              <span style={{ color: '#FFF', fontWeight: 700, fontSize: '14px' }}>🔥 На ближайший {hot.course_name.toLowerCase()} осталось только {hot.spots_left} мест!</span>
              <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noopener noreferrer"
                style={{ background: '#FFF', color: '#FF3A20', borderRadius: '6px', padding: '6px 14px', fontWeight: 800, fontSize: '12px', marginLeft: 'auto', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
                Записаться
              </a>
            </div>
          </div>
        </AnimatedSection>
      )}

      <section className="py-6" style={{ background: '#F8F7F5', borderBottom: '1px solid #EBEBEB' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap gap-2 items-center">
          <span style={{ color: '#888', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: '8px' }}>Формат:</span>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ background: tab === t ? RED : '#FFF', color: tab === t ? '#FFF' : '#555', border: `1px solid ${tab === t ? RED : '#DDDAD6'}`, borderRadius: '8px', padding: '6px 16px', fontWeight: 700, fontSize: '12px', cursor: 'pointer', textTransform: 'uppercase' }}>
              {t}
            </button>
          ))}
        </div>
      </section>

      <section className="py-12" style={{ background: '#FFF', position: 'relative', overflow: 'hidden' }}>
        <FloatingToolsBg layout={2} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          {loading ? <div style={{ textAlign: 'center', padding: '48px', color: '#888' }}>Загрузка...</div> :
            <div className="flex flex-col gap-4">
              {filtered.map((r, i) => {
                const pct = (r.total_spots - r.spots_left) / r.total_spots * 100;
                const low = r.spots_left <= 3;
                return (
                  <AnimatedSection key={r.id} delay={i * 0.08}>
                    <div style={{ background: '#FFF', border: `1px solid ${r.hot ? (r.color || RED) + '60' : '#EBEBEB'}`, borderRadius: '12px', padding: '20px 24px', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                      {r.hot && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${r.color || RED}, transparent)` }} />}
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                        <div className="md:col-span-2">
                          <div className="flex items-center gap-2 mb-2">
                            {r.hot && <span style={{ background: '#FF3A20', color: '#FFF', borderRadius: '4px', padding: '2px 8px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>🔥 Горячий набор</span>}
                            <span style={{ background: (r.color || RED) + '15', color: r.color || RED, borderRadius: '4px', padding: '2px 8px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>{r.format}</span>
                          </div>
                          <h3 style={{ color: '#0D0D0D', fontSize: '16px', fontWeight: 700, margin: 0 }}>{r.course_name}</h3>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2"><Calendar size={13} color="#AAA" /><span style={{ color: '#666', fontSize: '13px' }}>{r.start_date}</span></div>
                          <div className="flex items-center gap-2"><Clock size={13} color="#AAA" /><span style={{ color: '#777', fontSize: '12px' }}>{r.time_info}</span></div>
                          <div className="flex items-center gap-2"><MapPin size={13} color="#AAA" /><span style={{ color: '#777', fontSize: '12px' }}>{r.city}</span></div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1"><Users size={12} color="#AAA" /><span style={{ color: '#888', fontSize: '12px' }}>Места</span></div>
                            <span style={{ color: low ? '#FF4444' : r.color || RED, fontSize: '12px', fontWeight: 700 }}>{r.spots_left}/{r.total_spots}</span>
                          </div>
                          <div style={{ background: '#EEE', borderRadius: '4px', height: '6px' }}>
                            <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }}
                              transition={{ duration: 0.8 }} style={{ background: low ? '#FF4444' : r.color || RED, height: '100%', borderRadius: '4px' }} />
                          </div>
                          {low && <p style={{ color: '#FF4444', fontSize: '10px', fontWeight: 600, margin: '3px 0 0' }}>⚡ Мало мест!</p>}
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-3">
                          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', color: r.color || RED }}>{r.price}</div>
                          <a href={`https://wa.me/${waPhone}?text=Хочу записаться: ${r.course_name} (${r.start_date})`} target="_blank" rel="noopener noreferrer"
                            style={{ background: r.color || RED, color: '#FFF', borderRadius: '6px', padding: '8px 14px', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}>
                            <MessageCircle size={13} /> Записаться
                          </a>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          }
        </div>
      </section>

      <BarberPoleDivider />
    </div>
  );
}
