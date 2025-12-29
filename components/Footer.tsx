
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DASHBOARD_URL } from '../constants';
import { supabase } from '../lib/supabase';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setStatus('idle');
    try {
      const token = Math.random().toString(36).substring(2, 15);
      // Inserting into the public.subscriptions table as requested
      const { error } = await supabase.from('subscriptions').insert([
        { 
          email: email.toLowerCase().trim(), 
          confirmation_token: token, 
          is_confirmed: false 
        }
      ]);
      
      if (error) {
        // Handle unique constraint error (already subscribed)
        if (error.code === '23505') {
          setStatus('success'); // Still show success if already in list
        } else {
          throw error;
        }
      } else {
        setStatus('success');
      }
      setEmail('');
    } catch (err) {
      console.error('Subscription error:', err);
      setStatus('error');
    } finally {
      setLoading(false);
      // Reset status after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <footer className="bg-white pt-20 pb-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center -mt-24 mb-16 relative z-10">
          <button onClick={scrollToTop} className="w-14 h-14 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-[#237837] hover:bg-[#237837] hover:text-white transition-all group" aria-label="Scroll to top">
            <svg className="w-6 h-6 transition-transform group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Buying advice</h4>
            <ul className="space-y-4">
              <li><Link to="/buying-advice" className="text-slate-500 hover:text-[#237837] text-sm font-medium transition-colors">Used car values</Link></li>
              <li><Link to="/buying-advice" className="text-slate-500 hover:text-[#237837] text-sm font-medium transition-colors">Safety advice</Link></li>
              <li><Link to="/marketplace?bodyType=SUV" className="text-slate-500 hover:text-[#237837] text-sm font-medium transition-colors">SUV cars</Link></li>
              <li><Link to="/buying-advice" className="text-slate-500 hover:text-[#237837] text-sm font-medium transition-colors">Best family cars</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Products & services</h4>
            <ul className="space-y-4">
              <li><Link to="/value" className="text-slate-500 hover:text-[#237837] text-sm font-medium transition-colors">Sell your car</Link></li>
              <li><Link to="/products-services" className="text-slate-500 hover:text-[#237837] text-sm font-medium transition-colors">Vehicle check</Link></li>
              <li><Link to="/contact" className="text-slate-500 hover:text-[#237837] text-sm font-medium transition-colors">Contact Us</Link></li>
              <li><Link to="/products-services" className="text-slate-500 hover:text-[#237837] text-sm font-medium transition-colors">Insurance</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Quick search</h4>
            <ul className="space-y-4">
              <li><Link to="/used" className="text-slate-500 hover:text-[#237837] text-sm font-medium transition-colors">Used cars</Link></li>
              <li><Link to="/new" className="text-slate-500 hover:text-[#237837] text-sm font-medium transition-colors">New cars</Link></li>
              <li><Link to="/marketplace" className="text-slate-500 hover:text-[#237837] text-sm font-medium transition-colors">Market Place</Link></li>
              <li><a href={DASHBOARD_URL} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#237837] text-sm font-medium transition-colors">Dealer Login</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Newsletter</h4>
            <form className="space-y-3" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter your email" 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#237837] outline-none transition-all" 
              />
              <button 
                disabled={loading} 
                className="w-full bg-slate-900 text-white text-xs font-black uppercase tracking-widest py-4 rounded-xl hover:bg-[#237837] transition-all disabled:opacity-50 shadow-lg"
              >
                {loading ? '...' : 'Subscribe'}
              </button>
              {status === 'success' && (
                <p className="text-[11px] font-bold text-[#237837] animate-in fade-in slide-in-from-top-1">
                  Successfully subscribed! Welcome aboard.
                </p>
              )}
              {status === 'error' && (
                <p className="text-[11px] font-bold text-red-500 animate-in fade-in slide-in-from-top-1">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10 py-12 border-y border-slate-100">
          <div className="flex-1 space-y-4 text-center lg:text-left">
            <Link to="/" className="flex items-center gap-3 justify-center lg:justify-start group">
              <div className="flex flex-col gap-1">
                <div className="w-8 h-2 bg-[#237837] -skew-x-[25deg] rounded-sm"></div>
                <div className="w-8 h-2 bg-black -skew-x-[25deg] rounded-sm"></div>
              </div>
              <div className="relative flex flex-col">
                <span className="text-xl font-black italic text-slate-900 tracking-tighter leading-none">AutoSource</span>
                <span className="self-end text-[10px] font-black text-[#237837] leading-none mt-0.5 tracking-tighter">ZW</span>
              </div>
            </Link>
            <p className="text-slate-500 text-xs font-bold leading-relaxed">
              142 Nelson Mandela Avenue, Harare, Zimbabwe
            </p>
          </div>
          <div className="flex flex-col items-center lg:items-end gap-2">
            <p className="text-xs text-slate-400">© {currentYear} AutoSource ZW Marketplace. All rights reserved.</p>
            <a 
              href="https://www.informair.co.za" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#237837] transition-colors"
            >
              Powered by <span className="text-slate-900">Informair</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
