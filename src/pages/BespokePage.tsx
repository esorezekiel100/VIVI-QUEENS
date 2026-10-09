import React from 'react';
import { useApp } from '../context/AppContext';
import { Scissors, Clock, ShieldCheck, Ruler, ArrowRight } from 'lucide-react';

export const BespokePage: React.FC = () => {
  const { openAppointmentModal } = useApp();

  return (
    <div className="w-full bg-[#FAF8F5] text-[#1A1412]">
      
      {/* Header */}
      <section className="py-20 bg-[#1A1412] text-[#FAF8F5] text-center border-b border-[#C5A880]/20">
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
            CUSTOM CLOTHES
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif uppercase tracking-tight mt-2 text-white">
            How It Works
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#FAF8F5]/80 font-sans max-w-xl mx-auto leading-relaxed">
            We make clothes to fit your measurements.
          </p>
        </div>
      </section>

      {/* 4 Steps */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#1A1412]/8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
            FOUR STEPS
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#1A1412] mt-1 uppercase">
            From Idea to Outfit
          </h2>
        </div>

        <div className="space-y-6">
          
          {/* Step 1 */}
          <div className="bg-white p-6 sm:p-8 border border-[#1A1412]/10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <span className="font-mono text-3xl sm:text-4xl text-[#C5A880] font-bold shrink-0">
              01
            </span>
            <div className="space-y-1">
              <h3 className="font-serif text-xl uppercase text-[#1A1412]">
                Choose Your Style
              </h3>
              <p className="text-xs sm:text-sm text-[#1A1412]/75 leading-relaxed font-sans">
                Show us what you like, choose fabric, and tell us when you need it.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 sm:p-8 border border-[#1A1412]/10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <span className="font-mono text-3xl sm:text-4xl text-[#C5A880] font-bold shrink-0">
              02
            </span>
            <div className="space-y-1">
              <h3 className="font-serif text-xl uppercase text-[#1A1412]">
                Get Measured
              </h3>
              <p className="text-xs sm:text-sm text-[#1A1412]/75 leading-relaxed font-sans">
                We measure you in our private fitting room so your outfit fits well.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 sm:p-8 border border-[#1A1412]/10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <span className="font-mono text-3xl sm:text-4xl text-[#C5A880] font-bold shrink-0">
              03
            </span>
            <div className="space-y-1">
              <h3 className="font-serif text-xl uppercase text-[#1A1412]">
                Cut and Sew
              </h3>
              <p className="text-xs sm:text-sm text-[#1A1412]/75 leading-relaxed font-sans">
                We cut and sew your outfit with care.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 sm:p-8 border border-[#1A1412]/10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <span className="font-mono text-3xl sm:text-4xl text-[#C5A880] font-bold shrink-0">
              04
            </span>
            <div className="space-y-1">
              <h3 className="font-serif text-xl uppercase text-[#1A1412]">
                Final Fitting
              </h3>
              <p className="text-xs sm:text-sm text-[#1A1412]/75 leading-relaxed font-sans">
                Try it on at our studio. We can make small changes before you take it home.
              </p>
            </div>
          </div>

        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => openAppointmentModal('Custom Tailoring')}
            className="px-8 py-3 bg-[#1A1412] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#2D2420] transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Book A Fitting Today</span>
          </button>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-[#F5EFE8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FAF8F5] p-6 border border-[#1A1412]/10 space-y-2">
              <Ruler className="w-5 h-5 text-[#C5A880]" />
              <h4 className="font-serif text-lg font-semibold text-[#1A1412]">A Good Fit</h4>
              <p className="text-xs text-[#1A1412]/70 leading-relaxed">
                Made for your body, so you can move with ease.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-6 border border-[#1A1412]/10 space-y-2">
              <Clock className="w-5 h-5 text-[#C5A880]" />
              <h4 className="font-serif text-lg font-semibold text-[#1A1412]">Ready on Time</h4>
              <p className="text-xs text-[#1A1412]/70 leading-relaxed">
                Most outfits take 7 to 14 days. Ask us about urgent orders.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-6 border border-[#1A1412]/10 space-y-2">
              <ShieldCheck className="w-5 h-5 text-[#C5A880]" />
              <h4 className="font-serif text-lg font-semibold text-[#1A1412]">Neat Sewing</h4>
              <p className="text-xs text-[#1A1412]/70 leading-relaxed">
                We use strong stitches and neat seams.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
