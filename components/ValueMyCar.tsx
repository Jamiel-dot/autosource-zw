
import React, { useState } from 'react';
import { Button } from './Button';
import { ValuationModal } from './ValuationModal';

export const ValueMyCar: React.FC<{ onNavigate: (pageId: string) => void }> = ({ onNavigate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative min-h-[700px] flex items-center justify-center py-16 px-4 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=2000" 
            alt="Silver Toyota Fortuner" 
            className="w-full h-full object-cover scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 to-slate-900/95" />
        
        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left text-white space-y-8">
             <div className="inline-flex items-center gap-2 bg-[#237837] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                Precision Valuation Engine
             </div>
             <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85]">Sell your car <br /> for <span className="text-[#237837]">maximum value.</span></h1>
             <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed max-w-lg tracking-tight">
               Zimbabwe's most accurate valuation tool. We analyze ZIMRA duty metrics, brand reliability, and live local inventory.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
               <Button size="lg" className="rounded-3xl h-18 px-12 shadow-2xl shadow-[#237837]/30" onClick={() => setIsModalOpen(true)}>
                 Get Instant Valuation
               </Button>
               <Button variant="ghost" className="text-white hover:bg-white/5 rounded-3xl h-18 px-8 font-black uppercase tracking-widest text-xs" onClick={() => onNavigate('home')}>
                 Browse Market First
               </Button>
             </div>
          </div>
          
          <div className="flex-1 w-full max-w-md hidden lg:block">
             <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[48px] p-10 space-y-8">
                <div className="space-y-2">
                   <h3 className="text-white font-black text-xl tracking-tight">Real-Time Accuracy</h3>
                   <p className="text-slate-400 text-sm font-medium">Our system uses dynamic base pricing based on thousands of verified Zimbabwean transactions.</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                   {[
                     "ZIMRA Duty Impact Analysis",
                     "Brand Utility Premium Logic",
                     "Conservative Market Anchoring"
                   ].map(tick => (
                     <div key={tick} className="flex items-center gap-3 text-white font-bold text-xs">
                        <div className="w-5 h-5 rounded-full bg-[#237837] flex items-center justify-center">
                           <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        {tick}
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Logic Explained Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Base Market Median", text: "We anchor estimates to actual median prices from our database, ensuring your price isn't an 'outlier'." },
              { title: "Mileage & Condition", text: "Precise adjustments for wear-and-tear based on Zimbabwean road and climate conditions." },
              { title: "Import Logistics", text: "Adjustments for 'On-The-Ground' vehicles versus prospective import costs." }
            ].map((card, i) => (
              <div key={i} className="space-y-4 p-10 bg-slate-50 rounded-[40px] hover:bg-white hover:shadow-xl transition-all duration-500 border border-transparent hover:border-slate-100">
                <div className="w-12 h-12 bg-[#237837]/10 rounded-2xl flex items-center justify-center text-[#237837] text-xl font-black">{i+1}</div>
                <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase">{card.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ValuationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
