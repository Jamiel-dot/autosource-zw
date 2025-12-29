
import React, { useState, useEffect } from 'react';
import { Button } from './Button';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('autosource_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAction = (type: 'accept' | 'reject') => {
    localStorage.setItem('autosource_cookie_consent', type);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-8 animate-in slide-in-from-bottom-full duration-700">
      <div className="max-w-4xl mx-auto bg-slate-900 border border-white/10 rounded-[32px] p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-center gap-6 backdrop-blur-xl">
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className="text-2xl">🍪</span>
            <h3 className="text-white font-black uppercase tracking-widest text-sm">Cookie Settings</h3>
          </div>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            We use cookies to enhance your experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies on AutoSource ZW.
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button 
            variant="ghost" 
            className="flex-1 md:flex-none rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 px-8"
            onClick={() => handleAction('reject')}
          >
            Reject
          </Button>
          <Button 
            variant="primary" 
            className="flex-1 md:flex-none rounded-2xl px-10 h-14 shadow-xl shadow-[#237837]/20"
            onClick={() => handleAction('accept')}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};
