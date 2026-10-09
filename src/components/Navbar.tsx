import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPath, navigate, openAppointmentModal } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionsDropdownOpen, setCollectionsDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const navLinks = [
    { label: 'Shop', path: '/collections', hasDropdown: true },
    { label: 'Services', path: '/services' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const collectionSubLinks = [
    { label: 'All Outfits', path: '/collections' },
    { label: 'Nigerian Native Wear', path: '/native-attire' },
    { label: 'Custom Tailoring', path: '/bespoke' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setCollectionsDropdownOpen(false);
  };

  const handleMouseEnterDropdown = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setCollectionsDropdownOpen(true);
  };

  const handleMouseLeaveDropdown = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setCollectionsDropdownOpen(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1A1412]/10 bg-[#FAF8F5]/96 shadow-[0_4px_18px_rgba(26,20,18,0.06)] backdrop-blur-md transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-19 flex items-center justify-between">
        
        {/* Brand mark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('/');
          }}
          aria-label="VIVI QUEENS home"
          className="flex shrink-0 items-center gap-2.5 text-[#1A1412] hover:opacity-85 transition-opacity group"
        >
          <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center border border-[#C5A880] bg-[#1A1412] font-serif text-lg tracking-normal text-[#C5A880] shadow-sm">
            VQ
          </span>
          <span aria-hidden="true" className="flex flex-col leading-none">
            <span className="font-serif text-[21px] font-medium tracking-[0.12em]">VIVI</span>
            <span className="mt-1 text-[9px] font-semibold tracking-[0.38em] text-[#9B7848]">QUEENS</span>
          </span>
        </a>

        {/* Main navigation */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-[#1A1412]/75">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path || (link.hasDropdown && ['/native-attire', '/bespoke'].includes(currentPath));

            if (link.hasDropdown) {
              return (
                <div
                  key={link.path}
                  className="relative"
                  onMouseEnter={handleMouseEnterDropdown}
                  onMouseLeave={handleMouseLeaveDropdown}
                >
                  <button
                    onClick={() => handleNavClick(link.path)}
                    className={`relative px-3 py-3 inline-flex items-center gap-1 transition-colors hover:text-[#1A1412] cursor-pointer whitespace-nowrap ${
                      isActive ? 'text-[#1A1412] font-semibold' : 'text-[#1A1412]/75'
                    }`}
                    aria-expanded={collectionsDropdownOpen}
                  >
                    <span>{link.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${collectionsDropdownOpen ? 'rotate-180 text-[#C5A880]' : 'text-[#1A1412]/40'}`} />
                    {isActive && <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-[#C5A880]" />}
                  </button>

                  {/* Dropdown Menu */}
                  {collectionsDropdownOpen && (
                    <div className="absolute top-full left-0 z-50 mt-2 min-w-56 border border-[#1A1412]/10 bg-[#FAF8F5] p-2 shadow-xl">
                      {collectionSubLinks.map((sub) => (
                        <button
                          key={sub.label}
                          onClick={() => handleNavClick(sub.path)}
                          className="w-full border-b border-[#1A1412]/5 px-3 py-3 text-left text-sm transition-colors last:border-0 hover:bg-white group"
                        >
                          <p className="font-medium text-sm text-[#1A1412] group-hover:text-[#C5A880] transition-colors">
                            {sub.label}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.path);
                }}
                className={`relative px-3 py-3 transition-colors hover:text-[#1A1412] whitespace-nowrap flex items-center gap-1.5 ${
                  isActive ? 'text-[#1A1412] font-semibold' : 'text-[#1A1412]/75'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-[#C5A880]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Main action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => openAppointmentModal()}
            className="hidden sm:inline-flex items-center gap-2 border border-[#1A1412] px-5 py-3 text-xs font-semibold uppercase text-[#FAF8F5] bg-[#1A1412] hover:border-[#C5A880] hover:bg-[#C5A880] hover:text-[#1A1412] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A880] transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>Book A Fitting</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
          </button>

          {/* Mobile hamburger trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex h-11 w-11 items-center justify-center border border-[#1A1412]/15 text-[#1A1412] hover:border-[#C5A880] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A880]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-19 bottom-0 z-50 flex flex-col overflow-y-auto border-t border-[#1A1412]/10 bg-[#FAF8F5] px-6 py-5 shadow-xl">
            <nav className="flex flex-col text-left">
              {navLinks.map((link) => {
                const isActive = currentPath === link.path || (link.hasDropdown && ['/native-attire', '/bespoke'].includes(currentPath));

                if (link.hasDropdown) {
                  return (
                    <div key={link.path} className="border-b border-[#1A1412]/10">
                      <button
                        onClick={() => setCollectionsDropdownOpen((open) => !open)}
                        className={`flex w-full items-center justify-between py-4 text-base font-medium ${isActive ? 'text-[#9B7848]' : 'text-[#1A1412]'}`}
                        aria-expanded={collectionsDropdownOpen}
                      >
                        <span>{link.label}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${collectionsDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {collectionsDropdownOpen && (
                        <div className="pb-3 pl-4">
                          {collectionSubLinks.map((sub) => (
                            <a
                              key={sub.path}
                              href={sub.path}
                              onClick={(event) => {
                                event.preventDefault();
                                handleNavClick(sub.path);
                              }}
                              className="block py-2.5 text-sm text-[#1A1412]/70 hover:text-[#9B7848]"
                            >
                              {sub.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <a
                    key={link.path}
                    href={link.path}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.path);
                    }}
                    className={`border-b border-[#1A1412]/10 py-4 text-base font-medium transition-colors ${
                      isActive ? 'text-[#9B7848]' : 'text-[#1A1412] hover:text-[#9B7848]'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

          <div className="mt-auto pt-6">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAppointmentModal();
              }}
              className="w-full py-3.5 text-xs uppercase font-semibold text-[#FAF8F5] bg-[#1A1412] hover:bg-[#2D2420] transition-colors flex items-center justify-center gap-2"
            >
              <span>Book a Visit</span>
              <ArrowRight className="w-4 h-4 text-[#C5A880]" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
