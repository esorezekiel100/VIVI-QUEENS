import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Service } from '../types';
import { Scissors, Clock } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { openAppointmentModal } = useApp();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setServices(data.services);
        }
      })
      .catch(err => console.error('Error fetching services:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full bg-[#FAF8F5] text-[#1A1412]">
      
      {/* Header */}
      <section className="py-20 bg-[#1A1412] text-[#FAF8F5] text-center border-b border-[#C5A880]/20">
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
            WHAT WE DO
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif uppercase tracking-tight mt-2 text-white">
            Tailoring Services
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#FAF8F5]/80 font-sans max-w-xl mx-auto leading-relaxed">
            We sew native wear, wedding dresses, work clothes, and more.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-16 text-sm font-serif">Loading services...</div>
        ) : (
          <div className="space-y-8">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="bg-white p-6 sm:p-8 border border-[#1A1412]/10 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#C5A880] font-bold">
                    <span>0{index + 1}</span>
                    <span className="text-[#1A1412]/20">/</span>
                    <span className="uppercase tracking-wider font-sans text-[#1A1412]/60">VIVI QUEENS</span>
                  </div>

                  <h2 className="font-serif text-2xl uppercase text-[#1A1412]">
                    {service.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#1A1412]/80 leading-relaxed font-sans">
                    {service.shortDescription}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-[#1A1412]/60 pt-2">
                    <span className="flex items-center gap-1 font-semibold text-[#1A1412]">
                      {service.pricingNote}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                      Takes {service.duration}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 w-full md:w-auto">
                  <button
                    onClick={() => openAppointmentModal(service.title)}
                    className="w-full md:w-auto px-5 py-2.5 bg-[#1A1412] text-[#FAF8F5] text-xs uppercase font-semibold tracking-wider hover:bg-[#2D2420] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Book Service</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quote Banner */}
      <section className="py-16 bg-[#1A1412] text-[#FAF8F5] text-center border-t border-white/10">
        <div className="max-w-xl mx-auto px-4 space-y-4">
          <h3 className="font-serif text-2xl sm:text-3xl uppercase">
            Have A Style Photo In Mind?
          </h3>
          <p className="text-xs sm:text-sm text-[#FAF8F5]/80 leading-relaxed">
            Send us a photo on WhatsApp or visit our studio. We will tell you the price and fabric needed.
          </p>
          <button
            onClick={() => openAppointmentModal('Custom Style Inquiry')}
            className="px-6 py-2.5 bg-[#C5A880] text-[#1A1412] text-xs uppercase tracking-wider font-semibold hover:bg-[#D4AF37]"
          >
            Ask Us About Your Outfit
          </button>
        </div>
      </section>

    </div>
  );
};
