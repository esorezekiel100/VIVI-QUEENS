import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, MapPin, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate, openAppointmentModal, settings } = useApp();

  return (
    <div className="w-full bg-[#FAF8F5] text-[#1A1412]">
      
      {/* Header */}
      <section className="py-20 bg-[#1A1412] text-[#FAF8F5] text-center border-b border-[#C5A880]/20">
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
            ABOUT US
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif uppercase tracking-tight mt-2 text-white">
            About VIVI Queens
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#FAF8F5]/80 font-sans max-w-xl mx-auto leading-relaxed">
            We make custom clothes in Biogbolo, Yenagoa.
          </p>
        </div>
      </section>

      {/* Main Story */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#1A1412]/8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
              OUR STORY
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#1A1412]">
              Made to Fit You
            </h2>
            <p className="text-sm text-[#1A1412]/80 leading-relaxed font-sans">
              We make clothes that fit well and suit your style.
            </p>
            <p className="text-sm text-[#1A1412]/80 leading-relaxed font-sans">
              Choose native wear, a wedding dress, or work clothes. We sew each piece to your measurements.
            </p>

            <div className="pt-2">
              <button
                onClick={() => openAppointmentModal()}
                className="px-6 py-2.5 bg-[#1A1412] text-[#FAF8F5] text-xs uppercase font-semibold tracking-wider hover:bg-[#2D2420] transition-colors inline-flex items-center gap-2"
              >
                <span>Book A Fitting</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
              </button>
            </div>
          </div>

          <div className="border border-[#1A1412]/10 bg-white p-2 shadow-sm">
            <img
              src="/src/assets/images/studio_atelier_interior_1791459713381.jpg"
              alt="VIVI Queens studio"
              referrerPolicy="no-referrer"
              className="w-full h-80 object-cover"
            />
          </div>

        </div>
      </section>

      {/* Philosophy & Promise */}
      <section className="py-16 bg-[#F5EFE8] border-b border-[#1A1412]/8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card 1 */}
            <div className="bg-[#FAF8F5] p-8 border border-[#1A1412]/10 space-y-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C5A880] font-semibold">
                <span>Our Belief</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#1A1412]">
                Every Body Is Different
              </h3>
              <p className="text-xs sm:text-sm text-[#1A1412]/75 leading-relaxed font-sans">
                We measure you and make clothes that fit comfortably.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#FAF8F5] p-8 border border-[#1A1412]/10 space-y-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C5A880] font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Our Promise</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#1A1412]">
                Quality Work, On Time
              </h3>
              <p className="text-xs sm:text-sm text-[#1A1412]/75 leading-relaxed font-sans">
                We use strong thread, neat stitches, and good zips. We agree on a date and work to meet it.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Visit studio */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
          LOCATION
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif text-[#1A1412] uppercase">
          Visit Us in Biogbolo
        </h2>
        <p className="text-xs sm:text-sm text-[#1A1412]/75 max-w-md mx-auto leading-relaxed">
          {settings.location} • Open Monday to Saturday: 9:00 AM – 6:00 PM.
        </p>
        <div className="pt-2">
          <button
            onClick={() => navigate('/contact')}
            className="px-6 py-2.5 bg-[#C5A880] text-[#1A1412] text-xs font-semibold uppercase tracking-wider hover:bg-[#D4AF37]"
          >
            Directions and Phone
          </button>
        </div>
      </section>

    </div>
  );
};
