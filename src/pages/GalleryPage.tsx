import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { GalleryItem } from '../types';
import { Maximize2 } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const { openLightbox, openAppointmentModal } = useApp();
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'Bespoke',
    'Occasion',
    'Traditional',
    'Corporate',
    'Behind the Scenes',
  ];

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setGallery(data.gallery);
        }
      })
      .catch(err => console.error('Error fetching gallery:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = gallery.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="w-full bg-[#FAF8F5] text-[#1A1412] min-h-screen">
      
      {/* Header */}
      <section className="py-20 bg-[#1A1412] text-[#FAF8F5] text-center border-b border-[#C5A880]/20">
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
            OUR WORK
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif uppercase tracking-tight mt-2 text-white">
            Photo Gallery
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#FAF8F5]/80 font-sans max-w-xl mx-auto leading-relaxed">
            See outfits we have made and our studio in Yenagoa.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-20 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#1A1412]/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-2 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs uppercase tracking-[0.14em] font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1A1412] text-[#FAF8F5]'
                  : 'bg-white border border-[#1A1412]/10 text-[#1A1412]/70 hover:text-[#1A1412] hover:border-[#1A1412]/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Masonry / Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-24 text-sm font-serif">Loading photos...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 text-sm text-[#1A1412]/60 font-serif">
            No photos found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => openLightbox(item)}
                className="group cursor-pointer bg-white border border-[#1A1412]/10 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-4/5 overflow-hidden bg-[#EAE3D9]">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-3 rounded-full bg-white/90 text-[#1A1412] shadow-lg">
                      <Maximize2 className="w-5 h-5" />
                    </span>
                  </div>
                  <div className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.18em] bg-[#1A1412]/90 text-[#FAF8F5] px-2.5 py-1">
                    {item.category}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-medium text-[#1A1412] group-hover:text-[#C5A880] transition-colors">
                      {item.title}
                    </h3>
                    {item.caption && (
                      <p className="text-xs text-[#1A1412]/60 mt-1 line-clamp-2">
                        {item.caption}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1A1412]/10 flex items-center justify-between text-xs text-[#C5A880]">
                    <span className="uppercase tracking-widest font-semibold text-[10px]">
                      View Photo
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Inquiry Footer */}
      <section className="py-16 bg-[#F5EFE8] border-t border-[#1A1412]/10 text-center">
        <div className="max-w-2xl mx-auto px-4 space-y-3">
          <h2 className="font-serif text-2xl sm:text-3xl uppercase text-[#1A1412]">
            Like an Outfit?
          </h2>
          <p className="text-xs sm:text-sm text-[#1A1412]/75 max-w-md mx-auto leading-relaxed">
            Tell us what you like. We can make it in your size and color.
          </p>
          <div className="pt-2">
            <button
              onClick={() => openAppointmentModal('Gallery Style Inquiry')}
              className="px-6 py-2.5 bg-[#1A1412] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#2D2420] transition-colors"
            >
              Ask Us About It
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
