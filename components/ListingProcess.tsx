
import React from 'react';
import { Button } from './Button';
import { DASHBOARD_URL } from '../constants';

const Icons = {
  Identity: () => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Technical: () => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Pricing: () => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Gallery: () => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
};

export const ListingProcess: React.FC = () => {
  const steps = [
    {
      title: 'Vehicle Identity',
      icon: <Icons.Identity />,
      desc: 'Tell us the basics: Make, Model, Year, and Body Type to establish your listing foundation.'
    },
    {
      title: 'Technical Specs',
      icon: <Icons.Technical />,
      desc: 'Specify the heart of the car: Mileage, Transmission, Fuel Type, and Engine details.'
    },
    {
      title: 'Condition & Price',
      icon: <Icons.Pricing />,
      desc: 'Set your asking price in USD and provide an honest assessment of the vehicle condition.'
    },
    {
      title: 'Visuals & Location',
      icon: <Icons.Gallery />,
      desc: 'Upload stunning high-res photos and set your location (City/Address) for buyers to find you.'
    }
  ];

  const goToListing = () => {
    window.open(`${DASHBOARD_URL}/listings/new`, '_blank');
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#237837]/10 text-[#237837] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
            Simple & Fast
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">How to List Your Car</h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Join thousands of sellers in Zimbabwe. Our step-by-step process ensures your listing is professional and ready to sell.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-16 left-0 w-full h-0.5 bg-slate-100 -z-10"></div>
          
          {steps.map((step, idx) => (
            <div key={idx} className="group flex flex-col items-center text-center space-y-6">
              <div className="relative w-24 h-24 rounded-[32px] bg-white border-2 border-slate-100 flex items-center justify-center text-[#237837] shadow-xl group-hover:bg-[#237837] group-hover:text-white group-hover:border-[#237837] transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-[#237837]/20">
                {step.icon}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black shadow-lg">
                  {idx + 1}
                </div>
              </div>
              <div className="space-y-3 px-4">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight group-hover:text-[#237837] transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Button 
            onClick={goToListing}
            variant="primary" 
            size="lg" 
            className="rounded-[24px] px-12 h-18 text-lg shadow-2xl shadow-[#237837]/30"
          >
            Start Your Listing Now
            <svg className="w-5 h-5 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Button>
          <p className="mt-6 text-slate-400 text-sm font-bold uppercase tracking-widest">Takes less than 5 minutes</p>
        </div>
      </div>
    </section>
  );
};
