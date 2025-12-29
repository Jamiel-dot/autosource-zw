
import React from 'react';
import { MOCK_CARS } from '../constants';
import { CarCard } from './CarCard';
import { Button } from './Button';

export const CarLeasing: React.FC = () => {
  // Fixed: 'type' is now part of the Car interface in types.ts
  const leaseCars = MOCK_CARS.filter(car => car.type === 'Lease');

  const features = [
    { title: "Free 30-day returns*", desc: "Peace of mind guaranteed on every lease agreement." },
    { title: "Road tax included", desc: "One less thing for you to worry about throughout the term." },
    { title: "Free delivery to your door**", desc: "We bring your new car straight to your driveway." },
    { title: "No admin fees", desc: "Transparent pricing with zero hidden costs or setup fees." }
  ];

  return (
    <div className="w-full animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           <img 
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxury car background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#237837] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              Raytrents Car Rental Partnership
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
              Premium Car <span className="text-[#237837]">Leasing</span>
            </h1>
            <p className="text-xl text-slate-300 font-medium leading-relaxed">
              Drive the latest luxury models with flexible monthly payments, all-inclusive road tax, and free delivery across Zimbabwe.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
               <Button size="lg" className="rounded-2xl px-10 h-16 shadow-2xl shadow-[#237837]/30">Explore Lease Deals</Button>
               <div className="flex items-center gap-3 px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                 <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                   </svg>
                 </div>
                 <div>
                   <p className="text-[10px] font-black uppercase text-slate-400">Lease Hotline</p>
                   <p className="font-bold">0788832950</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="flex gap-4 items-start p-6 bg-slate-50 rounded-[32px] hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 border border-transparent hover:border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-[#237837]/10 flex items-center justify-center text-[#237837] shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm mb-1">{f.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Listings Section */}
      <section className="py-24 bg-[#fcfcfc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-slate-900">Latest Lease Offers</h2>
              <p className="text-slate-500 font-medium">Top-tier vehicles from Raytrents Car Rental.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span className="text-slate-900">45+</span> Active Enquiries
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {leaseCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
            {/* Repeat for visual balance in demo */}
            {leaseCars.map(car => (
              <CarCard key={car.id + '-clone'} car={{...car, id: car.id + '-clone'}} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-[#237837] rounded-[48px] p-10 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-[#237837]/40">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            
            <h2 className="text-4xl md:text-5xl font-black mb-8 relative z-10">Ready to lease?</h2>
            <p className="text-xl text-white/80 mb-12 relative z-10 font-medium">Our specialists are standing by to build your custom deal.</p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 relative z-10">
              <a 
                href="tel:0788832950"
                className="group flex items-center gap-4 bg-white text-slate-900 px-10 py-5 rounded-3xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10"
              >
                <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-[#237837] group-hover:bg-[#237837] group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                0788832950
              </a>
              <a 
                href="https://wa.me/447467291554"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 bg-[#25D366] text-white px-10 py-5 rounded-3xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#25D366]/30"
              >
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.035c0 2.123.554 4.197 1.606 6.034L0 24l6.135-1.61a11.893 11.893 0 005.915 1.648h.005c6.635 0 12.032-5.396 12.035-12.035a11.778 11.778 0 00-3.411-8.528" />
                  </svg>
                </div>
                Whatsapp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
