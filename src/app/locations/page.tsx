import { KENYAN_LOCATIONS } from '@/lib/locations';
import { MapPin, ChevronRight, Globe, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'SHA Services in Kenyan Counties & Towns | Online Support Hub',
  description: 'Select your city to access localized SHA services. We serve Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, and all major towns across Kenya.',
};

export default function LocationsIndexPage() {
  return (
    <main className="min-h-screen mesh-bg grainy pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <div className="badge-green mx-auto w-fit flex items-center gap-2">
            <Globe className="w-4 h-4" /> Nationwide Coverage
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-6">Serving Every Corner of<br /><span className="text-sha-600">Kenya</span></h1>
          <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
            Our SHA agents are strategically positioned to assist residents in every major town and county. Select your location below for targeted local support.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {KENYAN_LOCATIONS.map((loc) => (
            <Link 
              key={loc.slug} 
              href={`/locations/${loc.slug}`}
              className="group p-6 bg-white border border-gray-100 rounded-3xl hover:border-sha-500 hover:shadow-xl hover:shadow-sha-900/5 transition-all duration-300 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-sha-50 rounded-xl flex items-center justify-center group-hover:bg-sha-600 transition-colors">
                  <MapPin className="w-5 h-5 text-sha-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="font-black text-gray-900">{loc.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{loc.region}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-sha-600 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>

        <div className="mt-20 p-12 bg-sha-50 rounded-[3rem] border border-sha-100 text-center space-y-6">
          <ShieldCheck className="w-16 h-16 text-sha-600 mx-auto" />
          <h2 className="text-3xl font-black text-gray-900">Don&apos;t see your town?</h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto">
            No worries! While we have dedicated landing pages for these top hubs, our online services are available <span className="text-sha-700 font-bold">nationwide</span>. You can still apply for any SHA service from anywhere in Kenya.
          </p>
          <Link href="/#services" className="btn-primary inline-flex items-center gap-3">
            All Online Services <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </main>
  );
}
