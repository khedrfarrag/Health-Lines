import React, { memo } from 'react';
import { ArrowLeft, ArrowRight, Stethoscope } from 'lucide-react';

function IntroSection({ lang, t, onOpenBooking }) {
  const isAr = lang === 'ar' || t.langCode === 'العربية';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <section id="about" className="py-16 sm:py-24 border-b border-[#9d237a]/10 dark:border-white/10 relative overflow-hidden">
      <div className="shell">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Column 1: Title & Overline */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#629131]/12 dark:bg-lime-400/15 border border-[#629131]/25 text-xs font-semibold text-[#355e0d] dark:text-lime-300 mb-4">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>{isAr ? 'من نحن | مركز خطوط الصحة للعلاج الطبيعي' : 'About Us | Health Lines Physical Therapy'}</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl lg:text-5xl font-normal text-[#170a24] dark:text-white leading-[1.25] tracking-tight">
              {isAr ? (
                <>
                  نحن مركز خطوط الصحة
                  <br />
                  <span className="text-[#861365] dark:text-fuchsia-300">للعلاج الطبيعي والتأهيل النسائي بجدة</span>
                </>
              ) : (
                <>
                  Health Lines Center
                  <br />
                  <span className="text-[#861365] dark:text-fuchsia-300">Women’s Physical Therapy & Rehabilitation</span>
                </>
              )}
            </h2>
          </div>

          {/* Column 2: Lead paragraph & CTA */}
          <div className="flex flex-col items-start gap-5">
            <p className="text-base sm:text-lg text-[#3b2a4c] dark:text-slate-200 leading-relaxed font-medium">
              {isAr
                ? 'نحن مركز خطوط الصحة للعلاج الطبيعي، مركز طبي وتأهيلي متخصص للسيدات فقط، يقع في مدينة جدة. نحرص على تقديم خدمات العلاج الطبيعي والتأهيل من خلال الاهتمام بصحة المرأة وراحتها، وتوفير بيئة نسائية مريحة وآمنة، مع الحرص على تقديم تجربة علاجية مميزة تلبي احتياجات كل سيدة. هدفنا نكون وجهتك الموثوقة لاستعادة نشاطك، وتحسين جودة حياتك، والاهتمام بصحتك بخطوات مدروسة وعناية تستحقينها. 💗'
                : 'Health Lines Physical Therapy Center is a specialized medical and rehabilitation sanctuary exclusively for women in Jeddah. We are committed to delivering premier physical therapy and rehabilitation through dedicated attention to women’s health, comfort, and absolute privacy.'}
            </p>

            <button
              type="button"
              onClick={onOpenBooking}
              className="group inline-flex items-center gap-2 text-sm sm:text-base font-bold text-[#861365] dark:text-fuchsia-300 hover:text-[#355e0d] dark:hover:text-lime-400 transition-colors cursor-pointer"
            >
              <span>{isAr ? 'تحدث مع فريقنا الطبي واستشر مختصاً' : 'Speak With Our Specialists'}</span>
              <ArrowIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(IntroSection);
