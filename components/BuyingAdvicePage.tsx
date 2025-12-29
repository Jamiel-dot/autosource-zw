
import React, { useState, useEffect } from 'react';
import { Button } from './Button';

export type AdviceTab = 'Used car values' | 'Safety advice' | 'SUV cars' | 'Best family cars' | 'Hatchbacks';

interface BuyingAdvicePageProps {
  initialTab?: AdviceTab;
  onBack: () => void;
}

const Icons = {
  Value: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2" />
    </svg>
  ),
  Safety: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  SUV: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Family: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Hatch: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  )
};

const ADVICE_CONTENT: Record<AdviceTab, { title: string; icon: React.ReactNode; content: React.ReactNode }> = {
  'Used car values': {
    title: 'Precision Valuation Guide',
    icon: <Icons.Value />,
    content: (
      <div className="space-y-10">
        <section className="space-y-4">
          <h3 className="text-2xl font-black text-slate-900">What Drives Value in ZW?</h3>
          <p className="text-slate-600 leading-relaxed">
            In the local market, car valuation is less about age and more about <strong>brand utility</strong> and <strong>parts availability</strong>. A 10-year-old Toyota often commands a higher price than a 5-year-old European luxury sedan due to the lower cost of maintenance and high demand in the resale market.
          </p>
        </section>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100">
            <h4 className="font-black text-slate-900 mb-4 text-lg">The "Grey Market" Factor</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Imported vehicles from Japan and the UK set the baseline for pricing. High import duties (often up to 40-100% of CIF value) mean that cars already registered and "on the ground" in Zimbabwe carry a significant premium.
            </p>
          </div>
          <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100">
            <h4 className="font-black text-slate-900 mb-4 text-lg">Resale Champions</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Toyota Hilux, Ford Ranger, and Honda Fit are the "cash equivalents" of the car world here. They lose value much slower than specialized performance or luxury vehicles.
            </p>
          </div>
        </div>

        <section className="bg-[#237837]/5 p-8 rounded-[32px] border border-[#237837]/10">
          <h4 className="font-black text-[#237837] mb-4">Value Checklist for Buyers:</h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['Suspension condition', 'Ex-Japan vs Ex-UK status', 'Service history stamps', 'Logbook authenticity', 'Current insurance value', 'ZIMRA clearance verification'].map(item => (
              <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-[#237837]" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    )
  },
  'Safety advice': {
    title: 'Safety Standards & Local Risks',
    icon: <Icons.Safety />,
    content: (
      <div className="space-y-10">
        <section className="space-y-4">
          <h3 className="text-2xl font-black text-slate-900">Navigating ZW Road Conditions</h3>
          <p className="text-slate-600 leading-relaxed">
            Safety in Zimbabwe isn't just about crash test ratings; it's about active avoidance. Potholes, livestock, and unlit roads require vehicles with superior lighting, braking, and suspension response.
          </p>
        </section>

        <div className="space-y-6">
          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0">1</div>
            <div>
              <h4 className="font-black text-slate-900 text-lg mb-2">The Night-Driving Rule</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Ensure your vehicle has fog lights or high-intensity LED beams. Unlit hazards like broken-down trucks or pedestrians on highways are a major risk factor.</p>
            </div>
          </div>
          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0">2</div>
            <div>
              <h4 className="font-black text-slate-900 text-lg mb-2">Tyre Safety & Heat</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Our hot climate can cause cheap or old rubber to perish quickly. Always check the DOT date on tyres—anything over 5 years is unsafe, regardless of tread depth.</p>
            </div>
          </div>
          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0">3</div>
            <div>
              <h4 className="font-black text-slate-900 text-lg mb-2">Braking & ABS</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Anti-lock Braking Systems (ABS) are essential for stopping on gravel-shouldered roads without losing control. Never bypass ABS sensors during repairs.</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  'SUV cars': {
    title: 'The Comprehensive SUV Comparison',
    icon: <Icons.SUV />,
    content: (
      <div className="space-y-10">
        <section className="space-y-4">
          <h3 className="text-2xl font-black text-slate-900">Why the SUV Rules Zimbabwe</h3>
          <p className="text-slate-600 leading-relaxed">
            Ground clearance is the single most important metric for most buyers. Whether you're navigating suburban Harare or traveling to Nyanga, an SUV provides the durability needed for uneven terrain.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-8 border-2 border-slate-100 rounded-[40px] hover:border-[#237837] transition-colors group">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#237837] group-hover:text-white transition-all">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-2">Crossovers (Soft-Roaders)</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Ideal for city life. Models like the Honda CR-V or Toyota RAV4 offer comfort and efficiency with enough height to clear urban potholes.</p>
          </div>
          <div className="p-8 border-2 border-slate-100 rounded-[40px] hover:border-[#237837] transition-colors group">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#237837] group-hover:text-white transition-all">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-2">Full-Size 4x4s</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Built for the long haul. Toyota Fortuner and Land Cruiser Prado offer ladder-frame chassis strength for heavy-duty bush travel and towing.</p>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-10 rounded-[40px]">
           <h4 className="text-xl font-black mb-6">Expert Verdict</h4>
           <p className="text-slate-400 text-sm leading-relaxed mb-6">
             If your driving is 90% city, choose a Crossover to save on fuel and tires. If you frequently visit rural areas or farms, a ladder-frame SUV is non-negotiable for longevity.
           </p>
           <div className="flex flex-wrap gap-4">
              <span className="px-4 py-2 bg-white/10 rounded-xl text-xs font-bold">Better Resale</span>
              <span className="px-4 py-2 bg-white/10 rounded-xl text-xs font-bold">Pothole-Ready</span>
              <span className="px-4 py-2 bg-white/10 rounded-xl text-xs font-bold">Higher Towing Capacity</span>
           </div>
        </div>
      </div>
    )
  },
  'Best family cars': {
    title: 'Family Mobility & Safety',
    icon: <Icons.Family />,
    content: (
      <div className="space-y-10">
        <section className="space-y-4">
          <h3 className="text-2xl font-black text-slate-900">Selecting for the "Big Family"</h3>
          <p className="text-slate-600 leading-relaxed">
            In Zimbabwe, family cars often need to carry 5-7 people plus luggage. We evaluate cars based on <strong>ISOFIX points</strong>, <strong>rear air conditioning</strong>, and <strong>fuel economy</strong>.
          </p>
        </section>

        <div className="space-y-4">
          {[
            { cat: 'Best 7-Seater', model: 'Toyota Alphard / Vellfire', perk: 'Unmatched Cabin Luxury' },
            { cat: 'Best Value SUV', model: 'Suzuki Ertiga / XL6', perk: 'Low Running Costs' },
            { cat: 'Best Work/Life Balance', model: 'Ford Ranger Double Cab', perk: 'Utility Meets Family' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 gap-4">
              <div>
                <span className="text-[10px] font-black uppercase text-[#237837] tracking-widest">{item.cat}</span>
                <h4 className="text-xl font-black text-slate-900">{item.model}</h4>
              </div>
              <div className="px-6 py-2 bg-white rounded-2xl shadow-sm text-sm font-bold text-slate-500 border border-slate-50">
                {item.perk}
              </div>
            </div>
          ))}
        </div>

        <section className="space-y-4">
          <h4 className="text-lg font-black text-slate-900">Key Features to Look For:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 bg-white border border-slate-100 rounded-3xl">
              <h5 className="font-bold text-slate-900 mb-2">Rear Vents</h5>
              <p className="text-xs text-slate-500 leading-relaxed">Crucial for keeping kids cool during the October-November heatwaves.</p>
            </div>
            <div className="p-6 bg-white border border-slate-100 rounded-3xl">
              <h5 className="font-bold text-slate-900 mb-2">Service Network</h5>
              <p className="text-xs text-slate-500 leading-relaxed">Avoid niche European brands for families; parts need to be available in every major city.</p>
            </div>
          </div>
        </section>
      </div>
    )
  },
  'Hatchbacks': {
    title: 'Efficient City Commuters',
    icon: <Icons.Hatch />,
    content: (
      <div className="space-y-10">
        <section className="space-y-4">
          <h3 className="text-2xl font-black text-slate-900">The Rise of the Urban Hatch</h3>
          <p className="text-slate-600 leading-relaxed">
            As fuel prices fluctuate, the hatchback has become the king of the Zimbabwean commute. Agile, easy to park in crowded CBDs, and incredibly fuel-efficient.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-8 bg-slate-50 rounded-[40px]">
             <h4 className="text-3xl font-black text-[#237837] mb-2">1</h4>
             <h5 className="font-black text-slate-900 mb-2">Fuel Range</h5>
             <p className="text-xs text-slate-500">Most modern hatches achieve 15-20km per litre.</p>
          </div>
          <div className="text-center p-8 bg-slate-50 rounded-[40px]">
             <h4 className="text-3xl font-black text-[#237837] mb-2">2</h4>
             <h5 className="font-black text-slate-900 mb-2">Resale Value</h5>
             <p className="text-xs text-slate-500">The highest demand segment in Zimbabwe today.</p>
          </div>
          <div className="text-center p-8 bg-slate-50 rounded-[40px]">
             <h4 className="text-3xl font-black text-[#237837] mb-2">3</h4>
             <h5 className="font-black text-slate-900 mb-2">Parts Cost</h5>
             <p className="text-xs text-slate-500">Lowest maintenance costs across all vehicle types.</p>
          </div>
        </div>

        <section className="bg-slate-900 rounded-[40px] p-10 text-white">
          <h4 className="text-xl font-black mb-4">The "Honda Fit" Phenomenon</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            The Honda Fit (specifically the GE6 and GK3 models) is currently the most popular vehicle in Zimbabwe. Its popularity is driven by the "Magic Seats" system, allowing it to carry loads usually reserved for small vans, and a bulletproof CVT transmission.
          </p>
        </section>
      </div>
    )
  }
};

export const BuyingAdvicePage: React.FC<BuyingAdvicePageProps> = ({ initialTab = 'Used car values', onBack }) => {
  const [activeTab, setActiveTab] = useState<AdviceTab>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] animate-in fade-in duration-500">
      {/* Hero Header */}
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
            Buying <br /> <span className="text-[#237837]">Advice</span>
          </h1>
          <p className="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed mx-auto md:mx-0">
            Expert insights and structured data to help you navigate the unique automotive landscape in Zimbabwe.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Navigation */}
          <aside className="w-full lg:w-96 shrink-0">
            <div className="bg-white rounded-[48px] p-4 shadow-2xl shadow-slate-200/50 border border-slate-100">
              <div className="flex flex-col gap-2">
                {(Object.keys(ADVICE_CONTENT) as AdviceTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center justify-between px-8 py-5 rounded-[32px] font-black text-sm uppercase tracking-tight transition-all duration-300 text-left ${
                      activeTab === tab 
                        ? 'bg-[#237837] text-white shadow-xl shadow-[#237837]/30 scale-[1.02]' 
                        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-4">
                       <span className={`transition-colors duration-300 ${activeTab === tab ? 'text-white' : 'text-[#237837]'}`}>
                         {ADVICE_CONTENT[tab].icon}
                       </span>
                       {tab}
                    </span>
                    {activeTab === tab && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Support Card */}
            <div className="mt-8 bg-slate-900 rounded-[48px] p-10 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#237837]/10 rounded-full blur-2xl group-hover:bg-[#237837]/20 transition-all" />
               <h4 className="text-2xl font-black mb-4">Still Unsure?</h4>
               <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">Connect with our consultants for a personalized car buying plan.</p>
               <Button variant="primary" fullWidth className="rounded-2xl h-14">Talk to an Expert</Button>
            </div>
          </aside>

          {/* Right Main - Content */}
          <main className="flex-grow">
            <div className="bg-white rounded-[64px] p-10 md:p-20 shadow-sm border border-slate-100 min-h-[700px]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 pb-12 border-b border-slate-50">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#237837]/10 flex items-center justify-center text-[#237837]">
                      {ADVICE_CONTENT[activeTab].icon}
                    </div>
                    <span className="text-[10px] font-black uppercase text-[#237837] tracking-[0.2em]">Verified Insight</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight mt-4">
                    {ADVICE_CONTENT[activeTab].title}
                  </h2>
                </div>
              </div>

              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                {ADVICE_CONTENT[activeTab].content}
              </div>

              <div className="mt-20 p-12 bg-slate-50 rounded-[48px] flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="text-center md:text-left">
                  <h4 className="text-2xl font-black text-slate-900">Found your dream car?</h4>
                  <p className="text-slate-500 font-medium mt-1">Browse 5,000+ verified ZW listings today.</p>
                </div>
                <Button variant="primary" size="lg" className="rounded-2xl px-12 h-16 shadow-2xl shadow-[#237837]/20">
                  Search Marketplace
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>

      <div className="py-24" />
    </div>
  );
};
