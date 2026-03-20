import { AnimatedSection } from '../components/AnimatedSection';
import { MapPin, Phone, Mail, Send, Clock, MessageCircle, Instagram, Youtube } from 'lucide-react';
import { useState } from 'react';
import { BarberPoleDivider, FloatingToolsBg, PageHeroBand, PoleSideDecor } from '../components/BarberDecor';
import { submitLead, useSettings } from '../hooks/useAPI';

const LIME = '#D42B2B';
const CARD_BG = '#FFFFFF';
const BORDER = '#EBEBEB';

export function ContactsPage() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const { data: settings } = useSettings();
  const waPhone = settings.whatsapp_phone || '79001234567';
  const tgChannel = settings.telegram_channel || 'barberhouse_vrn';
  const address = settings.address || 'г. Воронеж, ул. Плехановская, 67';
  const phone = settings.phone || '+7 (900) 123-45-67';
  const email = settings.email || 'info@barberhouse.ru';
  const workHours = settings.work_hours || 'Пн–Сб: 9:00–20:00';

  const socials = [
    { label: 'ВКонтакте', handle: '@barberhouse_vrn', color: '#4C75A3', href: '#', desc: 'Новости, акции, фото' },
    { label: 'Telegram', handle: `@${tgChannel}`, color: '#2A96F3', href: `https://t.me/${tgChannel}`, desc: 'Оперативная связь' },
    { label: 'YouTube', handle: 'BARBER HOUSE School', color: '#FF0000', href: '#', desc: 'Видеоуроки и туториалы' },
    { label: 'TikTok', handle: '@barberhouse_vrn', color: '#FFFFFF', href: '#', desc: 'Короткие видео о барберинге' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitLead({ type: 'contact', name: form.name, phone: form.phone, message: form.message });
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <PageHeroBand label="Контакты" title="МЫ НА СВЯЗИ" subtitle="Звони, пиши или приходи. Ответим быстро — обычно в течение нескольких минут." />
      <section className="py-16" style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <FloatingToolsBg layout={0} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <AnimatedSection direction="left">
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 4vw, 44px)', color: '#0D0D0D', letterSpacing: '0.02em', marginBottom: '24px' }}>КАК НАС НАЙТИ</h2>
              <div className="flex flex-col gap-4">
                <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '24px', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 style={{ color: '#0D0D0D', fontSize: '16px', fontWeight: 700, margin: 0 }}>Главный кампус</h3>
                    <span style={{ background: LIME + '12', color: LIME, borderRadius: '6px', padding: '3px 8px', fontSize: '11px', fontWeight: 700 }}>Основной</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {[
                      { icon: MapPin, text: address },
                      { icon: Phone, text: phone },
                      { icon: Mail, text: email },
                      { icon: Clock, text: workHours },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-2"><Icon size={14} color={LIME} className="shrink-0" /><span style={{ color: '#666', fontSize: '13px' }}>{text}</span></div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '24px' }}>
                <h3 style={{ color: '#0D0D0D', fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Социальные сети</h3>
                <div className="grid grid-cols-2 gap-3">
                  {socials.map(s => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'border-color 0.25s', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
                      <span style={{ background: s.color + '15', borderRadius: '6px', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px' }}><span style={{ color: s.color, fontSize: '14px', fontWeight: 800 }}>{s.label[0]}</span></span>
                      <div><div style={{ color: '#0D0D0D', fontWeight: 600, fontSize: '13px' }}>{s.label}</div><div style={{ color: '#AAA', fontSize: '11px' }}>{s.handle}</div></div>
                    </a>
                  ))}
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '36px', boxShadow: '0 4px 32px rgba(0,0,0,0.07)' }}>
                {submitted ? (
                  <div style={{ textAlign: 'center', padding: '48px 0' }}>
                    <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', color: '#0D0D0D', marginBottom: '10px' }}>СООБЩЕНИЕ ОТПРАВЛЕНО!</h3>
                    <p style={{ color: '#777', fontSize: '15px' }}>Мы ответим в течение нескольких часов</p>
                  </div>
                ) : (
                  <>
                    <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(24px, 3vw, 36px)', color: '#0D0D0D', letterSpacing: '0.02em', marginBottom: '8px' }}>НАПИСАТЬ НАМ</h2>
                    <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>Оставь заявку — перезвоним и ответим на все вопросы</p>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                      {[{ key: 'name', label: 'Имя', type: 'text', placeholder: 'Иван' }, { key: 'phone', label: 'Телефон', type: 'tel', placeholder: '+7 900 123-45-67' }].map(f => (
                        <div key={f.key}><label style={{ color: '#555', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>{f.label}</label><input type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} required style={{ width: '100%', background: '#F8F7F5', border: `1px solid ${BORDER}`, borderRadius: '8px', padding: '12px 14px', color: '#0D0D0D', fontSize: '14px', outline: 'none' }} /></div>
                      ))}
                      <div><label style={{ color: '#555', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Сообщение</label><textarea placeholder="Ваш вопрос или пожелание..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={4} required style={{ width: '100%', background: '#F8F7F5', border: `1px solid ${BORDER}`, borderRadius: '8px', padding: '12px 14px', color: '#0D0D0D', fontSize: '14px', outline: 'none', resize: 'vertical' }} /></div>
                      <button type="submit" style={{ background: LIME, color: '#FFFFFF', borderRadius: '8px', padding: '14px', fontWeight: 800, fontSize: '14px', letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><MessageCircle size={16} /> Отправить</button>
                    </form>
                    <div style={{ marginTop: '20px', padding: '14px', background: '#F8F7F5', borderRadius: '8px' }}>
                      <div style={{ color: '#888', fontSize: '12px', textAlign: 'center' }}>Или напишите напрямую: <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noopener noreferrer" style={{ color: LIME, fontWeight: 700 }}>WhatsApp</a> / <a href={`https://t.me/${tgChannel}`} target="_blank" rel="noopener noreferrer" style={{ color: '#2A96F3', fontWeight: 700 }}>Telegram</a></div>
                    </div>
                  </>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
      <BarberPoleDivider />
      <section className="py-16" style={{ background: '#FAFAF8', position: 'relative', overflow: 'hidden' }}>
        <PoleSideDecor side="right" topPercent={50} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          <AnimatedSection className="text-center mb-8"><h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 4vw, 44px)', color: '#0D0D0D', letterSpacing: '0.02em', margin: 0 }}>ПРИХОДИ К НАМ</h2></AnimatedSection>
          <AnimatedSection>
            <div style={{ background: '#EBEBEB', borderRadius: '16px', overflow: 'hidden', height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${BORDER}` }}>
              <div style={{ textAlign: 'center' }}>
                <MapPin size={48} color={LIME} style={{ marginBottom: '12px' }} />
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', color: '#0D0D0D', letterSpacing: '0.05em', marginBottom: '6px' }}>{address}</div>
                <div style={{ color: '#888', fontSize: '14px', marginBottom: '16px' }}>5 минут от центра города</div>
                <a href={`https://maps.yandex.ru/?text=${encodeURIComponent(address)}`} target="_blank" rel="noopener noreferrer" style={{ background: LIME, color: '#FFFFFF', borderRadius: '8px', padding: '10px 22px', fontWeight: 700, fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'inline-block' }}>Открыть на карте</a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
