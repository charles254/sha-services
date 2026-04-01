import { MapPin, Globe, ShieldCheck, ArrowRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import LocationList from '@/components/LocationList';
import { KENYAN_LOCATIONS } from '@/lib/locations';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SHA Services in 500+ Towns | 47 Counties',
  description: 'SHA services in 500+ towns across all 47 Kenyan counties. Phone change, PIN registration, statements & more — no office visit needed. Find your town.',
  alternates: { canonical: '/locations' },
  openGraph: {
    title: 'SHA Services in 500+ Kenyan Towns | Find Your Location',
    description: 'Online SHA services available in all 47 counties. Find your town and apply for phone change, PIN registration, or statements today.',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SHA Services in 500+ Kenyan Towns',
    description: 'Online SHA services in all 47 counties. Find your town and apply today — no office visit needed.',
  },
};

// Group locations by county for the static county index
const counties = Array.from(
  KENYAN_LOCATIONS.reduce((map, loc) => {
    const existing = map.get(loc.region) || [];
    existing.push(loc);
    map.set(loc.region, existing);
    return map;
  }, new Map<string, typeof KENYAN_LOCATIONS>())
).sort(([a], [b]) => a.localeCompare(b));

export default function LocationsIndexPage() {
  return (
    <main className="min-h-screen mesh-bg grainy pt-32 pb-20">
      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://shacyberservices.com" },
              { "@type": "ListItem", "position": 2, "name": "Locations", "item": "https://shacyberservices.com/locations" }
            ]
          })
        }}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-12" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-sha-600 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <span className="text-gray-900">Locations</span>
        </nav>

        <div className="text-center mb-16 space-y-4">
          <div className="badge-green mx-auto w-fit flex items-center gap-2">
            <Globe className="w-4 h-4" /> Nationwide Coverage
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-gray-900 mb-6 tracking-tight">
            SHA Services in <span className="text-sha-600">500+ Towns</span><br />Across All 47 Counties
          </h1>
          <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
            From Nairobi to the smallest trading centers, our certified SHA agents process your requests online — no office visit needed.
          </p>
        </div>

        {/* Interactive Search */}
        <LocationList />

        {/* County-by-County Index — critical for internal linking and crawl depth */}
        <div className="mt-24 mb-20">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Browse by County</h2>
          <p className="text-gray-500 font-medium text-center mb-12 max-w-xl mx-auto">
            All 47 Kenyan counties covered. Click any town to see available SHA services.
          </p>
          <div className="space-y-10">
            {counties.map(([county, locations]) => (
              <div key={county} id={county.toLowerCase().replace(/[^a-z0-9]+/g, '-')}>
                <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sha-600" />
                  <Link href={`/locations/county/${county.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="hover:text-sha-600 transition-colors">
                    {county}
                  </Link>
                  <span className="text-xs text-gray-400 font-bold">({locations.length} towns)</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {locations.map((loc) => (
                    <Link
                      key={loc.slug}
                      href={`/locations/${loc.slug}`}
                      className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-700 hover:border-sha-500 hover:text-sha-700 hover:bg-sha-50 transition-all"
                    >
                      {loc.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="p-12 bg-sha-900 text-white rounded-[3rem] text-center space-y-6 shadow-2xl shadow-sha-900/40 relative overflow-hidden">
          <div className="absolute inset-0 mesh-bg opacity-10" />
          <div className="relative z-10">
            <ShieldCheck className="w-16 h-16 text-sha-400 mx-auto mb-6" />
            <h2 className="text-3xl font-black mb-4">Official SHA Service Hub</h2>
            <p className="text-sha-200 font-medium max-w-xl mx-auto mb-8">
              Certified agents serving all 47 counties. Your SHA request is processed securely regardless of your location in Kenya.
            </p>
            <Link href="/#services" className="btn-primary inline-flex items-center gap-3">
              Apply for SHA Services <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
