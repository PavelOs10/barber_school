import { useState } from 'react';
import { AnimatedSection } from '../components/AnimatedSection';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, BookOpen, Scissors } from 'lucide-react';
import { BarberPoleDivider, FloatingToolsBg, PageHeroBand, PoleSideDecor } from '../components/BarberDecor';
import { useSettings } from '../hooks/useAPI';

const LIME = '#D42B2B';
const CARD_BG = '#FFFFFF';
const BORDER = '#EBEBEB';

const teachers = [
  {
    id: 1,
    name: 'Александр Воронов',
    role: 'Старший преподаватель',
    exp: '10 лет опыта',
    img: 'https://images.unsplash.com/photo-1599011176306-4a96f1516d4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    bio: 'Александр — основатель школы BARBER HOUSE. Начинал карьеру в 2014 году в Москве, прошёл обучение у лучших мастеров России и Европы. Чемпион Воронежской области по барберингу 2022 года. Специализируется на классических техника�� и fade.',
    certs: ['Чемпион ЦФО 2022', 'Сертификат Wahl Academy', 'Международный сертификат barber'],
    courses: ['Базовый курс', 'Профессиональный курс'],
    tags: ['Fade', 'Классика', 'Бритьё'],
  },
  {
    id: 2,
    name: 'Дмитрий Сорокин',
    role: 'Преподаватель по стилю',
    exp: '7 лет опыта',
    img: 'https://images.unsplash.com/photo-1592304346250-ef7244f8c9cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    bio: 'Дмитрий — победитель федерального чемпионата по барберингу 2023. Специализируется на современных трендах, скин-фейде и дизайнерских стрижках. Ведёт собственный барбершоп.',
    certs: ['Победитель BarberBattle RU 2023', 'BaByliss Pro Expert', 'Instructor Andis Academy'],
    courses: ['Профессиональный курс', 'Мастер-класс'],
    tags: ['Скин-фейд', 'Дизайн', 'Тренды'],
  },
  {
    id: 3,
    name: 'Максим Черников',
    role: 'Преподаватель базового курса',
    exp: '5 лет опыта',
    img: 'https://images.unsplash.com/photo-1543697506-6729425f7265?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    bio: 'Максим работает с новичками — умеет объяснить сложные техники простым языком. Специализируется на базовых стрижках и правильной постановке рук. Все его ученики находят работу после курса.',
    certs: ['Сертификат Wahl Russia', 'Barber School Certificate', 'Инструктор по безопасности'],
    courses: ['Базовый курс', 'Онлайн-интенсив'],
    tags: ['База', 'Ножницы', 'Для новичков'],
  },
  {
    id: 4,
    name: 'Анна Козлова',
    role: 'Специалист по уходу',
    exp: '6 лет опыта',
    img: 'https://images.unsplash.com/photo-1638636241638-aef5120c5153?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    bio: 'Анна — единственный преподаватель школы с дерматологическим образованием. Ведёт курсы по уходу за кожей лица, лечебному бритью и работе с трудными типами кожи.',
    certs: ['Дерматолог-косметолог', 'Barber Skin Care Expert', 'Сертификат Keune Academy'],
    courses: ['Профессиональный курс'],
    tags: ['Уход за кожей', 'Бритьё', 'Здоровье'],
  },
];

function TeacherModal({ teacher, onClose }: { teacher: typeof teachers[0], onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.75)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.3 }}
          style={{ background: '#FFFFFF', border: `1px solid ${BORDER}`, borderRadius: '20px', maxWidth: '700px', width: '100%', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 32px 80px rgba(0,0,0,0.2)' }}
          onClick={e => e.stopPropagation()}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div style={{ height: '300px', position: 'relative' }}>
              <ImageWithFallback src={teacher.img} alt={teacher.name} className="w-full h-full object-cover" />
            </div>
            <div style={{ padding: '28px' }}>
              <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', color: '#AAA', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={22} />
              </button>
              <div style={{ color: LIME, fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>{teacher.exp}</div>
              <h2 style={{ color: '#0D0D0D', fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>{teacher.name}</h2>
              <p style={{ color: '#888', fontSize: '13px', marginBottom: '16px' }}>{teacher.role}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {teacher.tags.map(t => (
                  <span key={t} style={{ background: LIME + '12', color: LIME, borderRadius: '6px', padding: '3px 8px', fontSize: '11px', fontWeight: 600 }}>{t}</span>
                ))}
              </div>

              <p style={{ color: '#666', fontSize: '13px', lineHeight: 1.7, marginBottom: '16px' }}>{teacher.bio}</p>

              <div style={{ marginBottom: '14px' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Award size={14} color={LIME} />
                  <span style={{ color: '#0D0D0D', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Сертификаты</span>
                </div>
                {teacher.certs.map(c => <div key={c} style={{ color: '#777', fontSize: '12px', paddingLeft: '6px' }}>— {c}</div>)}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={14} color={LIME} />
                  <span style={{ color: '#0D0D0D', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Ведёт курсы</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {teacher.courses.map(c => (
                    <span key={c} style={{ border: `1px solid ${BORDER}`, color: '#666', borderRadius: '6px', padding: '3px 10px', fontSize: '11px' }}>{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function TeachersPage() {
  const { data: settings } = useSettings();
  const waPhone = settings.whatsapp_phone || '79001234567';
  const tgChannel = settings.telegram_channel || 'barberhouse_vrn';
  const [selected, setSelected] = useState<typeof teachers[0] | null>(null);

  return (
    <div style={{ minHeight: '100vh' }}>
      <PageHeroBand
        label="Команда"
        title="НАШИ ПРЕПОДАВАТЕЛИ"
        subtitle="Действующие мастера-практики. Учат тому, что делают сами — каждый день, в реальных барбершопах."
      />

      {/* Teachers grid */}
      <section className="py-16" style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <FloatingToolsBg layout={1} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teachers.map((t, i) => (
              <AnimatedSection key={t.id} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: `0 16px 48px rgba(0,0,0,0.1)` }}
                  transition={{ duration: 0.25 }}
                  style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
                  onClick={() => setSelected(t)}
                >
                  <div style={{ height: '260px', overflow: 'hidden', position: 'relative' }}>
                    <ImageWithFallback src={t.img} alt={t.name} className="w-full h-full object-cover" />
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
                      <span style={{ background: LIME, color: '#FFFFFF', borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: 700 }}>{t.exp}</span>
                    </div>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ color: '#0D0D0D', fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{t.name}</h3>
                    <p style={{ color: '#888', fontSize: '12px', marginBottom: '12px' }}>{t.role}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {t.tags.map(tag => (
                        <span key={tag} style={{ background: LIME + '12', color: LIME, borderRadius: '4px', padding: '2px 7px', fontSize: '10px', fontWeight: 700 }}>{tag}</span>
                      ))}
                    </div>
                    <button
                      style={{ width: '100%', background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: '8px', padding: '8px', color: '#888', fontSize: '12px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = LIME; e.currentTarget.style.color = LIME; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = '#888'; }}
                    >
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

      {/* Join CTA */}
      <section className="py-16" style={{ background: '#FAFAF8', position: 'relative', overflow: 'hidden' }}>
        <PoleSideDecor side="right" topPercent={50} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative" style={{ zIndex: 2 }}>
          <AnimatedSection>
            <div className="flex items-center justify-center mb-4">
              <Scissors size={40} color={LIME} />
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 4vw, 46px)', color: '#0D0D0D', letterSpacing: '0.02em', marginBottom: '12px' }}>
              ХОЧЕШЬ УЧИТЬСЯ У ЛУЧШИХ?
            </h2>
            <p style={{ color: '#777', fontSize: '16px', marginBottom: '24px' }}>
              Запишись на курс и начни обучение у действующих профессионалов
            </p>
            <a
              href={`https://wa.me/${waPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: LIME, color: '#FFFFFF', borderRadius: '8px', padding: '14px 32px', fontWeight: 800, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              Записаться на курс
            </a>
          </AnimatedSection>
        </div>
      </section>

      {selected && <TeacherModal teacher={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}