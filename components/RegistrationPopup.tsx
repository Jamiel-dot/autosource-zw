
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './Button';

type AuthMode = 'login' | 'register' | 'forgot' | 'reset';

interface RegistrationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userId: string) => void;
  initialMode?: AuthMode;
  draftContext?: string;
}

export const RegistrationPopup: React.FC<RegistrationPopupProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  initialMode = 'login',
  draftContext
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller' | 'dealer'>('buyer');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    if (initialMode && isOpen) {
      setMode(initialMode);
    }
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      }
    });
    
    if (error) {
      setMessage({ text: error.message, type: 'error' });
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) onSuccess(data.user.id);
      } else if (mode === 'register') {
        // 1. Sign up the user in auth.users
        const { data, error: authError } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { 
            data: { 
              full_name: fullName, 
              role: role,
              phone: phone 
            },
            emailRedirectTo: window.location.origin
          }
        });
        
        if (authError) throw authError;
        
        // 2. Explicitly upsert the profile into public.profiles to match the user's provided SQL schema
        if (data.user) {
          // Fix: Removed duplicate 'is_super_admin' property from the upsert object.
          const { error: profileError } = await supabase.from('profiles').upsert({
            id: data.user.id,
            email: email,
            full_name: fullName,
            phone: phone,
            role: role,
            is_dealer: role === 'dealer',
            is_super_admin: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            // Ensure business fields are null initially if not provided
            business_name: role === 'dealer' ? 'New Dealership' : null
          }, { onConflict: 'id' });

          if (profileError) console.error("Profile sync error:", profileError);
          
          setMessage({ 
            text: 'Registration successful! Please check your email for a verification link.', 
            type: 'success' 
          });
          
          setTimeout(() => setMode('login'), 4000);
        }
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}#type=recovery`
        });
        if (error) throw error;
        setMessage({ text: 'Recovery instructions dispatched.', type: 'success' });
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setMessage({ text: 'Credential reset complete.', type: 'success' });
        setTimeout(() => {
          setMode('login');
          window.location.hash = ''; 
        }, 2000);
      }
    } catch (err: any) {
      setMessage({ 
        text: err.message || 'Authentication error.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-4xl rounded-[48px] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-500 min-h-[600px]">
        {/* Left Side: Branding */}
        <div className="w-full md:w-5/12 bg-[#237837] relative overflow-hidden p-12 flex flex-col justify-between items-center text-center">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-[150%] h-[150%] bg-white/20 -translate-y-1/2 translate-x-1/2 rotate-[35deg]"></div>
          </div>
          <div className="relative z-10 my-auto">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 italic">
              AutoSource <span className="text-green-300/80">ZW</span>
            </h1>
            <p className="text-green-100/70 text-[10px] font-black tracking-[0.4em] mb-12 uppercase">
              Secure Marketplace Access
            </p>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
               <p className="text-white text-xs font-bold leading-relaxed">
                 {mode === 'register' 
                   ? 'Create an account to track your listings, save favorites, and access expert car valuations.' 
                   : 'Welcome back! Sign in to manage your inventory and respond to buyer enquiries.'}
               </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 flex flex-col p-8 md:p-14 relative bg-white overflow-y-auto no-scrollbar">
          <button onClick={onClose} className="absolute top-8 right-8 w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 transition-all z-10">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div className="w-full max-w-sm mx-auto my-auto">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {mode === 'login' && 'Portal Entry'}
                {mode === 'register' && 'Account Registration'}
                {mode === 'forgot' && 'Account Recovery'}
                {mode === 'reset' && 'Credential Reset'}
              </h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">
                Identity & Access Management
              </p>
            </div>

            <div className="space-y-6">
              {(mode === 'login' || mode === 'register') && (
                <div className="space-y-4">
                  <button 
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    className="w-full py-4 border border-slate-100 rounded-2xl flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 48 48">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                    </svg>
                    Continue with Google
                  </button>
                  <div className="flex items-center gap-4 py-2">
                    <div className="flex-1 h-px bg-slate-100"></div>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">OR</span>
                    <div className="flex-1 h-px bg-slate-100"></div>
                  </div>
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-5">
                {mode === 'register' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Name (*)</label>
                      <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm outline-none focus:bg-white focus:border-[#237837]/20 transition-all font-bold text-slate-900" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Phone Number (*)</label>
                      <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+263..." className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm outline-none focus:bg-white focus:border-[#237837]/20 transition-all font-bold text-slate-900" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Account Type (*)</label>
                      <select required value={role} onChange={e => setRole(e.target.value as any)} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm outline-none focus:bg-white focus:border-[#237837]/20 transition-all font-black cursor-pointer appearance-none text-slate-900">
                        <option value="buyer">Individual Buyer</option>
                        <option value="seller">Individual Seller</option>
                        <option value="dealer">Merchant Dealer</option>
                      </select>
                    </div>
                  </div>
                )}

                {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Email {mode === 'register' ? '(*)' : ''}</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="user@autosource.co.zw" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm outline-none focus:bg-white focus:border-[#237837]/20 transition-all font-bold text-slate-900" />
                  </div>
                )}

                {(mode === 'login' || mode === 'register' || mode === 'reset') && (
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Password {mode === 'register' ? '(*)' : ''}</label>
                    <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm outline-none focus:bg-white focus:border-[#237837]/20 transition-all font-bold text-slate-900" />
                    {mode === 'login' && (
                      <div className="flex justify-end pt-1">
                        <button type="button" onClick={() => setMode('forgot')} className="text-[9px] text-slate-400 hover:text-[#237837] font-black uppercase tracking-widest">Forgot Password?</button>
                      </div>
                    )}
                  </div>
                )}

                {message && (
                  <div className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border animate-in zoom-in-95 ${
                    message.type === 'success' ? 'bg-green-50 text-[#237837] border-green-100' : 
                    message.type === 'info' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                    'bg-red-50 text-red-500 border-red-100'
                  }`}>
                    {message.text}
                  </div>
                )}

                <button type="submit" disabled={loading} className="w-full py-5 bg-[#237837] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-[#237837]/20 hover:brightness-110 transition-all disabled:opacity-50 active:scale-[0.98]">
                  {loading ? 'Processing...' : (
                    mode === 'login' ? 'Authenticate' : 
                    mode === 'register' ? 'Register Account' : 
                    mode === 'forgot' ? 'Send Reset Link' : 'Save New Password'
                  )}
                </button>
              </form>
            </div>

            <div className="mt-10 text-center">
              {mode === 'login' ? (
                <button onClick={() => setMode('register')} className="text-[10px] text-slate-400 font-black uppercase tracking-widest hover:text-slate-900 transition-colors">
                  Don't have an account? <span className="text-[#237837] ml-2 underline">Register</span>
                </button>
              ) : (
                <button onClick={() => { setMode('login'); setMessage(null); }} className="text-[10px] text-slate-400 font-black uppercase tracking-widest hover:text-slate-900 transition-colors">
                  Back to Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
