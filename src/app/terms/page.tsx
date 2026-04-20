import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for SHA Online Cyber Services Kenya. Service fees from Ksh 200-800, M-Pesa payments, refund policy, and user responsibilities explained.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen mesh-bg grainy pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-12" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-sha-600 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <span className="text-gray-900">Terms of Service</span>
        </nav>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-sha-600 rounded-2xl flex items-center justify-center">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900">Terms of Service</h1>
            <p className="text-sm text-gray-400 font-bold">Last updated: April 2026</p>
          </div>
        </div>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">1. Service Overview</h2>
            <p className="text-gray-600 leading-relaxed">
              SHA Online Cyber Services Kenya provides agent-assisted processing for Social Health Authority (SHA) services including phone number changes, PIN registration, contribution statement requests, beneficiary updates, and employer registration. We act as certified intermediaries between you and the SHA.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">2. Service Fees</h2>
            <p className="text-gray-600 leading-relaxed mb-3">Our service fees are as follows and are payable via M-Pesa:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Phone Number Change: <strong>Ksh 500</strong> (processed within 24 hours)</li>
              <li>SHA PIN Registration: <strong>Ksh 300</strong> (processed within 2 hours)</li>
              <li>Contribution Statement: <strong>Ksh 200</strong> (processed within 1 hour)</li>
              <li>Beneficiary Update: <strong>Ksh 400</strong> (processed within 24 hours)</li>
              <li>Employer Registration: <strong>Ksh 800</strong> (processed within 48 hours)</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              Processing times are estimates and may vary based on SHA system availability. Fees are non-refundable once processing has begun, except where the service cannot be completed due to our error.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">3. User Responsibilities</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Provide accurate and truthful information in all service requests</li>
              <li>Upload genuine, unaltered documents as required</li>
              <li>Ensure you are authorized to make the request (e.g., you are the SHA member or an authorized employer representative)</li>
              <li>Complete M-Pesa payment when prompted</li>
              <li>Respond to any agent follow-up requests within 48 hours</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">4. Refund Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              If we are unable to process your request due to SHA system unavailability or an error on our part, you will receive a <strong>full refund within 7 business days</strong> via M-Pesa. Refunds are not available for requests rejected due to incorrect or fraudulent information provided by the user.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">5. Document Handling</h2>
            <p className="text-gray-600 leading-relaxed">
              All uploaded documents are encrypted using AES-256 and automatically deleted within 48 hours of processing. We do not retain copies of your personal documents beyond this period. See our <Link href="/privacy" className="text-sha-600 font-bold hover:underline">Privacy Policy</Link> for full details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">6. Limitations of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              SHA Online Cyber Services acts as an agent facilitating access to SHA services. We are not responsible for SHA system downtime, policy changes by the Social Health Authority, or delays caused by incomplete or inaccurate user-provided information. Our total liability is limited to the service fee paid for the specific request in question.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">7. Prohibited Use</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Submitting fraudulent documents or false information</li>
              <li>Using the platform to process requests for which you lack authorization</li>
              <li>Attempting to reverse-engineer, scrape, or disrupt our platform</li>
              <li>Using our services for any illegal purpose</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">8. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              These terms are governed by the laws of the Republic of Kenya. Any disputes arising from these terms shall be subject to the jurisdiction of Kenyan courts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">9. Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              Questions about these terms? Contact us at <a href="mailto:support@shacyberservices.com" className="text-sha-600 font-bold hover:underline">support@shacyberservices.com</a> or via WhatsApp at <a href="https://wa.me/254797201411" className="text-sha-600 font-bold hover:underline">+254 797 201 411</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
