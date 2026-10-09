import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { MessageSquare, ArrowRight } from 'lucide-react';

export const NativeAttirePage: React.FC = () => {
  const { openBespokeOrderModal, openAppointmentModal, settings } = useApp();
  const [nativeProducts, setNativeProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const filtered = data.products.filter((p: Product) =>
            p.category.toLowerCase().includes('traditional') ||
            p.collection.toLowerCase().includes('heritage') ||
            p.name.toLowerCase().includes('george') ||
            p.name.toLowerCase().includes('aso-oke') ||
            p.name.toLowerCase().includes('boubou') ||
            p.name.toLowerCase().includes('coral')
          );
          setNativeProducts(filtered);
        }
      })
      .catch(err => console.error('Error fetching native products:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full bg-[#FAF8F5] text-[#1A1412] min-h-screen">
      
      {/* Header */}
      <section className="py-20 bg-[#1A1412] text-[#FAF8F5] border-b border-[#C5A880]/30 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
            NIGERIAN TRADITIONAL WEAR
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif uppercase tracking-tight text-white">
            Nigerian Native Attire
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#FAF8F5]/85 max-w-xl mx-auto leading-relaxed">
            Ijaw George, Aso-Oke, boubou, and wedding clothes made in Yenagoa.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openAppointmentModal('Traditional & Native Attire')}
              className="px-6 py-2.5 bg-[#C5A880] text-[#1A1412] text-xs font-semibold uppercase tracking-wider hover:bg-[#D4AF37] transition-colors"
            >
              Book A Fitting
            </button>
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hello VIVI Queens, I want to sew a Nigerian native outfit (George, Aso-Oke, or Boubou).")}`}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2.5 bg-transparent border border-white/20 text-[#FAF8F5] text-xs font-medium uppercase tracking-wider hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Ask On WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
            CATALOG
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#1A1412] mt-1 uppercase">
            Native Outfits
          </h2>
          <p className="text-xs sm:text-sm text-[#1A1412]/70 mt-1">
            Choose an outfit or bring us your own idea.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-sm font-serif">Loading native outfits...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {nativeProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-[#1A1412]/10 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative aspect-4/5 overflow-hidden bg-[#FAF8F5]">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#1A1412]/90 text-[#FAF8F5] text-[10px] uppercase tracking-wider px-2 py-0.5">
                    Native Outfit
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/95 text-[#1A1412] font-mono text-xs font-semibold px-2.5 py-1">
                    ₦{product.price.toLocaleString()}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-xl font-medium text-[#1A1412]">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-[#1A1412]/75 leading-relaxed font-sans">
                      {product.description}
                    </p>
                    <p className="text-xs text-[#1A1412]/70 pt-3 border-t border-[#1A1412]/10">
                      <strong>Fabric:</strong> {product.fabric}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#1A1412]/10 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => openBespokeOrderModal(product)}
                      className="flex-1 py-2.5 bg-[#1A1412] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#2D2420] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Order This Design</span>
                    </button>
                    <a
                      href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(`Hello VIVI Queens, I am interested in: "${product.name}". Is fabric available?`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 px-4 border border-[#1A1412]/20 text-[#1A1412] text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-1 hover:border-[#1A1412]"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bring your own fabric */}
      <section className="py-16 bg-[#F5EFE8] border-t border-[#1A1412]/10 text-center">
        <div className="max-w-2xl mx-auto px-4 space-y-3">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
            BRING YOUR FABRIC
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#1A1412] uppercase">
            Have Your Own Fabric?
          </h2>
          <p className="text-xs sm:text-sm text-[#1A1412]/75 leading-relaxed">
            Bring your George, lace, or Aso-Oke to our studio. We will sew it for you.
          </p>
          <div className="pt-2">
            <button
              onClick={() => openAppointmentModal('Bring My Own Fabric')}
              className="px-6 py-2.5 bg-[#1A1412] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#2D2420] inline-flex items-center gap-2"
            >
              <span>Book a Fitting</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
