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
      {children}
    </>
  );
}
