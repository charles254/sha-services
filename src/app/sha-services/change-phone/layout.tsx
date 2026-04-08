import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Change SHA Phone Number Online | Ksh 500, 24hrs',
  description: 'Update your SHA phone number online in 24 hours. Upload your National ID and Police Abstract — certified agents handle the rest. Ksh 500 via M-Pesa.',
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
  { q: 'Why do I need a Police Abstract to change my SHA phone number?', a: 'A Police Abstract serves as official proof that your previous phone number is no longer in your possession or has been compromised. This is required by SHA to protect members from unauthorized changes. You can obtain a Police Abstract from any police station in Kenya — it typically takes 1-2 days to process.' },
  { q: 'What happens to my old phone number after the change?', a: 'Once the phone number change is processed, your old number is immediately delinked from your SHA account. All future OTPs, notifications, and communication from SHA will be sent to your new number. Your SHA membership number and all benefits remain unchanged.' },
  { q: 'Can I change my SHA phone number if I lost my SIM card?', a: 'Yes. A lost SIM card is one of the most common reasons for a phone number change. You will need to get a Police Abstract reporting the lost SIM, then submit your National ID and the abstract through our platform. Our agents will process the change within 24 hours.' },
  { q: 'How will I know my phone number change was successful?', a: 'You will receive a confirmation SMS on your new phone number and an email notification once the change is processed. You can also track the status of your request in real time using the tracking ID provided at submission.' },
  { q: 'What if my National ID name differs from my SHA registration?', a: 'Your National ID name must match your SHA registration records. If there is a discrepancy, you may need to update your SHA records first. Contact our support team via WhatsApp for guidance on resolving name mismatches before submitting a phone change request.' },
  { q: 'Can I change my phone number back to the original one later?', a: 'Yes, you can submit another phone number change request at any time. Each change requires a new Police Abstract and the standard Ksh 500 service fee. The same 24-hour processing time applies.' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
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
