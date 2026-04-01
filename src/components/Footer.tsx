import Link from 'next/link';
import { ShieldCheck, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

const services = [
  { label: 'Change Phone Number',    href: '/sha-services/change-phone' },
  { label: 'SHA PIN Registration',   href: '/sha-services/pin-registration' },
  { label: 'Contribution Statement', href: '/sha-services/contribution-statement' },
  { label: 'Beneficiary Update',     href: '/sha-services/beneficiary-update' },
  { label: 'Employer Registration',  href: '/sha-services/employer-registration' },
];

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sha-600 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div className="leading-none">
                <span className="text-lg font-outfit font-black text-white">
                  SHA<span className="text-sha-400">Cyber</span>
                </span>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-sha-400">SHA Cyber Services</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">
              Cyber SHA service agent for the Social Health Authority (SHA) — Kenya&apos;s universal
              health coverage body. Fast, secure, and KDPA compliant.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com/shaonlineservices" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 bg-white/5 hover:bg-sha-600 rounded-xl flex items-center justify-center transition-colors text-gray-400 hover:text-white font-black text-xs">f</a>
              <a href="https://x.com/shaonlineke" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="w-10 h-10 bg-white/5 hover:bg-sha-600 rounded-xl flex items-center justify-center transition-colors text-gray-400 hover:text-white font-black text-xs">X</a>
              <a href="https://linkedin.com/company/sha-online-services" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 bg-white/5 hover:bg-sha-600 rounded-xl flex items-center justify-center transition-colors text-gray-400 hover:text-white font-black text-xs">in</a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-sha-400 mb-6">Our Services</h4>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="text-gray-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-sha-600 rounded-full group-hover:w-2 transition-all" />
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-sha-400 mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Track My Request', href: '/track' },
                { label: 'How It Works', href: '/#how-it-works' },
                { label: 'Pricing', href: '/#pricing' },
                { label: 'FAQ', href: '/#faq' },
                { label: 'SHA Official Portal', href: 'https://sha.go.ke', ext: true },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target={l.ext ? '_blank' : undefined}
                    rel={l.ext ? 'noopener noreferrer' : undefined}
                    className="text-gray-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    {l.label}
                    {l.ext && <ExternalLink className="w-3 h-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-sha-400 mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-sha-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white">+254 719 628 275</p>
                  <p className="text-xs">Mon–Sat, 8am – 6pm</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-sha-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white">support@shacyberservices.com</p>
                  <p className="text-xs">Response within 2 hours</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400 border-t border-white/5 pt-4">
                <MapPin className="w-4 h-4 text-sha-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-black text-xs uppercase tracking-widest text-sha-300 mb-2">Popular Locations</p>
                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                    {[
                      { name: 'Nairobi', slug: 'westlands' },
                      { name: 'Mombasa', slug: 'mvita' },
                      { name: 'Kisumu',  slug: 'kisumu' },
                      { name: 'Nakuru',  slug: 'nakuru' },
                      { name: 'Eldoret', slug: 'eldoret' },
                    ].map((city) => (
                      <Link
                        key={city.slug}
                        href={`/locations/${city.slug}`}
                        className="text-[10px] text-gray-500 hover:text-white font-bold transition-colors"
                      >
                        {city.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} SHA Cyber Services Kenya. All rights reserved.
          </p>
          <div className="flex gap-6">
            {[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
              { label: 'KDPA Compliance', href: '/kdpa-compliance' },
            ].map((l) => (
              <Link key={l.label} href={l.href} className="text-[10px] text-gray-500 hover:text-sha-400 font-bold uppercase tracking-widest transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
