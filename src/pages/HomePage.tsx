import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Collection, Service, Testimonial } from '../types';
import { ArrowRight, ArrowUpRight, Scissors, MapPin, CheckCircle2, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

const heroSlides = [
  {
    src: '/src/assets/images/hero_nigerian_fashion_1791459700947.jpg',
    alt: 'Emerald gown by VIVI Queens',
  },
  {
    src: '/src/assets/images/traditional_contemporary_attire_1791459737601.jpg',
    alt: 'Nigerian traditional outfit',
  },
  {
    src: '/src/assets/images/nigerian_native_ijaw_george_1791460885980.jpg',
    alt: 'Ijaw George outfit',
  },
  {
    src: '/src/assets/images/nigerian_native_asooke_corset_1791460902042.jpg',
    alt: 'Aso-Oke corset gown',
  },
];

export const HomePage: React.FC = () => {
  const { navigate, openAppointmentModal, openBespokeOrderModal, settings } = useApp();

  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/collections').then(r => r.json()),
      fetch('/api/services').then(r => r.json()),
      fetch('/api/testimonials').then(r => r.json()),
    ])
      .then(([prodData, colData, srvData, testData]) => {
        if (prodData.success) setProducts(prodData.products);
        if (colData.success) setCollections(colData.collections);
        if (srvData.success) setServices(srvData.services);
        if (testData.success) setTestimonials(testData.testimonials.filter((t: Testimonial) => t.status === 'published'));
      })
      .catch(err => console.error('Error fetching homepage data:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (isHeroPaused) return;
    const timer = window.setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [activeHeroSlide, isHeroPaused]);

  return (
    <div className="w-full bg-[#FAF8F5] text-[#1A1412] overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section
        className="relative min-h-[88vh] flex items-center justify-center bg-[#1A1412] text-[#FAF8F5] overflow-hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured outfits"
      >
        <div className="absolute inset-0 z-0">
          {heroSlides.map((slide, index) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={index === activeHeroSlide ? slide.alt : ''}
              aria-hidden={index !== activeHeroSlide}
              referrerPolicy="no-referrer"
              className={`absolute inset-0 w-full h-full object-cover object-center scale-105 transition-opacity duration-700 ${
                index === activeHeroSlide ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1412] via-[#1A1412]/50 to-black/40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 mb-4 text-xs uppercase tracking-[0.25em] text-[#C5A880] font-medium border-b border-[#C5A880]/40 pb-1">
            <span>WOMEN'S FASHION & TAILORING</span>
            <span aria-hidden="true">·</span>
            <span>BIOGBOLO, YENAGOA</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight uppercase leading-[1.1] text-white max-w-3xl">
            Made to Fit You.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#FAF8F5]/90 font-sans font-normal max-w-xl leading-relaxed">
            Custom Nigerian clothes, sewn to fit you in Yenagoa.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => navigate('/collections')}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#FAF8F5] text-[#1A1412] hover:bg-[#EAE3D9] text-xs font-semibold tracking-[0.18em] uppercase transition-all shadow-md cursor-pointer"
            >
              Explore Outfits
            </button>
            <button
              onClick={() => openAppointmentModal()}
              className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-[#C5A880] text-[#FAF8F5] hover:bg-[#C5A880]/15 text-xs font-semibold tracking-[0.18em] uppercase transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-4 h-4 text-[#C5A880]" />
            </button>
          </div>

          <div className="mt-12 text-xs text-[#FAF8F5]/70 tracking-widest uppercase">
            Biogbolo, Yenagoa, Bayelsa State, Nigeria
          </div>

          <div className="mt-6 flex items-center gap-4" aria-label="Hero carousel controls">
            <button
              type="button"
              onClick={() => setActiveHeroSlide((current) => (current - 1 + heroSlides.length) % heroSlides.length)}
              className="flex h-9 w-9 items-center justify-center border border-white/30 text-white hover:bg-white/10"
              aria-label="Previous outfit"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2" aria-label="Choose an outfit photo">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  onClick={() => setActiveHeroSlide(index)}
                  className={`h-2.5 w-2.5 rounded-full border border-white transition-colors ${
                    index === activeHeroSlide ? 'bg-white' : 'bg-transparent'
                  }`}
                  aria-label={`Show photo ${index + 1}: ${slide.alt}`}
                  aria-pressed={index === activeHeroSlide}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIsHeroPaused((paused) => !paused)}
              className="flex h-9 w-9 items-center justify-center border border-white/30 text-white hover:bg-white/10"
              aria-label={isHeroPaused ? 'Play slideshow' : 'Pause slideshow'}
            >
              {isHeroPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => setActiveHeroSlide((current) => (current + 1) % heroSlides.length)}
              className="flex h-9 w-9 items-center justify-center border border-white/30 text-white hover:bg-white/10"
              aria-label="Next outfit"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. INTRODUCTION SECTION */}
      <section className="py-20 sm:py-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#1A1412]/8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
              ABOUT VIVI QUEENS
            </span>
            
            <h2 className="text-3xl sm:text-4xl font-serif text-[#1A1412] leading-tight">
              Clothes Made for You
            </h2>
            
            <p className="text-sm sm:text-base text-[#1A1412]/80 leading-relaxed font-sans">
              We sew clothes that fit well and match your style.
            </p>

            <p className="text-xs sm:text-sm text-[#1A1412]/75 leading-relaxed font-sans">
              Choose from wedding dresses, native wear, work clothes, and more.
            </p>

            <div className="pt-2 flex items-center gap-6">
              <button
                onClick={() => navigate('/about')}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#1A1412] hover:text-[#C5A880] transition-colors"
              >
                <span>About Us</span>
                <ArrowRight className="w-4 h-4 text-[#C5A880]" />
              </button>
              <span className="text-[#1A1412]/20">/</span>
              <button
                onClick={() => navigate('/bespoke')}
                className="text-xs uppercase tracking-wider font-semibold text-[#1A1412]/60 hover:text-[#1A1412] transition-colors"
              >
                How It Works
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative border border-[#1A1412]/10 bg-white overflow-hidden shadow-md">
              <img
                src="/src/assets/images/studio_atelier_interior_1791459713381.jpg"
                alt="VIVI Queens studio in Biogbolo"
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="p-4 bg-[#FAF8F5] border-t border-[#1A1412]/10 flex items-center justify-between">
                <div>
                  <p className="font-serif text-sm font-semibold text-[#1A1412]">Our Studio in Biogbolo</p>
                  <p className="text-xs text-[#1A1412]/60">Yenagoa, Bayelsa State</p>
                </div>
                <button
                  onClick={() => openAppointmentModal('Studio Visit')}
                  className="text-xs text-[#C5A880] uppercase tracking-wider font-semibold hover:underline"
                >
                  Visit Us →
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. SIGNATURE SERVICES */}
      <section className="py-24 sm:py-28 bg-[#F5EFE8] border-y border-[#1A1412]/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-5">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
                WHAT WE DO
              </span>
              <h2 className="text-4xl sm:text-5xl font-serif text-[#1A1412] mt-2">
                Our Services
              </h2>
            </div>
            <button
              onClick={() => navigate('/services')}
              className="inline-flex items-center gap-2 border-b border-[#C5A880] pb-2 text-xs uppercase tracking-wider font-semibold text-[#1A1412] hover:text-[#9B7848] transition-colors"
            >
              <span>See All Services</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {services.slice(0, 6).map((service, index) => (
              <div
                key={service.id}
                className="group flex min-h-56 flex-col justify-between border border-[#1A1412]/10 border-t-2 border-t-[#C5A880]/70 bg-[#FAF8F5] p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#C5A880] hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif text-3xl leading-none text-[#9B7848]">
                      0{index + 1}
                    </span>
                    <Scissors className="w-5 h-5 text-[#9B7848]/70" />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-medium text-[#1A1412] group-hover:text-[#9B7848] transition-colors">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm text-[#1A1412]/70 leading-relaxed font-sans">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="mt-7 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-[#1A1412]/10 pt-4">
                  <span className="min-w-0 text-xs leading-snug text-[#1A1412]/70 font-medium font-sans">
                    {service.pricingNote}
                  </span>
                  <button
                    onClick={() => openAppointmentModal(service.title)}
                    className="inline-flex shrink-0 items-center gap-1.5 border border-[#1A1412]/15 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#1A1412] transition-colors hover:border-[#1A1412] hover:bg-[#1A1412] hover:text-[#FAF8F5] cursor-pointer"
                  >
                    <span>Book</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#9B7848] group-hover:text-[#C5A880]" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. NIGERIAN NATIVE ATTIRE SPOTLIGHT */}
      <section className="py-20 bg-[#211A18] text-[#FAF8F5] border-b border-[#C5A880]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
                TRADITIONAL CLOTHES
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-white mt-1 uppercase tracking-wide">
                Nigerian Native Attire
              </h2>
              <p className="text-xs sm:text-sm text-[#FAF8F5]/80 mt-1 max-w-lg font-sans">
                Ijaw George, Aso-Oke, and wedding clothes, sewn in Yenagoa.
              </p>
            </div>
            <button
              onClick={() => navigate('/native-attire')}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#C5A880] text-[#1A1412] text-xs font-semibold uppercase tracking-wider hover:bg-[#D4AF37] transition-colors cursor-pointer"
            >
              <span>See Native Attire</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-[#1A1412] border border-white/10 overflow-hidden flex flex-col justify-between">
              <div className="relative aspect-3/4 overflow-hidden">
                <img
                  src="/src/assets/images/nigerian_native_ijaw_george_1791460885980.jpg"
                  alt="Bayelsa Ijaw George"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#1A1412]/90 text-[#FAF8F5] text-[10px] uppercase tracking-wider px-2 py-0.5">
                  Ijaw George
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-serif text-lg uppercase text-white">
                  Bayelsa Ijaw George Wrapper & Top
                </h3>
                <p className="text-xs text-[#FAF8F5]/70">
                  Blue and gold George with coral beads.
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs">
                  <span className="font-mono text-[#C5A880] font-semibold">₦195,000</span>
                  <button
                    onClick={() => navigate('/native-attire')}
                    className="text-white hover:underline text-[11px]"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#1A1412] border border-white/10 overflow-hidden flex flex-col justify-between">
              <div className="relative aspect-3/4 overflow-hidden">
                <img
                  src="/src/assets/images/nigerian_native_asooke_corset_1791460902042.jpg"
                  alt="Aso-Oke Outfit"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#1A1412]/90 text-[#FAF8F5] text-[10px] uppercase tracking-wider px-2 py-0.5">
                  Aso-Oke
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-serif text-lg uppercase text-white">
                  Aso-Oke Corset Dress
                </h3>
                <p className="text-xs text-[#FAF8F5]/70">
                  Gold and wine Aso-Oke with shaped shoulders.
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs">
                  <span className="font-mono text-[#C5A880] font-semibold">₦210,000</span>
                  <button
                    onClick={() => navigate('/native-attire')}
                    className="text-white hover:underline text-[11px]"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#1A1412] border border-white/10 overflow-hidden flex flex-col justify-between">
              <div className="relative aspect-3/4 overflow-hidden">
                <img
                  src="/src/assets/images/nigerian_native_coral_bridal_1791460924140.jpg"
                  alt="Coral Bridal Gown"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#1A1412]/90 text-[#FAF8F5] text-[10px] uppercase tracking-wider px-2 py-0.5">
                  Wedding
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-serif text-lg uppercase text-white">
                  Coral Bridal Reception Dress
                </h3>
                <p className="text-xs text-[#FAF8F5]/70">
                  A red dress with coral beads for traditional weddings.
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs">
                  <span className="font-mono text-[#C5A880] font-semibold">₦275,000</span>
                  <button
                    onClick={() => navigate('/native-attire')}
                    className="text-white hover:underline text-[11px]"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. PRODUCT / OUTFIT CATALOG HIGHLIGHT */}
      <section className="py-20 bg-[#FAF8F5] border-b border-[#1A1412]/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
                FEATURED OUTFITS
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#1A1412] mt-1 uppercase">
                Popular Designs
              </h2>
            </div>
            <button
              onClick={() => navigate('/collections')}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#1A1412] hover:text-[#C5A880] transition-colors"
            >
              <span>See Full Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, 6).map((product) => (
              <div
                key={product.id}
                className="group flex flex-col bg-white border border-[#1A1412]/10 overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="relative aspect-3/4 overflow-hidden bg-[#FAF8F5]">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 text-[10px] uppercase tracking-wider bg-[#1A1412]/90 text-[#FAF8F5] px-2 py-0.5">
                    {product.category}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-serif text-lg font-medium text-[#1A1412] group-hover:text-[#C5A880] transition-colors">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-[#1A1412]/70 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-[11px] text-[#1A1412]/60 pt-2">
                      <strong>Fabric:</strong> {product.fabric}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#1A1412]/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#1A1412]/50 block">Price</span>
                      <span className="font-mono text-sm font-semibold text-[#1A1412]">
                        ₦{product.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => openBespokeOrderModal(product)}
                      className="px-3 py-1.5 bg-[#1A1412] text-[#FAF8F5] text-xs uppercase tracking-wider hover:bg-[#C5A880] hover:text-[#1A1412] transition-colors cursor-pointer"
                    >
                      Request Outfit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. HOW WE WORK (SIMPLE 4 STEPS) */}
      <section className="py-20 bg-[#1A1412] text-[#FAF8F5] border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
              EASY PROCESS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-white mt-1 uppercase">
              How to Order
            </h2>
            <p className="text-xs sm:text-sm text-[#FAF8F5]/80 mt-2 font-sans">
              Four simple steps to your new outfit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-5 bg-white/5 border border-white/10 space-y-2">
              <span className="font-mono text-sm text-[#C5A880] font-bold">01</span>
              <h3 className="font-serif text-xl uppercase text-white">Consultation</h3>
              <p className="text-xs text-[#FAF8F5]/75 leading-relaxed font-sans">
                Tell us what you want and when you need it. Choose fabric with us or on WhatsApp.
              </p>
            </div>

            <div className="p-5 bg-white/5 border border-white/10 space-y-2">
              <span className="font-mono text-sm text-[#C5A880] font-bold">02</span>
              <h3 className="font-serif text-xl uppercase text-white">Measurement</h3>
              <p className="text-xs text-[#FAF8F5]/75 leading-relaxed font-sans">
                We measure you so your outfit fits well.
              </p>
            </div>

            <div className="p-5 bg-white/5 border border-white/10 space-y-2">
              <span className="font-mono text-sm text-[#C5A880] font-bold">03</span>
              <h3 className="font-serif text-xl uppercase text-white">Sewing</h3>
              <p className="text-xs text-[#FAF8F5]/75 leading-relaxed font-sans">
                We cut and sew your outfit with care.
              </p>
            </div>

            <div className="p-5 bg-white/5 border border-white/10 space-y-2">
              <span className="font-mono text-sm text-[#C5A880] font-bold">04</span>
              <h3 className="font-serif text-xl uppercase text-white">Fitting</h3>
              <p className="text-xs text-[#FAF8F5]/75 leading-relaxed font-sans">
                Try on your outfit. We can make small changes before you take it home.
              </p>
            </div>

          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => openAppointmentModal('Bespoke Tailoring')}
              className="px-8 py-3 bg-[#C5A880] text-[#1A1412] hover:bg-[#D4AF37] text-xs font-semibold tracking-wider uppercase transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Start Your Order</span>
            </button>
          </div>

        </div>
      </section>

      {/* 7. VISIT STUDIO */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#1A1412]/8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6">
            <img
              src="/src/assets/images/studio_atelier_interior_1791459713381.jpg"
              alt="VIVI Queens Studio"
              referrerPolicy="no-referrer"
              className="w-full h-80 sm:h-96 object-cover border border-[#1A1412]/10 shadow-md"
            />
          </div>

          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
              OUR STUDIO
            </span>
            
            <h2 className="text-3xl sm:text-4xl font-serif text-[#1A1412] uppercase leading-tight">
              Visit Our Studio
            </h2>

            <div className="flex items-center gap-2 text-sm text-[#1A1412] font-medium">
              <MapPin className="w-4 h-4 text-[#C5A880]" />
              <span>{settings.location}</span>
            </div>

            <p className="text-xs sm:text-sm text-[#1A1412]/75 leading-relaxed font-sans">
              Visit us to see fabrics, discuss your outfit, and get measured.
            </p>

            <ul className="space-y-2 text-xs text-[#1A1412]/80">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span>Private room for fittings</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span>George, lace, silk, and brocade fabrics</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span>Help choosing colors and styles</span>
              </li>
            </ul>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => openAppointmentModal('Studio Visit')}
                className="px-6 py-2.5 bg-[#1A1412] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#2D2420] transition-colors cursor-pointer"
              >
                Book A Studio Visit
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="px-6 py-2.5 bg-white border border-[#1A1412]/20 text-[#1A1412] text-xs font-semibold uppercase tracking-wider hover:border-[#1A1412] transition-colors cursor-pointer"
              >
                Hours and Contact
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 8. CLIENT REVIEWS */}
      <section className="py-20 bg-[#FAF8F5] border-b border-[#1A1412]/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
              REVIEWS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#1A1412] mt-1 uppercase">
              What Our Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 border border-[#1A1412]/10 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#C5A880] mb-3 text-xs">
                    {'★'.repeat(item.rating)}
                  </div>
                  <p className="font-serif italic text-sm sm:text-base text-[#1A1412] leading-relaxed">
                    "{item.quote}"
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[#1A1412]/10">
                  <p className="font-sans text-xs uppercase tracking-wider font-semibold text-[#1A1412]">
                    {item.clientName}
                  </p>
                  <p className="text-xs text-[#1A1412]/60 mt-0.5">
                    {item.clientRole} · {item.location}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. INSTAGRAM & SOCIAL */}
      <section className="py-16 bg-[#F5EFE8] text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
            FOLLOW US
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#1A1412] uppercase">
            Join Us On Instagram
          </h2>
          <p className="text-xs sm:text-sm text-[#1A1412]/70">
            See our newest outfits, fittings, and behind-the-scenes videos.
          </p>

          <div>
            <a
              href={`https://instagram.com/${(settings.instagramHandle || 'viviqueens').replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1A1412] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#2D2420] transition-colors"
            >
              <span>Follow {settings.instagramHandle || '@VIVIQUEENS'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A880]" />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
