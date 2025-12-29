
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';

interface ReserveOnlineProps {
  onViewWishlist: () => void;
}

export const ReserveOnline: React.FC<ReserveOnlineProps> = ({ onViewWishlist }) => {
  const navigate = useNavigate();
  const steps = [
    {
      num: '1',
      title: 'Find your fit',
      desc: 'Browse hundreds of verified listings from trusted dealers in Harare, Bulawayo, and across ZW.'
    },
    {
      num: '2',
      title: 'Physical Inspection',
      desc: 'Connect with sellers to arrange a viewing and professional inspection for total peace of mind.'
    },
    {
      num: '3',
      title: 'Secure the deal',
      desc: 'Save your favorites and move quickly to secure the car before someone else does.'
    }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 w-full lg:w-1/2 relative group">
            <div className="absolute -inset-4 bg-[#237837]/5 rounded-[48px] scale-95 group-hover:scale-100 transition-transform duration-700"></div>
            <img 
              src="https://informair.co.za/imgs/niss.jpg" 
              alt="Securing a car in Zimbabwe"
              className="relative w-full h-[500px] object-cover rounded-[40px] shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
            />
            {/* Trust Badge Overlay */}
            <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#237837] rounded-full flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 leading-none">Verified</p>
                <p className="text-sm font-black text-slate-900">100% Secure ZW</p>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#237837]/10 text-[#237837] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                Safe & Professional
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tighter">
                Secure Your Car in <span className="text-[#237837]">Zimbabwe</span>
              </h2>
              <p className="text-lg text-slate-600 font-medium leading-relaxed">
                The easiest way to buy a car in Zimbabwe. Safe, secure, and built specifically for the local market.
              </p>
            </div>
            <div className="space-y-8">
              {steps.map((step) => (
                <div key={step.num} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-slate-100 text-[#237837] rounded-2xl flex items-center justify-center font-black text-xl border border-slate-100">
                    {step.num}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-black text-slate-900">{step.title}</h4>
                    <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <Button 
                variant="primary" 
                size="lg" 
                className="rounded-2xl h-16 px-10 shadow-xl shadow-[#237837]/20"
                onClick={() => navigate('/marketplace')}
              >
                Start Searching
              </Button>
              <Button 
                variant="secondary" 
                size="lg" 
                className="rounded-2xl h-16 px-10 gap-3 border-slate-200 text-slate-600 hover:text-[#237837] group"
                onClick={onViewWishlist}
              >
                <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                View My Wishlist
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
