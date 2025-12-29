
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car } from '../types';
import { isInWishlist, toggleWishlist } from '../lib/wishlist';

interface CarCardProps {
  car: Partial<Car>;
  onSelect?: (id: string) => void;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (car.id) {
      setIsSaved(isInWishlist(car.id));
    }
    
    const handleUpdate = () => {
      if (car.id) setIsSaved(isInWishlist(car.id));
    };
    
    window.addEventListener('wishlist-updated', handleUpdate);
    return () => window.removeEventListener('wishlist-updated', handleUpdate);
  }, [car.id]);

  const title = car.listing_title || "Vehicle";
  const priceDisplay = car.price ? `${car.currency || '$'}${car.price.toLocaleString()}` : 'Contact';
  const imageUrl = car.main_image_url || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800';
  
  const specs = [
    car.year?.toString(),
    car.transmission?.toUpperCase(),
    car.fuel_type?.toUpperCase()
  ].filter(Boolean).join('  •  ');

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (car.id) {
      toggleWishlist(car.id);
    }
  };

  const sellerAvatar = car.profiles?.avatar_url || car.profiles?.logo_url;

  return (
    <Link 
      to={`/car/${car.id}`}
      className="group bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-[#237837]/5 transition-all duration-700 overflow-hidden flex flex-col p-4"
    >
      <div className="relative h-48 rounded-[32px] overflow-hidden bg-slate-50 mb-6">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          onError={(e) => {
             (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800';
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
          {car.is_featured && (
            <span className="bg-[#237837] text-white px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg">Featured</span>
          )}
          <span className="bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-sm border border-slate-100">
            {car.condition?.toUpperCase() || 'USED'}
          </span>
        </div>

        {/* Wishlist Toggle */}
        <button 
          onClick={handleToggleWishlist}
          className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all backdrop-blur-md shadow-sm z-20 ${isSaved ? 'bg-[#237837] text-white' : 'bg-white/50 text-white hover:text-red-500'}`}
        >
          <svg className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        
        {sellerAvatar && (
          <div className="absolute bottom-4 right-4 z-10">
            <div className="w-10 h-10 rounded-xl border-2 border-white overflow-hidden shadow-2xl bg-white">
              <img src={sellerAvatar} alt="Seller" className="w-full h-full object-cover" />
            </div>
          </div>
        )}
      </div>
      
      <div className="px-2 pb-2 flex-grow flex flex-col">
        <div className="mb-6">
          <h3 className="text-base font-black text-slate-900 group-hover:text-[#237837] transition-colors line-clamp-1 tracking-tight mb-1">{title}</h3>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{specs}</p>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Asking Price</p>
            <span className="text-xl font-black text-slate-900 tracking-tighter">{priceDisplay}</span>
          </div>
          <div className="bg-[#237837] text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 shadow-xl shadow-[#237837]/30 group-hover:bg-slate-900 group-hover:scale-110">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};
