import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Update SHA Beneficiaries Online | Add Dependants',
  description: 'Add, remove, or update SHA dependants in 24 hours. Certified agents process spouse, children, and parent beneficiary changes. Ksh 400 via M-Pesa.',
  keywords: ['SHA beneficiary update', 'add NHIF dependants', 'SHA member dependents', 'Social Health Authority beneficiary change'],
  alternates: { canonical: '/sha-services/beneficiary-update' },
  openGraph: {
    title: 'Update SHA Beneficiaries Online | 24hr Processing',
    description: 'Add or update SHA dependants without office visits. Spouse, children, parents — all processed in 24 hours.',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Update SHA Beneficiaries Online | 24hr Processing',
    description: 'Add or update SHA dependants without office visits. Spouse, children, parents — all processed in 24 hours.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "SHA Beneficiary Update",
            "description": "Add, remove, or update your Social Health Authority (SHA) dependants and beneficiaries online.",
            "provider": {
              "@type": "Organization",
              "name": "SHA Online Cyber Services Kenya"
            },
            "serviceType": "Government Document Update",
            "datePublished": "2025-01-15",
            "dateModified": "2026-04-10",
            "offers": {
              "@type": "Offer",
              "price": "400",
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
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://shacyberservices.com" },
              { "@type": "ListItem", "position": 2, "name": "SHA Services", "item": "https://shacyberservices.com/#services" },
              { "@type": "ListItem", "position": 3, "name": "Beneficiary Update", "item": "https://shacyberservices.com/sha-services/beneficiary-update" }
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { q: 'Who can I add as a beneficiary on my SHA membership?', a: 'You can add your spouse, biological or legally adopted children under the age of 25, and your parents as dependants on your SHA membership. Each dependant type requires specific supporting documentation.' },
              { q: 'How many beneficiaries can I add to my SHA account?', a: 'There is no strict limit on the number of dependants you can register. You can add one spouse, multiple children (under 25 years), and both parents. Each beneficiary is covered under your SHA membership.' },
              { q: 'What documents are needed to add a spouse as a beneficiary?', a: 'To add a spouse, you need their National ID (or passport), your marriage certificate, and your own National ID for verification. For customary marriages, an affidavit or chief\'s letter may be accepted.' },
              { q: 'Can I remove a beneficiary from my SHA membership?', a: 'Yes. You can remove beneficiaries through our platform. Common reasons include divorce, a child turning 25, or updating records after a parent\'s passing. The update is processed within 24 hours.' },
              { q: 'Will my beneficiaries retain coverage during the update process?', a: 'Yes. Existing beneficiaries retain their SHA coverage throughout the update process. New dependants become eligible for services once the update is confirmed, typically within 24 hours.' },
              { q: 'What if my child turns 25 — are they automatically removed?', a: 'Children are not automatically removed when they turn 25, but they become ineligible for coverage as dependants. Children over 25 should register for their own SHA membership independently.' },
            ].map((faq) => ({
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
