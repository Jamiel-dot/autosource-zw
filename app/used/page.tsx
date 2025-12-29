
import React from 'react';
import { UsedCarsListings } from '../../components/UsedCarsListings';
import { Hero } from '../../components/Hero';
import { SearchBar } from '../../components/SearchBar';

export default function UsedCarsPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <Hero />
      <SearchBar activePage="used" />
      <UsedCarsListings onCarSelect={() => {}} />
    </div>
  );
}
