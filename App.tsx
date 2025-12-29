
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import RootLayout from './app/layout';
import HomePage from './app/page';
import MarketplacePage from './app/marketplace/page';
import NewCarsPage from './app/new/page';
import UsedCarsPage from './app/used/page';
import ValuePage from './app/value/page';
import ContactRoute from './app/contact/page';
import DealersRoute from './app/dealers/page';
import WishlistRoute from './app/wishlist/page';
import CarDetailPage from './app/car/[id]/page';
import { BuyingAdvicePage } from './components/BuyingAdvicePage';
import { ProductsServicesPage } from './components/ProductsServicesPage';
import { PrivacyPolicyPage, TermsOfUsePage, CookiePolicyPage } from './components/LegalPages';

// Utility to reset scroll position on route change
const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<RootLayout children={<Outlet />} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/new" element={<NewCarsPage />} />
          <Route path="/used" element={<UsedCarsPage />} />
          <Route path="/value" element={<ValuePage />} />
          <Route path="/contact" element={<ContactRoute />} />
          <Route path="/dealers" element={<DealersRoute />} />
          <Route path="/wishlist" element={<WishlistRoute />} />
          
          {/* Dynamic Car Details */}
          <Route path="/car/:id" element={<CarDetailPage />} />
          
          {/* Information Routes */}
          <Route path="/buying-advice" element={<BuyingAdvicePage onBack={() => {}} />} />
          <Route path="/products-services" element={<ProductsServicesPage onBack={() => {}} onNavigateToValue={() => {}} />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfUsePage />} />
          <Route path="/cookies" element={<CookiePolicyPage />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
