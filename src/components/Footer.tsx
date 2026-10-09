import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, Mail, Clock, ArrowUpRight, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, navigate, openAppointmentModal } = useApp();

  return (
    <footer className="bg-[#1A1412] text-[#FAF8F5] pt-20 pb-12 border-t border-[#C5A880]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-serif tracking-[0.16em] uppercase text-[#FAF8F5]">
              {settings.brandName || 'VIVI QUEENS'}
            </h2>
            <p className="font-serif italic text-lg text-[#C5A880]">
              {settings.tagline || 'Made to fit you.'}
            </p>
            <p className="text-sm text-[#FAF8F5]/80 max-w-md leading-relaxed font-sans">
              Custom clothes for weddings, work, and everyday wear. Made in Biogbolo, Yenagoa.
            </p>
            <div className="pt-2">
              <button
                onClick={() => openAppointmentModal()}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs tracking-wider uppercase font-semibold bg-[#C5A880] text-[#1A1412] hover:bg-[#D4AF37] transition-colors"
              >
                <span>Book A Fitting</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A880]">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm text-[#FAF8F5]/80">
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/native-attire')}
                  className="hover:text-[#C5A880] transition-colors cursor-pointer text-left font-medium"
                >
                  Nigerian Native Attire
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/collections')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Collections
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/bespoke')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Custom Tailoring
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/services')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Tailoring Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/gallery')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/journal')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Style Tips
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Contact & Studio
                </button>
              </li>
            </ul>
          </div>

          {/* Location & Studio Details */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A880]">
              The Studio
            </h3>
            <div className="space-y-3 text-sm text-[#FAF8F5]/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <span>{settings.location || 'Biogbolo, Yenagoa, Bayelsa State, Nigeria'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A880] shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A880] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed text-[#FAF8F5]/70">
                  {settings.openingHours || 'Monday – Saturday: 9:00 AM – 6:00 PM'}
                </span>
              </div>
            </div>
          </div>

          {/* Social Presence */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A880]">
              Connect
            </h3>
            <div className="flex flex-col space-y-2 text-sm text-[#FAF8F5]/80">
              <a
                href={`https://instagram.com/${(settings.instagramHandle || 'viviqueens').replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#C5A880] transition-colors inline-flex items-center justify-between group"
              >
                <span>Instagram</span>
                <span className="text-xs text-[#FAF8F5]/40 group-hover:text-[#C5A880]">
                  {settings.instagramHandle || '@viviqueens'}
                </span>
              </a>
              <a
                href={`https://facebook.com/${(settings.facebookHandle || 'viviqueenscouture').replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#C5A880] transition-colors inline-flex items-center justify-between group"
              >
                <span>Facebook</span>
                <span className="text-xs text-[#FAF8F5]/40 group-hover:text-[#C5A880]">
                  {settings.facebookHandle || '@viviqueenscouture'}
                </span>
              </a>
              <a
                href={`https://tiktok.com/@${(settings.tiktokHandle || 'viviqueens').replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#C5A880] transition-colors inline-flex items-center justify-between group"
              >
                <span>TikTok</span>
                <span className="text-xs text-[#FAF8F5]/40 group-hover:text-[#C5A880]">
                  {settings.tiktokHandle || '@viviqueens'}
                </span>
              </a>
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.whatsappMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#C5A880] transition-colors inline-flex items-center justify-between group"
              >
                <span>WhatsApp</span>
                <span className="text-xs text-[#FAF8F5]/40 group-hover:text-[#C5A880]">Chat with us</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FAF8F5]/50 gap-4">
          <p>© 2026 VIVI QUEENS. All Rights Reserved. Biogbolo, Yenagoa, Bayelsa State.</p>
          
          <div className="flex items-center gap-6">
            <span className="hover:text-[#FAF8F5]/80 transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-[#FAF8F5]/80 transition-colors cursor-pointer">
              Custom Order Terms
            </span>
            <button
              onClick={() => navigate('/admin/login')}
              className="inline-flex items-center gap-1.5 text-[#C5A880] hover:text-white transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
