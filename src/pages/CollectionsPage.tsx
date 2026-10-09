import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { Search, X, ChevronRight, Check } from 'lucide-react';

export const CollectionsPage: React.FC = () => {
  const { openBespokeOrderModal } = useApp();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'Nigerian Native Attire',
    'Occasion Wear',
    'Corporate Wear',
    'New Arrivals',
    'Ready-to-Wear',
  ];

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.products);
        }
      })
      .catch(err => console.error('Error fetching products:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((p) => {
    let matchesCategory = selectedCategory === 'All';
    if (selectedCategory === 'Nigerian Native Attire') {
      matchesCategory =
        p.category.toLowerCase().includes('traditional') ||
        p.collection.toLowerCase().includes('heritage') ||
        p.name.toLowerCase().includes('george') ||
        p.name.toLowerCase().includes('aso-oke') ||
        p.name.toLowerCase().includes('boubou') ||
        p.name.toLowerCase().includes('coral');
    } else if (selectedCategory !== 'All') {
      matchesCategory = p.category.toLowerCase() === selectedCategory.toLowerCase();
    }
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.fabric.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full bg-[#FAF8F5] text-[#1A1412] min-h-screen">
      
      {/* Header */}
      <section className="py-20 bg-[#1A1412] text-[#FAF8F5] border-b border-[#C5A880]/20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
            OUTFITS & DESIGNS
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif uppercase tracking-wide mt-2 text-white">
            Browse Outfits
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#FAF8F5]/80 max-w-xl mx-auto leading-relaxed">
            Find outfits for weddings, work, and special days.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="sticky top-20 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#1A1412]/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Interactive filter tabs (segmented control as functional buttons) */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs uppercase tracking-[0.12em] font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#1A1412] text-[#FAF8F5]'
                    : 'bg-white border border-[#1A1412]/10 text-[#1A1412]/70 hover:text-[#1A1412] hover:border-[#1A1412]/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search outfits or fabric..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#1A1412]/15 focus:border-[#C5A880] focus:outline-hidden text-xs text-[#1A1412] placeholder:text-[#1A1412]/40"
            />
            <Search className="w-3.5 h-3.5 text-[#1A1412]/50 absolute left-3 top-2.5" />
          </div>

        </div>
      </section>

      {/* Product Catalog Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-24 text-sm text-[#1A1412]/60 font-serif">
            Loading outfits...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <p className="font-serif text-2xl text-[#1A1412]">No outfits found.</p>
            <p className="text-xs text-[#1A1412]/60">Clear the filters or try another search.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-6 py-2 bg-[#1A1412] text-[#FAF8F5] text-xs uppercase tracking-widest"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col bg-white border border-[#1A1412]/10 hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-3/4 overflow-hidden bg-[#FAF8F5]">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                  />
                  {/* Subtle editorial text metadata - ZERO-PILL discipline */}
                  <div className="absolute top-4 left-4 bg-[#1A1412]/90 text-[#FAF8F5] text-[10px] uppercase tracking-[0.16em] px-2.5 py-1">
                    {product.category}
                  </div>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
                    <button
                      onClick={() => setActiveDetailProduct(product)}
                      className="px-4 py-2 bg-white text-[#1A1412] text-xs uppercase tracking-wider font-semibold hover:bg-[#FAF8F5]"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => openBespokeOrderModal(product)}
                      className="px-4 py-2 bg-[#C5A880] text-[#1A1412] text-xs uppercase tracking-wider font-semibold hover:bg-[#D4AF37]"
                    >
                      Request Design
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Unboxed metadata with typographic separators */}
                    <div className="flex items-center gap-2 text-xs text-[#1A1412]/60 mb-1">
                      <span className="uppercase tracking-widest text-[#C5A880] font-semibold">{product.collection}</span>
                      <span aria-hidden="true">·</span>
                      <span>Custom orders available</span>
                    </div>

                    <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#1A1412] group-hover:text-[#C5A880] transition-colors">
                      {product.name}
                    </h2>

                    <p className="mt-2 text-xs text-[#1A1412]/70 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>

                    <div className="mt-3 pt-3 border-t border-[#1A1412]/8 text-[11px] text-[#1A1412]/70 space-y-1">
                      <p>
                        <strong className="text-[#1A1412]">Fabric:</strong> {product.fabric}
                      </p>
                      <p>
                        <strong className="text-[#1A1412]">Colors:</strong> {product.colors?.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#1A1412]/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#1A1412]/50 uppercase tracking-widest block">Price</span>
                      <span className="font-mono text-base font-semibold text-[#1A1412]">
                        ₦{product.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => openBespokeOrderModal(product)}
                      className="px-4 py-2 bg-[#1A1412] text-[#FAF8F5] text-xs uppercase tracking-[0.15em] font-medium hover:bg-[#2D2420] transition-colors flex items-center gap-1.5"
                    >
                      <span>Order</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Product Detail Modal */}
      {activeDetailProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#FAF8F5] text-[#1A1412] p-6 sm:p-10 shadow-2xl border border-[#C5A880]/30 my-8">
            <button
              onClick={() => setActiveDetailProduct(null)}
              className="absolute top-6 right-6 text-[#1A1412]/60 hover:text-[#1A1412] p-1"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <div className="border border-[#1A1412]/10 bg-white">
                  <img
                    src={activeDetailProduct.images[0]}
                    alt={activeDetailProduct.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-80 sm:h-96 object-cover"
                  />
                </div>
                {activeDetailProduct.images.length > 1 && (
                  <div className="flex gap-2">
                    {activeDetailProduct.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="detail view"
                        referrerPolicy="no-referrer"
                        className="w-16 h-20 object-cover border border-[#1A1412]/20"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                    {activeDetailProduct.category} · {activeDetailProduct.collection}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif text-[#1A1412] mt-1 leading-snug">
                    {activeDetailProduct.name}
                  </h3>
                  <p className="font-mono text-lg font-bold text-[#1A1412] mt-2">
                    ₦{activeDetailProduct.price.toLocaleString()}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-[#1A1412]/80 leading-relaxed">
                  {activeDetailProduct.description}
                </p>

                <div className="space-y-2 text-xs border-y border-[#1A1412]/10 py-4">
                  <p>
                    <strong className="text-[#1A1412]">Fabric:</strong> {activeDetailProduct.fabric}
                  </p>
                  <p>
                    <strong className="text-[#1A1412]">Colors:</strong> {activeDetailProduct.colors?.join(', ')}
                  </p>
                  <p>
                    <strong className="text-[#1A1412]">Fit:</strong> Custom fit or UK sizes 8–18
                  </p>
                  <p>
                    <strong className="text-[#1A1412]">Location:</strong> Biogbolo, Yenagoa
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => {
                      const p = activeDetailProduct;
                      setActiveDetailProduct(null);
                      openBespokeOrderModal(p);
                    }}
                    className="w-full py-3.5 bg-[#1A1412] text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#2D2420] transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Order This Outfit</span>
                  </button>
                  <p className="text-[11px] text-[#1A1412]/60 text-center">
                    Ask us about fabric and styling.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
