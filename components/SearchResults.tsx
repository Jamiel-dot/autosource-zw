
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CarCard } from './CarCard';
import { Car } from '../types';
import { SearchCriteria } from './SearchBar';

interface SearchResultsProps {
  criteria: SearchCriteria;
  onCarSelect: (id: string) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ criteria, onCarSelect }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('listings')
          .select('*, profiles(avatar_url, business_name, full_name, is_dealer)', { count: 'exact' })
          .eq('status', 'approved');

        // Condition Filter
        if (criteria.condition !== 'All') {
          query = query.eq('condition', criteria.condition);
        }

        // Make Filter
        if (criteria.make) {
          query = query.eq('make', criteria.make);
        }
        
        // Model Filter
        if (criteria.model) {
          query = query.eq('model', criteria.model);
        }

        // Location Filter
        if (criteria.location) {
          query = query.eq('location_city', criteria.location);
        }

        const { data, count, error } = await query.order('created_at', { ascending: false });

        if (!error && data) {
          setCars(data as any as Car[]);
          setTotalCount(count || 0);
        } else if (error) {
          console.error('Search error:', error);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [criteria]);

  return (
    <div className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Search Results
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-slate-500 font-medium">Filtered by:</span>
          <span className="bg-[#237837]/10 text-[#237837] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
            {criteria.condition === 'All' ? 'All Cars' : criteria.condition}
          </span>
          {criteria.make && <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">{criteria.make}</span>}
          {criteria.model && <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">{criteria.model}</span>}
          <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
            {criteria.location || 'All Zimbabwe'}
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <div className="text-sm font-bold text-slate-900">
          We found <span className="text-[#237837]">{totalCount.toLocaleString()}</span> matching vehicles
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Sort by:</span>
          <select className="flex-grow md:flex-none bg-slate-50 border-none rounded-2xl px-4 py-2 text-sm font-bold text-slate-700 outline-none cursor-pointer focus:ring-2 focus:ring-[#237837]/20">
            <option>Newest Listed</option>
            <option>Price (Low to High)</option>
            <option>Price (High to Low)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-96 bg-white rounded-3xl border border-slate-100 animate-pulse" />
          ))}
        </div>
      ) : cars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {cars.map(car => (
            <CarCard key={car.id} car={car} onSelect={onCarSelect} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[40px] border border-dashed border-slate-200 p-24 text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-4">No Exact Matches Found</h3>
          <p className="text-slate-500 max-w-md mx-auto font-medium leading-relaxed">
            We couldn't find any vehicles matching your exact criteria. Try broadening your search or adjusting your filters.
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mt-8 text-[#237837] font-black uppercase tracking-widest text-sm hover:underline"
          >
            Adjust Search
          </button>
        </div>
      )}
    </div>
  );
};
