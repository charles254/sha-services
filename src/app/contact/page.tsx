import { Phone, Mail, MapPin, Clock, Send, MessageSquare, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | WhatsApp, Phone & Email Support',
  description: 'Get help with your SHA request — reach our certified agents via WhatsApp (+254 719 628 275), email, or phone. Mon-Sat 8am-6pm. Average response time: 2 hours.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact SHA Online Cyber Services | Get Help Now',
    description: 'Reach our SHA agents via WhatsApp, phone, or email. Mon-Sat 8am-6pm, avg response 2 hours.',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact SHA Online Cyber Services | Get Help Now',
    description: 'Reach our SHA agents via WhatsApp, phone, or email. Mon-Sat 8am-6pm, avg response 2 hours.',
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen mesh-bg grainy pt-32 pb-20 font-inter">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact SHA Online Cyber Services",
            "url": "https://shaservices.co.ke/contact",
            "mainEntity": {
              "@type": "Organization",
              "name": "SHA Online Cyber Services Kenya",
              "telephone": "+254-719-628-275",
              "email": "support@shaservices.co.ke",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Upper Hill",
                "addressLocality": "Nairobi",
                "addressCountry": "KE"
              },
              "openingHours": "Mo-Sa 08:00-18:00"
            }
          })
        }}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <div className="badge-green mx-auto w-fit">Help Center</div>
          <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight">
            How can we <span className="text-sha-600">help?</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
            Our certified SHA agents are standing by to assist you with any questions or technical issues.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-sha-900 rounded-[2.5rem] p-8 text-white border-0 shadow-2xl shadow-sha-900/30">
              <h3 className="text-2xl font-black mb-8">Direct Contact</h3>
              <div className="space-y-6">
                <a href="https://wa.me/254719628275" className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-green-500 transition-colors">
                    <MessageSquare className="w-6 h-6 text-sha-400 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="font-black text-white">WhatsApp Support</p>
                    <p className="text-sha-300 text-sm font-medium">+254 719 628 275</p>
                    <p className="text-[10px] text-green-400 font-black uppercase tracking-widest mt-1 underline">Chat Now</p>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-sha-400">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-black text-white">Email Support</p>
                    <p className="text-sha-300 text-sm font-medium">support@shaservices.co.ke</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-sha-400">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-black text-white">Office Location</p>
                    <p className="text-sha-300 text-sm font-medium">Upper Hill, Nairobi, Kenya</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-12 border-t border-white/5 space-y-6">
                <div className="flex items-center gap-3">
                   <Clock className="w-5 h-5 text-sha-400" />
                   <div>
                     <p className="font-black text-sm">Working Hours</p>
                     <p className="text-xs text-sha-300">Mon - Sat: 8:00 AM - 6:00 PM</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <ShieldCheck className="w-5 h-5 text-sha-400" />
                   <div>
                     <p className="font-black text-sm">Certified Agents</p>
                     <p className="text-xs text-sha-300">Official SHA Processing Hub</p>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 glass rounded-[2.5rem] border-sha-100 italic">
               <p className="text-gray-500 font-medium leading-relaxed">
                 &ldquo;Most SHA phone change requests are resolved within 24 hours. For urgent matters, please use our WhatsApp channel for immediate attention.&rdquo;
               </p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-2">
            <div className="card border-sha-500/10 p-8 lg:p-12">
              <h2 className="text-3xl font-black text-gray-900 mb-2">Send us a message</h2>
              <p className="text-gray-500 font-medium mb-12">Fill out the form below and an agent will get back to you within 2 hours.</p>
              
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="label">Full Name</label>
                  <input type="text" placeholder="John Doe" className="input-field" required />
                </div>
                <div className="space-y-2">
                  <label className="label">Phone Number</label>
                  <input type="tel" placeholder="07XX XXX XXX" className="input-field" required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="label">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="input-field" required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="label">Inquiry Type</label>
                  <select className="input-field appearance-none cursor-pointer">
                    <option>Change Phone Number Assistance</option>
                    <option>PIN Registration Inquiry</option>
                    <option>Beneficiary Update Help</option>
                    <option>Payment Issues</option>
                    <option>Other / General Inquiry</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="label">Your Message</label>
                  <textarea rows={5} placeholder="How can we help you today?" className="input-field resize-none py-4"></textarea>
                </div>
                
                <div className="md:col-span-2 pt-4">
                  <button type="button" className="btn-primary w-full py-5 flex items-center justify-center gap-3 text-lg">
                    Send Message <Send className="w-5 h-5" />
                  </button>
                  <p className="text-[10px] text-center text-gray-400 font-black uppercase tracking-widest mt-6">
                    By submitting this form, you agree to our data protection policy.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
