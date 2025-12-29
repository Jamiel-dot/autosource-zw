
import React from 'react';
import { Button } from './Button';
import { DASHBOARD_URL } from '../constants';

const CheckIcon = () => (
  <svg className="w-5 h-5 text-[#237837] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

export const PricingPlans: React.FC = () => {
  const plans = [
    {
      id: 'b61e607d-0cda-4957-baee-5641b669c3e7',
      name: 'STANDARD FREE',
      price: '0',
      subtitle: 'DEFAULT',
      description: 'Baseline platform access. This is your automatic fallback plan when premium cycles end.',
      features: [
        'UP TO 5 STANDARD PHOTOS',
        'STANDARD AUDIT SPEED',
        '7-DAY LISTING DURATION',
        'SELF-SERVICE MANAGEMENT'
      ],
      buttonText: 'INCLUDED FALLBACK',
      isActive: false,
      isHighlighted: false
    },
    {
      id: 'a6fcf924-b8fd-483d-870a-64f74703c5ec',
      name: 'FEATURED PLUS',
      price: '10',
      subtitle: 'PER 30 DAYS',
      tag: 'ACTIVE TIER',
      description: 'Enhanced visibility for serious sellers. Higher search placement for a 30-day visibility cycle.',
      features: [
        'PRIORITY IN SEARCH RESULTS',
        'VERIFICATION BADGE',
        'UNLIMITED GALLERY PHOTOS',
        'FEATURED TAG FOR 30 DAYS'
      ],
      buttonText: 'Activate Featured',
      isActive: true, // Enabled as requested
      isHighlighted: true
    },
    {
      id: 'b95e8710-de19-4579-a4ad-f05e5ce72c0d',
      name: 'ADVERTISING / DEALER',
      price: '50',
      subtitle: 'PER 30 DAYS',
      description: 'Maximum exposure for merchant inventories. Bulk featured status across all units.',
      features: [
        'ALL INVENTORY FEATURED',
        'DEALER PROFILE BRANDING',
        'DIRECT SUPPORT CHANNEL',
        'BULK EXPORT TOOLS'
      ],
      buttonText: 'ACTIVATE ADVERTISING / DEALER',
      isActive: true,
      isHighlighted: false
    }
  ];

  const handleAction = () => {
    window.open(`${DASHBOARD_URL}`, '_blank');
  };

  return (
    <section className="py-24 bg-[#fcfcfc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Selling Plans</h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">Choose the right exposure level to sell your vehicle faster in the Zimbabwean market.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative flex flex-col bg-white rounded-[48px] p-10 shadow-2xl transition-all duration-500 hover:translate-y-[-8px] ${
                plan.isHighlighted ? 'border-2 border-[#237837] scale-[1.02]' : 'border border-slate-100'
              }`}
            >
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-3">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight w-2/3">
                    {plan.name}
                  </h3>
                  {plan.tag && (
                    <span className="inline-block bg-[#237837]/5 text-[#237837] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-[#237837]/10">
                      {plan.tag}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end text-[#237837]">
                    <span className="text-4xl font-black tracking-tighter">${plan.price}</span>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    {plan.subtitle}
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10">
                {plan.description}
              </p>

              <ul className="space-y-6 mb-12 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <CheckIcon />
                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest leading-none">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <button
                  onClick={handleAction}
                  disabled={!plan.isActive}
                  className={`w-full py-5 rounded-[24px] text-[12px] font-black uppercase tracking-[0.1em] transition-all duration-300 shadow-xl ${
                    plan.isActive 
                      ? 'bg-[#237837] text-white hover:bg-slate-900 hover:shadow-[#237837]/20 cursor-pointer' 
                      : 'bg-slate-50 text-slate-300 cursor-default'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
