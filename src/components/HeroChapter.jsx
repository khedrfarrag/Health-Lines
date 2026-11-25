import React, { memo, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight, MessageCircle, Sparkles, Phone, Star } from 'lucide-react';
import ChapterVideoBackground from './ChapterVideoBackground';
import { useDeviceProfile } from '../hooks/useDeviceProfile';

const EXPO_OUT = [0.16, 1, 0.3, 1];

function HeroChapter({ lang, t, onOpenBooking }) {
  const sectionRef = useRef(null);
  const { isMobile, isWeakOrSaveData } = useDeviceProfile();
  const useStaticMobile = isMobile || isWeakOrSaveData;
  const isAr = lang === 'ar' || t.langCode === 'العربية';

  // Parallax on desktop only
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const whatsappUrl = `https://wa.me/966599530955?text=${encodeURIComponent(
    isAr ? 'مرحباً، أود حجز جلسة علاج طبيعي وتأهيل في مركز خطوط الصحة بجدة' : 'Hello, I would like to book a physical therapy consultation at Health Lines Center Jeddah'
  )}`;

  const heroFacts = isAr
    ? [
        { num: '٠١', title: 'كادر طبي متخصص', sub: 'نخبة من أخصائيات وأخصائيي العلاج الطبيعي المعتمدين' },
        { num: '٠٢', title: 'خطة علاجية مخصصة', sub: 'تشخيص سريري دقيق وفق أحدث البروتوكولات الدولية' },
        { num: '٠٣', title: 'أحدث الأجهزة والتقنيات', sub: 'فيلاشيب 3، مساج لمفاوي، وتأهيل حركي متقدم' },
        { num: '٠٤', title: 'أعلى معايير الخصوصية', sub: 'أجنحة نسائية مغلقة بالكامل لراحتك التامة' },
      ]
    : [
        { num: '01', title: 'Specialized Medical Team', sub: 'Elite certified physical therapists & clinical staff' },
        { num: '02', title: 'Tailored Recovery Plan', sub: 'Accurate clinical diagnosis & evidence-based protocols' },
        { num: '03', title: 'Advanced Technology', sub: 'VelaShape III, lymphatic detox & functional rehab' },
        { num: '04', title: '100% Private Setting', sub: 'Dedicated private closed suites for utmost peace' },
      ];

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100svh] w-full flex flex-col justify-between overflow-hidden pt-24 sm:pt-28 pb-0"
    >
      {/* Primary Video Background — Serene, High-Definition, Zero Forced Zoom */}
      <ChapterVideoBackground
        videoSrc={['/videos/jeddah-city.mp4', '/videos/jeddah-city.webm', '/videos/pt-hero-clinic.mp4', '/videos/pt-hero-clinic.webm']}
        posterSrc="/assets/hero-sanctuary.jpg"
        alt="Health Lines Rehabilitation Sanctuary Suite Jeddah"
        glowClass="bg-[#9d237a]/25 dark:bg-[#9d237a]/35"
        glowSecondaryClass="bg-[#629131]/20 dark:bg-[#84cc16]/25"
        parallaxY={useStaticMobile ? null : bgY}
        priority={true}
      />

      {/* Main Hero Content */}
      <div className="relative z-10 shell my-auto py-6 sm:py-14 flex flex-col items-center text-center">
        <motion.div
          className="max-w-4xl mx-auto flex flex-col items-center w-full"
          style={useStaticMobile ? undefined : { y: contentY, opacity }}
        >
          {/* Top World-Class Concierge Pill Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EXPO_OUT }}
            className="mb-4 sm:mb-6"
          >
            <button
              type="button"
              onClick={onOpenBooking}
              className="group cursor-pointer inline-flex items-center gap-2 sm:gap-3 px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full bg-black/30 hover:bg-black/45 border border-white/20 hover:border-[#8cd63b] text-white backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.28)] transition-all duration-300"
            >
              {/* Pulsing Live Beacon */}
              <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8cd63b] opacity-80" />
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-[#8cd63b] shadow-[0_0_8px_#8cd63b]" />
              </span>

              {/* Concierge Text */}
              <span className="text-[11px] sm:text-sm font-medium tracking-wide text-white/95 whitespace-nowrap">
                {isAr ? (
                  <>
                    مركز خطوط الصحة · قلب جدة
                    <span className="hidden sm:inline">، لجمال قوامكِ وعافيتكِ التامة</span>
                  </>
                ) : (
                  <>
                    HEALTH LINES · Heart of Jeddah
                    <span className="hidden sm:inline">, to Your Vitality</span>
                  </>
                )}
              </span>

              {/* Sparkle Icon */}
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#8cd63b] group-hover:rotate-12 transition-transform shrink-0" />
            </button>
          </motion.div>

          {/* Main Headline — Clean, Crisp, Luxury Editorial */}
          <h1 className="font-editorial text-[2.4rem] sm:text-6xl md:text-7xl lg:text-8xl font-normal text-white tracking-tight leading-[1.16] mb-3.5 sm:mb-6 drop-shadow-[0_4px_20px_rgba(0,0,0,0.55)]">
            <span className="text-white">{isAr ? 'قبل أول خطوة،' : 'Before the First Step,'}</span>
            <br />
            <em className="italic font-light bg-gradient-to-r from-[#f8e3f4] via-white to-[#d9f99d] bg-clip-text text-transparent">
              {isAr ? 'صحتكِ تبدأ هنا.' : 'Your Health Begins Here.'}
            </em>
          </h1>

          {/* Subtitle / Lead Paragraph */}
          <p className="max-w-[34ch] sm:max-w-2xl text-[13.5px] sm:text-lg md:text-xl text-white/85 leading-[1.75] sm:leading-relaxed font-normal mb-6 sm:mb-10 px-2 sm:px-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
            {isAr
              ? 'توازن. خفة. علم. تجدد. جلسات علاج طبيعي وتأهيل متقدم ونحت قوام في جدة، بخطة فردية بإشراف أخصائيات معتمدات في أجنحة خاصة تمنحكِ الراحة التامة.'
              : 'Balance. Lightness. Science. Renewal. Advanced physical therapy, rehabilitation, and body sculpting in Jeddah, tailored by certified specialists in completely private suites.'}
          </p>

          {/* World-Class Hero Action Buttons */}
          <div className="flex flex-row items-center justify-center gap-2.5 sm:gap-4 w-full max-w-sm sm:max-w-none mb-6 sm:mb-11">
            {/* Primary Action Button — Rich Brand Gradient with Light Shimmer & Glow */}
            <button
              type="button"
              onClick={onOpenBooking}
              className="group relative flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 sm:gap-3 px-5 py-3.5 sm:px-9 sm:py-4.5 rounded-full bg-gradient-to-r from-[#8f1f6e] via-[#79125b] to-[#527b25] hover:from-[#a3227d] hover:via-[#891668] hover:to-[#608f2c] text-white font-bold text-xs sm:text-base border border-white/25 shadow-[0_10px_28px_rgba(143,31,110,0.42)] hover:shadow-[0_16px_45px_rgba(157,35,122,0.55)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden whitespace-nowrap"
            >
              {/* Subtle hover sweep shimmer */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

              <span className="relative z-10">{isAr ? 'احجز جلستك الآن' : 'Book Your Session'}</span>
              <ArrowIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white relative z-10 transition-transform group-hover:-translate-x-1 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1" />
            </button>

            {/* Secondary Action Button — Sleek Frosted Glass WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 sm:gap-2.5 px-4 py-3.5 sm:px-8 sm:py-4.5 rounded-full bg-black/30 hover:bg-black/45 border border-white/25 text-white font-semibold text-xs sm:text-base backdrop-blur-2xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 whitespace-nowrap"
            >
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
                <MessageCircle className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-white" />
              </div>
              <span className="sm:hidden">{isAr ? 'واتساب' : 'WhatsApp'}</span>
              <span className="hidden sm:inline">{isAr ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}</span>
            </a>

            {/* Direct Phone Call Button */}
            <a
              href="tel:0126918000"
              className="hidden md:inline-flex items-center justify-center gap-2 px-5 py-4 rounded-full bg-black/25 hover:bg-black/40 border border-white/20 text-white/90 hover:text-white font-mono text-xs backdrop-blur-xl transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-[#8cd63b]" />
              <span>012 691 8000</span>
            </a>
          </div>

          {/* Verified Trust & Social Proof Bar */}
          <div className="inline-flex items-center justify-center gap-2 sm:gap-3.5 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-full bg-black/30 border border-white/15 backdrop-blur-xl shadow-md text-white text-[11px] sm:text-xs">
            {/* Stars */}
            <div className="flex items-center gap-0.5 text-amber-300 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 sm:hidden" />
              <div className="hidden sm:flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold font-mono text-[11px] sm:text-xs mr-1 text-white">4.9</span>
            </div>

            <span className="text-white/25">|</span>

            {/* Overlapping Avatars */}
            <div className="hidden sm:flex -space-x-1.5 rtl:space-x-reverse items-center">
              <span className="w-5 h-5 rounded-full bg-[#861365] text-[10px] font-bold text-white flex items-center justify-center ring-1 ring-white/60">ط</span>
              <span className="w-5 h-5 rounded-full bg-[#5b872b] text-[10px] font-bold text-white flex items-center justify-center ring-1 ring-white/60">ع</span>
              <span className="w-5 h-5 rounded-full bg-[#9d237a] text-[10px] font-bold text-white flex items-center justify-center ring-1 ring-white/60">ر</span>
            </div>

            {/* Trust Slogan */}
            <span className="font-medium text-white/90 whitespace-nowrap">
              {isAr ? '+١٥,٠٠٠ جلسة ناجحة · أجنحة نسائية ١٠٠٪' : '+15,000 Sessions · 100% Private Suites'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Hero Facts Bottom Strip (01, 02, 03, 04) */}
      <div className="relative z-10 w-full bg-gradient-to-r from-[#14071e]/90 via-[#240a2c]/90 to-[#152412]/90 text-white border-t border-white/10 backdrop-blur-2xl">
        <div className="shell py-4 sm:py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6 sm:divide-x sm:rtl:divide-x-reverse divide-white/10">
            {heroFacts.map((fact, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 sm:gap-3.5 p-2.5 sm:p-0 sm:px-4 first:sm:px-0 rounded-xl sm:rounded-none bg-white/[0.04] sm:bg-transparent border border-white/[0.07] sm:border-0"
              >
                <span className="text-lg sm:text-3xl font-bold font-mono text-[#8cd63b] shrink-0">
                  {fact.num}
                </span>
                <div className="flex flex-col min-w-0 text-right rtl:text-right ltr:text-left">
                  <span className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">
                    {fact.title}
                  </span>
                  <span className="text-[10.5px] sm:text-xs text-slate-300/90 line-clamp-1">
                    {fact.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(HeroChapter);
