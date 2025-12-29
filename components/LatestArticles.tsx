
import React from 'react';
import { MOCK_ARTICLES } from '../constants';

export const LatestArticles: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Latest Articles</h2>
          <a href="#" className="text-[#237837] font-bold hover:underline">Read all guides</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_ARTICLES.map((article) => (
            <div key={article.id} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-52 overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-xs font-bold text-[#237837] tracking-wider uppercase mb-3">{article.category}</span>
                <h3 className="text-xl font-bold text-slate-900 leading-snug mb-4 group-hover:text-[#237837] transition-colors">{article.title}</h3>
                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-sm text-slate-500">
                  <span>{article.date}</span>
                  <svg className="w-5 h-5 text-slate-300 group-hover:text-[#237837] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
