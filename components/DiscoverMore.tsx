
import React from 'react';
import { Button } from './Button';
import { DASHBOARD_URL } from '../constants';

interface DiscoverMoreProps {
  onNavigate: (pageId: string) => void;
}

export const DiscoverMore: React.FC<DiscoverMoreProps> = ({ onNavigate }) => {
  const cards = [
    {
      title: 'Leasing Deals',
      desc: 'Get a brand new car for a fixed monthly cost with no long term commitment.',
      image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=800',
      cta: 'View Leasing',
      action: () => window.open('https://raytrentscarrental.com', '_blank')
    },
    {
      title: 'Sell Your Car',
      desc: 'Sell your car for more in as little as 24 hours. Free valuation included.',
      image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=800',
      cta: 'Get Valuation',
      action: () => onNavigate('value')
    },
    {
      title: 'Brand New Cars',
      desc: 'Be the first owner of the latest models from all major manufacturers.',
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800',
      cta: 'Shop New',
      action: () => onNavigate('new')
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-16">Discover More</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, idx) => (
            <div key={idx} className="group flex flex-col bg-slate-50 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="h-56 overflow-hidden">
                <img 
                  src={card.image} 
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-8 flex flex-col flex-grow space-y-4">
                <h3 className="text-2xl font-bold text-slate-900">{card.title}</h3>
                <p className="text-slate-600 leading-relaxed">{card.desc}</p>
                <div className="pt-4 mt-auto">
                  <Button 
                    variant="secondary" 
                    fullWidth 
                    className="rounded-xl"
                    onClick={card.action}
                  >
                    {card.cta}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
