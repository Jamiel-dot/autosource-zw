
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CarCard } from './CarCard';
import { Car } from '../types';
import { FilterSidebar } from './FilterSidebar';
import { AdvancedFilters } from './Marketplace';
import { Pagination } from './Pagination';

interface NewCarsListingsProps {
  onCarSelect: (id: string) => void;
  initialFilters?: Partial<AdvancedFilters>;
}

const ITEMS_PER_PAGE = 36;

export const NewCarsListings: React.FC<NewCarsListingsProps> = ({ onCarSelect, initialFilters }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  const filters: AdvancedFilters = {
    make: searchParams.get('make') || initialFilters?.make || '',
    model: searchParams.get('model') || initialFilters?.model || '',
    location: searchParams.get('location') || initialFilters?.location || '',
    bodyType: searchParams.get('bodyType') || initialFilters?.bodyType || '',
    minPrice: searchParams.get('minPrice') || initialFilters?.minPrice || '',
    maxPrice: searchParams.get('maxPrice') || initialFilters?.maxPrice || '',
    yearFrom: searchParams.get('yearFrom') || initialFilters?.yearFrom || '',
    yearTo: searchParams.get('yearTo') || initialFilters?.yearTo || '',
    condition: 'New'
  };

  const fetchNewCars = async (page: number) => {
    setLoading(true);
    try {
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from('listings')
        .select('*, profiles(avatar_url, business_name, full_name, is_dealer, business_address, logo_url)', { count: 'exact' })
        .eq('condition', 'New')
        .eq('status', 'approved');

      if (filters.make) query = query.eq('make', filters.make);
      if (filters.model) query = query.eq('model', filters.model);
      if (filters.location) query = query.eq('location_city', filters.location);
      if (filters.bodyType) query = query.eq('body_type', filters.bodyType);
      if (filters.minPrice) query = query.gte('price', parseFloat(filters.minPrice));
      if (filters.maxPrice) query = query.lte('price', parseFloat(filters.maxPrice));
      if (filters.yearFrom) query = query.gte('year', parseInt(filters.yearFrom));
      if (filters.yearTo) query = query.lte('year', parseInt(filters.yearTo));

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (!error && data) {
        setCars(data as any as Car[]);
        setTotalItems(count || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    setCurrentPage(1);
    fetchNewCars(1); 
  }, [searchParams]);

  const handleFilterChange = (f: Partial<AdvancedFilters>) => {
    const updated = { ...filters, ...f };
    const cleanParams = new URLSearchParams();
    Object.entries(updated).forEach(([k, v]) => {
      if (v && v !== 'All') cleanParams.set(k, v);
    });
    setSearchParams(cleanParams);
  };

  const pageTitle = filters.make ? `${filters.make} New Cars` : "New Cars";
  const gridClass = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4";

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-10">
        <aside className="w-full lg:w-72 flex-shrink-0">
          <FilterSidebar 
            activePage="new" 
            onFilterChange={handleFilterChange}
            currentFilters={filters}
          />
        </aside>
        <div className="flex-grow">
          <div className="mb-10">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-2">{pageTitle}</h1>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Brand new inventory from ZW Dealers</p>
          </div>
          {loading ? (
            <div className={gridClass}>
              {[...Array(6)].map((_, i) => <div key={i} className="h-64 bg-white rounded-2xl border border-slate-100 animate-pulse" />)}
            </div>
          ) : cars.length > 0 ? (
            <>
              <div className={gridClass}>
                {cars.map(car => <CarCard key={car.id} car={car} onSelect={onCarSelect} />)}
              </div>
              <Pagination 
                currentPage={currentPage}
                pageSize={ITEMS_PER_PAGE}
                totalItems={totalItems}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <div className="py-24 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-100">
              <p className="text-slate-500 font-bold italic">No new vehicles matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
