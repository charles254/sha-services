import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { KENYAN_LOCATIONS } from '@/lib/locations';
import { ShieldCheck, CheckCircle2, ArrowRight, MapPin, Zap, Clock } from 'lucide-react';
import Link from 'next/link';

type Props = {
  params: Promise<{ city: string }>;
};

export async function generateStaticParams() {
  return KENYAN_LOCATIONS.map((loc) => ({
    city: loc.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const location = KENYAN_LOCATIONS.find((l) => l.slug === city);
  if (!location) return {};

  const title = `SHA Online Services in ${location.name} | Social Health Authority Kenya`;
  const description = `Access fast, secure SHA services in ${location.name}, ${location.region}. Change phone number, register SHA PIN, and update beneficiaries with certified agents in ${location.name}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ['/og-image.jpg'],
    },
    alternates: {
      canonical: `/locations/${city}`,
    },
  };
}

const services = [
  { name: 'Change Phone Number', href: '/sha-services/change-phone', icon: Zap, price: '500' },
  { name: 'SHA PIN Registration', href: '/sha-services/pin-registration', icon: CheckCircle2, price: 'Free' },
  { name: 'Contribution Statement', href: '/sha-services/contribution-statement', icon: ShieldCheck, price: '300' },
];

export default async function LocationPage({ params }: Props) {
  const { city } = await params;
  const location = KENYAN_LOCATIONS.find((l) => l.slug === city);

  if (!location) notFound();

  return (
    <main className="min-h-screen mesh-bg grainy pt-32 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": `SHA Online Services ${location.name}`,
            "description": `Professional SHA services for residents of ${location.name}, ${location.region}.`,
            "url": `https://shaservices.co.ke/locations/${city}`,
            "telephone": "+254-719-628-275",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": location.name,
              "addressCountry": "KE"
            },
            "geo": {
              "@type": "GeoCircle",
              "geoMidpoint": {
                "@type": "GeoCoordinates",
                "addressCountry": "KE"
              },
              "geoRadius": "50"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "SHA Services",
              "itemListElement": services.map((s, i) => ({
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": s.name,
                  "description": `Assistance with ${s.name} in ${location.name}`
                },
                "position": i + 1
              }))
            }
          })
        }}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="badge-green mb-6 flex items-center gap-2 w-fit">
            <MapPin className="w-3 h-3" /> SHA Services in {location.name}
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight mb-8">
            Access SHA Services in<br />
            <span className="text-sha-600">{location.name}, {location.region}</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed mb-12">
            Residents of <span className="text-gray-900 font-bold">{location.name}</span> can now access professional Social Health Authority (SHA) services online. Our certified agents handle your requests securely and efficiently, saving you time and travel to government offices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((s) => (
            <div key={s.href} className="card group hover:border-sha-500 transition-all duration-500">
              <div className="w-14 h-14 bg-sha-50 rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:bg-sha-600 transition-colors">
                <s.icon className="w-7 h-7 text-sha-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">{s.name}</h3>
              <p className="text-gray-500 font-medium mb-6">
                Professional assistance for {s.name.toLowerCase()} in {location.name}.
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-lg font-black text-sha-700">Ksh {s.price}</span>
                <Link href={s.href} className="btn-primary-sm flex items-center gap-2">
                  Apply Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="card bg-sha-900 text-white p-12 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-black mb-6">Why use SHA Online in {location.name}?</h2>
              <div className="space-y-4">
                {[
                  { title: 'No Queues', desc: 'Avoid long waits at SHA/NHIF offices in town.', icon: Clock },
                  { title: 'Certified Agents', desc: 'Your request is handled by verified professionals.', icon: ShieldCheck },
                  { title: '24/7 Access', desc: 'Submit your request anytime from your phone or PC.', icon: Zap }
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-sha-400" />
                    </div>
                    <div>
                      <h4 className="font-black text-lg">{item.title}</h4>
                      <p className="text-sha-200/70 text-sm font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/10">
              <h3 className="text-xl font-black mb-4 italic">&ldquo;Changed my SHA phone number from {location.name} in under 4 hours. Super fast and reliable!&rdquo;</h3>
              <p className="text-sha-400 font-bold text-sm">— James M., {location.name} Resident</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
