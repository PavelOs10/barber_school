import { useState } from 'react';
import { Link } from 'react-router';
import { AnimatedSection } from '../components/AnimatedSection';
import { Clock, MapPin, Users, ArrowRight, CheckCircle, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BarberPoleDivider, FloatingToolsBg, PageHeroBand, PoleSideDecor } from '../components/BarberDecor';
import { useAPI, useSettings } from '../hooks/useAPI';

const LIME = '#D42B2B';
const CARD_BG = '#FFFFFF';
const BORDER = '#EBEBEB';
const filters = ['Все курсы', 'С нуля', 'Углублённый', 'Онлайн'];

function CourseCard({ course, waPhone }: { course: any; waPhone: string }) {
  const [expanded, setExpanded] = useState(false);
  const spotsLeft = course.spots;
  const pct = ((course.total_spots - spotsLeft) / course.total_spots) * 100;

  return (
    <AnimatedSection>
      <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', overflow: 'hidden', transition: 'border-color 0.3s' }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = course.color + '60')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}>
        <div style={{ height: '4px', background: course.color }} />
        <div style={{ padding: '24px' }}>
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <span style={{ background: course.color + '20', color: course.color, borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{course.tag}</span>
              <h3 style={{ color: '#0D0D0D', fontSize: '18px', fontWeight: 700, margin: '10px 0 4px' }}>{course.title}</h3>
              <p style={{ color: '#777', fontSize: '13px', margin: 0 }}>{course.subtitle}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="flex items-center gap-2"><Clock size={13} color="#777" /><span style={{ color: '#888', fontSize: '13px' }}>{course.duration}</span></div>
            <div className="flex items-center gap-2"><MapPin size={13} color="#777" /><span style={{ color: '#888', fontSize: '13px' }}>{course.city}</span></div>
            <div className="flex items-center gap-2"><Users size={13} color="#777" /><span style={{ color: '#888', fontSize: '13px' }}>Старт: {course.start_date}</span></div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <div className="flex justify-between items-center mb-1">
              <span style={{ color: '#888', fontSize: '12px' }}>Свободных мест</span>
              <span style={{ color: spotsLeft <= 3 ? '#FF4444' : course.color, fontSize: '12px', fontWeight: 700 }}>{spotsLeft} из {course.total_spots}</span>
            </div>
            <div style={{ background: '#2A2A2A', borderRadius: '4px', height: '6px' }}>
              <div style={{ background: spotsLeft <= 3 ? '#FF4444' : course.color, width: `${pct}%`, height: '100%', borderRadius: '4px', transition: 'width 0.5s ease' }} />
            </div>
            {spotsLeft <= 3 && <p style={{ color: '#FF4444', fontSize: '11px', fontWeight: 600, marginTop: '4px' }}>⚡ Осталось мало мест!</p>}
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
                <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: '16px', marginBottom: '16px' }}>
                  <p style={{ color: '#888', fontSize: '13px', lineHeight: 1.6, marginBottom: '12px' }}>{course.for_who}</p>
                  <p style={{ color: course.color, fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>💰 {course.income}</p>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ color: '#0D0D0D', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Программа курса:</div>
                    <div className="grid grid-cols-1 gap-1">
                      {(course.program || []).map((p: string, i: number) => (
                        <div key={i} className="flex items-center gap-2"><CheckCircle size={12} color={course.color} /><span style={{ color: '#888', fontSize: '12px' }}>{p}</span></div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#0D0D0D', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Бонусы:</div>
                    <div className="flex flex-wrap gap-2">
                      {(course.perks || []).map((p: string) => (
                        <span key={p} style={{ background: '#2A2A2A', color: '#888', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 600 }}>{p}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setExpanded(!expanded)} style={{ color: '#777', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 12px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {expanded ? <><ChevronUp size={14} /> Скрыть</> : <><ChevronDown size={14} /> Программа</>}
          </button>
          <div className="flex items-center justify-between pt-4" style={{ borderTop: `1px solid ${BORDER}` }}>
            <div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', color: course.color }}>{course.price}</div>
              {course.old_price && <div style={{ color: '#555', fontSize: '12px', textDecoration: 'line-through' }}>{course.old_price}</div>}
            </div>
            <a href={`https://wa.me/${waPhone}?text=Хочу записаться на ${course.title}`} target="_blank" rel="noopener noreferrer" style={{ background: course.color, color: '#0D0D0D', borderRadius: '6px', padding: '10px 16px', fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageCircle size={14} /> Записаться
            </a>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

export function CoursesPage() {
  const [activeFilter, setActiveFilter] = useState('Все курсы');
  const { data: courses, loading } = useAPI<any[]>('/courses', []);
  const { data: settings } = useSettings();
  const waPhone = settings.whatsapp_phone || '79001234567';
  const tgChannel = settings.telegram_channel || 'barberhouse_vrn';
  const filtered = activeFilter === 'Все курсы' ? courses : courses.filter((c: any) => c.category === activeFilter);

  return (
    <div style={{ minHeight: '100vh' }}>
      <PageHeroBand label="Обучение" title="НАШИ КУРСЫ" subtitle="Каждый курс — это путь к новой профессии. Выбери подходящий формат и начни зарабатывать любимым делом." />
      <section className="py-8" style={{ background: '#F8F7F5', borderBottom: '1px solid #EBEBEB' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap gap-2">
            {filters.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} style={{ background: activeFilter === f ? LIME : '#FFFFFF', color: activeFilter === f ? '#FFFFFF' : '#555', border: `1px solid ${activeFilter === f ? LIME : '#DDDAD6'}`, borderRadius: '8px', padding: '8px 18px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase', transition: 'all 0.2s' }}>{f}</button>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12" style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <FloatingToolsBg layout={0} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          {loading ? <div style={{ textAlign: 'center', padding: '48px', color: '#888' }}>Загрузка...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((c: any) => <CourseCard key={c.id} course={c} waPhone={waPhone} />)}
          </div>
          )}
        </div>
      </section>
      <BarberPoleDivider />
      <section className="py-16" style={{ background: '#FAFAF8', position: 'relative', overflow: 'hidden' }}>
        <PoleSideDecor side="right" topPercent={50} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative" style={{ zIndex: 2 }}>
          <AnimatedSection>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 4vw, 46px)', color: '#0D0D0D', letterSpacing: '0.02em', marginBottom: '12px' }}>НЕ ЗНАЕШЬ КАКОЙ КУРС ВЫБРАТЬ?</h2>
            <p style={{ color: '#777', fontSize: '16px', marginBottom: '24px' }}>Напиши нам — поможем выбрать курс под твои цели и бюджет</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noopener noreferrer" style={{ background: LIME, color: '#FFFFFF', borderRadius: '8px', padding: '14px 28px', fontWeight: 700, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}><MessageCircle size={16} /> WhatsApp</a>
              <a href={`https://t.me/${tgChannel}`} target="_blank" rel="noopener noreferrer" style={{ border: '1px solid #2A96F3', color: '#2A96F3', borderRadius: '8px', padding: '14px 28px', fontWeight: 700, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>Telegram</a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
