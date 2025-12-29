
import React, { useState } from 'react';
import { Button } from './Button';
import { ValuationModal } from './ValuationModal';

interface CarValuationProps {
  onHowItWorks: () => void;
}

export const CarValuation: React.FC<CarValuationProps> = ({ onHowItWorks }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-24 bg-emerald-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[40px] shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-100">
          <div className="p-10 md:p-16 flex-1 space-y-6 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-[#237837]/10 text-[#237837] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 self-start">
               Free Market Report
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">What's your car worth?</h2>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              Get a free, instant car valuation in seconds. Based on real-time market data to ensure you get the best price in Zimbabwe.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="rounded-2xl shadow-xl shadow-[#237837]/20 px-12 h-16"
                onClick={() => setIsModalOpen(true)}
              >
                Value your car
              </Button>
              <Button 
                variant="ghost" 
                size="lg" 
                className="rounded-2xl h-16 px-10 text-slate-400 hover:text-[#237837] hover:bg-[#237837]/5"
                onClick={onHowItWorks}
              >
                How it works
              </Button>
            </div>
          </div>
          <div className="flex-1 h-80 md:h-auto relative overflow-hidden group">
            <img 
              src="https://informair.co.za/imgs/women.jpg" 
              alt="Luxury car valuation"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-transparent" />
          </div>
        </div>
      </div>

      <ValuationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};
