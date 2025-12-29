
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Car } from '../types';
import { Button } from './Button';

export const CarLeaseSlider: React.FC = () => {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*, profiles(*)')
          .or('is_featured.eq.true,plan_type.eq.Featured')
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(12);

        if (!error && data) {
          setFeaturedCars(data as any as Car[]);
        } else if (error) {
          console.error('Supabase error:', error);
        }
      } catch (err) {
        console.error('Error fetching featured ads:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (!loading && featuredCars.length === 0) return null;

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#237837] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white mb-6 shadow-lg shadow-[#237837]/20">
              <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
              Promoted Listings
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">Featured Showcase</h2>
            <p className="text-slate-500 mt-4 text-lg font-medium leading-relaxed">
              Premium advertised vehicles from our top-rated verified dealers across Zimbabwe.
            </p>
          </div>
          <button 
            onClick={() => navigate('/marketplace')}
            className="flex items-center gap-3 text-[#237837] font-black text-sm uppercase tracking-widest hover:translate-x-2 transition-transform bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100"
          >
            Explore Marketplace
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

        {/* Reduced min-w from 360px to 280px to fit more items and added gap adjustment */}
        <div className="flex overflow-x-auto gap-6 pb-12 custom-scrollbar scroll-smooth -mx-4 px-4 md:mx-0 md:px-0">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="min-w-[280px] h-[460px] bg-white rounded-[40px] border border-slate-100 animate-pulse" />
            ))
          ) : (
            featuredCars.map((car) => (
              <div 
                key={car.id} 
                onClick={() => navigate(`/car/${car.id}`)}
                className="group min-w-[280px] max-w-[280px] bg-white rounded-[40px] p-4 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-[#237837]/5 transition-all duration-700 cursor-pointer relative"
              >
                {/* Featured Ad Badge - Smaller */}
                <div className="absolute top-6 left-6 z-20 flex flex-col gap-1.5">
                  <span className="bg-[#237837] text-white px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-xl backdrop-blur-sm border border-white/10">Featured</span>
                  <span className="bg-white/90 text-slate-900 px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-lg border border-slate-100">
                    {car.condition}
                  </span>
                </div>

                <div className="relative h-48 rounded-[32px] overflow-hidden mb-6">
                  <img 
                    src={car.main_image_url} 
                    alt={car.listing_title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Seller Avatar Overlay - Scaled down */}
                  {(car.profiles?.avatar_url || car.profiles?.logo_url) && (
                    <div className="absolute bottom-4 right-4">
                      <div className="w-10 h-10 rounded-xl border-2 border-white bg-white shadow-2xl overflow-hidden group-hover:scale-110 transition-transform duration-500">
                        <img 
                          src={car.profiles.avatar_url || car.profiles.logo_url || ''} 
                          alt="Seller" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="px-2 space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight group-hover:text-[#237837] transition-colors line-clamp-1 tracking-tight">{car.listing_title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{car.year}</span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[60px]">{car.transmission}</span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[60px]">{car.fuel_type}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Asking Price</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-slate-900 tracking-tighter">{car.currency} {car.price?.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="bg-[#237837] text-white w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-xl shadow-[#237837]/30 group-hover:bg-slate-900">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Button 
            variant="secondary" 
            className="w-full rounded-[24px] h-16 text-sm uppercase tracking-widest"
            onClick={() => navigate('/marketplace')}
          >
            View All Promoted
          </Button>
        </div>
      </div>
    </section>
  );
};
