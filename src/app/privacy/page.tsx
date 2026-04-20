import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'SHA Online Cyber Services privacy policy. Learn how we collect, use, and protect your personal data in compliance with the Kenya Data Protection Act (KDPA) 2019.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen mesh-bg grainy pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-12" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-sha-600 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <span className="text-gray-900">Privacy Policy</span>
        </nav>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-sha-600 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900">Privacy Policy</h1>
            <p className="text-sm text-gray-400 font-bold">Last updated: April 2026</p>
          </div>
        </div>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              SHA Online Cyber Services Kenya (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and protect your information when you use our platform to access Social Health Authority (SHA) services. We operate in full compliance with the <strong>Kenya Data Protection Act (KDPA) 2019</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">2. Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed mb-3">We collect the following personal information to process your SHA service requests:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Identity information:</strong> Full name, National ID number, date of birth</li>
              <li><strong>Contact information:</strong> Phone number, email address</li>
              <li><strong>SHA-specific data:</strong> SHA PIN/member number, employment details</li>
              <li><strong>Documents:</strong> National ID copies, Police Abstracts, certificates (as required by specific services)</li>
              <li><strong>Payment information:</strong> M-Pesa transaction references (we do not store M-Pesa PINs)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Processing your SHA service requests with the Social Health Authority</li>
              <li>Communicating order status updates via SMS and email</li>
              <li>Processing M-Pesa payments for our services</li>
              <li>Providing customer support</li>
              <li>Complying with legal and regulatory requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">4. Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              All documents and personal data are encrypted using <strong>AES-256 encryption</strong> during storage and transmission. Uploaded documents are <strong>automatically deleted within 48 hours</strong> of successful processing. Our systems are hosted on secure, access-controlled infrastructure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">5. Data Retention</h2>
            <p className="text-gray-600 leading-relaxed">
              We retain your order records for a maximum of <strong>12 months</strong> after service completion for customer support and dispute resolution. Uploaded documents (ID copies, police abstracts, etc.) are permanently deleted within <strong>48 hours</strong> of processing completion. You may request early deletion at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">6. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-3">Under the KDPA 2019, you have the right to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to the processing of your data</li>
              <li>Receive your data in a portable format</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              To exercise these rights, contact us at <a href="mailto:support@shacyberservices.com" className="text-sha-600 font-bold hover:underline">support@shacyberservices.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">7. Third-Party Sharing</h2>
            <p className="text-gray-600 leading-relaxed">
              We share your information only with the Social Health Authority (SHA) for processing your service requests and with Safaricom for M-Pesa payment processing. We do not sell, trade, or share your personal data with any other third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">8. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              For privacy-related inquiries, contact our Data Protection Officer at <a href="mailto:support@shacyberservices.com" className="text-sha-600 font-bold hover:underline">support@shacyberservices.com</a> or via WhatsApp at <a href="https://wa.me/254797201411" className="text-sha-600 font-bold hover:underline">+254 797 201 411</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
