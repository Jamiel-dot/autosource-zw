
import React, { useState, useEffect } from 'react';
import { Button } from './Button';

export type ProductsTab = 'Sell your car' | 'Vehicle check' | 'Contact Us' | 'Car insurance' | 'Gap insurance';

interface ProductsServicesPageProps {
  initialTab?: ProductsTab;
  onBack: () => void;
  onNavigateToValue: () => void;
}

const Icons = {
  Sell: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Contact: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
    </svg>
  ),
  Insurance: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Gap: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  )
};

export const ProductsServicesPage: React.FC<ProductsServicesPageProps> = ({ initialTab = 'Sell your car', onBack, onNavigateToValue }) => {
  const [activeTab, setActiveTab] = useState<ProductsTab>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'Sell your car':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <section className="space-y-4">
              <h3 className="text-2xl font-black text-slate-900">Reach Thousands of Buyers Instantly</h3>
              <p className="text-slate-600 leading-relaxed">
                Listing your vehicle on AutoSource ZW gives you immediate exposure to Zimbabwe's largest community of verified car buyers. Whether you're a private seller or a local dealer, our platform is designed to get your car sold fast.
              </p>
            </section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Free Valuation', desc: 'Get an instant estimate before you list.' },
                { title: 'High Visibility', desc: 'Featured placement for premium ads.' },
                { title: 'Secure Comms', desc: 'Integrated chat to protect your privacy.' }
              ].map((item, i) => (
                <div key={i} className="p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                  <h4 className="font-black text-slate-900 mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
            <Button variant="primary" size="lg" className="rounded-2xl" onClick={onNavigateToValue}>Start Selling Now</Button>
          </div>
        );
      case 'Vehicle check':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <section className="space-y-4">
              <h3 className="text-2xl font-black text-slate-900">Buy with Absolute Confidence</h3>
              <p className="text-slate-600 leading-relaxed">
                Don't take risks with your investment. Our comprehensive vehicle check service verifies the history of any car registered in Zimbabwe or imported from the UK and Japan.
              </p>
            </section>
            <div className="bg-[#237837]/5 p-8 rounded-[32px] border border-[#237837]/10">
              <h4 className="font-black text-[#237837] mb-6 uppercase tracking-widest text-xs">What we verify:</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  'Stolen vehicle check',
                  'Finance agreement status',
                  'Mileage history verification',
                  'Previous accident damage',
                  'ZIMRA duty clearance',
                  'Logbook authenticity'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-sm font-bold text-slate-700">
                    <div className="w-6 h-6 rounded-full bg-[#237837] text-white flex items-center justify-center shrink-0">✓</div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 'Contact Us':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <section className="space-y-4">
              <h3 className="text-2xl font-black text-slate-900">We're Here to Help</h3>
              <p className="text-slate-600 leading-relaxed">
                Whether you're looking for technical support, advertising opportunities, or just have a general question, our team in Harare is standing by.
              </p>
            </section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                    <Icons.Contact />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900">Direct Support</h4>
                    <p className="text-xs text-slate-500">Available Mon - Fri, 8am - 5pm</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-black text-[#237837]">+263 788 832 950</p>
                  <p className="text-slate-500 font-bold">hello@autosource.co.zw</p>
                </div>
              </div>
              <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100">
                <h4 className="font-black text-slate-900 mb-2">Visit Our Office</h4>
                <p className="text-slate-500 font-medium leading-relaxed">
                  123 Samora Machel Ave,<br />
                  Harare, Zimbabwe
                </p>
                <div className="mt-6">
                  <Button variant="outline" size="sm" className="rounded-xl">View on Map</Button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Car insurance':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <section className="space-y-4">
              <h3 className="text-2xl font-black text-slate-900">Comprehensive Protection</h3>
              <p className="text-slate-600 leading-relaxed">
                Protect your asset with Zimbabwe's leading insurance providers. From Third Party Fire & Theft to Full Comprehensive coverage, we help you find the best rates.
              </p>
            </section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 border-2 border-slate-100 rounded-[40px] hover:border-[#237837] transition-all">
                <h4 className="text-xl font-black text-slate-900 mb-2">Full Comprehensive</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Maximum protection including accidental damage, theft, and third-party liabilities.</p>
              </div>
              <div className="p-8 border-2 border-slate-100 rounded-[40px] hover:border-[#237837] transition-all">
                <h4 className="text-xl font-black text-slate-900 mb-2">Third Party Only</h4>
                <p className="text-sm text-slate-500 leading-relaxed">The legal minimum requirement in Zimbabwe, covering damage to others.</p>
              </div>
            </div>
            <div className="bg-slate-900 text-white p-10 rounded-[40px]">
              <h4 className="text-xl font-black mb-4">Partner Providers</h4>
              <p className="text-slate-400 text-sm mb-6">We work with Zimnat, Old Mutual, and Alliance to bring you competitive premiums.</p>
              <Button variant="primary" className="rounded-2xl">Request a Quote</Button>
            </div>
          </div>
        );
      case 'Gap insurance':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <section className="space-y-4">
              <h3 className="text-2xl font-black text-slate-900">Bridge the Value Gap</h3>
              <p className="text-slate-600 leading-relaxed">
                If your vehicle is written off or stolen, standard insurance only pays the current market value. GAP insurance covers the difference between your insurance payout and what you originally paid for the car.
              </p>
            </section>
            <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100">
              <h4 className="font-black text-slate-900 mb-4">Why you need GAP insurance:</h4>
              <div className="space-y-4">
                {[
                  { q: 'New Car Depreciation', a: 'Cars lose value quickly in their first 3 years.' },
                  { q: 'Finance Protection', a: 'Ensure you aren\'t left paying a loan for a car you no longer have.' },
                  { q: 'Peace of Mind', a: 'Walk away with the full original value of your investment.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-1.5 h-1.5 bg-[#237837] rounded-full mt-2 shrink-0"></div>
                    <div>
                      <p className="font-black text-slate-900 text-sm">{item.q}</p>
                      <p className="text-xs text-slate-500">{item.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const tabs: { label: ProductsTab; icon: React.ReactNode }[] = [
    { label: 'Sell your car', icon: <Icons.Sell /> },
    { label: 'Vehicle check', icon: <Icons.Check /> },
    { label: 'Contact Us', icon: <Icons.Contact /> },
    { label: 'Car insurance', icon: <Icons.Insurance /> },
    { label: 'Gap insurance', icon: <Icons.Gap /> }
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] animate-in fade-in duration-500">
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#237837]/20 to-transparent opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center md:text-left">
          <button 
            onClick={onBack}
            className="text-[#237837] font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-8 hover:-translate-x-1 transition-transform mx-auto md:mx-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Home
          </button>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-6">
            Products & <br /> <span className="text-[#237837]">Services</span>
          </h1>
          <p className="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed mx-auto md:mx-0">
            Beyond the marketplace — explore our suite of tools and services designed to simplify car ownership in Zimbabwe.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-96 shrink-0">
            <div className="bg-white rounded-[48px] p-4 shadow-2xl shadow-slate-200/50 border border-slate-100">
              <div className="flex flex-col gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.label}
                    onClick={() => setActiveTab(tab.label)}
                    className={`flex items-center justify-between px-8 py-5 rounded-[32px] font-black text-sm uppercase tracking-tight transition-all duration-300 text-left ${
                      activeTab === tab.label 
                        ? 'bg-[#237837] text-white shadow-xl shadow-[#237837]/30 scale-[1.02]' 
                        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-4">
                       <span className={`transition-colors duration-300 ${activeTab === tab.label ? 'text-white' : 'text-[#237837]'}`}>
                         {tab.icon}
                       </span>
                       {tab.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="flex-grow">
            <div className="bg-white rounded-[64px] p-10 md:p-20 shadow-sm border border-slate-100 min-h-[700px]">
              <div className="flex items-center gap-4 mb-16 pb-12 border-b border-slate-50">
                 <div className="w-14 h-14 rounded-2xl bg-[#237837]/10 flex items-center justify-center text-[#237837]">
                    {tabs.find(t => t.label === activeTab)?.icon}
                 </div>
                 <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                   {activeTab}
                 </h2>
              </div>
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
      <div className="py-24" />
    </div>
  );
};
