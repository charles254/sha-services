import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Change SHA Phone Number Online | Ksh 200, 24hrs',
  description: 'Update your SHA phone number online in 24 hours. Upload your National ID — certified agents handle the rest. Ksh 200 via M-Pesa.',
  keywords: ['SHA phone change', 'NHIF phone number change', 'update SHA number online', 'Social Health Authority phone update'],
  alternates: { canonical: '/sha-services/change-phone' },
  openGraph: {
    title: 'Change SHA Phone Number Online | 24hr Processing',
    description: 'Update your SHA phone number without visiting an office. Upload docs, pay via M-Pesa, done in 24 hours.',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Change SHA Phone Number Online | 24hr Processing',
    description: 'Update your SHA phone number without visiting an office. Upload docs, pay via M-Pesa, done in 24 hours.',
  },
};

const faqs = [
  { q: 'What happens to my old phone number after the change?', a: 'Once the phone number change is processed, your old number is immediately delinked from your SHA account. All future OTPs, notifications, and communication from SHA will be sent to your new number. Your SHA membership number and all benefits remain unchanged.' },
  { q: 'Can I change my SHA phone number if I lost my SIM card?', a: 'Yes. A lost SIM card is one of the most common reasons for a phone number change. Simply submit your National ID through our platform and our certified agents will process the change within 24 hours.' },
  { q: 'How will I know my phone number change was successful?', a: 'You will receive a confirmation SMS on your new phone number and an email notification once the change is processed. You can also track the status of your request in real time using the tracking ID provided at submission.' },
  { q: 'What if my National ID name differs from my SHA registration?', a: 'Your National ID name must match your SHA registration records. If there is a discrepancy, you may need to update your SHA records first. Contact our support team via WhatsApp for guidance on resolving name mismatches before submitting a phone change request.' },
  { q: 'Can I change my phone number back to the original one later?', a: 'Yes, you can submit another phone number change request at any time. Each change requires the standard Ksh 200 service fee, and the same 24-hour processing time applies.' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "SHA Phone Number Change",
            "description": "Update your SHA-registered phone number online with certified agents. Requires National ID.",
            "provider": {
              "@type": "Organization",
              "name": "SHA Online Cyber Services Kenya"
            },
            "serviceType": "Government Document Update",
            "datePublished": "2025-01-15",
            "dateModified": "2026-04-10",
            "offers": {
              "@type": "Offer",
              "price": "200",
              "priceCurrency": "KES"
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map((faq) => ({
              "@type": "Question",
              "name": faq.q,
              "acceptedAnswer": { "@type": "Answer", "text": faq.a },
            })),
          })
        }}
      />
      {children}
    </>
  );
}
