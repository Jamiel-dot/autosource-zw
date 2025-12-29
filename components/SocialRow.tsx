
import React from 'react';

const Icons = {
  Facebook: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  Instagram: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  ),
  Linkedin: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  )
};

interface SocialRowProps {
  onPageChange?: (pageId: string) => void;
}

export const SocialRow: React.FC<SocialRowProps> = ({ onPageChange }) => {
  const socialLinks = [
    { name: 'Facebook', icon: <Icons.Facebook />, href: 'https://facebook.com/autosourcezw' },
    { name: 'Instagram', icon: <Icons.Instagram />, href: 'https://instagram.com/autosourcezw' },
    { name: 'Linkedin', icon: <Icons.Linkedin />, href: 'https://linkedin.com/company/autosourcezw' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-100 pt-10">
        <div className="flex items-center gap-6">
          <span className="text-sm font-bold text-slate-400 tracking-wider uppercase">Follow us</span>
          <div className="flex gap-4">
            {socialLinks.map((platform) => (
              <a 
                key={platform.name} 
                href={platform.href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#237837] hover:text-white transition-all shadow-sm hover:shadow-md hover:scale-110 active:scale-95 duration-300"
              >
                <span className="sr-only">{platform.name}</span>
                {platform.icon}
              </a>
            ))}
          </div>
        </div>
        <div className="flex gap-8 text-sm font-bold text-slate-500">
          <button onClick={() => onPageChange?.('privacy')} className="hover:text-[#237837] transition-colors">Privacy Policy</button>
          <button onClick={() => onPageChange?.('cookies')} className="hover:text-[#237837] transition-colors">Cookies</button>
          <button onClick={() => onPageChange?.('terms')} className="hover:text-[#237837] transition-colors">Terms of Use</button>
        </div>
      </div>
    </div>
  );
};
