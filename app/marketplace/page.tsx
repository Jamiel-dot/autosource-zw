
import React from 'react';
import { Marketplace } from '../../components/Marketplace';
import { Hero } from '../../components/Hero';
import { SearchBar } from '../../components/SearchBar';

export default function MarketplacePage() {
  return (
    <div className="animate-in fade-in duration-500">
      <Hero />
      <SearchBar activePage="marketplace" />
      <Marketplace />
    </div>
  );
}
