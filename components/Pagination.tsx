
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalItems, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return null;

  // Simple range generation
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // For many pages, we might want to truncate, but for now we'll show all
  // given typical initial listing volumes.

  return (
    <div className="flex items-center justify-center gap-2 mt-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-12 h-12 rounded-2xl border border-slate-100 bg-white flex items-center justify-center text-slate-400 hover:text-[#237837] hover:border-[#237837] disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-100 transition-all shadow-sm"
        aria-label="Previous Page"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="flex gap-2">
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-12 h-12 rounded-2xl font-black text-sm transition-all ${
              currentPage === page
                ? 'bg-[#237837] text-white shadow-lg shadow-[#237837]/20 scale-110'
                : 'bg-white border border-slate-100 text-slate-500 hover:border-[#237837] hover:text-[#237837] shadow-sm'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-12 h-12 rounded-2xl border border-slate-100 bg-white flex items-center justify-center text-slate-400 hover:text-[#237837] hover:border-[#237837] disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-100 transition-all shadow-sm"
        aria-label="Next Page"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};
