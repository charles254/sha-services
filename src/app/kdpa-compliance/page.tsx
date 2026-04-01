import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, ChevronRight, Lock, Trash2, Eye, FileCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'KDPA Compliance | Kenya Data Protection Act 2019',
  description: 'How SHA Online Cyber Services complies with the Kenya Data Protection Act 2019. AES-256 encryption, 48hr auto-deletion, your rights, and how to file complaints.',
  alternates: { canonical: '/kdpa-compliance' },
};

export default function KDPACompliancePage() {
  return (
    <main className="min-h-screen mesh-bg grainy pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-12" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-sha-600 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <span className="text-gray-900">KDPA Compliance</span>
        </nav>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-sha-600 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900">KDPA Compliance</h1>
            <p className="text-sm text-gray-400 font-bold">Kenya Data Protection Act 2019</p>
          </div>
        </div>

        <p className="text-xl text-gray-500 font-medium leading-relaxed mb-12">
          SHA Online Cyber Services is fully committed to complying with the Kenya Data Protection Act (KDPA) 2019. As a platform handling sensitive health-related and identity data, we take our obligations under this law seriously.
        </p>

        {/* Key Measures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {[
            {
              icon: Lock,
              title: 'AES-256 Encryption',
              desc: 'All personal data and documents are encrypted in transit and at rest using military-grade AES-256 encryption.',
            },
            {
              icon: Trash2,
              title: '48-Hour Auto-Deletion',
              desc: 'Uploaded documents (IDs, police abstracts, certificates) are permanently deleted within 48 hours of processing completion.',
            },
            {
              icon: Eye,
              title: 'Purpose Limitation',
              desc: 'Your data is collected only for the specific SHA service you request and is never used for marketing or sold to third parties.',
            },
            {
              icon: FileCheck,
              title: 'Lawful Processing',
              desc: 'We process your data based on your explicit consent and contractual necessity as defined in Section 30 of the KDPA.',
            },
          ].map((item) => (
            <div key={item.title} className="card p-6 flex gap-4">
              <div className="w-12 h-12 bg-sha-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                <item.icon className="w-6 h-6 text-sha-600" />
              </div>
              <div>
                <h3 className="font-black text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">Your Rights Under the KDPA</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              The Kenya Data Protection Act 2019 grants you the following rights regarding your personal data:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-3">
              <li><strong>Right of Access (Section 26):</strong> You can request a copy of all personal data we hold about you at no cost.</li>
              <li><strong>Right to Rectification (Section 26):</strong> You can request correction of inaccurate personal data.</li>
              <li><strong>Right to Deletion (Section 26):</strong> You can request deletion of your personal data when it is no longer necessary for the purpose it was collected.</li>
              <li><strong>Right to Object (Section 26):</strong> You can object to processing of your data in certain circumstances.</li>
              <li><strong>Right to Data Portability (Section 26):</strong> You can request your data in a structured, commonly used format.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">Data We Collect and Why</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3 font-black text-gray-900 border border-gray-100">Data Type</th>
                    <th className="text-left p-3 font-black text-gray-900 border border-gray-100">Purpose</th>
                    <th className="text-left p-3 font-black text-gray-900 border border-gray-100">Retention</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr>
                    <td className="p-3 border border-gray-100">Full name, ID number</td>
                    <td className="p-3 border border-gray-100">SHA service processing</td>
                    <td className="p-3 border border-gray-100">12 months</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-gray-100">Phone, email</td>
                    <td className="p-3 border border-gray-100">Status updates, support</td>
                    <td className="p-3 border border-gray-100">12 months</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-gray-100">SHA PIN</td>
                    <td className="p-3 border border-gray-100">Service request processing</td>
                    <td className="p-3 border border-gray-100">12 months</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-gray-100">Document uploads</td>
                    <td className="p-3 border border-gray-100">Identity verification</td>
                    <td className="p-3 border border-gray-100 font-bold text-sha-700">48 hours</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-gray-100">M-Pesa receipt</td>
                    <td className="p-3 border border-gray-100">Payment confirmation</td>
                    <td className="p-3 border border-gray-100">12 months</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">How to Exercise Your Rights</h2>
            <p className="text-gray-600 leading-relaxed">
              To exercise any of your data protection rights, send a request to our Data Protection Officer at <a href="mailto:support@shacyberservices.com" className="text-sha-600 font-bold hover:underline">support@shacyberservices.com</a> with the subject line &quot;KDPA Data Request.&quot; We will respond within <strong>30 days</strong> as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">Complaints</h2>
            <p className="text-gray-600 leading-relaxed">
              If you believe your data protection rights have been violated, you may lodge a complaint with the <strong>Office of the Data Protection Commissioner (ODPC)</strong> at <a href="https://odpc.go.ke" target="_blank" rel="noopener noreferrer" className="text-sha-600 font-bold hover:underline">odpc.go.ke</a>.
            </p>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 bg-sha-50 rounded-[2rem] border border-sha-100 text-center">
          <ShieldCheck className="w-10 h-10 text-sha-600 mx-auto mb-4" />
          <h3 className="text-xl font-black text-gray-900 mb-2">Your Data is Safe with Us</h3>
          <p className="text-gray-500 font-medium max-w-md mx-auto mb-6">
            We are committed to protecting your personal information at every step of your SHA service request.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/privacy" className="btn-outline text-sm">Privacy Policy</Link>
            <Link href="/terms" className="btn-outline text-sm">Terms of Service</Link>
            <Link href="/contact" className="btn-primary text-sm">Contact Us</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
