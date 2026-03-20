import { AnimatedSection } from '../components/AnimatedSection';
import { Calendar, Clock, Users, MessageCircle, CheckCircle, Scissors } from 'lucide-react';
import { useState } from 'react';
import { BarberPoleDivider, FloatingToolsBg, PageHeroBand, PoleSideDecor } from '../components/BarberDecor';
import { useAPI, useSettings, submitLead } from '../hooks/useAPI';

const LIME = '#D42B2B';
const CARD_BG = '#FFFFFF';
const BORDER = '#EBEBEB';

export function ModelPage() {
  const { data: modelDays, loading } = useAPI<any[]>('/model-days', []);
  const { data: settings } = useSettings();
  const waPhone = settings.whatsapp_phone || '79001234567';
  const [form, setForm] = useState({ name: '', phone: '', comment: '' });
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ minHeight: '100vh' }}>
      <PageHeroBand label="Стать моделью" title="БЕСПЛАТНАЯ СТРИЖКА" subtitle="Приходи к нам моделью — наши студенты постригут тебя бесплатно под контролем мастера-наставника." />
      <section className="py-16" style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <FloatingToolsBg layout={0} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <AnimatedSection direction="left">
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 4vw, 44px)', color: '#0D0D0D', letterSpacing: '0.02em', marginBottom: '16px' }}>БЛИЖАЙШИЕ ДНИ ДЛЯ МОДЕЛЕЙ</h2>
              {loading ? <div style={{ color: '#888', padding: '24px' }}>Загрузка...</div> : (
              <div className="flex flex-col gap-3">
                {modelDays.map((d: any) => (
                  <div key={d.id} style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar size={14} color={LIME} />
                          <span style={{ color: '#0D0D0D', fontWeight: 700, fontSize: '14px' }}>{d.date}</span>
                          <span style={{ color: '#AAA', fontSize: '12px' }}>({d.day})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={12} color="#AAA" />
                          <span style={{ color: '#777', fontSize: '12px' }}>{d.time}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: d.spots <= 3 ? '#FF4444' : '#2D9E5A', fontSize: '12px', fontWeight: 700 }}>{d.spots} мест</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Scissors size={12} color={LIME} />
                      <span style={{ color: '#666', fontSize: '13px' }}>{d.topic}</span>
                    </div>
                  </div>
                ))}
              </div>
              )}
              <div style={{ marginTop: '20px' }}>
                <h3 style={{ color: '#0D0D0D', fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>Как это работает:</h3>
                {['Запишись на удобную дату', 'Приходи в школу в назначенное время', 'Студент стрижёт тебя бесплатно под контролем мастера', 'Результат контролирует преподаватель — качество гарантировано'].map((t, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2"><CheckCircle size={14} color={LIME} className="shrink-0 mt-0.5" /><span style={{ color: '#666', fontSize: '13px' }}>{t}</span></div>
                ))}
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '36px', boxShadow: '0 4px 32px rgba(0,0,0,0.07)' }}>
                {submitted ? (
                  <div style={{ textAlign: 'center', padding: '32px 0' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: '#0D0D0D', marginBottom: '8px' }}>ЗАЯВКА ПРИНЯТА!</h3>
                    <p style={{ color: '#777', fontSize: '15px' }}>Мы свяжемся с тобой в течение нескольких часов</p>
                  </div>
                ) : (
                  <>
                    <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(24px, 3vw, 36px)', color: '#0D0D0D', letterSpacing: '0.02em', marginBottom: '8px' }}>ЗАПИСАТЬСЯ МОДЕЛЬЮ</h2>
                    <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>Оставь заявку — мы подберём удобную дату</p>
                    <form onSubmit={async (e) => { e.preventDefault(); await submitLead({ type: 'model', name: form.name, phone: form.phone, message: form.comment }); setSubmitted(true); }} className="flex flex-col gap-4">
                      {[
                        { key: 'name', label: 'Твоё имя', type: 'text', placeholder: 'Иван' },
                        { key: 'phone', label: 'Телефон или мессенджер', type: 'text', placeholder: '+7 900 123-45-67' },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={{ color: '#555', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>{f.label}</label>
                          <input type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} required style={{ width: '100%', background: '#F8F7F5', border: `1px solid ${BORDER}`, borderRadius: '8px', padding: '12px 14px', color: '#0D0D0D', fontSize: '14px', outline: 'none' }} />
                        </div>
                      ))}
                      <div>
                        <label style={{ color: '#555', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Комментарий (необязательно)</label>
                        <textarea placeholder="Пожелания по стрижке, предпочтительная дата..." value={form.comment} onChange={e => setForm(p => ({ ...p, comment: e.target.value }))} rows={3} style={{ width: '100%', background: '#F8F7F5', border: `1px solid ${BORDER}`, borderRadius: '8px', padding: '12px 14px', color: '#0D0D0D', fontSize: '14px', outline: 'none', resize: 'vertical' }} />
                      </div>
                      <button type="submit" style={{ background: LIME, color: '#FFFFFF', borderRadius: '8px', padding: '14px', fontWeight: 800, fontSize: '14px', letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
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
