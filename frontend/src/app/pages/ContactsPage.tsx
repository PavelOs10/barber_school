import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { AnimatedSection, BarberPoleDivider, FloatingToolsBg, PageHeroBand } from '../components/UI';
import { useSettings, submitLead } from '../hooks/useAPI';

const RED = '#D42B2B';

export function ContactsPage() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const { data: s } = useSettings();
  const waPhone = s.whatsapp_phone || '79001234567';
  const tg = s.telegram_channel || 'barberhouse_vrn';
  const address = s.address || 'г. Воронеж, ул. Плехановская, 67';
  const phone = s.phone || '+7 (900) 123-45-67';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitLead({ type: 'contact', name: form.name, phone: form.phone, message: form.message });
    setSent(true);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <PageHeroBand label="Контакты" title="МЫ НА СВЯЗИ" subtitle="Звони, пиши или приходи. Ответим быстро." />
      <section className="py-16" style={{ background: '#FFF', position: 'relative', overflow: 'hidden' }}>
        <FloatingToolsBg layout={0} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <AnimatedSection direction="left">
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 4vw, 44px)', color: '#0D0D0D', marginBottom: '24px' }}>КАК НАС НАЙТИ</h2>
              <div style={{ background: '#FFF', border: '1px solid #EBEBEB', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
                <h3 style={{ color: '#0D0D0D', fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Главный кампус</h3>
                <div className="flex flex-col gap-3">
                  {[{ icon: MapPin, text: address }, { icon: Phone, text: phone }, { icon: Mail, text: s.email || 'info@barberhouse.ru' }, { icon: Clock, text: s.work_hours || 'Пн–Сб: 9:00–20:00' }].map(({ icon: I, text }) => (
                    <div key={text} className="flex items-center gap-3"><I size={16} color={RED} /><span style={{ color: '#666', fontSize: '14px' }}>{text}</span></div>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-6">
                <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noopener noreferrer"
                  style={{ background: RED, color: '#FFF', borderRadius: '8px', padding: '12px 20px', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MessageCircle size={14} /> WhatsApp
                </a>
                <a href={`https://t.me/${tg}`} target="_blank" rel="noopener noreferrer"
                  style={{ background: '#2A96F3', color: '#FFF', borderRadius: '8px', padding: '12px 20px', fontWeight: 700, fontSize: '13px' }}>
                  Telegram
                </a>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div style={{ background: '#FFF', border: '1px solid #EBEBEB', borderRadius: '20px', padding: '36px', boxShadow: '0 4px 32px rgba(0,0,0,0.07)' }}>
                {sent ? (
                  <div style={{ textAlign: 'center', padding: '48px 0' }}>
                    <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', color: '#0D0D0D', marginBottom: '10px' }}>СООБЩЕНИЕ ОТПРАВЛЕНО!</h3>
                    <p style={{ color: '#777', fontSize: '15px' }}>Мы ответим в течение нескольких часов</p>
                  </div>
                ) : (
                  <>
                    <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(24px, 3vw, 36px)', color: '#0D0D0D', marginBottom: '8px' }}>НАПИСАТЬ НАМ</h2>
                    <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>Оставь заявку — перезвоним</p>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                      {[{ key: 'name', label: 'Имя', type: 'text', ph: 'Иван' }, { key: 'phone', label: 'Телефон', type: 'tel', ph: '+7 900 123-45-67' }].map(f => (
                        <div key={f.key}>
                          <label style={{ color: '#555', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>{f.label}</label>
                          <input type={f.type} placeholder={f.ph} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} required
                            style={{ width: '100%', background: '#F8F7F5', border: '1px solid #EBEBEB', borderRadius: '8px', padding: '12px 14px', color: '#0D0D0D', fontSize: '14px', outline: 'none' }} />
                        </div>
                      ))}
                      <div>
                        <label style={{ color: '#555', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Сообщение</label>
                        <textarea placeholder="Ваш вопрос..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={4} required
                          style={{ width: '100%', background: '#F8F7F5', border: '1px solid #EBEBEB', borderRadius: '8px', padding: '12px 14px', color: '#0D0D0D', fontSize: '14px', outline: 'none', resize: 'vertical' }} />
                      </div>
                      <button type="submit" style={{ background: RED, color: '#FFF', borderRadius: '8px', padding: '14px', fontWeight: 800, fontSize: '14px', textTransform: 'uppercase', cursor: 'pointer', border: 'none' }}>
                        Отправить
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
