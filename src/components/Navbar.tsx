'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ShieldCheck, ChevronDown } from 'lucide-react';

const services = [
  { label: 'Change Phone Number',     href: '/sha-services/change-phone' },
  { label: 'SHA PIN Registration',    href: '/sha-services/pin-registration' },
  { label: 'Contribution Statement',  href: '/sha-services/contribution-statement' },
  { label: 'Beneficiary Update',      href: '/sha-services/beneficiary-update' },
  { label: 'Employer Registration',   href: '/sha-services/employer-registration' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [servOpen, setServOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-lg border-b border-sha-100/60 shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sha-700 rounded-xl flex items-center justify-center shadow-lg shadow-sha-900/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div className="leading-none">
            <span className="text-xl font-outfit font-black tracking-tight text-gray-900">
              SHA<span className="text-sha-600">Online</span>
            </span>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-sha-600">
              Services Kenya
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-gray-600">
          {/* Services Dropdown */}
          <div className="relative group" onMouseEnter={() => setServOpen(true)} onMouseLeave={() => setServOpen(false)}>
            <button className="flex items-center gap-1 hover:text-sha-600 transition-colors uppercase tracking-widest text-[10px] font-black">
              Services <ChevronDown className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform" />
            </button>
            {servOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-64">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 space-y-1">
                  {services.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      className="block px-4 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-sha-50 hover:text-sha-700 transition-colors"
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/track" className="hover:text-sha-600 transition-colors uppercase tracking-widest text-[10px] font-black">
            Track Request
          </Link>
          <Link href="/contact" className="hover:text-sha-600 transition-colors uppercase tracking-widest text-[10px] font-black">
            Contact
          </Link>
          <Link href="/locations" className="hover:text-sha-600 transition-colors uppercase tracking-widest text-[10px] font-black">
            Locations
          </Link>
          <Link href="/#how-it-works" className="hover:text-sha-600 transition-colors uppercase tracking-widest text-[10px] font-black">
            How It Works
          </Link>
          <Link href="/#faq" className="hover:text-sha-600 transition-colors uppercase tracking-widest text-[10px] font-black">
            FAQ
          </Link>

          <Link
            href="/sha-services/change-phone"
            className="ml-2 bg-sha-700 text-white px-6 py-2.5 rounded-full hover:bg-sha-600 transition-all shadow-md text-[10px] uppercase font-black tracking-widest"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-6 py-6 space-y-2 shadow-2xl">
          <p className="text-[9px] font-black uppercase tracking-widest text-sha-600 mb-3">Our Services</p>
          {services.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              onClick={() => setOpen(false)}
              className="block py-3 px-4 rounded-xl font-bold text-gray-700 hover:bg-sha-50 hover:text-sha-700 transition-colors"
            >
              {s.label}
            </Link>
          ))}
          <div className="h-px bg-gray-100 my-3" />
          <Link href="/track" onClick={() => setOpen(false)} className="block py-3 px-4 font-bold text-gray-700 hover:text-sha-600 transition-colors">
            Track Request
          </Link>
          <Link href="/contact" onClick={() => setOpen(false)} className="block py-3 px-4 font-bold text-gray-700 hover:text-sha-600 transition-colors">
            Contact Us
          </Link>
          <Link href="/locations" onClick={() => setOpen(false)} className="block py-3 px-4 font-bold text-gray-700 hover:text-sha-600 transition-colors">
            Our Locations
          </Link>
          <Link href="/sha-services/change-phone" onClick={() => setOpen(false)} className="block mt-4 py-4 btn-primary text-center rounded-2xl">
            Get Started Now
          </Link>
        </div>
      )}
    </header>
  );
}
