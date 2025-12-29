
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Car } from '../types';
import { CarCard } from './CarCard';

export const FeaturedGrid: React.FC = () => {
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
          .limit(20); // 5 columns * 4 rows = 20 items

        if (!error && data) {
          setFeaturedCars(data as any as Car[]);
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
    <section className="py-24 bg-[#fcfcfc]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#237837] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white mb-6 shadow-lg shadow-[#237837]/20">
              <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
              Promoted Listings
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[0.9]">Featured Showcase</h2>
            <p className="text-slate-500 mt-6 text-lg font-medium leading-relaxed">
              Premium advertised vehicles from our top-rated verified dealers across Zimbabwe.
            </p>
          </div>
          <button 
            onClick={() => navigate('/marketplace')}
            className="flex items-center gap-3 text-[#237837] font-black text-sm uppercase tracking-widest hover:translate-x-2 transition-transform bg-white px-8 py-4 rounded-[20px] shadow-sm border border-slate-100"
          >
            Explore Marketplace
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-[420px] bg-white rounded-[40px] border border-slate-100 animate-pulse" />
            ))
          ) : (
            featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))
          )}
        </div>

        {featuredCars.length > 0 && (
          <div className="mt-16 pt-16 border-t border-slate-100 text-center">
            <button 
              onClick={() => navigate('/marketplace')}
              className="bg-slate-900 text-white px-12 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-[#237837] transition-all shadow-xl shadow-black/10"
            >
              View Full Inventory
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
