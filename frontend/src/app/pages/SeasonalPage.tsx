import { motion } from 'motion/react';
import { AnimatedSection, ScrollTicker } from '../components/AnimatedSection';
import { Link } from 'react-router';
import { ArrowRight, Clock, Flame, CheckCircle, Calendar, Gift } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { BarberPoleDivider, FloatingToolsBg, PageHeroBand } from '../components/BarberDecor';
import { useAPI, useSettings } from '../hooks/useAPI';

const RED = '#D42B2B';
const BLUE = '#2255CC';
const CARD_BG = '#FFFFFF';
const BORDER = '#EBEBEB';

function getDaysUntil(dateStr: string): number {
  const d = new Date(dateStr);
  const diff = d.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getStatus(startStr: string, endStr: string): 'active' | 'upcoming' | 'ended' {
  const now = new Date().toISOString().split('T')[0];
  if (now >= startStr && now <= endStr) return 'active';
  if (now < startStr) return 'upcoming';
  return 'ended';
}

function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    active:   { label: 'Идёт сейчас', bg: RED, color: '#fff' },
    upcoming: { label: 'Скоро', bg: '#F0EDE8', color: '#888', border: '1px solid #DDDAD6' },
    ended:    { label: 'Завершена', bg: '#F5F3F0', color: '#AAA' },
  };
  const c = configs[status];
  return <span style={{ background: c.bg, color: c.color, borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', border: c.border }}>{c.label}</span>;
}

function DaysCounter({ daysUntil, status }: { daysUntil: number; status: string }) {
  if (status === 'ended') return null;
  if (status === 'active') return <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: RED }}><Flame size={14} /><span style={{ fontSize: '12px', fontWeight: 700 }}>Акция активна</span></div>;
  return <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888' }}><Clock size={14} /><span style={{ fontSize: '12px', fontWeight: 600 }}>Через {daysUntil} {daysUntil === 1 ? 'день' : daysUntil < 5 ? 'дня' : 'дней'}</span></div>;
}

function PromoCard({ promo, status, compact, waPhone }: { promo: any; status: string; compact?: boolean; waPhone: string }) {
  const daysUntil = getDaysUntil(promo.start_date);
  const isEnded = status === 'ended';
  return (
    <motion.div whileHover={!isEnded ? { y: -4, scale: 1.01 } : {}} transition={{ duration: 0.25 }} style={{ background: CARD_BG, border: `1px solid ${status === 'active' ? promo.color + '50' : BORDER}`, borderRadius: '16px', overflow: 'hidden', height: '100%', opacity: isEnded ? 0.5 : 1, position: 'relative', boxShadow: status === 'active' ? `0 4px 24px ${promo.color}15` : '0 2px 12px rgba(0,0,0,0.05)' }}>
      <div style={{ height: '4px', background: isEnded ? '#E8E6E3' : promo.color }} />
      {status === 'active' && <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '80px', background: `linear-gradient(to bottom, ${promo.color}10, transparent)`, pointerEvents: 'none' }} />}
      <div style={{ padding: compact ? '20px' : '28px' }}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2"><span style={{ fontSize: compact ? '24px' : '32px' }}>{promo.icon}</span><StatusBadge status={status} /></div>
            <div style={{ color: promo.color, fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '4px' }}>{promo.holiday}</div>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: compact ? '22px' : '28px', color: isEnded ? '#AAA' : '#0D0D0D', letterSpacing: '0.03em', lineHeight: 1, margin: 0 }}>{promo.title}</h3>
          </div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: compact ? '36px' : '48px', color: isEnded ? '#CCC' : promo.color, lineHeight: 1, flexShrink: 0 }}>{promo.discount}</div>
        </div>
        <p style={{ color: isEnded ? '#BBB' : '#777', fontSize: '14px', lineHeight: 1.6, marginBottom: '16px' }}>{promo.description}</p>
        {!compact && !isEnded && (
          <div className="flex flex-col gap-2 mb-4">
            {(promo.perks || []).map((perk: string) => <div key={perk} className="flex items-center gap-2"><CheckCircle size={14} color={promo.color} /><span style={{ color: '#666', fontSize: '13px' }}>{perk}</span></div>)}
          </div>
        )}
        <div className="flex items-center justify-between mt-4">
          <DaysCounter daysUntil={daysUntil} status={status} />
          {!isEnded && <div className="flex items-center gap-2"><span style={{ color: '#AAA', fontSize: '11px', fontWeight: 600 }}>Промокод:</span><span style={{ background: '#F0EDE8', border: `1px solid ${promo.color}40`, borderRadius: '6px', padding: '3px 8px', color: promo.color, fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em' }}>{promo.promo_code}</span></div>}
        </div>
        {!isEnded && (
          <a href={`https://wa.me/${waPhone}?text=Хочу%20записаться%20по%20акции%20${promo.promo_code}`} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: '16px', background: promo.color, color: '#FFFFFF', borderRadius: '8px', padding: '11px', textAlign: 'center', fontWeight: 700, fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase', transition: 'opacity 0.2s' }} onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>Воспользоваться акцией</a>
        )}
      </div>
    </motion.div>
  );
}

function NextPromoHighlight({ promo, waPhone }: { promo: any; waPhone: string }) {
  const daysUntil = getDaysUntil(promo.start_date);
  return (
    <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.25 }} style={{ background: '#FFFFFF', border: `1px solid ${promo.color}30`, borderRadius: '20px', overflow: 'hidden', position: 'relative', boxShadow: `0 4px 32px ${promo.color}12` }}>
      <div style={{ height: '4px', background: promo.color }} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <div style={{ padding: '32px' }}>
          <div className="flex items-center gap-2 mb-3"><span style={{ background: promo.color + '12', border: `1px solid ${promo.color}30`, borderRadius: '6px', padding: '3px 10px', color: promo.color, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>🔜 Следующая акция</span></div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 6vw, 64px)', color: '#0D0D0D', lineHeight: 0.95, marginBottom: '8px' }}>{promo.holiday}</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(24px, 4vw, 36px)', color: promo.color, marginBottom: '16px' }}>{promo.title}</div>
          <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.6, marginBottom: '20px' }}>{promo.description}</p>
          <div className="flex flex-col gap-2 mb-6">{(promo.perks || []).map((perk: string) => <div key={perk} className="flex items-center gap-2"><CheckCircle size={14} color={promo.color} /><span style={{ color: '#666', fontSize: '13px' }}>{perk}</span></div>)}</div>
          <a href={`https://wa.me/${waPhone}?text=Хочу%20записаться%20по%20акции%20${promo.promo_code}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: promo.color, color: '#FFFFFF', borderRadius: '10px', padding: '12px 24px', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Хочу скидку! <ArrowRight size={14} /></a>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', background: `${promo.color}06`, borderLeft: `1px solid ${promo.color}15` }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>{promo.icon}</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '80px', color: promo.color, lineHeight: 1 }}>{daysUntil > 0 ? daysUntil : 0}</div>
          <div style={{ color: '#888', fontSize: '14px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{daysUntil === 1 ? 'день до акции' : daysUntil < 5 ? 'дня до акции' : 'дней до акции'}</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '64px', color: '#0D0D0D', marginTop: '20px', lineHeight: 1 }}>{promo.discount}</div>
          <div style={{ color: '#AAA', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>СКИДКА</div>
          <div style={{ marginTop: '16px', background: '#F0EDE8', border: `1px solid ${promo.color}30`, borderRadius: '8px', padding: '8px 16px', textAlign: 'center' }}>
            <div style={{ color: '#AAA', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>Промокод</div>
            <div style={{ color: promo.color, fontSize: '16px', fontWeight: 800, letterSpacing: '0.05em' }}>{promo.promo_code}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function SeasonalPage() {
  const { data: seasons, loading } = useAPI<any[]>('/promos', []);
  const { data: settings } = useSettings();
  const waPhone = settings.whatsapp_phone || '79001234567';
  const tgChannel = settings.telegram_channel || 'barberhouse_vrn';

  const active = seasons.filter((s: any) => getStatus(s.start_date, s.end_date) === 'active');
  const upcoming = seasons.filter((s: any) => getStatus(s.start_date, s.end_date) === 'upcoming');
  const ended = seasons.filter((s: any) => getStatus(s.start_date, s.end_date) === 'ended');
  const nextPromo = upcoming[0];

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <PageHeroBand label="Сезонные акции" title="АКЦИИ И СЕЗОНКИ" subtitle="Праздники, сезоны и специальные поводы — повод получить лучшую скидку на обучение." />
      <ScrollTicker text="BARBER HOUSE · АКЦИИ · СЕЗОННЫЕ ПРЕДЛОЖЕНИЯ · ВОРОНЕЖ · BARBER HOUSE" bg={RED} color="#FFFFFF" speed={25} />
      {active.length > 0 && (
        <section className="py-16" style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
          <FloatingToolsBg layout={0} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
            <AnimatedSection className="flex items-center gap-3 mb-8"><Flame size={20} color={RED} /><h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', color: '#0D0D0D', letterSpacing: '0.04em', margin: 0 }}>СЕЙЧАС АКТИВНО</h2></AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{active.map((p: any, i: number) => <AnimatedSection key={p.id} delay={i * 0.1}><PromoCard promo={p} status="active" waPhone={waPhone} /></AnimatedSection>)}</div>
          </div>
        </section>
      )}
      <BarberPoleDivider />
      {upcoming.length > 0 && (
        <section className="py-16" style={{ background: '#FAFAF8', position: 'relative', overflow: 'hidden' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
            <AnimatedSection className="flex items-center gap-3 mb-8"><Calendar size={20} color={BLUE} /><h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', color: '#0D0D0D', letterSpacing: '0.04em', margin: 0 }}>БЛИЖАЙШИЕ АКЦИИ</h2></AnimatedSection>
            {nextPromo && <AnimatedSection className="mb-8"><NextPromoHighlight promo={nextPromo} waPhone={waPhone} /></AnimatedSection>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{upcoming.slice(1).map((p: any, i: number) => <AnimatedSection key={p.id} delay={i * 0.1}><PromoCard promo={p} status="upcoming" compact waPhone={waPhone} /></AnimatedSection>)}</div>
          </div>
        </section>
      )}
      <BarberPoleDivider />
      {ended.length > 0 && (
        <section className="py-16" style={{ background: '#FFFFFF' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <AnimatedSection className="mb-8"><h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: '#CCC', letterSpacing: '0.04em', margin: 0 }}>ЗАВЕРШЁННЫЕ АКЦИИ</h2></AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{ended.map((p: any, i: number) => <AnimatedSection key={p.id} delay={i * 0.08}><PromoCard promo={p} status="ended" compact waPhone={waPhone} /></AnimatedSection>)}</div>
          </div>
        </section>
      )}
      <BarberPoleDivider />
      <section className="py-20" style={{ background: RED }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔔</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 5vw, 56px)', color: '#FFFFFF', marginBottom: '12px' }}>НЕ ПРОПУСТИ АКЦИЮ</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', lineHeight: 1.6, marginBottom: '28px' }}>Подпишись на наш Telegram-канал — первым узнаешь о новых акциях</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href={`https://t.me/${tgChannel}`} target="_blank" rel="noopener noreferrer" style={{ background: '#FFFFFF', color: BLUE, borderRadius: '10px', padding: '14px 28px', fontWeight: 700, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>Подписаться в Telegram</a>
              <Link to="/courses" style={{ border: '2px solid rgba(255,255,255,0.6)', color: '#FFFFFF', borderRadius: '10px', padding: '14px 28px', fontWeight: 700, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>Смотреть курсы <ArrowRight size={14} /></Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
