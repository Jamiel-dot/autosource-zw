
import React from 'react';
import { Button } from './Button';
import { Hero } from './Hero';

interface ContactPageProps {
  onBack: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-500">
      {/* Reusing the Home Page Hero Style as requested */}
      <Hero />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
                Get in <span className="text-[#237837]">Touch</span>
              </h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                Have a question about a listing or want to advertise with us? Our team in Harare is ready to help you navigate the Zimbabwean car market.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                <div className="w-12 h-12 bg-[#237837] text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#237837]/20">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h4 className="font-black text-slate-900 text-lg mb-2">Call Us</h4>
                <p className="text-slate-500 font-bold">+263 788 832 950</p>
                <p className="text-slate-400 text-sm">Mon-Fri 8am to 5pm</p>
              </div>

              <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                <div className="w-12 h-12 bg-[#237837] text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#237837]/20">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="font-black text-slate-900 text-lg mb-2">Email Support</h4>
                <p className="text-slate-500 font-bold">support@autosource.co.zw</p>
                <p className="text-slate-400 text-sm">We reply within 24h</p>
              </div>
            </div>

            <div className="p-10 bg-slate-900 rounded-[40px] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#237837]/20 rounded-full blur-3xl"></div>
              <h4 className="text-2xl font-black mb-4">Our Office</h4>
              <p className="text-slate-400 font-medium leading-relaxed">
                123 Samora Machel Ave,<br />
                Harare, Zimbabwe
              </p>
              <div className="mt-8">
                <Button variant="secondary" className="rounded-2xl" onClick={() => window.open('https://maps.google.com', '_blank')}>
                  Get Directions
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-[48px] p-10 md:p-16 shadow-2xl border border-slate-100">
            <h3 className="text-3xl font-black text-slate-900 mb-8">Send a Message</h3>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent! Our team will contact you soon.'); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input type="text" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-[#237837] outline-none transition-all" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input type="email" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-[#237837] outline-none transition-all" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                <input type="text" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-[#237837] outline-none transition-all" placeholder="How can we help?" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                <textarea required rows={5} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-[#237837] outline-none transition-all resize-none" placeholder="Tell us more about your enquiry..."></textarea>
              </div>
              <Button fullWidth size="lg" className="rounded-2xl h-16 shadow-xl shadow-[#237837]/20">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
