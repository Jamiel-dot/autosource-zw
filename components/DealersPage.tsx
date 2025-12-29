
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';
import { Button } from './Button';

interface DealersPageProps {
  onBack: () => void;
}

export const DealersPage: React.FC<DealersPageProps> = ({ onBack }) => {
  const [dealers, setDealers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDealer, setSelectedDealer] = useState<Profile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDealers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('is_dealer', true)
          .order('business_name', { ascending: true });

        if (error) throw error;
        if (data) setDealers(data as Profile[]);
      } catch (err) {
        console.error('Error fetching dealers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDealers();
  }, []);

  const filteredDealers = dealers.filter(d => 
    (d.business_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.business_address || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#fcfcfc] min-h-screen pb-32 animate-in fade-in duration-500">
      {/* Hero Header */}
      <section className="bg-slate-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#237837]/15 to-transparent opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <button 
            onClick={onBack}
            className="text-[#237837] font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-6 hover:-translate-x-1 transition-transform"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Home
          </button>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none mb-4">
            Verified <br /> <span className="text-[#237837]">Dealers</span>
          </h1>
          <p className="text-[13px] md:text-base text-slate-400 font-medium max-w-lg leading-relaxed">
            Connect with Zimbabwe's most trusted automotive merchants. Verified for your security.
          </p>
        </div>
      </section>

      {/* Search & Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl p-3 shadow-xl border border-slate-100 mb-10">
          <div className="relative">
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search by dealer name or location..." 
              className="w-full bg-slate-50 rounded-xl pl-12 pr-5 py-4 text-sm font-bold text-slate-900 outline-none focus:border-[#237837] border-2 border-transparent transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-56 bg-white rounded-[32px] border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : filteredDealers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDealers.map((dealer) => (
              <div 
                key={dealer.id}
                className="group bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden cursor-pointer"
                onClick={() => setSelectedDealer(dealer)}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#237837]/5 rounded-full blur-2xl group-hover:bg-[#237837]/10 transition-colors" />
                
                <div className="w-20 h-20 rounded-2xl bg-slate-50 border-2 border-slate-50 shadow-inner overflow-hidden mb-4 flex items-center justify-center">
                  {dealer.logo_url || dealer.avatar_url ? (
                    <img src={dealer.logo_url || dealer.avatar_url || ''} alt={dealer.business_name || ''} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-[#237837]">
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-black text-slate-900 group-hover:text-[#237837] transition-colors line-clamp-1 tracking-tighter">{dealer.business_name || dealer.full_name}</h3>
                <p className="text-[11px] font-bold text-slate-400 mt-1 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  {dealer.business_address || 'Harare, Zimbabwe'}
                </p>

                <div className="mt-6 w-full pt-6 border-t border-slate-50">
                  <Button variant="outline" fullWidth className="rounded-xl h-10 text-[11px]">View Contact Details</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-white rounded-[32px] border-2 border-dashed border-slate-100">
            <p className="text-slate-400 font-bold italic">No dealers found.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedDealer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedDealer(null)} />
          <div className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
            <button 
              onClick={() => setSelectedDealer(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center text-slate-500 transition-all z-10"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="p-8 md:p-12">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-[32px] bg-slate-50 border-2 border-slate-50 shadow-xl overflow-hidden mb-6 flex items-center justify-center">
                   {selectedDealer.logo_url || selectedDealer.avatar_url ? (
                      <img src={selectedDealer.logo_url || selectedDealer.avatar_url || ''} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-[#237837]">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      </div>
                    )}
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">{selectedDealer.business_name}</h3>
                <div className="flex items-center gap-2 bg-[#237837]/10 text-[#237837] px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight mb-8">
                   <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                   Verified Dealer
                </div>
                
                <div className="w-full space-y-3 text-left">
                  <div className="p-5 bg-slate-50 rounded-2xl flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#237837] shadow-sm">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tight mb-0.5">Showroom</p>
                      <p className="text-slate-900 font-bold leading-relaxed text-[13px]">{selectedDealer.business_address || 'Harare'}</p>
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-2xl flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#237837] shadow-sm">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tight mb-0.5">Phone</p>
                      <p className="text-slate-900 font-black text-lg tracking-tighter">{selectedDealer.business_phone || selectedDealer.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  <Button 
                    variant="primary" 
                    size="md" 
                    className="rounded-2xl h-14 text-[13px] shadow-xl shadow-[#237837]/20"
                    onClick={() => {
                      const num = (selectedDealer.business_phone || selectedDealer.phone || '').replace(/\+/g, '').replace(/\s/g, '');
                      window.open(`https://wa.me/${num}`, '_blank');
                    }}
                  >
                    WhatsApp
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="md" 
                    className="rounded-2xl h-14 text-[13px]"
                    onClick={() => {
                       const num = (selectedDealer.business_phone || selectedDealer.phone || '').replace(/\+/g, '').replace(/\s/g, '');
                       window.open(`tel:${num}`);
                    }}
                  >
                    Call
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
