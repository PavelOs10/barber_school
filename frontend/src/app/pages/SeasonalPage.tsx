import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Check, AlertTriangle, Clock, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedSection, BarberPoleDivider, FloatingToolsBg, MarqueeTicker, PageHeroBand } from '../components/UI';
import { useAPI, useSettings } from '../hooks/useAPI';

const RED = '#D42B2B';

function getStatus(s: string, e: string) {
  const now = new Date().toISOString().split('T')[0];
  return now >= s && now <= e ? 'active' : now < s ? 'upcoming' : 'ended';
}

function daysUntil(d: string) { return Math.ceil((new Date(d).getTime() - Date.now()) / 864e5); }

export function SeasonalPage() {
  const { data: promos } = useAPI<any[]>('/promos', []);
  const { data: settings } = useSettings();
  const waPhone = settings.whatsapp_phone || '79001234567';
  const tg = settings.telegram_channel || 'barberhouse_vrn';

  const active = promos.filter(p => getStatus(p.start_date, p.end_date) === 'active');
  const upcoming = promos.filter(p => getStatus(p.start_date, p.end_date) === 'upcoming');
  const ended = promos.filter(p => getStatus(p.start_date, p.end_date) === 'ended');

  return (
    <div style={{ minHeight: '100vh' }}>
      <PageHeroBand label="Сезонные акции" title="АКЦИИ И СЕЗОНКИ" subtitle="Праздники и специальные поводы — повод получить лучшую скидку." />
      <MarqueeTicker text="BARBER HOUSE · АКЦИИ · СЕЗОННЫЕ ПРЕДЛОЖЕНИЯ · ВОРОНЕЖ" />

      {active.length > 0 && (
        <section className="py-16" style={{ background: '#FFF', position: 'relative', overflow: 'hidden' }}>
          <FloatingToolsBg layout={0} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
            <AnimatedSection className="flex items-center gap-3 mb-8">
              <AlertTriangle size={20} color={RED} />
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', color: '#0D0D0D', margin: 0 }}>СЕЙЧАС АКТИВНО</h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {active.map((p, i) => (
                <AnimatedSection key={p.id} delay={i * 0.1}>
                  <PromoCard promo={p} status="active" waPhone={waPhone} />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <>
          <BarberPoleDivider />
          <section className="py-16" style={{ background: '#FAFAF8' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <AnimatedSection className="flex items-center gap-3 mb-8">
                <Calendar size={20} color="#2255CC" />
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', color: '#0D0D0D', margin: 0 }}>БЛИЖАЙШИЕ АКЦИИ</h2>
              </AnimatedSection>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {upcoming.map((p, i) => (
                  <AnimatedSection key={p.id} delay={i * 0.1}>
                    <PromoCard promo={p} status="upcoming" waPhone={waPhone} compact />
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {ended.length > 0 && (
        <>
          <BarberPoleDivider />
          <section className="py-16" style={{ background: '#FFF' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <AnimatedSection className="mb-8">
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: '#CCC' }}>ЗАВЕРШЁННЫЕ</h2>
              </AnimatedSection>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ended.map((p, i) => (
                  <AnimatedSection key={p.id} delay={i * 0.08}>
                    <PromoCard promo={p} status="ended" waPhone={waPhone} compact />
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      <BarberPoleDivider />
      <section className="py-20" style={{ background: RED }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 5vw, 56px)', color: '#FFF', marginBottom: '12px' }}>НЕ ПРОПУСТИ АКЦИЮ</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', marginBottom: '28px' }}>Подпишись на Telegram — первым узнаешь о новых акциях</p>
            <a href={`https://t.me/${tg}`} target="_blank" rel="noopener noreferrer"
              style={{ background: '#FFF', color: '#2255CC', borderRadius: '10px', padding: '14px 28px', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase' }}>
              Подписаться в Telegram
            </a>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

function PromoCard({ promo: p, status, waPhone, compact }: { promo: any; status: string; waPhone: string; compact?: boolean }) {
  const isEnded = status === 'ended';
  const days = daysUntil(p.start_date);
  const hasBg = !!p.bg_image && !isEnded;
  return (
    <motion.div whileHover={isEnded ? {} : { y: -4 }}
      style={{ background: '#FFF', border: `1px solid ${status === 'active' ? (p.color || RED) + '50' : '#EBEBEB'}`, borderRadius: '16px', overflow: 'hidden', height: '100%', opacity: isEnded ? 0.5 : 1, position: 'relative' }}>
      {/* Background image */}
      {hasBg && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${p.bg_image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.78) 50%, rgba(255,255,255,0.65) 100%)',
          }} />
        </div>
      )}
      <div style={{ height: '4px', background: isEnded ? '#E8E6E3' : p.color || RED, position: 'relative', zIndex: 1 }} />
      <div style={{ padding: compact ? '20px' : '28px', position: 'relative', zIndex: 1 }}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span style={{ fontSize: compact ? '24px' : '32px' }}>{p.icon}</span>
              <span style={{ background: status === 'active' ? RED : '#F0EDE8', color: status === 'active' ? '#FFF' : '#888', borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                {status === 'active' ? 'Идёт сейчас' : status === 'upcoming' ? 'Скоро' : 'Завершена'}
              </span>
            </div>
            <div style={{ color: p.color || RED, fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '4px' }}>{p.holiday}</div>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: compact ? '22px' : '28px', color: isEnded ? '#AAA' : '#0D0D0D', lineHeight: 1 }}>{p.title}</h3>
          </div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: compact ? '36px' : '48px', color: isEnded ? '#CCC' : p.color || RED, lineHeight: 1 }}>{p.discount}</div>
        </div>
        <p style={{ color: isEnded ? '#BBB' : hasBg ? '#444' : '#777', fontSize: '14px', lineHeight: 1.6, marginBottom: '16px' }}>{p.description}</p>
        {!compact && !isEnded && (p.perks || []).length > 0 && (
          <div className="flex flex-col gap-2 mb-4">
            {p.perks.map((pk: string) => <div key={pk} className="flex items-center gap-2"><Check size={14} color={p.color || RED} /><span style={{ color: '#666', fontSize: '13px' }}>{pk}</span></div>)}
          </div>
        )}
        <div className="flex items-center justify-between mt-4">
          {status === 'upcoming' && days > 0 && <div className="flex items-center gap-2" style={{ color: '#888' }}><Clock size={14} /><span style={{ fontSize: '12px', fontWeight: 600 }}>Через {days} {days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}</span></div>}
          {status === 'active' && <div className="flex items-center gap-2" style={{ color: RED }}><AlertTriangle size={14} /><span style={{ fontSize: '12px', fontWeight: 700 }}>Акция активна</span></div>}
          {!isEnded && p.promo_code && (
            <div className="flex items-center gap-2">
              <span style={{ color: '#AAA', fontSize: '11px', fontWeight: 600 }}>Промокод:</span>
              <span style={{ background: '#F0EDE8', border: `1px solid ${(p.color || RED)}40`, borderRadius: '6px', padding: '3px 8px', color: p.color || RED, fontSize: '12px', fontWeight: 700 }}>{p.promo_code}</span>
            </div>
          )}
        </div>
        {!isEnded && (
          <a href={`https://wa.me/${waPhone}?text=Акция ${p.promo_code}`} target="_blank" rel="noopener noreferrer"
            style={{ display: 'block', marginTop: '16px', background: p.color || RED, color: '#FFF', borderRadius: '8px', padding: '11px', textAlign: 'center', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase' }}>
            Воспользоваться акцией
          </a>
        )}
      </div>
    </motion.div>
  );
}
