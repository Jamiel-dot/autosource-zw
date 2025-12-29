
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface BodyType {
  name: string;
  image_url: string;
}

interface BodyTypeGridProps {
  onSelectType: (type: string) => void;
}

const ALLOWED_TYPES = [
  'Crossover', 'Hatchback', 'Minivan', 'Sedan', 'SUV', 'Truck'
];

export const BodyTypeGrid: React.FC<BodyTypeGridProps> = ({ onSelectType }) => {
  const [bodyTypes, setBodyTypes] = useState<BodyType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBodyTypes = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('body_types')
          .select('name, image_path')
          .order('name', { ascending: true });

        if (error) throw error;

        if (data) {
          const formatted = data
            .filter((bt) => ALLOWED_TYPES.includes(bt.name))
            .map((bt) => {
              const { data: publicUrlData } = supabase.storage
                .from('category-images')
                .getPublicUrl(bt.image_path);

              return {
                name: bt.name,
                image_url: publicUrlData.publicUrl,
              };
            });
            
          setBodyTypes(formatted);
        }
      } catch (err) {
        console.error('Error fetching body types:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBodyTypes();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div className="text-left">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Browse by body type</h2>
            <p className="text-slate-500 mt-1 font-medium text-sm md:text-base">Find the perfect shape for your lifestyle</p>
          </div>
          <button 
            onClick={() => navigate('/marketplace')}
            className="text-xs md:text-sm font-black text-[#237837] hover:underline flex items-center gap-2 group"
          >
            View All Vehicles
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center p-2">
                <div className="w-full aspect-video rounded-2xl bg-slate-50 animate-pulse mb-3"></div>
                <div className="h-3 w-12 bg-slate-50 animate-pulse rounded"></div>
              </div>
            ))
          ) : bodyTypes.length > 0 ? (
            bodyTypes.map((type) => (
              <button
                key={type.name}
                onClick={() => onSelectType(`type-${type.name}`)}
                className="group relative flex flex-col items-center p-3 rounded-[24px] transition-all duration-300 hover:bg-slate-50 border border-transparent hover:border-slate-100"
              >
                <div className="w-full aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-slate-50/50 flex items-center justify-center p-2 shadow-sm group-hover:shadow-lg group-hover:shadow-[#237837]/5 transition-all duration-500">
                  <img 
                    src={type.image_url} 
                    alt={type.name} 
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400';
                    }}
                  />
                </div>
                <span className="text-xs md:text-sm font-black text-slate-900 group-hover:text-[#237837] transition-colors tracking-tight">
                  {type.name}
                </span>
              </button>
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-slate-400 font-medium border border-dashed border-slate-200 rounded-3xl text-sm">
              No categories found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
