import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { KENYAN_LOCATIONS } from '@/lib/locations';
import { ShieldCheck, CheckCircle2, ArrowRight, MapPin, Zap, Clock, FileText, Users, Building2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

type Props = {
  params: Promise<{ city: string }>;
};

// Build Maps for O(1) lookups
const locationBySlug = new Map(KENYAN_LOCATIONS.map((loc) => [loc.slug, loc]));

// Group locations by region for cross-linking
const locationsByRegion = new Map<string, typeof KENYAN_LOCATIONS>();
for (const loc of KENYAN_LOCATIONS) {
  const existing = locationsByRegion.get(loc.region) || [];
  existing.push(loc);
  locationsByRegion.set(loc.region, existing);
}

export async function generateStaticParams() {
  return KENYAN_LOCATIONS.map((loc) => ({
    city: loc.slug,
  }));
}

// Threshold: noindex towns with population under 5,000 to focus crawl budget
const LOW_POP_THRESHOLD = 5000;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const location = locationBySlug.get(city);
  if (!location) return {};

  const isLowPop = location.population < LOW_POP_THRESHOLD;
  const title = `SHA Online Cyber Services in ${location.name}, ${location.region} | Kenya`;
  const description = `SHA Online Cyber Services in ${location.name}, ${location.region}. Phone change, PIN registration, statements & more. No office visit. From Ksh 200.`;

  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      images: ['/og-image.jpg'],
    },
    alternates: {
      canonical: `/locations/${city}`,
    },
    // Noindex low-population towns to focus crawl budget on high-value pages
    ...(isLowPop && { robots: { index: false, follow: true } }),
  };
}

const services = [
  { name: 'Change Phone Number', href: '/sha-services/change-phone', icon: Zap, price: '500', time: '24 hrs', desc: 'Update your SHA-registered phone number with a Police Abstract and National ID.' },
  { name: 'SHA PIN Registration', href: '/sha-services/pin-registration', icon: CheckCircle2, price: '300', time: '2 hrs', desc: 'Register as a new SHA member and receive your unique member number.' },
  { name: 'Contribution Statement', href: '/sha-services/contribution-statement', icon: FileText, price: '200', time: '1 hr', desc: 'Get your official SHA contribution history for loans, visas, or records.' },
  { name: 'Beneficiary Update', href: '/sha-services/beneficiary-update', icon: Users, price: '400', time: '24 hrs', desc: 'Add, remove, or update your SHA dependants and beneficiaries.' },
  { name: 'Employer Registration', href: '/sha-services/employer-registration', icon: Building2, price: '800', time: '48 hrs', desc: 'Register your business as an SHA employer for staff health coverage.' },
];

export default async function LocationPage({ params }: Props) {
  const { city } = await params;
  const location = locationBySlug.get(city);

  if (!location) notFound();

  // Get nearby locations from same county for cross-linking (exclude self, limit 8)
  const nearbyLocations = (locationsByRegion.get(location.region) || [])
    .filter((l) => l.slug !== location.slug)
    .slice(0, 8);

  // County name without "County" suffix for natural copy
  const county = location.region.replace(' County', '');
  const countySlug = location.region.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const popFormatted = location.population.toLocaleString();

  return (
    <main className="min-h-screen mesh-bg grainy pt-32 pb-20">
      {/* LocalBusiness Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": `SHA Online Cyber Services ${location.name}`,
            "description": `Professional SHA services for residents of ${location.name}, ${location.region}. Phone change, PIN registration, contribution statements, beneficiary updates, and employer registration.`,
            "url": `https://shacyberservices.com/locations/${city}`,
            "telephone": "+254-719-628-275",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": location.name,
              "addressRegion": location.region,
              "addressCountry": "KE"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": location.lat,
              "longitude": location.lng
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "SHA Services",
              "itemListElement": services.map((s, i) => ({
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": s.name,
                  "description": `${s.name} assistance in ${location.name}`
                },
                "price": s.price,
                "priceCurrency": "KES",
                "position": i + 1
              }))
            }
          })
        }}
      />
      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://shacyberservices.com" },
              { "@type": "ListItem", "position": 2, "name": "Locations", "item": "https://shacyberservices.com/locations" },
              { "@type": "ListItem", "position": 3, "name": location.region, "item": `https://shacyberservices.com/locations/county/${countySlug}` },
              { "@type": "ListItem", "position": 4, "name": location.name, "item": `https://shacyberservices.com/locations/${city}` }
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
          <Link href={`/locations/county/${countySlug}`} className="hover:text-sha-600 transition-colors">{location.region}</Link>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <span className="text-gray-900">{location.name}</span>
        </nav>

        <div className="max-w-3xl">
          <div className="badge-green mb-6 flex items-center gap-2 w-fit">
            <MapPin className="w-3 h-3" /> SHA Services in {location.name}
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight mb-8">
            SHA Online Cyber Services in{' '}
            <span className="text-sha-600">{location.name}</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed mb-4">
            Residents of <span className="text-gray-900 font-bold">{location.name}</span> (population {popFormatted}) in <Link href={`/locations/county/${countySlug}`} className="text-sha-600 font-bold hover:underline">{location.region}</Link> can access all Social Health Authority (SHA) services online without visiting government offices. Our certified agents process requests for {county} residents securely and efficiently.
          </p>
          {location.isCountySeat && (
            <p className="text-sm text-sha-600 font-bold mb-12 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> {location.name} is the county headquarters of {location.region}
            </p>
          )}
          {!location.isCountySeat && <div className="mb-12" />}
        </div>

        {/* All 5 Services */}
        <h2 className="text-3xl font-black text-gray-900 mb-8">SHA Services Available in {location.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {services.map((s) => (
            <div key={s.href} className="card group hover:border-sha-500 transition-all duration-500 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-sha-50 rounded-[1.25rem] flex items-center justify-center group-hover:bg-sha-600 transition-colors">
                  <s.icon className="w-6 h-6 text-sha-600 group-hover:text-white transition-colors" />
                </div>
                <div className="text-right">
                  <p className="font-black text-gray-900 text-lg">Ksh {s.price}</p>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{s.time}</p>
                </div>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">{s.name} in {location.name}</h3>
              <p className="text-gray-500 font-medium text-sm mb-6 flex-1">{s.desc}</p>
              <Link href={s.href} className="btn-primary-sm flex items-center gap-2 w-fit">
                Apply Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Why Section */}
        <div className="!bg-sha-900 rounded-[2.5rem] text-white p-8 lg:p-16 relative overflow-hidden shadow-2xl shadow-sha-900/40 mb-20">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-black mb-8">Why Use SHA Online Cyber Services in {location.name}?</h2>
              <div className="space-y-6">
                {[
                  { title: 'No Travel Required', desc: `Skip the trip to SHA offices in ${county}. Submit everything from your phone or computer in ${location.name}.`, icon: Clock },
                  { title: 'Certified SHA Agents', desc: 'Every request is handled by verified professionals with direct access to SHA systems.', icon: ShieldCheck },
                  { title: '24/7 Online Access', desc: `Submit your SHA request anytime — our platform is available around the clock for ${location.name} residents.`, icon: Zap },
                  { title: 'All 5 Services', desc: 'Phone change, PIN registration, contribution statements, beneficiary updates, and employer registration — all online.', icon: CheckCircle2 },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-sha-300" />
                    </div>
                    <div>
                      <h4 className="font-black text-xl mb-1">{item.title}</h4>
                      <p className="text-white font-medium leading-relaxed opacity-90">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 rounded-[2.5rem] p-10 border border-white/20 backdrop-blur-sm">
              <h3 className="text-2xl font-black mb-6 italic leading-relaxed">&ldquo;Changed my SHA phone number from {location.name} in under 4 hours. No queues, no travel — just fast service.&rdquo;</h3>
              <p className="text-sha-300 font-black">— Verified {location.name} Resident</p>
            </div>
          </div>
        </div>

        {/* How It Works — unique content per page based on location */}
        <div className="mb-20">
          <h2 className="text-3xl font-black text-gray-900 mb-8">How It Works for {location.name} Residents</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Choose a Service', desc: `Select from 5 SHA services above. Each is available to all residents of ${location.name} and ${location.region}.` },
              { step: '02', title: 'Submit Documents', desc: `Upload your National ID and required documents securely. All files are encrypted and auto-deleted within 48 hours.` },
              { step: '03', title: 'Receive Results', desc: `Our certified agents process your request and deliver results via SMS and email to your ${location.name} address.` },
            ].map(({ step, title, desc }) => (
              <div key={step} className="card">
                <div className="text-[48px] font-black text-sha-500/20 leading-none mb-2">{step}</div>
                <h3 className="text-xl font-black text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 font-medium text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Locations — internal cross-linking */}
        {nearbyLocations.length > 0 && (
          <div className="mb-20">
            <h2 className="text-3xl font-black text-gray-900 mb-3">SHA Services Near {location.name}</h2>
            <p className="text-gray-500 font-medium mb-8">
              Also serving these towns in {location.region}:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {nearbyLocations.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/locations/${loc.slug}`}
                  className="group p-4 bg-white border border-gray-100 rounded-2xl hover:border-sha-500 hover:shadow-lg transition-all flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-sha-50 rounded-xl flex items-center justify-center group-hover:bg-sha-600 transition-colors flex-shrink-0">
                    <MapPin className="w-4 h-4 text-sha-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-gray-900 text-sm truncate">{loc.name}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest truncate">{loc.region}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center card p-12">
          <h2 className="text-3xl font-black text-gray-900 mb-4">Ready to Get Started in {location.name}?</h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto mb-8">
            Join thousands of {county} residents who have simplified their SHA services online. No queues, no travel — just fast, certified service.
          </p>
          <Link href="/#services" className="btn-primary inline-flex items-center gap-3 group">
            View All Services <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </main>
  );
}
