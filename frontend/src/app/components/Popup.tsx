import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import logoImg from '@/assets/bf79a2c11bccd3308e961cbe03a60b3b3f1f2f07.png';
import { submitLead, useSettings } from '../hooks/useAPI';

const RED = '#D42B2B';
const BLUE = '#2255CC';

export function Popup() {
  const [show, setShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', messenger: '' });
  const [dismissed, setDismissed] = useState(false);
  const { data: settings } = useSettings();
  const waPhone = settings.whatsapp_phone || '79001234567';
  const tgChannel = settings.telegram_channel || 'barberhouse_vrn';

  useEffect(() => {
    if (dismissed) return;
    const alreadyShown = sessionStorage.getItem('popup_shown');
    if (alreadyShown) return;
    const timer = setTimeout(() => { setShow(true); sessionStorage.setItem('popup_shown', '1'); }, 30000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  const handleClose = () => { setShow(false); setDismissed(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitLead({ type: 'popup', name: form.name, phone: form.phone, message: form.messenger ? `Мессенджер: ${form.messenger}` : '' });
    setSubmitted(true);
    setTimeout(() => { setShow(false); setDismissed(true); }, 2500);
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="fixed inset-0 z-[100]" style={{ background: 'rgba(0,0,0,0.85)' }} />
          <motion.div initial={{ opacity: 0, scale: 0.88, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="fixed inset-0 z-[101] flex items-center justify-center p-4" style={{ pointerEvents: 'none' }}>
            <div style={{ background: '#111111', border: '1px solid #222', borderRadius: '18px', maxWidth: '460px', width: '100%', pointerEvents: 'auto', position: 'relative', overflow: 'hidden' }}>
              <div style={{ height: '4px', background: 'linear-gradient(90deg, #D42B2B 0%, #FFFFFF 33%, #D42B2B 50%, #FFFFFF 66%, #2255CC 100%)' }} />
              <div style={{ padding: '32px 28px' }}>
                <button onClick={handleClose} className="absolute top-8 right-6 p-1" style={{ color: '#555' }}><X size={20} /></button>
                <div className="flex items-center gap-4 mb-5">
                  <div style={{ background: '#FFFFFF', borderRadius: '8px', padding: '4px 6px', flexShrink: 0 }}><img src={logoImg} alt="BARBER HOUSE" style={{ height: '40px', width: 'auto' }} /></div>
                  <div>
                    <h3 style={{ color: '#FFFFFF', fontSize: '17px', fontWeight: 700, margin: 0, lineHeight: 1.2 }}>Хочешь стать барбером?</h3>
                    <p style={{ color: '#666', fontSize: '12px', margin: '4px 0 0' }}>Ответим за 5 минут в любом мессенджере</p>
                  </div>
                </div>
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div style={{ background: `${RED}15`, border: `1px solid ${RED}40`, borderRadius: '10px', padding: '10px 14px', marginBottom: '2px' }}>
                      <p style={{ color: RED, fontSize: '12px', fontWeight: 700, margin: 0 }}>🎁 Бесплатная консультация + скидка 5% для новых студентов</p>
                    </div>
                    {[
                      { placeholder: 'Твоё имя', field: 'name', type: 'text', required: true },
                      { placeholder: 'Номер телефона', field: 'phone', type: 'tel', required: true },
                      { placeholder: 'Ссылка на мессенджер (необязательно)', field: 'messenger', type: 'text', required: false },
                    ].map(inp => (
                      <input key={inp.field} required={inp.required} placeholder={inp.placeholder} type={inp.type} value={form[inp.field as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [inp.field]: e.target.value }))} style={{ background: '#1A1A1A', border: '1px solid #252525', borderRadius: '9px', padding: '12px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none', width: '100%' }} />
                    ))}
                    <div className="flex gap-2 mt-1">
                      <button type="submit" style={{ background: RED, color: '#FFFFFF', borderRadius: '9px', padding: '12px', fontWeight: 700, fontSize: '14px', flex: 1, cursor: 'pointer', letterSpacing: '0.03em', textTransform: 'uppercase', transition: 'opacity 0.2s' }}>Отправить</button>
                      <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noopener noreferrer" style={{ background: '#25D366', color: '#fff', borderRadius: '9px', padding: '12px 14px', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>WA</a>
                      <a href={`https://t.me/${tgChannel}`} target="_blank" rel="noopener noreferrer" style={{ background: BLUE, color: '#fff', borderRadius: '9px', padding: '12px 14px', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>TG</a>
                    </div>
                    <p style={{ color: '#383838', fontSize: '11px', textAlign: 'center', margin: 0 }}>Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>
                  </form>
                ) : (
                  <div className="text-center py-6">
                    <div style={{ fontSize: '42px', marginBottom: '12px' }}>✅</div>
                    <h3 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Заявка принята!</h3>
                    <p style={{ color: '#666', fontSize: '14px' }}>Мы свяжемся с тобой в ближайшее время</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
