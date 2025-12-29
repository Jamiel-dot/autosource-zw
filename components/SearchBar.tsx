
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { supabase } from '../lib/supabase';

export interface SearchCriteria {
  make: string;
  model: string;
  location: string;
  condition: 'All' | 'New' | 'Used';
  bodyType?: string;
  minPrice?: string;
  maxPrice?: string;
  yearFrom?: string;
  yearTo?: string;
}

interface SearchBarProps {
  activePage?: string;
  onSearch?: (criteria: SearchCriteria) => void;
}

const ZIMBABWE_CITIES = [
  'Harare', 'Bulawayo', 'Chitungwiza', 'Mutare', 'Gweru', 'Kwekwe', 'Kadoma', 'Masvingo', 'Victoria Falls', 'Marondera', 'Norton', 'Chegutu', 'Zvishavane', 'Bindura', 'Chinhoyi'
];

const CAR_TYPES = [
  'Coupe', 'Crossover', 'Hatchback', 'Minivan', 'Sedan', 'Sports Car', 'Supercar', 'SUV', 'Truck', 'Van', 'Wagon'
];

export const SearchBar: React.FC<SearchBarProps> = ({ activePage }) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number>(1); 
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [location, setLocation] = useState('');
  
  // Advanced filters state for modal
  const [bodyType, setBodyType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');

  const [showMakes, setShowMakes] = useState(false);
  const [showModels, setShowModels] = useState(false);
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);

  const makeRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activePage === 'new') setActiveIndex(3);
    else if (activePage === 'used') setActiveIndex(2);
    else setActiveIndex(1);
  }, [activePage]);

  useEffect(() => {
    const fetchMakes = async () => {
      const { data, error } = await supabase
        .from('vehicle_models')
        .select('make_name')
        .order('make_name', { ascending: true });
      
      if (!error && data) {
        const uniqueMakes = Array.from(new Set(data.map((m: any) => m.make_name as string))) as string[];
        setMakes(uniqueMakes);
      }
    };
    fetchMakes();

    const handleClickOutside = (event: MouseEvent) => {
      if (makeRef.current && !makeRef.current.contains(event.target as Node)) setShowMakes(false);
      if (modelRef.current && !modelRef.current.contains(event.target as Node)) setShowModels(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      if (!selectedMake) {
        setModels([]);
        return;
      }
      const { data, error } = await supabase
        .from('vehicle_models')
        .select('name')
        .eq('make_name', selectedMake)
        .order('name', { ascending: true });
      
      if (!error && data) {
        setModels(data.map((m: any) => m.name as string));
      }
    };
    fetchModels();
  }, [selectedMake]);

  const handleSearch = () => {
    const conditionMap: Record<number, string> = {
      1: 'marketplace',
      2: 'used',
      3: 'new'
    };

    const targetPath = `/${conditionMap[activeIndex]}`;
    const params = new URLSearchParams();
    if (selectedMake) params.set('make', selectedMake);
    if (selectedModel) params.set('model', selectedModel);
    if (location) params.set('location', location);
    if (bodyType) params.set('bodyType', bodyType);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (yearFrom) params.set('yearFrom', yearFrom);
    if (yearTo) params.set('yearTo', yearTo);
    
    setIsMoreOptionsOpen(false);
    navigate(`${targetPath}?${params.toString()}`);
  };

  const resetAll = () => {
    setSelectedMake('');
    setSelectedModel('');
    setLocation('');
    setBodyType('');
    setMinPrice('');
    setMaxPrice('');
    setYearFrom('');
    setYearTo('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-30">
      <div className="bg-white rounded-3xl lg:rounded-full shadow-2xl p-2 border border-slate-100 flex flex-col lg:flex-row items-center">
        {/* Make Section */}
        <div 
          ref={makeRef} 
          className="flex-1 px-6 py-4 w-full relative group cursor-pointer hover:bg-slate-50 transition-colors lg:rounded-l-full"
          onClick={() => setShowMakes(!showMakes)}
        >
          <label className="text-[11px] font-black text-slate-400 block leading-tight uppercase tracking-wider mb-1">Make</label>
          <div className="flex justify-between items-center">
            <span className="text-[15px] font-bold text-slate-900 truncate">{selectedMake || 'Any Make'}</span>
            <svg className={`w-4 h-4 text-slate-300 transition-transform ${showMakes ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {showMakes && (
            <div className="absolute top-[calc(100%+10px)] left-0 w-full lg:w-64 bg-white shadow-2xl rounded-2xl py-2 max-h-80 overflow-y-auto z-[60] border border-slate-100 animate-in fade-in slide-in-from-top-2">
              <button className="w-full text-left px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50" onClick={(e) => { e.stopPropagation(); setSelectedMake(''); setSelectedModel(''); setShowMakes(false); }}>Any Make</button>
              {makes.map(make => <button key={make} className="w-full text-left px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50" onClick={(e) => { e.stopPropagation(); setSelectedMake(make); setSelectedModel(''); setShowMakes(false); }}>{make}</button>)}
            </div>
          )}
        </div>

        <div className="hidden lg:block w-px h-10 bg-slate-100 mx-1"></div>

        {/* Model Section */}
        <div 
          ref={modelRef} 
          className={`flex-1 px-6 py-4 w-full relative group transition-colors ${!selectedMake ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-50'}`}
          onClick={() => selectedMake && setShowModels(!showModels)}
        >
          <label className="text-[11px] font-black text-slate-400 block leading-tight uppercase tracking-wider mb-1">Model</label>
          <div className="flex justify-between items-center">
            <span className="text-[15px] font-bold text-slate-900 truncate">{selectedModel || 'Any Model'}</span>
            <svg className={`w-4 h-4 text-slate-300 transition-transform ${showModels ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {showModels && (
            <div className="absolute top-[calc(100%+10px)] left-0 w-full lg:w-64 bg-white shadow-2xl rounded-2xl py-2 max-h-80 overflow-y-auto z-[60] border border-slate-100 animate-in fade-in slide-in-from-top-2">
              <button className="w-full text-left px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50" onClick={(e) => { e.stopPropagation(); setSelectedModel(''); setShowModels(false); }}>Any Model</button>
              {models.map(model => <button key={model} className="w-full text-left px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50" onClick={(e) => { e.stopPropagation(); setSelectedModel(model); setShowModels(false); }}>{model}</button>)}
            </div>
          )}
        </div>

        <div className="hidden lg:block w-px h-10 bg-slate-100 mx-1"></div>

        {/* More Options Link */}
        <div className="px-6 py-4 w-full lg:w-auto flex items-center justify-center">
          <button 
            onClick={() => setIsMoreOptionsOpen(true)}
            className="text-sm font-bold text-[#237837] hover:underline whitespace-nowrap"
          >
            More options
          </button>
        </div>

        {/* Search Button */}
        <div className="p-2 w-full lg:w-auto">
          <button 
            onClick={handleSearch}
            className="bg-[#237837] text-white rounded-2xl lg:rounded-full h-14 lg:h-16 px-10 flex items-center justify-center gap-3 w-full hover:bg-slate-900 transition-all shadow-xl shadow-[#237837]/20"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="font-black uppercase tracking-widest text-xs">Search</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters Modal */}
      {isMoreOptionsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsMoreOptionsOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Advanced Search</h3>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Refine your perfect match</p>
                </div>
                <button 
                  onClick={() => setIsMoreOptionsOpen(false)}
                  className="w-12 h-12 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
                {/* Condition Tab */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Condition</label>
                  <div className="flex bg-slate-50 p-1.5 rounded-2xl">
                    {['All', 'Used', 'New'].map((tab, i) => (
                      <button
                        key={tab}
                        onClick={() => setActiveIndex(i + 1)}
                        className={`flex-1 py-3 rounded-xl text-xs font-black transition-all tracking-wider ${
                          activeIndex === i + 1 ? 'bg-white text-[#237837] shadow-sm' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Location */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                    <select 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-900 focus:border-[#237837] outline-none appearance-none"
                    >
                      <option value="">All Zimbabwe</option>
                      {ZIMBABWE_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                  </div>

                  {/* Body Type */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Body Type</label>
                    <select 
                      value={bodyType}
                      onChange={(e) => setBodyType(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-900 focus:border-[#237837] outline-none appearance-none"
                    >
                      <option value="">Any Body Type</option>
                      {CAR_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price Range (USD)</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="number" 
                      placeholder="Min Price" 
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-900 focus:border-[#237837] outline-none" 
                    />
                    <input 
                      type="number" 
                      placeholder="Max Price" 
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-900 focus:border-[#237837] outline-none" 
                    />
                  </div>
                </div>

                {/* Year Range */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Year Model</label>
                  <div className="grid grid-cols-2 gap-4">
                    <select 
                      value={yearFrom}
                      onChange={(e) => setYearFrom(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-900 focus:border-[#237837] outline-none"
                    >
                      <option value="">Year From</option>
                      {Array.from({length: 30}, (_, i) => 2025 - i).map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <select 
                      value={yearTo}
                      onChange={(e) => setYearTo(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-900 focus:border-[#237837] outline-none"
                    >
                      <option value="">Year To</option>
                      {Array.from({length: 30}, (_, i) => 2025 - i).map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex flex-col md:flex-row gap-4">
                <button 
                  onClick={resetAll}
                  className="flex-1 py-5 rounded-3xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors bg-slate-50"
                >
                  Reset Filters
                </button>
                <button 
                  onClick={handleSearch}
                  className="flex-[2] bg-[#237837] text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-[#237837]/30 hover:bg-slate-900 transition-all"
                >
                  Show Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
