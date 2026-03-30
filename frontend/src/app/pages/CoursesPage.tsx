import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Calendar, Check, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { AnimatedSection, BarberPoleDivider, FloatingToolsBg, PageHeroBand, ScissorsDecor } from '../components/UI';
import { useAPI, useSettings } from '../hooks/useAPI';

const RED = '#D42B2B';
const TABS = ['Все курсы', 'С нуля', 'Углублённый', 'Онлайн'];

function CourseCard({ c, waPhone }: { c: any; waPhone: string }) {
  const [open, setOpen] = useState(false);
  const spots = c.spots;
  const pct = (c.total_spots - spots) / c.total_spots * 100;
  return (
    <AnimatedSection>
      <div style={{ background: '#FFF', border: '1px solid #EBEBEB', borderRadius: '16px', overflow: 'hidden', transition: 'border-color 0.3s' }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = (c.color || RED) + '60')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = '#EBEBEB')}>
        <div style={{ height: '4px', background: c.color || RED }} />
        <div style={{ padding: '24px' }}>
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <span style={{ background: (c.color || RED) + '20', color: c.color || RED, borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{c.tag}</span>
              <h3 style={{ color: '#0D0D0D', fontSize: '18px', fontWeight: 700, margin: '10px 0 4px' }}>{c.title}</h3>
              <p style={{ color: '#777', fontSize: '13px', margin: 0 }}>{c.subtitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="flex items-center gap-2"><Clock size={13} color="#777" /><span style={{ color: '#888', fontSize: '13px' }}>{c.duration}</span></div>
            <div className="flex items-center gap-2"><MapPin size={13} color="#777" /><span style={{ color: '#888', fontSize: '13px' }}>{c.city}</span></div>
            <div className="flex items-center gap-2"><Calendar size={13} color="#777" /><span style={{ color: '#888', fontSize: '13px' }}>Старт: {c.start_date}</span></div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div className="flex justify-between items-center mb-1">
              <span style={{ color: '#888', fontSize: '12px' }}>Свободных мест</span>
              <span style={{ color: spots <= 3 ? '#FF4444' : c.color || RED, fontSize: '12px', fontWeight: 700 }}>{spots} из {c.total_spots}</span>
            </div>
            <div style={{ background: '#EEE', borderRadius: '4px', height: '6px' }}>
              <div style={{ background: spots <= 3 ? '#FF4444' : c.color || RED, width: `${pct}%`, height: '100%', borderRadius: '4px', transition: 'width 0.5s ease' }} />
            </div>
            {spots <= 3 && <p style={{ color: '#FF4444', fontSize: '11px', fontWeight: 600, marginTop: '4px' }}>⚡ Осталось мало мест!</p>}
          </div>

          <AnimatePresence>
            {open && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                <div style={{ borderTop: '1px solid #EBEBEB', paddingTop: '16px', marginBottom: '16px' }}>
                  {c.for_who && <p style={{ color: '#888', fontSize: '13px', lineHeight: 1.6, marginBottom: '12px' }}>{c.for_who}</p>}
                  {c.income && <p style={{ color: c.color || RED, fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>💰 {c.income}</p>}
                  {(c.program || []).length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ color: '#0D0D0D', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Программа курса:</div>
                      {c.program.map((p: string, i: number) => (
                        <div key={i} className="flex items-center gap-2"><Check size={12} color={c.color || RED} /><span style={{ color: '#888', fontSize: '12px' }}>{p}</span></div>
                      ))}
                    </div>
                  )}
                  {(c.perks || []).length > 0 && (
                    <div>
                      <div style={{ color: '#0D0D0D', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Бонусы:</div>
                      <div className="flex flex-wrap gap-2">{c.perks.map((p: string) => <span key={p} style={{ background: '#F5F3F0', color: '#888', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 600 }}>{p}</span>)}</div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button onClick={() => setOpen(!open)} style={{ color: '#777', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 12px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {open ? <><ChevronUp size={14} /> Скрыть</> : <><ChevronDown size={14} /> Программа</>}
          </button>

          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid #EBEBEB' }}>
            <div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', color: c.color || RED }}>{c.price}</div>
              {c.old_price && <div style={{ color: '#555', fontSize: '12px', textDecoration: 'line-through' }}>{c.old_price}</div>}
            </div>
            <a href={`https://wa.me/${waPhone}?text=Хочу записаться на ${c.title}`} target="_blank" rel="noopener noreferrer"
              style={{ background: c.color || RED, color: '#FFF', borderRadius: '6px', padding: '10px 16px', fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageCircle size={14} /> Записаться
            </a>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

export function CoursesPage() {
  const [tab, setTab] = useState('Все курсы');
  const { data: courses, loading } = useAPI<any[]>('/courses', []);
  const { data: settings } = useSettings();
  const waPhone = settings.whatsapp_phone || '79001234567';
  const filtered = tab === 'Все курсы' ? courses : courses.filter(c => c.category === tab);

  return (
    <div style={{ minHeight: '100vh' }}>
      <PageHeroBand label="Обучение" title="НАШИ КУРСЫ" subtitle="Каждый курс — это путь к новой профессии. Выбери подходящий формат." />

      <section className="py-8" style={{ background: '#F8F7F5', borderBottom: '1px solid #EBEBEB' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap gap-2">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ background: tab === t ? RED : '#FFF', color: tab === t ? '#FFF' : '#555', border: `1px solid ${tab === t ? RED : '#DDDAD6'}`, borderRadius: '8px', padding: '8px 18px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase', transition: 'all 0.2s' }}>
              {t}
            </button>
          ))}
        </div>
      </section>

      <section className="py-12" style={{ background: '#FFF', position: 'relative', overflow: 'hidden' }}>
        <FloatingToolsBg layout={0} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          {loading ? <div style={{ textAlign: 'center', padding: '48px', color: '#888' }}>Загрузка...</div> :
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{filtered.map(c => <CourseCard key={c.id} c={c} waPhone={waPhone} />)}</div>
          }
        </div>
      </section>

      <BarberPoleDivider />

      <section className="py-16" style={{ background: '#FAFAF8' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 4vw, 46px)', color: '#0D0D0D', marginBottom: '12px' }}>НЕ ЗНАЕШЬ КАКОЙ КУРС ВЫБРАТЬ?</h2>
            <p style={{ color: '#777', fontSize: '16px', marginBottom: '24px' }}>Напиши нам — поможем выбрать курс под твои цели</p>
            <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noopener noreferrer"
              style={{ background: RED, color: '#FFF', borderRadius: '8px', padding: '14px 28px', fontWeight: 700, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <MessageCircle size={16} /> WhatsApp
            </a>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
