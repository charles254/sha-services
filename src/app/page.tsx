import Link from 'next/link';
import {
  Phone, ShieldCheck, FileText, Users, Building2, ArrowRight,
  CheckCircle2, Clock, Star, ChevronDown, Zap, MapPin
} from 'lucide-react';

const services = [
  {
    icon: Phone,
    title: 'Change Phone Number',
    desc: 'Update your SHA-registered phone number online. Required: Police Abstract + National ID.',
    price: 200,
    href: '/sha-services/change-phone',
    time: '24 hrs',
    color: 'bg-green-50 text-green-700 border-green-200',
    iconBg: 'bg-green-600',
  },
  {
    icon: ShieldCheck,
    title: 'SHA PIN Registration',
    desc: 'Register as a new SHA member and get your unique member number quickly.',
    price: 300,
    href: '/sha-services/pin-registration',
    time: '2 hrs',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    iconBg: 'bg-blue-600',
  },
  {
    icon: FileText,
    title: 'Contribution Statement',
    desc: 'Get your official SHA contribution history and payment records for any period.',
    price: 200,
    href: '/sha-services/contribution-statement',
    time: '1 hr',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    iconBg: 'bg-amber-600',
  },
  {
    icon: Users,
    title: 'Beneficiary Update',
    desc: 'Add, remove or update your SHA dependants / beneficiaries with official documentation.',
    price: 400,
    href: '/sha-services/beneficiary-update',
    time: '24 hrs',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    iconBg: 'bg-purple-600',
  },
  {
    icon: Building2,
    title: 'Employer Registration',
    desc: 'Register your business as an SHA employer and onboard your employees effortlessly.',
    price: 800,
    href: '/sha-services/employer-registration',
    time: '48 hrs',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    iconBg: 'bg-rose-600',
  },
];

const faqs = [
  {
    q: 'Why do I need a Police Abstract to change my phone number?',
    a: 'SHA regulations require proof of identity for online phone number changes to prevent fraud and identity theft. The Police Abstract confirms your report of a lost/inaccessible line.',
  },
  {
    q: 'How long does the phone change take?',
    a: 'Our certified SHA agents process phone number changes within 24 working hours after verifying your documents. You will receive an SMS confirmation on your new number.',
  },
  {
    q: 'Is my personal information safe?',
    a: 'Yes. All documents are encrypted using AES-256 and are deleted from our systems within 48 hours of successful processing. We comply fully with the Kenya Data Protection Act (KDPA 2019).',
  },
  {
    q: 'Can I track my request?',
    a: 'Absolutely. After submitting your request, you will receive a unique Tracking ID. Visit our Track page anytime to check real-time status updates from your agent.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept M-Pesa. After submitting your request, you will receive an M-Pesa STK push to the phone number you provided. Payment is only requested once documents are verified.',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(f => ({
              "@type": "Question",
              "name": f.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": f.a
              }
            }))
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "SHA Online Cyber Services",
            "provider": {
              "@type": "Organization",
              "name": "SHA Online Cyber Services Kenya"
            },
            "areaServed": {
              "@type": "Country",
              "name": "KE"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "SHA Service Catalog",
              "itemListElement": services.map((s, i) => ({
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": s.title,
                  "description": s.desc
                }
              }))
            }
          })
        }}
      />
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen mesh-bg grainy flex items-center pt-20 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-sha-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gold-500/6 rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="badge-green">
                <span className="w-1.5 h-1.5 bg-sha-500 rounded-full animate-pulse" />
                Official SHA Agent Services
              </div>

              <h1 className="text-6xl lg:text-7xl font-black text-gray-900 leading-[0.95] tracking-tight">
                SHA Services,{' '}
                <span className="text-sha-600">Done Right.</span>
                <br />
                <span className="text-4xl lg:text-5xl text-gray-500 font-black">Online. Fast.</span>
              </h1>

              <p className="text-xl text-gray-500 leading-relaxed max-w-lg font-medium">
                Certified agents handle your Social Health Authority tasks — phone updates, PIN
                registration, contribution records and more — without you stepping foot in a queue.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/#services" className="btn-primary flex items-center gap-3 group">
                  View All Services
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/track" className="btn-outline flex items-center gap-3">
                  Track My Request
                </Link>
              </div>

              <div className="flex flex-wrap gap-6 pt-4">
                {[
                  { icon: Zap, val: '15 min', label: 'Avg Response Time' },
                  { icon: Star, val: '4.9/5', label: 'Customer Rating' },
                  { icon: CheckCircle2, val: '10k+', label: 'Requests Processed' },
                ].map(({ icon: Icon, val, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sha-50 border border-sha-100 rounded-xl flex items-center justify-center">
                      <Icon className="w-4 h-4 text-sha-600" />
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-lg leading-none">{val}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero card */}
            <div className="relative hidden lg:block">
              <div className="card p-10 relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-sha-700 rounded-2xl flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-black text-gray-900">SHA Verification</p>
                    <p className="text-xs text-sha-600 font-bold">Secure · Certified · Fast</p>
                  </div>
                  <span className="ml-auto flex items-center gap-1.5 text-[10px] font-black text-green-600 uppercase">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Live
                  </span>
                </div>

                <div className="space-y-4">
                  {services.slice(0, 4).map((s) => (
                    <div key={s.title} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-sha-50 transition-colors group">
                      <div className={`w-10 h-10 ${s.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <s.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-gray-900 text-sm truncate">{s.title}</p>
                        <p className="text-xs text-gray-400 font-bold">Ksh {s.price} · {s.time}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-sha-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-sha-500/10 rounded-[2rem] -z-10" />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gold-500/10 rounded-2xl -z-10" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-300" />
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────────────── */}
      <section className="py-10 bg-sha-800 border-y border-sha-700">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-10 text-center">
            {[
              { val: 'KDPA 2019', label: 'Data Protection Compliant' },
              { val: 'AES-256', label: 'Document Encryption' },
              { val: 'SHA Certified', label: 'Official Agent Hub' },
              { val: '48hrs', label: 'Data Auto-Deletion' },
              { val: '24/7', label: 'Request Monitoring' },
            ].map(({ val, label }) => (
              <div key={label}>
                <p className="font-black text-white text-lg">{val}</p>
                <p className="text-[10px] text-sha-300 font-bold uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────── */}
      <section id="services" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <div className="badge-green mx-auto w-fit">All SHA Services</div>
            <h2 className="text-5xl font-black text-gray-900">Everything SHA, Online.</h2>
            <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
              Our certified agents handle every SHA service end-to-end. Submit your request, upload
              documents, and receive updates — without leaving your home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="card group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 ${service.iconBg} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900 text-xl">Ksh {service.price}</p>
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black border mt-1 ${service.color}`}>
                      <Clock className="w-3 h-3" /> {service.time}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-sha-700 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed flex-1">{service.desc}</p>

                <div className="mt-6 flex items-center gap-2 text-sha-600 font-black text-sm group-hover:gap-4 transition-all">
                  Apply Now <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section id="how-it-works" className="py-28 bg-sha-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sha-500/20 border border-sha-500/30 text-[10px] font-black uppercase tracking-widest text-sha-300">
              Simple Process
            </div>
            <h2 className="text-5xl font-black text-white">Done in 3 Simple Steps</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Choose Your Service', desc: 'Select the SHA service you need. Fill in your details including your SHA member number.' },
              { step: '02', title: 'Upload Documents', desc: 'Upload the required documents (ID, Police Abstract, etc.) securely through our encrypted portal.' },
              { step: '03', title: 'We Handle the Rest', desc: 'Our certified SHA agents process your request and send you confirmation via SMS & email within the stated timeframe.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative">
                <div className="text-[80px] font-black text-sha-500/20 leading-none mb-4 font-outfit">{step}</div>
                <h3 className="text-2xl font-black text-white mb-3">{title}</h3>
                <p className="text-sha-300 font-medium leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────── */}
      <section id="pricing" className="py-28 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="badge-green mx-auto w-fit mb-6">Transparent Pricing</div>
          <h2 className="text-5xl font-black text-gray-900 mb-6">No Hidden Fees. Ever.</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
            {services.map((s) => (
              <Link key={s.href} href={s.href} className="card text-center p-6 hover:scale-[1.02] transition-all">
                <div className={`w-12 h-12 ${s.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <p className="font-black text-gray-900 text-sm mb-1">{s.title}</p>
                <p className="text-2xl font-black text-sha-600">Ksh {s.price}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{s.time}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section id="faq" className="py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <div className="badge-green mx-auto w-fit">FAQ</div>
            <h2 className="text-5xl font-black text-gray-900">Common Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <details key={q} className="card p-0 group overflow-hidden">
                <summary className="p-6 cursor-pointer font-black text-gray-900 flex items-center justify-between gap-4 list-none">
                  {q}
                  <ChevronDown className="w-5 h-5 text-sha-600 flex-shrink-0 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-gray-500 font-medium leading-relaxed text-sm border-t border-gray-100 pt-4">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED LOCATIONS ────────────────────────────────── */}
      <section className="py-28 mesh-bg grainy">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <div className="badge-green mx-auto w-fit flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Nationwide Coverage
            </div>
            <h2 className="text-5xl font-black text-gray-900">Serving All 47 Counties</h2>
            <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
              From major cities to rural towns — our certified SHA agents process requests for residents across Kenya.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { name: 'Nairobi (Westlands)', slug: 'westlands' },
              { name: 'Mombasa (Mvita)', slug: 'mvita' },
              { name: 'Kisumu', slug: 'kisumu' },
              { name: 'Nakuru', slug: 'nakuru' },
              { name: 'Eldoret', slug: 'eldoret' },
              { name: 'Malindi', slug: 'malindi' },
              { name: 'Voi', slug: 'voi' },
              { name: 'Isiolo', slug: 'isiolo' },
              { name: 'Kamukunji', slug: 'kamukunji' },
              { name: 'Thika', slug: 'thika' },
              { name: 'Nyeri', slug: 'nyeri' },
              { name: 'Meru', slug: 'meru' },
              { name: 'Garissa', slug: 'garissa' },
              { name: 'Machakos', slug: 'machakos' },
              { name: 'Naivasha', slug: 'naivasha' },
            ].map((loc) => (
              <Link
                key={loc.slug}
                href={`/locations/${loc.slug}`}
                className="group p-4 bg-white border border-gray-100 rounded-2xl hover:border-sha-500 hover:shadow-lg transition-all flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-sha-50 rounded-xl flex items-center justify-center group-hover:bg-sha-600 transition-colors flex-shrink-0">
                  <MapPin className="w-4 h-4 text-sha-600 group-hover:text-white transition-colors" />
                </div>
                <span className="font-black text-gray-900 text-sm truncate">{loc.name}</span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/locations" className="btn-outline inline-flex items-center gap-3">
              View All 500+ Locations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-28 mesh-bg grainy">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="card p-16 flex flex-col items-center gap-8">
            <div className="w-20 h-20 bg-sha-700 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-sha-900/20 rotate-6 hover:rotate-0 transition-transform duration-500">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-4">
              <h2 className="text-5xl font-black text-gray-900">Ready to Get Started?</h2>
              <p className="text-gray-500 text-lg font-medium max-w-xl mx-auto leading-relaxed">
                Join thousands of Kenyans who have simplified their SHA services. No queues, no
                frustration — just fast, certified service.
              </p>
            </div>
            <Link href="/#services" className="btn-primary flex items-center gap-3 group text-lg px-12 py-5">
              View All Services
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
