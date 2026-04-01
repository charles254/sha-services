import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { KENYAN_LOCATIONS } from '@/lib/locations';
import { ShieldCheck, ArrowRight, MapPin, ChevronRight, Users, Zap, Clock } from 'lucide-react';
import Link from 'next/link';

type Props = {
  params: Promise<{ county: string }>;
};

// Build county slug -> { name, locations } map
const countyMap = new Map<string, { name: string; locations: typeof KENYAN_LOCATIONS }>();
for (const loc of KENYAN_LOCATIONS) {
  if (loc.region === 'Kenya') continue;
  const slug = loc.region.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const existing = countyMap.get(slug);
  if (existing) {
    existing.locations.push(loc);
  } else {
    countyMap.set(slug, { name: loc.region, locations: [loc] });
  }
}

export async function generateStaticParams() {
  return Array.from(countyMap.keys()).map((county) => ({ county }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { county } = await params;
  const data = countyMap.get(county);
  if (!data) return {};

  const title = `SHA Online Cyber Services in ${data.name} | ${data.locations.length} Towns Covered`;
  const description = `SHA Online Cyber Services in ${data.locations.length} towns across ${data.name}. Phone change, PIN registration, statements & more — no queues. From Ksh 200.`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/locations/county/${county}` },
    openGraph: { title, description, images: ['/og-image.jpg'] },
  };
}

export default async function CountyPage({ params }: Props) {
  const { county } = await params;
  const data = countyMap.get(county);
  if (!data) notFound();

  const { name: countyName, locations } = data;
  const sortedLocations = [...locations].sort((a, b) => b.population - a.population);
  const totalPop = locations.reduce((s, l) => s + l.population, 0);
  const countySeat = locations.find((l) => l.isCountySeat);
  const shortName = countyName.replace(' County', '');

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
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://shaservices.co.ke" },
              { "@type": "ListItem", "position": 2, "name": "Locations", "item": "https://shaservices.co.ke/locations" },
              { "@type": "ListItem", "position": 3, "name": countyName, "item": `https://shaservices.co.ke/locations/county/${county}` }
            ]
          })
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-12" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-sha-600 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <Link href="/locations" className="hover:text-sha-600 transition-colors">Locations</Link>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <span className="text-gray-900">{countyName}</span>
        </nav>

        {/* Hero */}
        <div className="max-w-3xl mb-16">
          <div className="badge-green mb-6 flex items-center gap-2 w-fit">
            <MapPin className="w-3 h-3" /> {countyName}
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight mb-8">
            SHA Services in{' '}
            <span className="text-sha-600">{countyName}</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed">
            We serve <span className="text-gray-900 font-bold">{locations.length} towns</span> across {countyName} with a combined population of over {Math.round(totalPop / 1000)}k residents.
            {countySeat && <> The county headquarters is in <Link href={`/locations/${countySeat.slug}`} className="text-sha-600 font-bold hover:underline">{countySeat.name}</Link>.</>}
            {' '}All 5 SHA services are available online — no office visit required.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { label: 'Towns Served', value: locations.length.toString(), icon: MapPin },
            { label: 'Population Covered', value: `${Math.round(totalPop / 1000)}k+`, icon: Users },
            { label: 'Services Available', value: '5', icon: ShieldCheck },
            { label: 'Processing Time', value: '1-48 hrs', icon: Clock },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="card text-center p-6">
              <Icon className="w-6 h-6 text-sha-600 mx-auto mb-3" />
              <p className="text-3xl font-black text-gray-900">{value}</p>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Towns Grid — sorted by population */}
        <h2 className="text-3xl font-black text-gray-900 mb-3">All Towns in {countyName}</h2>
        <p className="text-gray-500 font-medium mb-8">Sorted by population. Click any town for SHA service details.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-20">
          {sortedLocations.map((loc) => (
            <Link
              key={loc.slug}
              href={`/locations/${loc.slug}`}
              className="group p-5 bg-white border border-gray-100 rounded-2xl hover:border-sha-500 hover:shadow-xl transition-all flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-sha-50 rounded-xl flex items-center justify-center group-hover:bg-sha-600 transition-colors flex-shrink-0">
                <MapPin className="w-5 h-5 text-sha-600 group-hover:text-white transition-colors" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-black text-gray-900 truncate">
                  {loc.name}
                  {loc.isCountySeat && <span className="ml-2 text-[9px] bg-sha-50 text-sha-700 px-2 py-0.5 rounded-full font-black uppercase">HQ</span>}
                </p>
                <p className="text-[10px] text-gray-400 font-bold">
                  Pop. {loc.population.toLocaleString()}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-sha-600 transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>

        {/* Services Available */}
        <div className="!bg-sha-900 rounded-[2.5rem] text-white p-8 lg:p-16 relative overflow-hidden shadow-2xl shadow-sha-900/40 mb-20">
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-8 text-center">SHA Services for {shortName} Residents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Phone Number Change', price: '500', time: '24 hrs', href: '/sha-services/change-phone' },
                { name: 'SHA PIN Registration', price: '300', time: '2 hrs', href: '/sha-services/pin-registration' },
                { name: 'Contribution Statement', price: '200', time: '1 hr', href: '/sha-services/contribution-statement' },
                { name: 'Beneficiary Update', price: '400', time: '24 hrs', href: '/sha-services/beneficiary-update' },
                { name: 'Employer Registration', price: '800', time: '48 hrs', href: '/sha-services/employer-registration' },
              ].map((s) => (
                <Link key={s.href} href={s.href} className="bg-white/10 rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-all group">
                  <h3 className="font-black text-lg mb-1">{s.name}</h3>
                  <p className="text-sha-300 text-sm font-bold">Ksh {s.price} · {s.time}</p>
                  <div className="mt-4 flex items-center gap-2 text-sha-300 text-xs font-black group-hover:text-white transition-colors">
                    Apply Now <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center card p-12">
          <Zap className="w-10 h-10 text-sha-600 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-gray-900 mb-4">Get Started in {shortName}</h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto mb-8">
            Join {shortName} residents who are accessing SHA services online. Select your service and submit your request in minutes.
          </p>
          <Link href="/#services" className="btn-primary inline-flex items-center gap-3 group">
            View All Services <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </main>
  );
}
