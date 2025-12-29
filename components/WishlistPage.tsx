
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Car } from '../types';
import { CarCard } from './CarCard';
import { Button } from './Button';
import { getWishlist, clearWishlist as clearAll } from '../lib/wishlist';

interface WishlistPageProps {
  onCarSelect: (id: string) => void;
  onBrowse: () => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onCarSelect, onBrowse }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlistCars = async () => {
    const ids = getWishlist();
    if (ids.length === 0) {
      setCars([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*, profiles(avatar_url, business_name, full_name, is_dealer)')
        .in('id', ids)
        .eq('status', 'approved');

      if (!error && data) {
        setCars(data as any as Car[]);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistCars();
    
    const handleUpdate = () => {
      fetchWishlistCars();
    };
    
    window.addEventListener('wishlist-updated', handleUpdate);
    return () => window.removeEventListener('wishlist-updated', handleUpdate);
  }, []);

  const gridClass = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4";

  if (loading) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 py-32 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#237837]/20 border-t-[#237837] rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold tracking-tight text-[13px]">Retrieving saved items...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Saved Vehicles</h1>
          <p className="text-slate-500 font-medium text-sm">
            {cars.length === 0 
              ? "No saved vehicles yet." 
              : `Reviewing ${cars.length} saved vehicle${cars.length === 1 ? '' : 's'}.`}
          </p>
        </div>
        {cars.length > 0 && (
          <button 
            onClick={() => { if(confirm('Clear all saved vehicles?')) clearAll(); }}
            className="text-slate-400 hover:text-red-500 font-bold text-[10px] uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear All
          </button>
        )}
      </div>

      {cars.length > 0 ? (
        <div className={gridClass}>
          {cars.map(car => (
            <CarCard key={car.id} car={car} onSelect={onCarSelect} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[32px] border-2 border-dashed border-slate-100 p-20 text-center flex flex-col items-center">
          <h3 className="text-xl font-black text-slate-900 mb-4">Your list is empty</h3>
          <Button size="md" className="rounded-xl px-10" onClick={onBrowse}>
            Explore Marketplace
          </Button>
        </div>
      )}
    </div>
  );
};
