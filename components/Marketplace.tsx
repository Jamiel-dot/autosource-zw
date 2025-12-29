
import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Car, Profile } from '../types';
import { CarCard } from './CarCard';
import { FilterSidebar } from './FilterSidebar';
import { SearchCriteria } from './SearchBar';
import { Pagination } from './Pagination';

export interface AdvancedFilters extends SearchCriteria {
  minPrice?: string;
  maxPrice?: string;
  bodyType?: string;
  yearFrom?: string;
  yearTo?: string;
}

const ITEMS_PER_PAGE = 36;

export const Marketplace: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  const filters: AdvancedFilters = {
    make: searchParams.get('make') || '',
    model: searchParams.get('model') || '',
    location: searchParams.get('location') || '',
    condition: (searchParams.get('condition') as any) || 'All',
    bodyType: searchParams.get('bodyType') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    yearFrom: searchParams.get('yearFrom') || '',
    yearTo: searchParams.get('yearTo') || ''
  };

  const fetchListings = async (page: number) => {
    setLoading(true);
    try {
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from('listings')
        .select('*, profiles(id, avatar_url, business_name, full_name, is_dealer, business_address, logo_url)', { count: 'exact' })
        .eq('status', 'approved');

      if (filters.condition !== 'All') query = query.eq('condition', filters.condition);
      if (filters.make) query = query.eq('make', filters.make);
      if (filters.model) query = query.eq('model', filters.model);
      if (filters.location) query = query.eq('location_city', filters.location);
      if (filters.bodyType) query = query.eq('body_type', filters.bodyType);
      if (filters.yearFrom) query = query.gte('year', parseInt(filters.yearFrom));
      if (filters.yearTo) query = query.lte('year', parseInt(filters.yearTo));
      if (filters.minPrice) query = query.gte('price', parseFloat(filters.minPrice));
      if (filters.maxPrice) query = query.lte('price', parseFloat(filters.maxPrice));

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (!error && data) {
        setAllCars(data as any as Car[]);
        setTotalItems(count || 0);
      }
    } catch (err) {
      console.error('Marketplace fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchListings(1);
  }, [searchParams]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchListings(currentPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  const sections = useMemo(() => {
    const featured = allCars.filter(car => car.is_featured);
    const advertising = allCars.filter(car => car.is_paid && !car.is_featured);
    const free = allCars.filter(car => !car.is_paid);

    const dealerGroups: Record<string, { dealer: Partial<Profile>, cars: Car[] }> = {};
    advertising.forEach(car => {
      const dealerId = car.user_id;
      if (!dealerGroups[dealerId]) {
        dealerGroups[dealerId] = {
          dealer: car.profiles || { full_name: 'Verified Seller' },
          cars: []
        };
      }
      dealerGroups[dealerId].cars.push(car);
    });

    return { featured, dealerAds: Object.values(dealerGroups), free };
  }, [allCars]);

  const handleFilterChange = (newFilters: Partial<AdvancedFilters>) => {
    const updated = { ...filters, ...newFilters };
    const cleanParams = new URLSearchParams();
    Object.entries(updated).forEach(([k, v]) => {
      if (v && v !== 'All') cleanParams.set(k, v);
    });
    setSearchParams(cleanParams);
  };

  const pageTitle = filters.make ? `${filters.make} Marketplace` : "Car Marketplace";
  const gridClass = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4";

  return (
    <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-10">
        <aside className="w-full lg:w-72 flex-shrink-0">
          <FilterSidebar 
            activePage="marketplace" 
            onFilterChange={handleFilterChange}
            currentFilters={filters}
          />
        </aside>
        
        <div className="flex-grow space-y-12">
          <div className="mb-8">
            <h1 className="text-[25px] font-black text-slate-900 tracking-tighter leading-none mb-4">
              {pageTitle}
            </h1>
            <p className="text-slate-500 font-medium text-[15px]">
              {totalItems.toLocaleString()} vehicles currently available nationwide.
            </p>
          </div>

          {loading ? (
            <div className={gridClass}>
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-64 bg-white rounded-2xl border border-slate-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {sections.featured.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Featured Listings</h2>
                    <div className="h-px flex-grow bg-slate-100"></div>
                  </div>
                  <div className={gridClass}>
                    {sections.featured.map(car => <CarCard key={car.id} car={car} />)}
                  </div>
                </section>
              )}
              
              {sections.dealerAds.map((group, idx) => (
                <section key={idx} className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 overflow-hidden border border-slate-100">
                      {group.dealer.logo_url || group.dealer.avatar_url ? (
                        <img src={group.dealer.logo_url || group.dealer.avatar_url || ''} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#237837]">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-[13px] font-black text-slate-900 tracking-tight">{group.dealer.business_name || group.dealer.full_name}</h3>
                      <p className="text-[9px] font-black text-[#237837] uppercase tracking-widest mt-0.5">Showroom</p>
                    </div>
                  </div>
                  <div className={gridClass}>
                    {group.cars.map(car => <CarCard key={car.id} car={car} />)}
                  </div>
                </section>
              ))}

              {sections.free.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Market Results</h2>
                    <div className="h-px flex-grow bg-slate-100"></div>
                  </div>
                  <div className={gridClass}>
                    {sections.free.map(car => <CarCard key={car.id} car={car} />)}
                  </div>
                </section>
              )}

              {allCars.length === 0 && (
                <div className="py-24 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                  <h3 className="text-[25px] font-black text-slate-900 mb-2">No vehicles found</h3>
                  <p className="text-slate-500 mb-8">Try adjusting your filters to broaden your search results.</p>
                  <button onClick={() => setSearchParams({})} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#237837] transition-all">Reset All Filters</button>
                </div>
              )}

              <Pagination 
                currentPage={currentPage} 
                pageSize={ITEMS_PER_PAGE} 
                totalItems={totalItems} 
                onPageChange={setCurrentPage} 
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
};
