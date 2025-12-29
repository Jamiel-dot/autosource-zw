import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AdvancedFilters } from './Marketplace';

interface FilterSidebarProps {
  activePage: string;
  onFilterChange?: (filters: Partial<AdvancedFilters>) => void;
  currentFilters?: AdvancedFilters;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ activePage, onFilterChange, currentFilters }) => {
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);

  useEffect(() => {
    const fetchMakes = async () => {
      const { data, error } = await supabase
        .from('vehicle_models')
        .select('make_name')
        .order('make_name', { ascending: true });
      
      // Explicitly cast Array.from result to string[] to resolve unknown[] assignment error
      if (!error && data) {
        const uniqueMakes = Array.from(new Set(data.map((m: any) => m.make_name as string))) as string[];
        setMakes(uniqueMakes);
      }
    };
    fetchMakes();
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      if (!currentFilters?.make) {
        setModels([]);
        return;
      }
      const { data, error } = await supabase
        .from('vehicle_models')
        .select('name')
        .eq('make_name', currentFilters.make)
        .order('name', { ascending: true });
      
      // Fix: cast mapped items to string to ensure string[] type consistency
      if (!error && data) {
        setModels(data.map((m: any) => m.name as string));
      }
    };
    fetchModels();
  }, [currentFilters?.make]);

  const handleChange = (key: keyof AdvancedFilters, value: string) => {
    if (onFilterChange) {
      onFilterChange({ [key]: value });
    }
  };

  return (
    <div className="w-full lg:w-80 flex-shrink-0">
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 lg:sticky lg:top-32 transition-all duration-300">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-black text-slate-900 uppercase tracking-[0.1em] text-xs">Search Filters</h3>
            <p className="text-[10px] text-[#237837] font-black mt-0.5 tracking-widest uppercase">
              {currentFilters?.condition === 'All' ? 'Everything' : `${currentFilters?.condition} ONLY`}
            </p>
          </div>
          <button 
            onClick={() => onFilterChange?.({
              make: '', model: '', bodyType: '', minPrice: '', maxPrice: '', yearFrom: '', yearTo: ''
            })}
            className="text-xs font-bold text-[#237837] hover:underline px-3 py-1 bg-[#237837]/5 rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>

        {/* Condition Toggle */}
        <div className="flex bg-slate-50 p-1 rounded-2xl mb-8">
           {['All', 'Used', 'New'].map(cond => (
             <button
               key={cond}
               onClick={() => handleChange('condition', cond as any)}
               className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${currentFilters?.condition === cond ? 'bg-white text-[#237837] shadow-sm' : 'text-slate-400'}`}
             >
               {cond}
             </button>
           ))}
        </div>

        {/* Price Range */}
        <div className="space-y-4 mb-8">
          <label className="text-sm font-black text-slate-800 tracking-tight">Price Range ($)</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-xs font-bold">$</span>
               <input 
                 type="number" 
                 placeholder="Min" 
                 value={currentFilters?.minPrice || ''}
                 onChange={(e) => handleChange('minPrice', e.target.value)}
                 className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-8 pr-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-[#237837] transition-all" 
               />
            </div>
            <div className="relative">
               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-xs font-bold">$</span>
               <input 
                 type="number" 
                 placeholder="Max" 
                 value={currentFilters?.maxPrice || ''}
                 onChange={(e) => handleChange('maxPrice', e.target.value)}
                 className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-8 pr-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-[#237837] transition-all" 
               />
            </div>
          </div>
        </div>

        {/* Year Range */}
        <div className="space-y-4 mb-8">
          <label className="text-sm font-black text-slate-800 tracking-tight">Year Range</label>
          <div className="grid grid-cols-2 gap-3">
            <select 
              value={currentFilters?.yearFrom || ''}
              onChange={(e) => handleChange('yearFrom', e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 outline-none appearance-none"
            >
              <option value="">From</option>
              {Array.from({ length: 30 }, (_, i) => 2025 - i).map(year => <option key={year} value={year}>{year}</option>)}
            </select>
            <select 
              value={currentFilters?.yearTo || ''}
              onChange={(e) => handleChange('yearTo', e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 outline-none appearance-none"
            >
              <option value="">To</option>
              {Array.from({ length: 30 }, (_, i) => 2025 - i).map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
        </div>

        {/* Make */}
        <div className="space-y-4 mb-8">
          <label className="text-sm font-black text-slate-800 tracking-tight">Make</label>
          <select 
            value={currentFilters?.make || ''}
            onChange={(e) => handleChange('make', e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none appearance-none cursor-pointer"
          >
            <option value="">All Makes</option>
            {makes.map(make => <option key={make} value={make}>{make}</option>)}
          </select>
        </div>

        {/* Model */}
        <div className={`space-y-4 mb-8 ${!currentFilters?.make ? 'opacity-50 pointer-events-none' : ''}`}>
          <label className="text-sm font-black text-slate-800 tracking-tight">Model</label>
          <select 
            value={currentFilters?.model || ''}
            onChange={(e) => handleChange('model', e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none appearance-none cursor-pointer"
          >
            <option value="">All Models</option>
            {models.map(model => <option key={model} value={model}>{model}</option>)}
          </select>
        </div>

        {/* Body Styles */}
        <div className="space-y-4 mb-8">
          <label className="text-sm font-black text-slate-800 tracking-tight">Body Type</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Coupe', 'Crossover', 'Hatchback', 'Minivan', 'Sedan', 
              'Sports Car', 'Supercar', 'SUV', 'Truck', 'Van', 'Wagon'
            ].map(type => (
              <button 
                key={type} 
                onClick={() => handleChange('bodyType', currentFilters?.bodyType === type ? '' : type)}
                className={`px-3 py-2.5 rounded-2xl text-[10px] font-black transition-all uppercase tracking-tighter ${currentFilters?.bodyType === type ? 'bg-[#237837] text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};