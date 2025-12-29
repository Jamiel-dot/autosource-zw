
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS, TOP_CATEGORIES, DASHBOARD_URL } from '../constants';
import { getWishlist } from '../lib/wishlist';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const updateCount = () => {
      setWishlistCount(getWishlist().length);
    };
    updateCount();
    window.addEventListener('wishlist-updated', updateCount);
    return () => window.removeEventListener('wishlist-updated', updateCount);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const goToDashboard = () => {
    window.open(DASHBOARD_URL, '_blank');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white">
      {/* Top Categories Bar */}
      <div className="bg-white border-b border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-6 h-10 overflow-x-auto no-scrollbar whitespace-nowrap">
            {TOP_CATEGORIES.map((cat) => {
              const href = `/marketplace?bodyType=${cat}`;
              const isActive = location.pathname + location.search === href;
              return (
                <Link 
                  key={cat} 
                  to={href}
                  className={`text-[12px] font-bold transition-colors h-full flex items-end pb-2 ${
                    isActive 
                      ? 'text-[#237837] border-b-2 border-[#237837]' 
                      : 'text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="bg-white border-b border-slate-100 shadow-sm relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link 
                to="/"
                className="flex items-center group cursor-pointer select-none"
              >
                <div className="flex flex-col gap-1 mr-3">
                  <div className="w-10 h-2.5 bg-[#237837] -skew-x-[25deg] rounded-sm"></div>
                  <div className="w-10 h-2.5 bg-black -skew-x-[25deg] rounded-sm"></div>
                </div>
                <div className="relative flex flex-col">
                  <span className="text-2xl md:text-3xl font-black italic text-slate-900 tracking-tighter leading-none">
                    AutoSource
                  </span>
                  <span className="self-end text-sm font-black text-[#237837] leading-none mt-0.5 tracking-tighter">
                    ZW
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Center Links */}
            <div className="hidden xl:flex space-x-8 h-full">
              {NAV_LINKS.map((link) => {
                const isExternal = link.href.startsWith('http');
                const path = link.id === 'home' ? '/' : `/${link.id}`;
                const isActive = location.pathname === path;
                
                if (isExternal) {
                  return (
                    <a 
                      key={link.id}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[14px] h-full flex items-end pb-6 transition-all whitespace-nowrap border-b-4 font-semibold text-slate-500 border-transparent hover:text-[#237837]"
                    >
                      {link.label}
                    </a>
                  );
                }

                return (
                  <Link 
                    key={link.id} 
                    to={path}
                    className={`text-[14px] h-full flex items-end pb-6 transition-all whitespace-nowrap border-b-4 ${
                      isActive 
                        ? 'font-bold text-[#237837] border-[#237837]' 
                        : 'font-semibold text-slate-500 border-transparent hover:text-[#237837]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4 md:space-x-6">
              <Button 
                onClick={goToDashboard}
                variant="primary" 
                size="sm" 
                className="hidden md:flex rounded-xl bg-slate-900 hover:bg-[#237837] border-none text-[12px] uppercase tracking-widest px-6"
              >
                Sell My Car
              </Button>

              <Link 
                to="/wishlist"
                className={`relative flex flex-col items-center group transition-colors ${location.pathname === '/wishlist' ? 'text-[#237837]' : 'text-slate-700 hover:text-[#237837]'}`}
              >
                <div className="relative">
                  <svg className="w-6 h-6" fill={location.pathname === '/wishlist' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-bold mt-1">Saved</span>
              </Link>
              <button 
                onClick={goToDashboard}
                className="flex flex-col items-center group text-slate-700 hover:text-[#237837] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-[11px] font-bold mt-1">Account</span>
              </button>
              
              <button 
                onClick={toggleMenu}
                className="xl:hidden flex flex-col items-center justify-center w-10 h-10 space-y-1.5 focus:outline-none"
                aria-label="Toggle menu"
              >
                <span className={`block w-6 h-0.5 bg-slate-900 transition-all duration-300 transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-slate-900 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block w-6 h-0.5 bg-slate-900 transition-all duration-300 transform ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div 
        className={`xl:hidden fixed top-30 right-0 w-full md:w-80 h-[calc(100vh-120px)] bg-white z-40 transition-transform duration-300 ease-in-out transform shadow-2xl border-l border-slate-100 overflow-y-auto ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col p-6 space-y-2">
          <Button 
            onClick={goToDashboard}
            className="w-full rounded-2xl h-14 bg-slate-900 text-white font-black uppercase tracking-widest mb-4"
          >
            Sell My Car
          </Button>

          {NAV_LINKS.map((link) => {
            const isExternal = link.href.startsWith('http');
            const path = link.id === 'home' ? '/' : `/${link.id}`;
            const isActive = location.pathname === path;

            if (isExternal) {
              return (
                <a 
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  className="flex items-center justify-between px-6 py-4 rounded-2xl text-left transition-all text-slate-600 font-semibold hover:bg-slate-50 hover:text-[#237837]"
                >
                  {link.label}
                </a>
              );
            }

            return (
              <Link 
                key={link.id} 
                to={path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center justify-between px-6 py-4 rounded-2xl text-left transition-all ${
                  isActive 
                    ? 'bg-[#237837] text-white font-bold' 
                    : 'text-slate-600 font-semibold hover:bg-slate-50 hover:text-[#237837]'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </Link>
            );
          })}
          
          <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
             <Link 
               to="/wishlist"
               onClick={() => setIsMenuOpen(false)}
               className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all ${location.pathname === '/wishlist' ? 'bg-[#237837]/10 text-[#237837]' : 'text-slate-600'}`}
             >
                <div className="flex items-center gap-4">
                  <svg className="w-6 h-6" fill={location.pathname === '/wishlist' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Saved Vehicles
                </div>
                {wishlistCount > 0 && (
                  <span className="bg-[#237837] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black">
                    {wishlistCount}
                  </span>
                )}
             </Link>
             <button 
               onClick={goToDashboard}
               className="w-full flex items-center gap-4 px-6 py-4 text-slate-600 font-bold hover:text-[#237837]"
             >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Manage My Account
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
