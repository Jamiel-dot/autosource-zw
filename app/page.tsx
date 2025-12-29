
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { SearchBar } from '../components/SearchBar';
import { BodyTypeGrid } from '../components/BodyTypeGrid';
import { DiscoverMore } from '../components/DiscoverMore';
import { FeaturedGrid } from '../components/FeaturedGrid';
import { ReserveOnline } from '../components/ReserveOnline';
import { CarValuation } from '../components/CarValuation';
import { ListingProcess } from '../components/ListingProcess';
import { PricingPlans } from '../components/PricingPlans';
import { BrandLogos } from '../components/BrandLogos';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="animate-in fade-in duration-700">
      <Hero />
      <SearchBar />
      <BodyTypeGrid onSelectType={(type) => {
        const bodyType = type.replace('type-', '');
        navigate(`/marketplace?bodyType=${bodyType}`);
      }} />
      
      {/* Promoted Listings Section moved here as requested */}
      <FeaturedGrid />

      <DiscoverMore onNavigate={(path) => navigate(`/${path}`)} />
      <ReserveOnline onViewWishlist={() => navigate('/wishlist')} />
      <CarValuation onHowItWorks={() => navigate('/value')} />
      <ListingProcess />
      <PricingPlans />
      <BrandLogos onBrandSelect={(brand) => {
        navigate(`/marketplace?make=${brand}`);
      }} />
    </div>
  );
}
