
import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SocialRow } from '../components/SocialRow';
import { CookieConsent } from '../components/CookieConsent';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col w-full overflow-x-hidden">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <SocialRow />
      <Footer />
      <CookieConsent />
    </div>
  );
}
