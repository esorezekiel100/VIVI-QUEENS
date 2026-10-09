import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, X, ExternalLink } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  const { settings } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ right: 24, bottom: 24 });
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startRight: number;
    startBottom: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);

  const cleanNumber = (settings.whatsappNumber || '2348148920145').replace(/[^0-9]/g, '');
  const defaultText = settings.whatsappMessage || 'Hello VIVI Queens, I would like to ask about an outfit.';

  const handleOpenWhatsApp = (customMessage?: string) => {
    const textToSend = customMessage || defaultText;
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(textToSend)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startRight: position.right,
      startBottom: position.bottom,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    const container = containerRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !container) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (!drag.moved && Math.hypot(deltaX, deltaY) < 4) return;
    drag.moved = true;
    suppressClickRef.current = true;

    const bounds = container.getBoundingClientRect();
    const maxRight = Math.max(12, window.innerWidth - bounds.width - 12);
    const maxBottom = Math.max(12, window.innerHeight - bounds.height - 12);
    setPosition({
      right: Math.min(maxRight, Math.max(12, drag.startRight - deltaX)),
      bottom: Math.min(maxBottom, Math.max(12, drag.startBottom - deltaY)),
    });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
  };

  useEffect(() => {
    const keepInViewport = () => {
      const bounds = containerRef.current?.getBoundingClientRect();
      if (!bounds) return;
      const maxRight = Math.max(12, window.innerWidth - bounds.width - 12);
      const maxBottom = Math.max(12, window.innerHeight - bounds.height - 12);
      setPosition((current) => ({
        right: Math.min(current.right, maxRight),
        bottom: Math.min(current.bottom, maxBottom),
      }));
    };

    window.addEventListener('resize', keepInViewport);
    keepInViewport();
    return () => window.removeEventListener('resize', keepInViewport);
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="fixed z-50 flex flex-col items-end"
      style={{ right: position.right, bottom: position.bottom }}
    >
      {/* Popover Card */}
      {isOpen && (
        <div className="mb-3 w-[min(20rem,calc(100vw-1.5rem))] bg-[#FAF8F5] text-[#1A1412] p-5 shadow-2xl border border-[#C5A880]/30 rounded-none transition-all duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#1A1412]/10">
            <div>
              <p className="font-serif text-base font-semibold tracking-wide">VIVI QUEENS</p>
              <p className="text-[11px] text-[#1A1412]/60">Biogbolo, Yenagoa</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#1A1412]/50 hover:text-[#1A1412] p-1"
              aria-label="Close WhatsApp card"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#1A1412]/80 mt-3 leading-relaxed">
            Ask about an outfit, fabric, or a fitting.
          </p>

          <div className="mt-4 space-y-2">
            <button
              onClick={() => handleOpenWhatsApp("Hello VIVI Queens, I want to ask about sewing an outfit with you.")}
              className="w-full text-left text-xs p-2.5 bg-white border border-[#1A1412]/10 hover:border-[#C5A880] transition-colors"
            >
              ✨ "Ask about sewing an outfit"
            </button>
            <button
              onClick={() => handleOpenWhatsApp("Hello VIVI Queens, I want to book a measurement visit at your Biogbolo studio.")}
              className="w-full text-left text-xs p-2.5 bg-white border border-[#1A1412]/10 hover:border-[#C5A880] transition-colors"
            >
              📏 "Book a measurement visit"
            </button>
          </div>

          <button
            onClick={() => handleOpenWhatsApp()}
            className="mt-4 w-full py-2.5 bg-[#1A1412] text-[#FAF8F5] hover:bg-[#2D2420] text-xs font-medium tracking-[0.15em] uppercase flex items-center justify-center gap-2"
          >
            <span>Chat on WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#C5A880]" />
          </button>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => {
          if (suppressClickRef.current) return;
          setIsOpen(!isOpen);
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="group flex touch-none select-none items-center gap-2.5 px-4 py-3 bg-[#1A1412] text-[#FAF8F5] border border-[#C5A880]/50 shadow-xl hover:bg-[#2A201C] transition-all cursor-grab active:cursor-grabbing"
        aria-label="Contact VIVI Queens on WhatsApp"
        aria-expanded={isOpen}
        title="Drag to move or click to open WhatsApp"
      >
        <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
        <MessageCircle className="w-5 h-5 text-[#C5A880]" />
        <span className="text-xs uppercase tracking-[0.16em] font-medium hidden sm:inline-block">
          WhatsApp
        </span>
      </button>
    </div>
  );
};
