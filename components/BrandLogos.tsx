
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface BrandLogosProps {
  onBrandSelect: (brand: string) => void;
}

const TOP_5_NAMES = ['Toyota', 'Ford', 'BMW', 'Mercedes-Benz', 'Nissan'];

// Local map for high-quality logos of the Top 5
const LOGO_MAP: Record<string, string> = {
  'Toyota': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Toyota_carlogo.svg/1200px-Toyota_carlogo.svg.png',
  'Ford': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ford_logo_flat.svg/1200px-Ford_logo_flat.svg.png',
  'BMW': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/2048px-BMW.svg.png',
  'Mercedes-Benz': 'https://informair.co.za/imgs/Mercedes-Benz.png',
  'Nissan': 'https://informair.co.za/imgs/nissan.png'
};

export const BrandLogos: React.FC<BrandLogosProps> = ({ onBrandSelect }) => {
  const [allMakes, setAllMakes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchMakes = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('vehicle_models')
          .select('make_name')
          .order('make_name', { ascending: true });

        if (!error && data) {
          const unique = Array.from(new Set(data.map(m => m.make_name as string))).sort() as string[];
          setAllMakes(unique);
        }
      } catch (err) {
        console.error('Error fetching brands:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMakes();
  }, []);

  const otherMakes = allMakes.filter(m => !TOP_5_NAMES.includes(m));

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
              Shop by <span className="text-[#237837]">Brand</span>
            </h2>
            <p className="text-slate-500 mt-4 text-[14px] md:text-base font-medium tracking-tight">
              Explore the most popular manufacturers in the Zimbabwean market.
            </p>
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="group flex items-center gap-3 bg-slate-50 hover:bg-[#237837] text-slate-900 hover:text-white px-6 py-3 rounded-2xl font-black text-[12px] uppercase tracking-tight transition-all duration-300 shadow-sm"
          >
            {isExpanded ? 'Show Less' : 'View All Brands'}
            <svg 
              className={`w-4 h-4 transition-transform duration-500 ${isExpanded ? 'rotate-180' : 'group-hover:translate-y-1'}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Top 5 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
          {TOP_5_NAMES.map((name) => (
            <button 
              key={name}
              onClick={() => onBrandSelect(name)}
              className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-[48px] border-2 border-transparent hover:border-[#237837] hover:bg-white hover:shadow-2xl transition-all duration-500 group relative overflow-hidden h-64"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#237837]/5 rounded-full blur-3xl group-hover:bg-[#237837]/10 transition-colors" />
              <div className="w-20 h-20 mb-6 relative z-10">
                <img 
                  src={LOGO_MAP[name]} 
                  alt={name} 
                  className="w-full h-full object-contain filter grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-110" 
                />
              </div>
              <span className="text-lg font-black text-slate-900 group-hover:text-[#237837] transition-colors relative z-10 tracking-tight">
                {name}
              </span>
            </button>
          ))}
        </div>

        {/* Expandable Grid for All Other Brands */}
        <div 
          className={`mt-12 overflow-hidden transition-all duration-700 ease-in-out ${
            isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="pt-12 border-t border-slate-100">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {loading ? (
                Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-14 bg-slate-50 rounded-2xl animate-pulse" />
                ))
              ) : (
                otherMakes.map((make) => (
                  <button
                    key={make}
                    onClick={() => onBrandSelect(make)}
                    className="flex items-center justify-center px-4 py-4 bg-white border border-slate-100 rounded-2xl font-bold text-slate-600 hover:text-[#237837] hover:border-[#237837] hover:shadow-lg transition-all duration-300 text-[13px] tracking-tight"
                  >
                    {make}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};