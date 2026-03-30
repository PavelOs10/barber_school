import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, BookOpen } from 'lucide-react';
import { AnimatedSection, BarberPoleDivider, FloatingToolsBg, ImageWithFallback, PageHeroBand, ScissorsDecor } from '../components/UI';
import { useAPI, useSettings } from '../hooks/useAPI';

const RED = '#D42B2B';

interface Teacher {
  id: number; name: string; role: string; experience: string; description: string; photo: string;
  sort_order: number; visible: number; created_at: string;
}

export function TeachersPage() {
  const { data: settings } = useSettings();
  const { data: teachers, loading } = useAPI<Teacher[]>('/teachers', []);
  const waPhone = settings.whatsapp_phone || '79001234567';
  const [selected, setSelected] = useState<Teacher | null>(null);

  return (
    <div style={{ minHeight: '100vh' }}>
      <PageHeroBand label="Команда" title="НАШИ ПРЕПОДАВАТЕЛИ" subtitle="Действующие мастера-практики. Учат тому, что делают сами — каждый день, в реальных барбершопах." />

      <section className="py-16" style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <FloatingToolsBg layout={1} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          {loading && <div style={{ textAlign: 'center', padding: '48px', color: '#888' }}>Загрузка...</div>}
          {!loading && !teachers.length && <div style={{ textAlign: 'center', padding: '48px', color: '#888' }}>Преподавателей пока нет</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teachers.map((t, i) => (
              <AnimatedSection key={t.id} delay={i * 0.1}>
                <motion.div whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(0,0,0,0.1)' }} transition={{ duration: 0.25 }}
                  style={{ background: '#FFF', border: '1px solid #EBEBEB', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
                  onClick={() => setSelected(t)}>
                  <div style={{ height: '260px', overflow: 'hidden', position: 'relative' }}>
                    <ImageWithFallback src={t.photo} alt={t.name} className="w-full h-full object-cover" />
                    {t.experience && (
                      <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
                        <span style={{ background: RED, color: '#FFF', borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: 700 }}>{t.experience}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ color: '#0D0D0D', fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{t.name}</h3>
                    <p style={{ color: '#888', fontSize: '12px', marginBottom: '12px' }}>{t.role}</p>
                    <button style={{ width: '100%', background: 'transparent', border: '1px solid #EBEBEB', borderRadius: '8px', padding: '8px', color: '#888', fontSize: '12px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = RED; e.currentTarget.style.color = RED; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#EBEBEB'; e.currentTarget.style.color = '#888'; }}>
                      Подробнее
                    </button>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <BarberPoleDivider />

      <section className="py-16" style={{ background: '#FAFAF8' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 4vw, 46px)', color: '#0D0D0D', letterSpacing: '0.02em', marginBottom: '12px' }}>ХОЧЕШЬ УЧИТЬСЯ У ЛУЧШИХ?</h2>
            <p style={{ color: '#777', fontSize: '16px', marginBottom: '24px' }}>Запишись на курс и начни обучение у действующих профессионалов</p>
            <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noopener noreferrer"
              style={{ background: RED, color: '#FFF', borderRadius: '8px', padding: '14px 32px', fontWeight: 800, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Записаться на курс
            </a>
          </AnimatedSection>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }} onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              style={{ background: '#FFF', borderRadius: '20px', maxWidth: '600px', width: '100%', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}
              onClick={e => e.stopPropagation()}>
              {selected.photo && <div style={{ height: '250px' }}><ImageWithFallback src={selected.photo} alt={selected.name} className="w-full h-full object-cover" /></div>}
              <div style={{ padding: '28px' }}>
                <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: '16px', right: '16px', color: '#AAA', background: 'rgba(255,255,255,0.8)', border: 'none', cursor: 'pointer', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
                {selected.experience && <div style={{ color: RED, fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>{selected.experience}</div>}
                <h2 style={{ color: '#0D0D0D', fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>{selected.name}</h2>
                <p style={{ color: '#888', fontSize: '13px', marginBottom: '16px' }}>{selected.role}</p>
                {selected.description && <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.7 }}>{selected.description}</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
