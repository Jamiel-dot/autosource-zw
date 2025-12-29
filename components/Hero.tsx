
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';

const SLIDES = [
  {
    id: 1,
    title: "Toyota Fortuner",
    subtitle: "Exceptional reliability for Zimbabwe. Available for immediate delivery nationwide.",
    trending: "Trending Now",
    image: "https://informair.co.za/imgs/sportfortuner.png",
    
    position: "object-center",
    ctas: [
      { label: "Sell a Car", path: "https://dashboard.autosource.co.zw" },
    ]
  },
  {
    id: 2,
    title: "A Market place for everyone",
    subtitle: "Buy, sell, and discover vehicles that fit every lifestyle and budget",
    trending: "Premium Choice",
    image: "https://autosource.co.zw//imgs/6.jpg",
    
    position: "object-[center_right]",
    ctas: [
      { label: "Market Place", path: "https://autosource.co.zw/marketplace" },

     
      
    ]
  },
  {
    id: 3,
    title: "Raytrents Car rental",
    subtitle: "Reliable, fuel-efficient cars for hassle-free travel around Harare.",
    trending: "Fuel Efficient",
    image: "https://autosource.co.zw/imgs/4.jpg",
    
    position: "object-center",
    ctas: [
     { label: "Rent a Car", path: "https://www.raytrentscarrental.com" },
      
      
    ]
  }
];

export const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000); // Rotate every 6 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-white pt-6 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[32px] overflow-hidden h-[400px] flex items-center shadow-xl border border-slate-100 bg-slate-900">
          
          {/* Slides Container */}
          {SLIDES.map((slide, index) => (
            <div 
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out flex items-center p-8 lg:px-16 ${
                index === currentSlide ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'
              }`}
            >
              {/* Background Image */}
              <img 
                src={slide.image} 
                alt={slide.title}
                className={`absolute inset-0 w-full h-full object-cover ${slide.position} transition-transform duration-[6000ms] ease-linear ${
                  index === currentSlide ? 'scale-110' : 'scale-100'
                }`}
              />
              
              {/* Sophisticated Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />
              <div className="absolute inset-0 bg-black/10" />

              {/* Content Block */}
              <div className={`relative z-10 w-full lg:w-3/4 space-y-5 transition-all duration-1000 transform ${
                index === currentSlide ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
              }`}>
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-1">
                    <span className="w-1.5 h-1.5 bg-[#237837] rounded-full animate-pulse"></span>
                    <span className="text-white text-[10px] font-black uppercase tracking-widest">{slide.trending}</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[0.85] drop-shadow-2xl">
                    {slide.title.split(' ')[0]} <br />
                    <span className="text-white/70">{slide.title.split(' ').slice(1).join(' ')}</span>
                  </h1>
                  <p className="text-base md:text-xl font-medium text-white/80 max-w-md leading-relaxed tracking-tight">
                    {slide.subtitle}
                  </p>
                </div>
                
                {/* 3 Unique CTA Buttons per Slide */}
                <div className="flex flex-wrap items-center gap-3 pt-4">
                  {slide.ctas.map((cta, ctaIdx) => (
                    <Link key={ctaIdx} to={cta.path} className="inline-block">
                      <Button 
                        variant={ctaIdx === 0 ? "primary" : "secondary"}
                        size="md" 
                        className={`rounded-2xl px-6 h-14 border-none shadow-xl transition-all duration-500 text-[11px] font-black uppercase tracking-widest group ${
                          ctaIdx === 0 
                            ? "bg-white text-[#237837] hover:bg-[#237837] hover:text-white shadow-black/40" 
                            : "bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-slate-900 border border-white/20"
                        }`}
                      >
                        {cta.label}
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Artistic Accent Text */}
              <div className="absolute bottom-12 right-16 hidden xl:flex flex-col items-end pointer-events-none">
                 <p className="text-white/10 text-[100px] font-black leading-none select-none italic tracking-tighter uppercase">{slide.accent}</p>
              </div>
            </div>
          ))}

          {/* Slide Indicators (Dots) */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
            {SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-700 rounded-full h-1.5 ${
                  index === currentSlide 
                    ? 'w-12 bg-white shadow-lg' 
                    : 'w-3 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
