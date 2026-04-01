'use client';

import { useState, useDeferredValue, useMemo } from 'react';
import { KENYAN_LOCATIONS } from '@/lib/locations';
import { MapPin, ChevronRight, Search, X } from 'lucide-react';
import Link from 'next/link';

export default function LocationList() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    const q = deferredQuery.toLowerCase();
    return KENYAN_LOCATIONS.filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.region.toLowerCase().includes(q)
    ).slice(0, 100);
  }, [deferredQuery]); // Deferred value keeps input responsive while filtering 500+ items

  return (
    <div className="space-y-12">
      {/* Search Bar */}
      <div className="max-w-xl mx-auto relative group">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400 group-focus-within:text-sha-600 transition-colors" />
        </div>
        <input 
          type="text" 
          placeholder="Search town, county or hub..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-16 pr-12 py-6 bg-white border border-gray-100 rounded-[2rem] shadow-xl shadow-sha-900/5 focus:ring-4 focus:ring-sha-500/10 focus:border-sha-600 transition-all outline-none text-lg font-bold placeholder:text-gray-300"
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-6 flex items-center p-2 text-gray-300 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((loc) => (
          <Link 
            key={loc.slug} 
            href={`/locations/${loc.slug}`}
            className="group p-5 bg-white border border-gray-100 rounded-[2rem] hover:border-sha-500 hover:shadow-2xl hover:shadow-sha-900/10 transition-all duration-300 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-sha-50 rounded-2xl flex items-center justify-center group-hover:bg-sha-600 transition-colors">
                <MapPin className="w-5 h-5 text-sha-600 group-hover:text-white transition-colors" />
              </div>
              <div className="min-w-0">
                <p className="font-black text-gray-900 truncate">{loc.name}</p>
                <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.15em] truncate">{loc.region}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-sha-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-bold mb-2">No towns found matching &ldquo;{query}&rdquo;</p>
          <button onClick={() => setQuery('')} className="text-sha-600 font-black text-sm uppercase tracking-widest hover:underline">Clear Search</button>
        </div>
      )}

      {query === '' && KENYAN_LOCATIONS.length > 100 && (
        <p className="text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
          Showing 100 of {KENYAN_LOCATIONS.length} locations. Use search to find more.
        </p>
      )}
    </div>
  );
}
