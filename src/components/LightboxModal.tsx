import React from 'react';
import { useApp } from '../context/AppContext';
import { X } from 'lucide-react';

export const LightboxModal: React.FC = () => {
  const { lightboxItem, closeLightbox, openAppointmentModal } = useApp();

  if (!lightboxItem) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
      onClick={closeLightbox}
    >
      <div
        className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeLightbox}
          className="absolute -top-12 right-0 text-white/80 hover:text-white p-2"
          aria-label="Close preview"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative w-full max-h-[75vh] flex items-center justify-center overflow-hidden border border-white/10 bg-black">
          <img
            src={lightboxItem.image}
            alt={lightboxItem.title}
            referrerPolicy="no-referrer"
            className="max-h-[75vh] w-auto max-w-full object-contain"
          />
        </div>

        <div className="w-full bg-[#1A1412] text-[#FAF8F5] p-5 border-t border-[#C5A880]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#C5A880]">
              <span className="uppercase tracking-[0.2em]">{lightboxItem.category}</span>
              <span aria-hidden="true">·</span>
              <span>VIVI QUEENS</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-white tracking-wide mt-1">
              {lightboxItem.title}
            </h3>
            {lightboxItem.caption && (
              <p className="text-xs text-white/70 mt-1 max-w-xl">
                {lightboxItem.caption}
              </p>
            )}
          </div>

          <button
            onClick={() => {
              closeLightbox();
              openAppointmentModal(`Inquiry regarding ${lightboxItem.title}`);
            }}
            className="px-5 py-2.5 bg-[#C5A880] text-[#1A1412] text-xs uppercase font-medium tracking-[0.15em] hover:bg-[#D4AF37] transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <span>Ask About This Outfit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
