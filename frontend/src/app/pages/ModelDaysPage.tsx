import { useState } from 'react';
import { Calendar, Clock, Check, MessageCircle, GraduationCap } from 'lucide-react';
import { AnimatedSection, BarberPoleDivider, FloatingToolsBg, PageHeroBand } from '../components/UI';
import { useAPI, useSettings, submitLead } from '../hooks/useAPI';

const RED = '#D42B2B';

export function ModelDaysPage() {
  const { data: days, loading } = useAPI<any[]>('/model-days', []);
  const { data: settings } = useSettings();
  const [form, setForm] = useState({ name: '', phone: '', comment: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitLead({ type: 'model', name: form.name, phone: form.phone, message: form.comment });
    setSent(true);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <PageHeroBand label="Стать моделью" title="БЕСПЛАТНАЯ СТРИЖКА" subtitle="Приходи моделью — наши студенты постригут тебя бесплатно под контролем мастера." />
      <section className="py-16" style={{ background: '#FFF', position: 'relative', overflow: 'hidden' }}>
        <FloatingToolsBg layout={0} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <AnimatedSection direction="left">
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 4vw, 44px)', color: '#0D0D0D', marginBottom: '16px' }}>БЛИЖАЙШИЕ ДНИ ДЛЯ МОДЕЛЕЙ</h2>
              {loading ? <div style={{ color: '#888', padding: '24px' }}>Загрузка...</div> :
                <div className="flex flex-col gap-3">
                  {days.map(d => (
                    <div key={d.id} style={{ background: '#FFF', border: '1px solid #EBEBEB', borderRadius: '12px', padding: '16px 20px' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar size={14} color={RED} /><span style={{ color: '#0D0D0D', fontWeight: 700, fontSize: '14px' }}>{d.date}</span>
                            <span style={{ color: '#AAA', fontSize: '12px' }}>({d.day})</span>
                          </div>
                          <div className="flex items-center gap-2"><Clock size={12} color="#AAA" /><span style={{ color: '#777', fontSize: '12px' }}>{d.time}</span></div>
                        </div>
                        <div style={{ color: d.spots <= 3 ? '#FF4444' : '#2D9E5A', fontSize: '12px', fontWeight: 700 }}>{d.spots} мест</div>
                      </div>
                      <div className="flex items-center gap-2"><GraduationCap size={12} color={RED} /><span style={{ color: '#666', fontSize: '13px' }}>{d.topic}</span></div>
                    </div>
                  ))}
                </div>
              }
              <div style={{ marginTop: '20px' }}>
                <h3 style={{ color: '#0D0D0D', fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>Как это работает:</h3>
                {['Запишись на удобную дату', 'Приходи в школу', 'Студент стрижёт бесплатно под контролем мастера', 'Качество гарантировано'].map((s, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2"><Check size={14} color={RED} className="shrink-0 mt-0.5" /><span style={{ color: '#666', fontSize: '13px' }}>{s}</span></div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div style={{ background: '#FFF', border: '1px solid #EBEBEB', borderRadius: '20px', padding: '36px', boxShadow: '0 4px 32px rgba(0,0,0,0.07)' }}>
                {sent ? (
                  <div style={{ textAlign: 'center', padding: '32px 0' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: '#0D0D0D' }}>ЗАЯВКА ПРИНЯТА!</h3>
                    <p style={{ color: '#777', fontSize: '15px' }}>Мы свяжемся с тобой</p>
                  </div>
                ) : (
                  <>
                    <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(24px, 3vw, 36px)', color: '#0D0D0D', marginBottom: '24px' }}>ЗАПИСАТЬСЯ МОДЕЛЬЮ</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                      <input placeholder="Твоё имя" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required
                        style={{ width: '100%', background: '#F8F7F5', border: '1px solid #EBEBEB', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', outline: 'none' }} />
                      <input placeholder="+7 900 123-45-67" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} required
                        style={{ width: '100%', background: '#F8F7F5', border: '1px solid #EBEBEB', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', outline: 'none' }} />
                      <textarea placeholder="Пожелания (необязательно)" value={form.comment} onChange={e => setForm(p => ({ ...p, comment: e.target.value }))} rows={3}
                        style={{ width: '100%', background: '#F8F7F5', border: '1px solid #EBEBEB', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', outline: 'none', resize: 'vertical' }} />
                      <button type="submit" style={{ background: RED, color: '#FFF', borderRadius: '8px', padding: '14px', fontWeight: 800, fontSize: '14px', textTransform: 'uppercase', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <MessageCircle size={16} /> Записаться
                      </button>
                    </form>
                  </>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
      <BarberPoleDivider />
    </div>
  );
}
