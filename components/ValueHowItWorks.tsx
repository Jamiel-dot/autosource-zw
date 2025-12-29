
import React, { useState } from 'react';
import { Button } from './Button';

export const ValueHowItWorks: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const steps = [
    {
      title: 'Real-Time Market Data',
      desc: 'Our AI analyzes over 15,000 live listings in Zimbabwe to determine the current base market value for your specific make and model.',
      icon: '📊'
    },
    {
      title: 'Mileage Precision',
      desc: 'We use a benchmark of 17,500km per year. Low mileage adds premium value, while high mileage is adjusted fairly.',
      icon: '🚗'
    },
    {
      title: 'Condition Multiplier',
      desc: 'From Excellent to Poor, we apply rigorous percentage multipliers to reflect how well your car has been cared for.',
      icon: '✨'
    },
    {
      title: 'Feature Boost',
      desc: 'Premium options like sunroofs, leather interiors, and navigation systems add up to 10% extra to your final valuation.',
      icon: '💎'
    }
  ];

  const faqs = [
    {
      q: 'How do you handle the "Toyota Factor" in Zimbabwe?',
      a: 'In Zimbabwe, Toyota vehicles historically retain up to 15% more value than competitors. Our algorithm automatically applies a "Reliability Multiplier" for Toyota models to reflect local market strength.'
    },
    {
      q: 'What is the standard mileage average?',
      a: 'We assume an average usage of 15,000 to 20,000 km per year. If your car has done 50,000km in 5 years, it is considered "Low Mileage" and will receive a value boost.'
    },
    {
      q: 'Is the condition boost fixed?',
      a: 'No. An "Excellent" condition car can gain up to 12% in value, whereas "Poor" condition (needing major work) can see a deduction of up to 25% from the base market price.'
    },
    {
      q: 'Why diesel vehicles often worth more?',
      a: 'Due to fuel efficiency and engine longevity preferred by Zimbabwean buyers for long-distance travel, diesel engines often command a 3-6% price premium.'
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-32">
      {/* Hero Header */}
      <section className="bg-slate-950 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#237837]/20 to-transparent opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <button 
            onClick={onBack}
            className="text-[#237837] font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-8 hover:-translate-x-1 transition-transform"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Home
          </button>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
            Our Valuation <br /> <span className="text-[#237837]">Logic</span>
          </h1>
          <p className="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed">
            We don't just guess. We use a data-driven approach tailored specifically for the Zimbabwean automotive landscape.
          </p>
        </div>
      </section>

      {/* The Process */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="group p-10 bg-slate-50 rounded-[40px] hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 border border-transparent hover:border-slate-100">
              <div className="text-5xl mb-8 group-hover:scale-110 transition-transform inline-block">
                {step.icon}
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4">{step.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-50 rounded-[60px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="lg:w-1/3 space-y-6">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Technical FAQs</h2>
            <p className="text-slate-500 font-medium leading-relaxed">Understanding the variables that influence your final price range.</p>
            <Button size="lg" className="rounded-2xl" onClick={onBack}>Get Your Report</Button>
          </div>
          <div className="lg:w-2/3 space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className="bg-white rounded-[32px] overflow-hidden border border-slate-100 transition-all"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="text-lg font-black text-slate-900">{faq.q}</span>
                  <div className={`w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center transition-transform duration-300 ${openFaq === i ? 'rotate-180 bg-[#237837]/10 text-[#237837]' : 'text-slate-400'}`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-64' : 'max-h-0'}`}>
                  <div className="px-8 pb-8 text-slate-500 font-medium leading-relaxed">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
