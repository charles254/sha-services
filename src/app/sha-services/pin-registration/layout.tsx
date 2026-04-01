import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SHA PIN Registration Online | Ksh 300, 2hrs',
  description: 'Register as a new SHA member and get your PIN in 2 hours. Certified agents process your application — no queues, no office visits. Ksh 300 via M-Pesa.',
  keywords: ['SHA registration', 'NHIF registration online', 'SHA PIN online', 'register for Social Health Authority'],
  alternates: { canonical: '/sha-services/pin-registration' },
  openGraph: {
    title: 'SHA PIN Registration Online | 2hr Processing',
    description: 'Register as a new SHA member online. Get your PIN in 2 hours — no queues. Only Ksh 300.',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SHA PIN Registration Online | 2hr Processing',
    description: 'Register as a new SHA member online. Get your PIN in 2 hours — no queues. Only Ksh 300.',
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
            "name": "SHA PIN Registration",
            "description": "Register as a new Social Health Authority (SHA) member and receive your unique member number online.",
            "provider": {
              "@type": "Organization",
              "name": "SHA Online Cyber Services Kenya"
            },
            "serviceType": "Government Registration",
            "offers": {
              "@type": "Offer",
              "price": "300",
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
              { "@type": "ListItem", "position": 3, "name": "PIN Registration", "item": "https://shacyberservices.com/sha-services/pin-registration" }
            ]
          })
        }}
      />
      {children}
    </>
  );
}
