import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { getAIValuation, ValuationInput, ValuationResult } from '../lib/valuationEngine';
import { supabase } from '../lib/supabase';
import { AddListing } from './AddListing';
import { RegistrationPopup } from './RegistrationPopup';
import { Profile, Car } from '../types';

interface ValuationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ValuationModal: React.FC<ValuationModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [user, setUser] = useState<Profile | null>(null);
  const [showListingForm, setShowListingForm] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [pendingListing, setPendingListing] = useState(false); // <-- New flag

  const [formData, setFormData] = useState<ValuationInput>({
    make: '',
    model: '',
    year: 2020,
    mileage: 50000,
    condition: 'Good',
    fuelType: 'Petrol',
    transmission: 'Auto',
    car_status: 'Used',
    city: 'Harare'
  });

  // Check if user is logged in
  const checkAuth = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle();
      if (profile) {
        const p = profile as Profile;
        setUser(p);
        return p;
      }
    }
    setUser(null);
    return null;
  };

  // Fetch makes on mount
  useEffect(() => {
    checkAuth();

    const fetchMakes = async () => {
      const { data } = await supabase.from('vehicle_models').select('make_name');
      if (data) {
        const unique = Array.from(new Set(data.map(m => m.make_name as string))).sort();
        setMakes(unique);
      }
    };

    fetchMakes();
  }, []);

  // Fetch models when make changes
  useEffect(() => {
    const fetchModels = async () => {
      if (!formData.make) return;
      const { data } = await supabase.from('vehicle_models').select('name').eq('make_name', formData.make).order('name');
      if (data) setModels(data.map(m => m.name));
    };
    fetchModels();
  }, [formData.make]);

  if (!isOpen) return null;

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const performValuation = async () => {
    setLoading(true);
    try {
      const val = await getAIValuation(formData);
      setResult(val);
      setStep(4);
    } catch (err: any) {
      alert("Valuation Alert: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle clicking "List My Vehicle Now"
  const handleListNow = async () => {
    const currentUser = user || await checkAuth();
    if (currentUser) {
      setShowListingForm(true);
    } else {
      setPendingListing(true); // remember the user wants to list
      setShowRegistration(true);
    }
  };

  // Handle successful registration
  const handleRegistrationSuccess = async () => {
    const refreshedUser = await checkAuth();
    setShowRegistration(false);
    if (refreshedUser) {
      setUser(refreshedUser);
      if (pendingListing) {
        setShowListingForm(true); // now open listing form
        setPendingListing(false);  // reset flag
      }
    }
  };

  const onComplete = () => {
    setShowListingForm(false);
    onClose();
  };

  // Show listing form
  if (showListingForm) {
    const initialListingData: Partial<Car> = {
      make: formData.make,
      model: formData.model,
      year: formData.year,
      mileage: formData.mileage,
      condition: formData.condition,
      price: result?.dealer_listing_price,
      location_city: formData.city,
      listing_title: `${formData.year} ${formData.make} ${formData.model}`,
      fuel_type: formData.fuelType,
      transmission: formData.transmission
    };

    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-[#fcfcfc] w-full max-w-5xl h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl p-6 md:p-12 no-scrollbar">
          <AddListing 
            user={user} 
            onComplete={onComplete} 
            initialData={initialListingData as Car}
          />
        </div>
      </div>
    );
  }

  // Main valuation modal UI
  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
        <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">

          {/* Step indicators */}
          <div className="absolute top-10 left-10 flex items-center gap-4">
            {step < 4 && (
              <div className="flex gap-1.5">
                {[1,2,3].map(i => (
                  <div key={i} className={`w-10 h-1.5 rounded-full transition-all duration-700 ${step >= i ? 'bg-[#237837]' : 'bg-slate-100'}`} />
                ))}
              </div>
            )}
          </div>

          <button onClick={onClose} className="absolute top-8 right-8 w-12 h-12 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 transition-all z-10">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-10 md:p-16">
            {/* Step 1: Vehicle Identity */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center mb-12">
                  <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Vehicle Identity</h3>
                  <p className="text-slate-500 font-medium mt-2">Let's find your car in our ZW database.</p>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Make</label>
                      <select value={formData.make} onChange={(e) => setFormData({...formData, make: e.target.value, model: ''})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-900 focus:border-[#237837] outline-none appearance-none">
                        <option value="">Select Make</option>
                        {makes.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Model</label>
                      <select value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-900 focus:border-[#237837] outline-none appearance-none disabled:opacity-50" disabled={!formData.make}>
                        <option value="">Select Model</option>
                        {models.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Year</label>
                      <select value={formData.year} onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-900 focus:border-[#237837] outline-none appearance-none">
                        {Array.from({length: 30}, (_, i) => 2025 - i).map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Condition</label>
                      <select value={formData.car_status} onChange={(e) => setFormData({...formData, car_status: e.target.value as any})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-900 focus:border-[#237837] outline-none appearance-none">
                        <option value="Used">Used</option>
                        <option value="New">Brand New</option>
                      </select>
                    </div>
                  </div>
                  <Button fullWidth size="lg" className="rounded-[24px] h-18 text-lg shadow-xl shadow-[#237837]/20" onClick={handleNext} disabled={!formData.make || !formData.model}>
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Usage Profile */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center mb-12">
                  <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Usage Profile</h3>
                  <p className="text-slate-500 font-medium mt-2">Exact details lead to accurate ranges.</p>
                </div>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block text-center">General Condition</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Excellent', 'Good', 'Fair', 'Poor'].map(c => (
                        <button key={c} onClick={() => setFormData({...formData, condition: c as any})} className={`py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] border-2 transition-all ${formData.condition === c ? 'bg-[#237837] border-[#237837] text-white shadow-lg' : 'bg-white border-slate-50 text-slate-400 hover:border-slate-200'}`}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block text-center">Current Mileage (km)</label>
                    <div className="relative">
                      <input type="number" value={formData.mileage} onChange={(e) => setFormData({...formData, mileage: parseInt(e.target.value)})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-5 text-3xl font-black text-slate-900 text-center focus:border-[#237837] outline-none" />
                      <span className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 font-black uppercase text-xs tracking-widest pointer-events-none">KM</span>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-6">
                    <Button variant="ghost" className="flex-1 rounded-2xl h-16" onClick={handleBack}>Back</Button>
                    <Button className="flex-[2] rounded-[24px] h-16" onClick={handleNext}>Confirm Details</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Valuation in progress */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-center">
                <div className="w-32 h-32 bg-[#237837]/10 rounded-[40px] flex items-center justify-center mx-auto mb-10 shadow-inner">
                  <svg className="w-16 h-16 text-[#237837] animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter italic">Analyzing ZW Market</h3>
                <p className="text-slate-500 font-medium mb-12 max-w-sm mx-auto">We are cross-referencing your vehicle against 15k+ active and past transaction records.</p>
                <Button fullWidth size="lg" className="rounded-[24px] h-18 shadow-2xl shadow-[#237837]/30" onClick={performValuation} disabled={loading}>
                  {loading ? 'Consulting Market Median...' : 'Generate Market Report'}
                </Button>
              </div>
            )}

            {/* Step 4: Result */}
            {step === 4 && result && (
              <div className="animate-in zoom-in-95 duration-700">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 bg-[#237837]/10 text-[#237837] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                    Conservative Valuation Result
                  </div>
                  <h3 className="text-5xl font-black text-slate-900 tracking-tighter mb-2 italic">Valuation Ready</h3>
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">{formData.year} {formData.make} {formData.model} • {formData.car_status}</p>
                </div>

                <div className="bg-slate-950 p-12 rounded-[56px] text-white mb-10 relative overflow-hidden text-center shadow-2xl shadow-slate-900/40">
                  <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#237837]/20 rounded-full blur-[100px]" />
                  <p className="text-[10px] font-black text-[#237837] uppercase tracking-widest mb-6 border border-[#237837]/30 inline-block px-4 py-1.5 rounded-full">Estimated Market Range (USD)</p>
                  <div className="text-5xl md:text-6xl font-black tracking-tighter mb-10 tabular-nums">
                    ${result.estimated_market_value_min.toLocaleString()} <span className="text-white/20">-</span> ${result.estimated_market_value_max.toLocaleString()}
                  </div>

                  <div className="grid grid-cols-2 gap-6 border-t border-white/5 pt-10">
                    <div className="bg-white/5 p-6 rounded-[32px] border border-white/5 group hover:bg-white/10 transition-colors">
                      <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-2">Fast Sale Estimate</p>
                      <p className="text-2xl font-black text-emerald-400 tabular-nums">${result.fast_sale_price.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-[32px] border border-white/5 group hover:bg-white/10 transition-colors">
                      <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-2">Retail List Price</p>
                      <p className="text-2xl font-black text-white tabular-nums">${result.dealer_listing_price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 mb-12">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {result.key_influencers.map(inf => (
                      <span key={inf} className="bg-slate-50 border border-slate-100 text-slate-600 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-tight shadow-sm">✓ {inf}</span>
                    ))}
                  </div>
                  <p className="text-slate-500 text-xs text-center leading-relaxed italic px-6 font-medium">
                    "{result.summary}"
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <Button fullWidth size="lg" className="rounded-[24px] h-18 shadow-2xl shadow-[#237837]/30 text-lg" onClick={handleListNow}>
                    List My Vehicle Now
                  </Button>
                  <button onClick={onClose} className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-900 transition-colors py-2">
                    Dismiss Report
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Registration Popup */}
      <RegistrationPopup 
        isOpen={showRegistration} 
        onClose={() => setShowRegistration(false)} 
        onSuccess={handleRegistrationSuccess}
        draftContext="valuation"
      />
    </>
  );
};
