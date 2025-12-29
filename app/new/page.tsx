
import React from 'react';
import { NewCarsListings } from '../../components/NewCarsListings';
import { Hero } from '../../components/Hero';
import { SearchBar } from '../../components/SearchBar';

export default function NewCarsPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <Hero />
      <SearchBar activePage="new" />
      <NewCarsListings onCarSelect={() => {}} />
    </div>
  );
}
